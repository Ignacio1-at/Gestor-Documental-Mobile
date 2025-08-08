import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import {
  Text,
  Button,
  Card,
  TextInput,
  Menu,
} from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { DocumentService } from '../services/DocumentService';
import { Document } from '../types';
import 'react-native-get-random-values';

const AgregarDocumentoScreen = () => {
  const [documentName, setDocumentName] = useState('');
  const [category, setCategory] = useState('Personal');
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const categories = ['Personal', 'Trabajo', 'Educación', 'Salud', 'Finanzas'];

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      setSelectedFile(result[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // Usuario canceló
      } else {
        Alert.alert('Error', 'No se pudo seleccionar el documento');
      }
    }
  };

  const pickImage = async () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
      },
      (response) => {
        if (response.assets && response.assets[0]) {
          setSelectedFile(response.assets[0]);
        }
      }
    );
  };

  const saveDocument = async () => {
    if (!documentName.trim() || !selectedFile) {
      Alert.alert('Error', 'Debe ingresar un nombre y seleccionar un archivo');
      return;
    }

    try {
      console.log('💾 Guardando documento:', selectedFile.name);
      
      // Copiar archivo al almacenamiento interno
      const internalPath = await DocumentService.copyFileToInternalStorage(
        selectedFile.uri,
        selectedFile.name || 'documento'
      );

      const document: Document = {
        id: Date.now().toString(),
        name: documentName,
        type: selectedFile.type?.includes('pdf') ? 'PDF' : 'Imagen',
        date: new Date().toISOString().split('T')[0],
        category,
        uri: internalPath, // Usar la ruta interna en lugar de la URI temporal
        size: selectedFile.size,
        mimeType: selectedFile.type,
      };

      await DocumentService.saveDocument(document);
      Alert.alert('Éxito', 'Documento guardado correctamente');

      // Limpiar formulario
      setDocumentName('');
      setSelectedFile(null);
      setCategory('Personal');

    } catch (error) {
      console.error('❌ Error guardando documento:', error);
      Alert.alert('Error', `No se pudo guardar el documento: ${error}`);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Agregar Documento
      </Text>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Seleccionar Archivo
          </Text>
          {selectedFile && (
            <Text variant="bodySmall" style={styles.selectedFile}>
              ✅ Archivo seleccionado: {selectedFile.name}
            </Text>
          )}
          <View style={styles.buttonRow}>
            {/* BOTONES CON EMOJIS - MÁS SIMPLE Y FUNCIONAL */}
            <Button
              mode="contained"
              onPress={pickDocument}
              style={styles.button}>
              📄 PDF
            </Button>
            
            <Button
              mode="outlined"
              onPress={pickImage}
              style={styles.button}>
              🖼️ Imagen
            </Button>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Información del Documento
          </Text>

          <TextInput
            label="Nombre del documento"
            value={documentName}
            onChangeText={setDocumentName}
            style={styles.input}
            mode="outlined"
          />

          {/* MENÚ DE CATEGORÍAS SIMPLE */}
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setMenuVisible(true)}
                style={styles.input}>
                📁 Categoría: {category} ▼
              </Button>
            }>
            {categories.map(cat => (
              <Menu.Item
                key={cat}
                onPress={() => {
                  setCategory(cat);
                  setMenuVisible(false);
                }}
                title={cat}
              />
            ))}
          </Menu>
        </Card.Content>
      </Card>

      {/* BOTÓN GUARDAR SIMPLE */}
      <Button
        mode="contained"
        onPress={saveDocument}
        style={styles.saveButton}>
        💾 Guardar Documento
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  title: {
    margin: 16,
    textAlign: 'center',
  },
  card: {
    margin: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  selectedFile: {
    marginBottom: 8,
    fontStyle: 'italic',
    color: '#4CAF50',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  button: {
    flex: 0.4,
  },
  input: {
    marginVertical: 8,
  },
  saveButton: {
    margin: 16,
    marginTop: 24,
  },
});

export default AgregarDocumentoScreen;