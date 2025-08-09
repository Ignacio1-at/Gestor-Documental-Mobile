import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { Text, IconButton, Card, ProgressBar } from 'react-native-paper';
import Pdf from 'react-native-pdf';

interface PdfViewerProps {
  uri: string;
  fileName: string;
}

const { width, height } = Dimensions.get('window');

const PdfViewer: React.FC<PdfViewerProps> = ({ uri, fileName }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const openFullScreen = () => {
    setModalVisible(true);
  };

  const closeFullScreen = () => {
    setModalVisible(false);
  };

  const onLoadComplete = (numberOfPages: number) => {
    setLoading(false);
    setTotalPages(numberOfPages);
  };

  const onPageChanged = (page: number) => {
    setCurrentPage(page);
  };

  const onError = (error: any) => {
    console.log('PDF Error:', error);
    setPdfError(true);
    setLoading(false);
  };

  if (pdfError) {
    return (
      <Card style={styles.errorCard}>
        <Card.Content>
          <View style={styles.errorContainer}>
            <Text style={styles.errorEmoji}>📄❌</Text>
            <Text variant="bodyMedium" style={styles.errorText}>
              No se pudo cargar el PDF
            </Text>
            <Text variant="bodySmall" style={styles.errorDetail}>
              Verifica que el archivo exista y sea un PDF válido
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      {/* Vista previa */}
      <Card style={styles.previewCard}>
        <Card.Content>
          <View style={styles.previewContainer}>
            <Text variant="titleSmall" style={styles.previewTitle}>
              📄 Vista Previa PDF
            </Text>
            
            <TouchableOpacity onPress={openFullScreen} style={styles.pdfContainer}>
              <Pdf
                source={{ uri }}
                onLoadComplete={onLoadComplete}
                onPageChanged={onPageChanged}
                onError={onError}
                style={styles.previewPdf}
                trustAllCerts={false}
                page={1}
                scale={1.0}
                spacing={0}
                fitPolicy={1}
                enablePaging={false}
                enableRTL={false}
                enableAnnotationRendering={true}
                password=""
                renderActivityIndicator={() => <View />}
              />
              {!loading && !pdfError && (
                <View style={styles.overlay}>
                  <Text style={styles.overlayText}>
                    👆 Toca para ver en pantalla completa
                  </Text>
                  {totalPages > 0 && (
                    <Text style={styles.pageInfo}>
                      {totalPages} página{totalPages !== 1 ? 's' : ''}
                    </Text>
                  )}
                </View>
              )}
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>

      {/* Modal pantalla completa */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeFullScreen}>
        <View style={styles.modalContainer}>
          {/* Header con información y botón cerrar */}
          <View style={styles.modalHeader}>
            <View style={styles.headerInfo}>
              <Text variant="titleMedium" style={styles.modalTitle} numberOfLines={1}>
                {fileName}
              </Text>
              {totalPages > 0 && (
                <Text style={styles.pageCounter}>
                  Página {currentPage} de {totalPages}
                </Text>
              )}
            </View>
            <IconButton
              icon="close"
              size={24}
              iconColor="white"
              onPress={closeFullScreen}
              style={styles.closeButton}
            />
          </View>
          
          {/* PDF en pantalla completa */}
          <View style={styles.fullPdfContainer}>
            <Pdf
              source={{ uri }}
              onLoadComplete={onLoadComplete}
              onPageChanged={onPageChanged}
              onError={onError}
              style={styles.fullPdf}
              trustAllCerts={false}
              scale={1.0}
              spacing={10}
              fitPolicy={2}
              enablePaging={true}
              enableRTL={false}
              enableAnnotationRendering={true}
              password=""
              horizontal={false}
            />
          </View>
          
          {/* Footer con instrucciones */}
          <View style={styles.modalFooter}>
            <Text style={styles.footerText}>
              Desliza para navegar • Pellizca para hacer zoom
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  previewCard: {
    margin: 16,
  },
  previewContainer: {
    alignItems: 'center',
  },
  previewTitle: {
    marginBottom: 12,
    textAlign: 'center',
  },
  loadingContainer: {
    width: width - 64,
    paddingVertical: 20,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 8,
    color: '#666',
  },
  pdfContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  previewPdf: {
    width: width - 64,
    height: 200,
    borderRadius: 8,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
  },
  overlayText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
  },
  pageInfo: {
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    fontSize: 10,
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerInfo: {
    flex: 1,
    marginRight: 16,
  },
  modalTitle: {
    color: 'white',
  },
  pageCounter: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  closeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  fullPdfContainer: {
    flex: 1,
  },
  fullPdf: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalFooter: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  errorCard: {
    margin: 16,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 8,
  },
  errorDetail: {
    textAlign: 'center',
    color: '#666',
  },
});

export default PdfViewer;