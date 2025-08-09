import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import ImageViewer from './Visualizadores/ImageViewer';
import PdfViewer from './Visualizadores/PdfViewer';

interface DocumentViewerProps {
  uri: string;
  fileName: string;
  type: 'PDF' | 'Imagen';
  mimeType?: string;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  uri,
  fileName,
  type,
  mimeType
}) => {
  // 🔧 NORMALIZAR URI - asegurar prefijo file://
  const normalizeUri = (inputUri: string): string => {
    if (!inputUri) return '';
    
    // Si ya tiene file:// o es content://, devolverlo tal como está
    if (inputUri.startsWith('file://') || inputUri.startsWith('content://')) {
      return inputUri;
    }
    
    // Si es una ruta absoluta sin prefijo, agregar file://
    if (inputUri.startsWith('/')) {
      return `file://${inputUri}`;
    }
    
    return inputUri;
  };

  const normalizedUri = normalizeUri(uri);

  if (!normalizedUri) {
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

  if (type === 'PDF' || mimeType?.includes('pdf')) {
    return <PdfViewer uri={normalizedUri} fileName={fileName} />;
  }

  if (type === 'Imagen' || mimeType?.includes('image')) {
    return <ImageViewer uri={normalizedUri} fileName={fileName} />;
  }

  return (
    <Card style={styles.errorCard}>
      <Card.Content>
        <Text variant="bodyMedium" style={styles.errorText}>
          📄 Tipo de archivo no soportado: {type}
        </Text>
        <Text variant="bodySmall" style={styles.debugText}>
          URI: {normalizedUri}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  errorCard: {
    margin: 16,
  },
  errorText: {
    textAlign: 'center',
    color: '#666',
  },
  debugText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 10,
    marginTop: 8,
  },
});

export default DocumentViewer;