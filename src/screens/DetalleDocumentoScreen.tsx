import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, RefreshControl } from 'react-native';
import { Text, Card, Chip, Button } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import DocumentViewer from '../components/DocumentViewer';
import { DocumentService } from '../services/DocumentService';
import EditarDocumentoModal from '../components/EditarDocumentoModal';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = NativeStackScreenProps<RootStackParamList, 'DocumentDetail'>;

const DetalleDocumentoScreen = ({ route, navigation }: Props) => {
  const { document } = route.params;
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(document);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const documents = await DocumentService.getDocuments();
      const updatedDocument = documents.find(doc => doc.id === currentDocument.id);
      
      if (updatedDocument) {
        setCurrentDocument(updatedDocument);
      } else {
        Alert.alert(
          'Documento no encontrado',
          'Este documento ha sido eliminado.',
          [
            {
              text: 'Entendido',
              onPress: () => navigation.goBack()
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la información del documento');
    } finally {
      setRefreshing(false);
    }
  };

  const handleEdit = () => {
    setEditModalVisible(true);
  };

  const handleSaveEdit = async (updates: Partial<Document>) => {
    try {
      await DocumentService.updateDocument(currentDocument.id, updates);
      setCurrentDocument({ ...currentDocument, ...updates });
      Alert.alert('Éxito', 'Documento actualizado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el documento');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de que quieres eliminar "${currentDocument.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await DocumentService.deleteDocument(currentDocument.id);
              Alert.alert('Éxito', 'Documento eliminado correctamente');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el documento');
            }
          },
        },
      ]
    );
  };

  const getDocumentColor = (type: string) => {
    return type === 'PDF' ? '#D32F2F' : '#4CAF50';
  };

  const getDocumentIcon = (type: string) => {
    return type === 'PDF' ? 'picture-as-pdf' : 'image';
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (!document) {
    return (
      <View style={styles.container}>
        <Card style={styles.errorCard}>
          <Card.Content style={styles.errorContent}>
            <Icon name="error-outline" size={48} color="#D32F2F" />
            <Text variant="titleMedium" style={styles.errorText}>
              No se pudo cargar el documento
            </Text>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#E91E63']}
          tintColor="#E91E63"
          title="Actualizando..."
          titleColor="#E91E63"
          progressBackgroundColor="#FFFFFF"
        />
      }>
      
      <Card style={styles.infoCard}>
        <Card.Content style={styles.cardContent}>
          {refreshing && (
            <View style={styles.refreshIndicator}>
              <Icon name="refresh" size={16} color="#E91E63" />
              <Text style={styles.refreshText}>Actualizando información...</Text>
            </View>
          )}

          <View style={styles.headerSection}>
            <View style={styles.iconContainer}>
              <Icon 
                name={getDocumentIcon(currentDocument.type)} 
                size={32} 
                color={getDocumentColor(currentDocument.type)} 
              />
            </View>
            <Text variant="headlineSmall" style={styles.documentName}>
              {currentDocument.name}
            </Text>
          </View>

          <View style={styles.chipContainer}>
            <Chip 
              style={[styles.chip, { backgroundColor: getDocumentColor(currentDocument.type) + '15' }]}
              textStyle={[styles.chipText, { color: getDocumentColor(currentDocument.type) }]}
              icon={() => (
                <Icon 
                  name={getDocumentIcon(currentDocument.type)} 
                  size={14} 
                  color={getDocumentColor(currentDocument.type)} 
                />
              )}>
              {currentDocument.type}
            </Chip>
            <Chip 
              style={styles.categoryChip}
              textStyle={styles.categoryChipText}
              icon={() => <Icon name="folder" size={14} color="#E91E63" />}>
              {currentDocument.category}
            </Chip>
          </View>

          <View style={styles.metadataContainer}>
            <View style={styles.metadataRow}>
              <Icon name="event" size={16} color="#8E9AAF" />
              <Text style={styles.metadataLabel}>Fecha:</Text>
              <Text style={styles.metadataValue}>{currentDocument.date}</Text>
            </View>
            
            {currentDocument.size && (
              <View style={styles.metadataRow}>
                <Icon name="storage" size={16} color="#8E9AAF" />
                <Text style={styles.metadataLabel}>Tamaño:</Text>
                <Text style={styles.metadataValue}>
                  {formatFileSize(currentDocument.size)}
                </Text>
              </View>
            )}
            
            {currentDocument.mimeType && (
              <View style={styles.metadataRow}>
                <Icon name="info" size={16} color="#8E9AAF" />
                <Text style={styles.metadataLabel}>Tipo:</Text>
                <Text style={styles.metadataValue}>{currentDocument.mimeType}</Text>
              </View>
            )}
          </View>

          <View style={styles.actionButtons}>
            <Button
              mode="outlined"
              onPress={handleEdit}
              style={styles.editButton}
              labelStyle={styles.editButtonText}
              disabled={refreshing}
              icon={() => <Icon name="edit" size={16} color="#E91E63" />}>
              Editar
            </Button>
            <Button
              mode="outlined"
              onPress={handleDelete}
              style={styles.deleteButton}
              labelStyle={styles.deleteButtonText}
              disabled={refreshing}
              icon={() => <Icon name="delete" size={16} color="#D32F2F" />}>
              Eliminar
            </Button>
          </View>

          <View style={styles.refreshHint}>
            <Icon name="keyboard-arrow-down" size={16} color="#C7D2FE" />
            <Text style={styles.refreshHintText}>
              Desliza hacia abajo para actualizar
            </Text>
          </View>
        </Card.Content>
      </Card>

      <DocumentViewer
        uri={currentDocument.uri}
        fileName={currentDocument.name}
        type={currentDocument.type}
        mimeType={currentDocument.mimeType}
      />

      <EditarDocumentoModal
        visible={editModalVisible}
        document={currentDocument}
        onClose={() => setEditModalVisible(false)}
        onSave={handleSaveEdit}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  infoCard: {
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
  refreshIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FCE4EC',
    borderRadius: 20,
    marginBottom: 16,
    gap: 6,
  },
  refreshText: {
    color: '#E91E63',
    fontSize: 12,
    fontWeight: '500',
  },
  refreshHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 4,
  },
  refreshHintText: {
    color: '#C7D2FE',
    fontSize: 11,
    fontStyle: 'italic',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 1,
  },
  documentName: {
    textAlign: 'center',
    color: '#2E3A59',
    fontWeight: '600',
  },
  chipContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  categoryChip: {
    backgroundColor: '#FCE4EC',
    borderWidth: 1,
    borderColor: '#F8BBD9',
  },
  categoryChipText: {
    color: '#E91E63',
    fontSize: 12,
    fontWeight: '600',
  },
  metadataContainer: {
    marginTop: 8,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    gap: 12,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metadataLabel: {
    fontSize: 13,
    color: '#6C7B95',
    fontWeight: '500',
    minWidth: 60,
  },
  metadataValue: {
    fontSize: 13,
    color: '#2E3A59',
    fontWeight: '600',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    gap: 12,
  },
  editButton: {
    flex: 1,
    borderColor: '#E91E63',
    borderWidth: 1.5,
    borderRadius: 12,
  },
  editButtonText: {
    color: '#E91E63',
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    borderColor: '#D32F2F',
    borderWidth: 1.5,
    borderRadius: 12,
  },
  deleteButtonText: {
    color: '#D32F2F',
    fontWeight: '600',
  },
  errorCard: {
    margin: 16,
    elevation: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
  },
  errorContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  errorText: {
    textAlign: 'center',
    color: '#6C7B95',
    marginTop: 12,
  },
});

export default DetalleDocumentoScreen;