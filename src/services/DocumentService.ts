import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import { Document } from '../types';
import { Platform } from 'react-native';

const DOCUMENTS_KEY = 'DOCUMENTS';
const DOCUMENTS_FOLDER = `${RNFS.DocumentDirectoryPath}/documents`;

export const DocumentService = {
  async ensureDocumentsFolder(): Promise<void> {
    try {
      const exists = await RNFS.exists(DOCUMENTS_FOLDER);
      if (!exists) {
        await RNFS.mkdir(DOCUMENTS_FOLDER);
        console.log('📁 Carpeta creada:', DOCUMENTS_FOLDER);
      }
    } catch (error) {
      console.error('❌ Error creando carpeta:', error);
      throw new Error(`No se pudo crear la carpeta: ${error}`);
    }
  },

  async copyFileToInternalStorage(sourceUri: string, fileName: string): Promise<string> {
    try {
      await this.ensureDocumentsFolder();

      // 🔧 GENERAR nombre único y seguro
      const timestamp = Date.now();
      const sanitizedName = fileName
        .replace(/[^a-zA-Z0-9.-]/g, '_')
        .substring(0, 100);
      const internalPath = `${DOCUMENTS_FOLDER}/${timestamp}_${sanitizedName}`;

      // 🔧 DETECTAR tipo de URI
      if (sourceUri.startsWith('content://')) {
        // 📱 CONTENT URI (Android) - usar readFile + writeFile
        console.log('📁 Copiando desde content URI:', sourceUri);

        try {
          // Leer el contenido del content URI
          const fileData = await RNFS.readFile(sourceUri, 'base64');

          // Escribir al almacenamiento interno
          await RNFS.writeFile(internalPath, fileData, 'base64');

        } catch (contentError) {
          // Fallback: intentar con copyFile (funciona en algunos casos)
          console.log('🔄 Intentando método alternativo...');
          await RNFS.copyFile(sourceUri, internalPath);
        }

      } else {
        // 📁 FILE URI o ruta normal
        const cleanSourceUri = sourceUri.replace('file://', '');

        // Validar que existe
        const sourceExists = await RNFS.exists(cleanSourceUri);
        if (!sourceExists) {
          throw new Error(`Archivo origen no existe: ${cleanSourceUri}`);
        }

        // Verificar destino en iOS
        if (Platform.OS === 'ios') {
          const destExists = await RNFS.exists(internalPath);
          if (destExists) {
            await RNFS.unlink(internalPath);
          }
        }

        console.log('📁 Copiando archivo normal:', {
          from: cleanSourceUri,
          to: internalPath
        });

        // Copiar con timeout
        await Promise.race([
          RNFS.copyFile(cleanSourceUri, internalPath),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout al copiar archivo')), 10000)
          )
        ]);
      }

      // 🔧 VERIFICAR que se copió correctamente
      const copiedExists = await RNFS.exists(internalPath);
      if (!copiedExists) {
        throw new Error('El archivo no se copió correctamente');
      }

      console.log('✅ Archivo copiado exitosamente');
      return internalPath;

    } catch (error) {
      console.error('❌ Error detallado:', error);
      throw new Error(`No se pudo copiar: ${error.message || error}`);
    }
  },

  async getDocuments(): Promise<Document[]> {
    try {
      const documentsJson = await AsyncStorage.getItem(DOCUMENTS_KEY);
      if (!documentsJson) return [];

      const documents = JSON.parse(documentsJson);

      // 🔧 VALIDAR integridad de archivos
      const validDocuments = [];
      for (const doc of documents) {
        try {
          if (doc.uri) {
            const exists = await RNFS.exists(doc.uri);
            if (exists) {
              validDocuments.push(doc);
            } else {
              console.warn(`⚠️ Archivo perdido: ${doc.name}`);
            }
          }
        } catch (error) {
          console.warn(`⚠️ Error verificando ${doc.name}:`, error);
        }
      }

      // Si encontramos archivos perdidos, actualizar la lista
      if (validDocuments.length !== documents.length) {
        await AsyncStorage.setItem(DOCUMENTS_KEY, JSON.stringify(validDocuments));
        console.log(`🧹 Limpieza: ${documents.length - validDocuments.length} archivos perdidos removidos`);
      }

      return validDocuments;
    } catch (error) {
      console.error('❌ Error obteniendo documentos:', error);
      return [];
    }
  },

  async saveDocument(document: Document): Promise<void> {
    try {
      if (!document.id || !document.name || !document.uri) {
        throw new Error('Documento inválido: faltan campos requeridos');
      }

      const documents = await this.getDocuments();
      documents.push(document);
      await AsyncStorage.setItem(DOCUMENTS_KEY, JSON.stringify(documents));
      console.log('💾 Documento guardado:', document.name);
    } catch (error) {
      console.error('❌ Error guardando documento:', error);
      throw error;
    }
  },

  async deleteDocument(id: string): Promise<void> {
    try {
      const documents = await this.getDocuments();
      const documentToDelete = documents.find(doc => doc.id === id);

      if (documentToDelete?.uri) {
        try {
          const exists = await RNFS.exists(documentToDelete.uri);
          if (exists) {
            await RNFS.unlink(documentToDelete.uri);
            console.log('🗑️ Archivo físico eliminado');
          }
        } catch (fileError) {
          console.warn('⚠️ No se pudo eliminar archivo físico:', fileError);
        }
      }

      const filtered = documents.filter(doc => doc.id !== id);
      await AsyncStorage.setItem(DOCUMENTS_KEY, JSON.stringify(filtered));
      console.log('✅ Documento eliminado de la lista');
    } catch (error) {
      console.error('❌ Error eliminando documento:', error);
      throw error;
    }
  },

  // NUEVA función para debug
  async getDiagnosticInfo(): Promise<object> {
    try {
      return {
        documentsFolder: DOCUMENTS_FOLDER,
        folderExists: await RNFS.exists(DOCUMENTS_FOLDER),
        platform: Platform.OS,
        documentsCount: (await this.getDocuments()).length,
        freeSpace: (await RNFS.getFSInfo()).freeSpace,
      };
    } catch (error) {
      return { error: error.message };
    }
  },

  async updateDocument(id: string, updates: Partial<Document>): Promise<void> {
    try {
      const documents = await this.getDocuments();
      const index = documents.findIndex(doc => doc.id === id);

      if (index === -1) {
        throw new Error('Documento no encontrado');
      }

      documents[index] = { ...documents[index], ...updates };
      await AsyncStorage.setItem(DOCUMENTS_KEY, JSON.stringify(documents));
      console.log('✅ Documento actualizado:', documents[index].name);
    } catch (error) {
      console.error('❌ Error actualizando documento:', error);
      throw error;
    }
  }
};