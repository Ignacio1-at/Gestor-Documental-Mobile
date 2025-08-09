import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Alert,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  IconButton,
  Divider,
} from 'react-native-paper';
import { CategoriaService } from '../services/CategoriaService';
import { DocumentService } from '../services/DocumentService';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface GestionarCategoriasModalProps {
  visible: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const GestionarCategoriasModal: React.FC<GestionarCategoriasModalProps> = ({
  visible,
  onClose,
  onUpdate,
}) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      loadCategories();
    }
  }, [visible]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const cats = await CategoriaService.getCategories();
      setCategories(cats);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryInput.trim()) {
      Alert.alert('Error', 'Ingresa un nombre para la categoría');
      return;
    }

    if (categories.includes(newCategoryInput.trim())) {
      Alert.alert('Error', 'Esta categoría ya existe');
      return;
    }

    try {
      await CategoriaService.addCategory(newCategoryInput.trim());
      await loadCategories();
      setNewCategoryInput('');
      Alert.alert('Éxito', 'Categoría agregada correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar la categoría');
    }
  };

  const handleDeleteCategory = async (categoryToDelete: string) => {
    try {
      const documents = await DocumentService.getDocuments();
      const documentsUsingCategory = documents.filter(doc => doc.category === categoryToDelete);

      if (documentsUsingCategory.length > 0) {
        Alert.alert(
          'No se puede eliminar',
          `Esta categoría está siendo usada por ${documentsUsingCategory.length} documento(s).`,
          [{ text: 'Entendido' }]
        );
        return;
      }

      Alert.alert(
        'Confirmar eliminación',
        `¿Eliminar "${categoryToDelete}"?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: async () => {
              try {
                await CategoriaService.removeCategory(categoryToDelete);
                await loadCategories();
                Alert.alert('Éxito', 'Categoría eliminada');
              } catch (error) {
                Alert.alert('Error', 'No se pudo eliminar');
              }
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo verificar la categoría');
    }
  };

  const renderCategoryItem = ({ item }: { item: string }) => (
    <View style={styles.categoryItem}>
      <Icon name="folder" size={20} color="#E91E63" />
      <Text style={styles.categoryName}>{item}</Text>
      <TouchableOpacity
        onPress={() => handleDeleteCategory(item)}
        style={styles.deleteButton}>
        <Icon name="delete" size={18} color="#D32F2F" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.modalContainer}>
          <Card style={styles.modalCard}>
            <Card.Content>
              {/* Header */}
              <View style={styles.header}>
                <Text variant="titleLarge" style={styles.title}>
                  Gestionar Categorías
                </Text>
                <IconButton
                  icon="close"
                  onPress={onClose}
                  iconColor="#6C7B95"
                />
              </View>

              {/* Agregar categoría */}
              <View style={styles.addSection}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Agregar nueva categoría
                </Text>
                <View style={styles.inputRow}>
                  <TextInput
                    label="Nombre"
                    value={newCategoryInput}
                    onChangeText={setNewCategoryInput}
                    style={styles.input}
                    mode="outlined"
                  />
                  <Button
                    mode="contained"
                    onPress={handleAddCategory}
                    style={styles.addButton}>
                    Agregar
                  </Button>
                </View>
              </View>

              <Divider style={styles.divider} />

              {/* Lista de categorías */}
              <View style={styles.listSection}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Categorías existentes ({categories.length})
                </Text>

                {loading ? (
                  <Text style={styles.loadingText}>Cargando...</Text>
                ) : categories.length === 0 ? (
                  <Text style={styles.emptyText}>No hay categorías</Text>
                ) : (
                  <FlatList
                    data={categories}
                    keyExtractor={(item) => item}
                    renderItem={renderCategoryItem}
                    style={styles.list}
                    showsVerticalScrollIndicator={false}
                  />
                )}
              </View>

              {/* Botón Listo */}
              <Button
                mode="contained"
                onPress={onUpdate}
                style={styles.doneButton}>
                Listo
              </Button>
            </Card.Content>
          </Card>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    maxHeight: '80%',
  },
  modalCard: {
    borderRadius: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#2E3A59',
    fontWeight: '600',
  },
  addSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#2E3A59',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
  },
  addButton: {
    marginBottom: 8,
  },
  divider: {
    marginVertical: 16,
  },
  listSection: {
    marginBottom: 16,
  },
  list: {
    maxHeight: 200,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    color: '#2E3A59',
  },
  deleteButton: {
    padding: 8,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
  },
  loadingText: {
    textAlign: 'center',
    color: '#6C7B95',
    padding: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6C7B95',
    padding: 20,
  },
  doneButton: {
    marginTop: 8,
  },
});

export default GestionarCategoriasModal;