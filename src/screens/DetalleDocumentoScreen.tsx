import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Text, Card, Chip} from 'react-native-paper';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';
import {ImageViewer} from '../components/DetalleDocumento';
import PDFViewer from '../components/DetalleDocumento/PdfViewer';

type Props = NativeStackScreenProps<RootStackParamList, 'DocumentDetail'>;

const DetalleDocumentoScreen = ({route}: Props) => {
  const {document} = route.params;

  if (!document) {
    return (
      <View style={styles.container}>
        <Card style={styles.errorCard}>
          <Card.Content>
            <Text variant="bodyMedium" style={styles.errorText}>
              ❌ No se pudo cargar el documento
            </Text>
          </Card.Content>
        </Card>
      </View>
    );
  }

  const renderViewer = () => {
    if (!document.uri) {
      return (
        <Card style={styles.errorCard}>
          <Card.Content>
            <Text variant="bodyMedium" style={styles.errorText}>
              ⚠️ No se encontró la ubicación del archivo
            </Text>
          </Card.Content>
        </Card>
      );
    }

    // Renderizar el visualizador apropiado según el tipo
    if (document.type === 'PDF') {
      return <PDFViewer uri={document.uri} fileName={document.name} />;
    } else {
      return <ImageViewer uri={document.uri} fileName={document.name} />;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Información del documento */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.documentName}>
            {document.name}
          </Text>
          
          <View style={styles.chipContainer}>
            <Chip style={styles.chip}>
              {document.type === 'PDF' ? '📄' : '🖼️'} {document.type}
            </Chip>
            <Chip style={styles.chip}>
              📁 {document.category}
            </Chip>
          </View>
          
          <View style={styles.metadataContainer}>
            <Text variant="bodyMedium" style={styles.metadata}>
              📅 Fecha: {document.date}
            </Text>
            {document.size && (
              <Text variant="bodySmall" style={styles.metadata}>
                📊 Tamaño: {(document.size / 1024).toFixed(1)} KB
              </Text>
            )}
            {document.mimeType && (
              <Text variant="bodySmall" style={styles.metadata}>
                🏷️ Tipo: {document.mimeType}
              </Text>
            )}
          </View>
        </Card.Content>
      </Card>

      {/* Visualizador dinámico */}
      {renderViewer()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  card: {
    margin: 16,
  },
  documentName: {
    marginBottom: 12,
    textAlign: 'center',
  },
  chipContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
    flexWrap: 'wrap',
  },
  chip: {
    marginHorizontal: 4,
    marginVertical: 2,
  },
  metadataContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  metadata: {
    marginVertical: 2,
  },
  errorCard: {
    margin: 16,
  },
  errorText: {
    textAlign: 'center',
    color: '#666',
  },
});

export default DetalleDocumentoScreen;