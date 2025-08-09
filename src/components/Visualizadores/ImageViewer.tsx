import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { Text, IconButton, Card } from 'react-native-paper';

interface ImageViewerProps {
  uri: string;
  fileName: string;
}

const { width, height } = Dimensions.get('window');

const ImageViewer: React.FC<ImageViewerProps> = ({ uri, fileName }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [imageError, setImageError] = useState(false);

  const openFullScreen = () => {
    setModalVisible(true);
  };

  const closeFullScreen = () => {
    setModalVisible(false);
  };

  if (imageError) {
    return (
      <Card style={styles.errorCard}>
        <Card.Content>
          <View style={styles.errorContainer}>
            <Text style={styles.errorEmoji}>🚫</Text>
            <Text variant="bodyMedium" style={styles.errorText}>
              No se pudo cargar la imagen
            </Text>
            <Text variant="bodySmall" style={styles.errorDetail}>
              Verifica que el archivo exista y sea una imagen válida
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
              🖼️ Vista Previa
            </Text>
            <TouchableOpacity onPress={openFullScreen} style={styles.imageContainer}>
              <Image
                source={{ uri }}
                style={styles.previewImage}
                resizeMode="cover"
                onError={() => setImageError(true)}
              />
              <View style={styles.overlay}>
                <Text style={styles.overlayText}>👆 Toca para ver en pantalla completa</Text>
              </View>
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
          {/* Header con botón cerrar */}
          <View style={styles.modalHeader}>
            <Text variant="titleMedium" style={styles.modalTitle} numberOfLines={1}>
              {fileName}
            </Text>
            <IconButton
              icon="close"
              size={24}
              iconColor="white"
              onPress={closeFullScreen}
              style={styles.closeButton}
            />
          </View>
          
          {/* Imagen en pantalla completa */}
          <TouchableOpacity 
            style={styles.fullImageContainer}
            onPress={closeFullScreen}
            activeOpacity={1}>
            <Image
              source={{ uri }}
              style={styles.fullImage}
              resizeMode="contain"
              onError={() => {
                setImageError(true);
                closeFullScreen();
              }}
            />
          </TouchableOpacity>
          
          {/* Footer con instrucciones */}
          <View style={styles.modalFooter}>
            <Text style={styles.footerText}>
              Toca cualquier lugar para cerrar
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
  imageContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  previewImage: {
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
  modalTitle: {
    color: 'white',
    flex: 1,
    marginRight: 16,
  },
  closeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  fullImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: width,
    height: height - 150,
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

export default ImageViewer;