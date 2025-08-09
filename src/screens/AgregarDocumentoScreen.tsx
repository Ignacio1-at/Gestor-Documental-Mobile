import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import {
  Text,
  Button,
  Card,
  TextInput,
  Menu,
  Chip,
} from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { DocumentService } from '../services/DocumentService';
import { CategoriaService } from '../services/CategoriaService';
import { Document } from '../types';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import 'react-native-get-random-values';

const AgregarDocumentoScreen = () => {
  const [documentName, setDocumentName] = useState('');
  const [category, setCategory] = useState('Personal');
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [categories, setCategories] = useState<string[]>(['Personal']);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, [])
  );

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const cats = await CategoriaService.getCategories();
      setCategories(cats);
      
      if (!cats.includes(category)) {
        setCategory(cats[0] || 'Personal');
      }
    } catch (error) {
      console.error('Error cargando categorías:', error);
      const defaultCategories = ['Personal', 'Trabajo', 'Educación', 'Salud', 'Finanzas'];
      setCategories(defaultCategories);
      setCategory('Personal');
    } finally {
      setLoadingCategories(false);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      setSelectedFile(result[0]);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
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
      setSaving(true);
      
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
        uri: internalPath,
        size: selectedFile.size,
        mimeType: selectedFile.type,
      };

      await DocumentService.saveDocument(document);
      Alert.alert('Éxito', 'Documento guardado correctamente');

      setDocumentName('');
      setSelectedFile(null);

    } catch (error) {
      console.error('Error guardando documento:', error);
      Alert.alert('Error', `No se pudo guardar el documento: ${error}`);
    } finally {
      setSaving(false);
    }
  };

  const getFileTypeInfo = () => {
    if (!selectedFile) return null;
    
    const isImage = selectedFile.type?.includes('image');
    return {
      icon: isImage ? 'image' : 'picture-as-pdf',
      color: isImage ? '#4CAF50' : '#D32F2F',
      type: isImage ? 'Imagen' : 'PDF'
    };
  };

  const fileInfo = getFileTypeInfo();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Icon name="upload-file" size={32} color="#E91E63" />
        </View>
        <Text variant="headlineMedium" style={styles.title}>
          Agregar Documento
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Selecciona un archivo y completa la información
        </Text>
      </View>

      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.sectionHeader}>
            <Icon name="attach-file" size={20} color="#E91E63" />
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Seleccionar Archivo
            </Text>
          </View>

          {selectedFile && (
            <View style={styles.selectedFileContainer}>
              <View style={styles.fileInfo}>
                <View style={[styles.fileIcon, { backgroundColor: fileInfo!.color + '15' }]}>
                  <Icon name={fileInfo!.icon} size={20} color={fileInfo!.color} />
                </View>
                <View style={styles.fileDetails}>
                  <Text variant="titleSmall" style={styles.fileName} numberOfLines={1}>
                    {selectedFile.name}
                  </Text>
                  <Text variant="bodySmall" style={styles.fileType}>
                    {fileInfo!.type} • {(selectedFile.size / 1024).toFixed(1)} KB
                  </Text>
                </View>
                <Icon name="check-circle" size={20} color="#4CAF50" />
              </View>
            </View>
          )}

          <View style={styles.buttonRow}>
            <Button
              mode="contained"
              onPress={pickDocument}
              style={[styles.fileButton, styles.pdfButton]}
              labelStyle={styles.fileButtonText}
              icon={() => <Icon name="picture-as-pdf" size={18} color="#FFFFFF" />}>
              PDF
            </Button>
            
            <Button
              mode="outlined"
              onPress={pickImage}
              style={[styles.fileButton, styles.imageButton]}
              labelStyle={styles.imageButtonText}
              icon={() => <Icon name="image" size={18} color="#4CAF50" />}>
              Imagen
            </Button>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.sectionHeader}>
            <Icon name="info" size={20} color="#E91E63" />
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Información del Documento
            </Text>
          </View>

          <TextInput
            label="Nombre del documento"
            value={documentName}
            onChangeText={setDocumentName}
            style={styles.input}
            mode="outlined"
            outlineColor="#E1E8ED"
            activeOutlineColor="#E91E63"
            left={<TextInput.Icon icon={() => <Icon name="description" size={20} color="#6C7B95" />} />}
            disabled={saving}
          />

          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setMenuVisible(true)}
                style={styles.categoryButton}
                labelStyle={styles.categoryButtonText}
                disabled={loadingCategories || saving}
                icon={() => <Icon name="folder" size={16} color="#E91E63" />}>
                {loadingCategories ? 'Cargando categorías...' : `${category}`}
                <Icon name="keyboard-arrow-down" size={16} color="#E91E63" style={styles.dropdownIcon} />
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
                leadingIcon={() => <Icon name="folder" size={16} color="#6C7B95" />}
              />
            ))}
          </Menu>

          <View style={styles.infoContainer}>
            <Icon name="lightbulb-outline" size={14} color="#8E9AAF" />
            <Text variant="bodySmall" style={styles.infoText}>
              Puedes gestionar las categorías desde la lista de documentos
            </Text>
          </View>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={saveDocument}
        style={styles.saveButton}
        labelStyle={styles.saveButtonText}
        disabled={loadingCategories || saving || !selectedFile || !documentName.trim()}
        loading={saving}
        icon={() => <Icon name="save" size={18} color="#FFFFFF" />}>
        {saving ? 'Guardando...' : 'Guardar Documento'}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FCE4EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  title: {
    textAlign: 'center',
    color: '#2E3A59',
    fontWeight: '600',
    marginBottom: 6,
  },
  subtitle: {
    textAlign: 'center',
    color: '#6C7B95',
  },
  card: {
    margin: 16,
    elevation: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardContent: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    color: '#2E3A59',
    fontWeight: '600',
  },
  selectedFileContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E1E8ED',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fileIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    color: '#2E3A59',
    fontWeight: '600',
    marginBottom: 2,
  },
  fileType: {
    color: '#6C7B95',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  fileButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 4,
  },
  pdfButton: {
    backgroundColor: '#D32F2F',
  },
  imageButton: {
    borderColor: '#4CAF50',
    borderWidth: 1.5,
  },
  fileButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  imageButtonText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  input: {
    marginVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  categoryButton: {
    marginVertical: 8,
    borderColor: '#E91E63',
    borderWidth: 1.5,
    borderRadius: 12,
    justifyContent: 'flex-start',
  },
  categoryButtonText: {
    color: '#E91E63',
    fontWeight: '500',
    textAlign: 'left',
  },
  dropdownIcon: {
    marginLeft: 'auto',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  infoText: {
    color: '#8E9AAF',
    fontStyle: 'italic',
    flex: 1,
  },
  saveButton: {
    margin: 16,
    marginTop: 8,
    borderRadius: 16,
    paddingVertical: 8,
    backgroundColor: '#E91E63',
    elevation: 3,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AgregarDocumentoScreen;