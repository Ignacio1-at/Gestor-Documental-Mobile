import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import {Document} from '../types';

const DOCUMENTS_KEY = 'DOCUMENTS';
const DOCUMENTS_FOLDER = `${RNFS.DocumentDirectoryPath}/documents`;

export const DocumentService = {
  async ensureDocumentsFolder(): Promise<void> {
    try {
      const exists = await RNFS.exists(DOCUMENTS_FOLDER);
      if (!exists) {
        await RNFS.mkdir(DOCUMENTS_FOLDER);
        console.log('📁 Carpeta de documentos creada:', DOCUMENTS_FOLDER);
      }
    } catch (error) {
      console.error('Error creando carpeta de documentos:', error);
      throw error;
    }
  },

  async copyFileToInternalStorage(sourceUri: string, fileName: string): Promise<string> {
    try {
      await this.ensureDocumentsFolder();
      
      // Generar nombre único para evitar conflictos
      const timestamp = Date.now();
      const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
      const internalPath = `${DOCUMENTS_FOLDER}/${timestamp}_${sanitizedName}`;
      
      console.log('📁 Copiando archivo a:', internalPath);
      
      // Copiar el archivo
      await RNFS.copyFile(sourceUri, internalPath);
      
      console.log('✅ Archivo copiado exitosamente');
      return internalPath;
    } catch (error) {
      console.error('❌ Error copiando archivo:', error);
      throw new Error(`No se pudo copiar el archivo: ${error}`);
    }
  },

  async getDocuments(): Promise<Document[]> {
    try {
      const documents = await AsyncStorage.getItem(DOCUMENTS_KEY);
      return documents ? JSON.parse(documents) : [];
    } catch (error) {
      console.error('Error getting documents:', error);
      return [];
    }
  },

  async saveDocument(document: Document): Promise<void> {
    try {
      const documents = await this.getDocuments();
      documents.push(document);
      await AsyncStorage.setItem(DOCUMENTS_KEY, JSON.stringify(documents));
    } catch (error) {
      console.error('Error saving document:', error);
      throw error;
    }
  },

  async clearAllDocuments(): Promise<void> {
    try {
      await AsyncStorage.removeItem(DOCUMENTS_KEY);
      console.log('🗑️ Todos los documentos han sido eliminados');
    } catch (error) {
      console.error('Error clearing documents:', error);
      throw error;
    }
  },

  async deleteDocument(id: string): Promise<void> {
    try {
      const documents = await this.getDocuments();
      const documentToDelete = documents.find(doc => doc.id === id);
      
      // Eliminar el archivo físico si existe
      if (documentToDelete?.uri) {
        try {
          const exists = await RNFS.exists(documentToDelete.uri);
          if (exists) {
            await RNFS.unlink(documentToDelete.uri);
            console.log('🗑️ Archivo físico eliminado:', documentToDelete.uri);
          }
        } catch (fileError) {
          console.warn('⚠️ No se pudo eliminar el archivo físico:', fileError);
        }
      }
      
      // Eliminar de la lista
      const filtered = documents.filter(doc => doc.id !== id);
      await AsyncStorage.setItem(DOCUMENTS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }
};