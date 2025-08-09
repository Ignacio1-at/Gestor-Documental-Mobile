import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  IconButton,
} from 'react-native-paper';
import { Document } from '../types';
import { CategoriaService } from '../services/CategoriaService';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface EditarDocumentoModalProps {
  visible: boolean;
  document: Document;
  onClose: () => void;
  onSave: (updates: Partial<Document>) => void;
}

const EditarDocumentoModal: React.FC<EditarDocumentoModalProps> = ({
  visible,
  document,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(document.name);
  const [category, setCategory] = useState(document.category);
  const [categories, setCategories] = useState<string[]>([]);
  const [showCategories, setShowCategories] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    setName(document.name);
    setCategory(document.category);
  }, [document]);

  const loadCategories = async () => {
    const cats = await CategoriaService.getCategories();
    setCategories(cats);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre no puede estar vacío');
      return;
    }

    try {
      setSaving(true);
      onSave({
        name: name.trim(),
        category,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory);
    setShowCategories(false);
  };

  const handleClose = () => {
    setShowCategories(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
      statusBarTranslucent={true}
    >
      <TouchableOpacity 
        style={styles.backdrop}
        activeOpacity={1}
        onPress={handleClose}
      >
        <TouchableOpacity 
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <Card style={styles.modalCard}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.header}>
                <View style={styles.headerInfo}>
                  <Icon name="edit" size={22} color="#E91E63" />
                  <Text variant="titleLarge" style={styles.headerTitle}>
                    Editar Documento
                  </Text>
                </View>
                <IconButton 
                  icon={() => <Icon name="close" size={20} color="#6C7B95" />}
                  onPress={handleClose}
                  style={styles.closeButton}
                />
              </View>

              <ScrollView 
                style={styles.content} 
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}>
                
                <View style={styles.inputSection}>
                  <Text variant="labelMedium" style={styles.sectionLabel}>
                    Información del documento
                  </Text>
                  <TextInput
                    label="Nombre del documento"
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                    mode="outlined"
                    outlineColor="#E1E8ED"
                    activeOutlineColor="#E91E63"
                    left={<TextInput.Icon icon={() => <Icon name="description" size={20} color="#6C7B95" />} />}
                    disabled={saving}
                  />
                </View>

                <View style={styles.categorySection}>
                  <Text variant="labelMedium" style={styles.sectionLabel}>
                    Categoría del documento
                  </Text>
                  
                  <TouchableOpacity
                    style={styles.selectedCategoryButton}
                    onPress={() => setShowCategories(!showCategories)}
                    disabled={saving}>
                    <View style={styles.categoryButtonContent}>
                      <Icon name="folder" size={18} color="#E91E63" />
                      <Text variant="titleSmall" style={styles.categoryButtonText}>
                        {category}
                      </Text>
                    </View>
                    <Icon 
                      name={showCategories ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                      size={20} 
                      color="#6C7B95" 
                    />
                  </TouchableOpacity>

                  {showCategories && (
                    <View style={styles.categoriesList}>
                      <ScrollView 
                        style={styles.categoriesScroll} 
                        nestedScrollEnabled={true}
                        showsVerticalScrollIndicator={false}>
                        {categories.map((cat, index) => (
                          <TouchableOpacity
                            key={cat}
                            style={[
                              styles.categoryItem,
                              cat === category && styles.selectedCategoryItem,
                              index === categories.length - 1 && styles.lastCategoryItem
                            ]}
                            onPress={() => handleCategorySelect(cat)}>
                            <Icon 
                              name="folder" 
                              size={16} 
                              color={cat === category ? "#E91E63" : "#6C7B95"} 
                            />
                            <Text style={[
                              styles.categoryText,
                              cat === category && styles.selectedCategoryText
                            ]}>
                              {cat}
                            </Text>
                            {cat === category && (
                              <Icon name="check" size={16} color="#E91E63" />
                            )}
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              </ScrollView>

              <View style={styles.actionButtons}>
                <Button 
                  mode="outlined" 
                  onPress={handleClose} 
                  style={styles.cancelButton}
                  labelStyle={styles.cancelButtonText}
                  disabled={saving}
                  icon={() => <Icon name="close" size={16} color="#6C7B95" />}>
                  Cancelar
                </Button>
                <Button 
                  mode="contained" 
                  onPress={handleSave} 
                  style={styles.saveButton}
                  labelStyle={styles.saveButtonText}
                  disabled={saving || !name.trim()}
                  loading={saving}
                  icon={() => <Icon name="save" size={16} color="#FFFFFF" />}>
                  {saving ? 'Guardando...' : 'Guardar'}
                </Button>
              </View>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    justifyContent: 'center',
    maxHeight: '75%',
  },
  modalCard: {
    elevation: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  cardContent: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    color: '#2E3A59',
    fontWeight: '600',
  },
  closeButton: {
    margin: 0,
  },
  content: {
    maxHeight: 320,
  },
  inputSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    marginBottom: 8,
    color: '#6C7B95',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FFFFFF',
  },
  categorySection: {
    marginBottom: 16,
  },
  selectedCategoryButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E1E8ED',
  },
  categoryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryButtonText: {
    color: '#2E3A59',
    fontWeight: '500',
  },
  categoriesList: {
    marginTop: 8,
    maxHeight: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E1E8ED',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoriesScroll: {
    maxHeight: 150,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  lastCategoryItem: {
    borderBottomWidth: 0,
  },
  selectedCategoryItem: {
    backgroundColor: '#FCE4EC',
  },
  categoryText: {
    flex: 1,
    fontSize: 14,
    color: '#2E3A59',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#E91E63',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderColor: '#E1E8ED',
    borderWidth: 1.5,
    borderRadius: 12,
  },
  cancelButtonText: {
    color: '#6C7B95',
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#E91E63',
    borderRadius: 12,
    paddingVertical: 4,
  },
  saveButtonText: {
    fontWeight: '600',
  },
});

export default EditarDocumentoModal;