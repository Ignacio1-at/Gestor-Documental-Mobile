import React, {useState, useCallback} from 'react';
import {View, StyleSheet, FlatList, ScrollView, Alert} from 'react-native';
import {Text, Card, Searchbar, Chip, FAB, Button} from 'react-native-paper';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Document, RootStackParamList} from '../types';
import {useFocusEffect} from '@react-navigation/native';
import {DocumentService} from '../services/DocumentService';
import {CategoriaService} from '../services/CategoriaService';
import GestionarCategoriasModal from '../components/GestionarCategoriasModal';
import UserProfileHeader from '../components/UserProfileHeader';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = NativeStackScreenProps<RootStackParamList, 'DocumentList'>;

const ListaDocumentosScreen = ({navigation}: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>(['Todas']);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadDocuments();
      loadCategories();
    }, [])
  );

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const docs = await DocumentService.getDocuments();
      setDocuments(docs);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los documentos');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const cats = await CategoriaService.getCategories();
      setCategories(['Todas', ...cats]);
    } catch (error) {
      console.error('Error cargando categorías:', error);
      setCategories(['Todas', 'Personal', 'Trabajo', 'Educación', 'Salud', 'Finanzas']);
    }
  };

  const handleCategoriesUpdated = () => {
    loadCategories();
    setShowCategoryModal(false);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDocumentIcon = (type: string) => {
    return type === 'PDF' ? 'picture-as-pdf' : 'image';
  };

  const renderDocumentCard = ({ item }: { item: Document }) => (
    <Card
      style={styles.documentCard}
      onPress={() => navigation.navigate('DocumentDetail', { document: item })}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Icon 
              name={getDocumentIcon(item.type)} 
              size={28} 
              color={item.type === 'PDF' ? '#D32F2F' : '#4CAF50'} 
            />
          </View>
          
          <View style={styles.cardInfo}>
            <Text variant="titleMedium" numberOfLines={1} style={styles.cardTitle}>
              {item.name}
            </Text>
            <View style={styles.cardMeta}>
              <View style={styles.metaItem}>
                <Icon name="label" size={12} color="#8E9AAF" />
                <Text style={styles.metaText}>{item.type}</Text>
              </View>
              <View style={styles.metaItem}>
                <Icon name="folder" size={12} color="#8E9AAF" />
                <Text style={styles.metaText}>{item.category}</Text>
              </View>
              <View style={styles.metaItem}>
                <Icon name="schedule" size={12} color="#8E9AAF" />
                <Text style={styles.metaText}>{item.date}</Text>
              </View>
            </View>
          </View>
          
          <Icon name="chevron-right" size={20} color="#C7D2FE" />
        </View>
      </Card.Content>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        <Icon name="folder-open" size={64} color="#C7D2FE" />
      </View>
      <Text variant="titleMedium" style={styles.emptyTitle}>
        {loading 
          ? 'Cargando documentos...'
          : searchQuery || selectedCategory !== 'Todas'
          ? 'No se encontraron documentos'
          : 'No hay documentos todavía'}
      </Text>
      {!loading && documents.length === 0 && (
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('AddTab')}
          style={styles.emptyButton}
          icon={() => <Icon name="add-circle-outline" size={16} color="#E91E63" />}>
          Agregar primer documento
        </Button>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <UserProfileHeader />
      
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Buscar documentos..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          iconColor="#E91E63"
          inputStyle={styles.searchInput}
        />
      </View>

      <View style={styles.filterContainer}>
        <View style={styles.filterHeader}>
          <View style={styles.filterTitleContainer}>
            <Icon name="filter-list" size={16} color="#6C7B95" />
            <Text variant="labelMedium" style={styles.filterTitle}>
              Filtrar por categoría
            </Text>
          </View>
          <Button
            mode="text"
            onPress={() => setShowCategoryModal(true)}
            style={styles.manageButton}
            labelStyle={styles.manageButtonText}
            icon={() => <Icon name="settings" size={14} color="#E91E63" />}>
            Gestionar
          </Button>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryScrollContent}>
          {categories.map(category => (
            <Chip
              key={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.selectedChip
              ]}
              textStyle={[
                styles.chipText,
                selectedCategory === category && styles.selectedChipText
              ]}>
              {category}
            </Chip>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredDocuments}
        keyExtractor={item => item.id}
        renderItem={renderDocumentCard}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={filteredDocuments.length === 0 ? styles.emptyList : undefined}
        showsVerticalScrollIndicator={false}
      />

      <FAB
        style={styles.fab}
        icon={() => <Icon name="add" size={24} color="#FFFFFF" />}
        onPress={() => navigation.navigate('AddTab')}
        label="Agregar"
        color="#FFFFFF"
      />

      <GestionarCategoriasModal
        visible={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onUpdate={handleCategoriesUpdated}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  searchbar: {
    elevation: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  searchInput: {
    color: '#2E3A59',
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterTitle: {
    color: '#6C7B95',
    fontWeight: '500',
  },
  manageButton: {
    minWidth: 0,
  },
  manageButtonText: {
    fontSize: 12,
    color: '#E91E63',
    fontWeight: '600',
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryScrollContent: {
    paddingRight: 16,
  },
  categoryChip: {
    marginRight: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E8ED',
  },
  selectedChip: {
    backgroundColor: '#E91E63',
    borderColor: '#E91E63',
  },
  chipText: {
    color: '#6C7B95',
    fontSize: 12,
    fontWeight: '500',
  },
  selectedChipText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  documentCard: {
    marginHorizontal: 16,
    marginVertical: 6,
    elevation: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    color: '#2E3A59',
    fontWeight: '600',
    marginBottom: 6,
  },
  cardMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#8E9AAF',
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#6C7B95',
  },
  emptyButton: {
    borderColor: '#E91E63',
    borderWidth: 1.5,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#E91E63',
  },
});

export default ListaDocumentosScreen;