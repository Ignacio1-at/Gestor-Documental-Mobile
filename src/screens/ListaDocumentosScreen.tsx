import React, {useState, useCallback} from 'react';
import {View, StyleSheet, FlatList, ScrollView, Alert} from 'react-native';
import {Text, Card, Searchbar, Chip, FAB} from 'react-native-paper';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Document, RootStackParamList} from '../types';
import {useFocusEffect} from '@react-navigation/native';
import {DocumentService} from '../services/DocumentService'; // ✅ DESCOMENTADO

type Props = NativeStackScreenProps<RootStackParamList, 'DocumentList'>;

const ListaDocumentosScreen = ({navigation}: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [documents, setDocuments] = useState<Document[]>([]); // ✅ CAMBIADO
  const [loading, setLoading] = useState(false); // ✅ AGREGADO

  const categories = ['Todas', 'Personal', 'Trabajo', 'Educación', 'Salud', 'Finanzas'];

  // ✅ CARGAR DOCUMENTOS REALES
  useFocusEffect(
    useCallback(() => {
      loadDocuments();
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

  // Filtrar documentos por búsqueda Y categoría
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeEmoji = (type: string) => {
    return type === 'PDF' ? '📄' : '🖼️';
  };

  return (
    <View style={styles.container}>
      {/* Barra de búsqueda */}
      <Searchbar
        placeholder="Buscar documentos..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      {/* Filtro por categorías */}
      <View style={styles.filterContainer}>
        <Text variant="labelMedium" style={styles.filterTitle}>
          🔍 Filtrar por categoría:
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {categories.map(category => (
            <Chip
              key={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.selectedChip
              ]}
              textStyle={
                selectedCategory === category && styles.selectedChipText
              }
            >
              {category}
            </Chip>
          ))}
        </ScrollView>
      </View>

      {/* Lista de documentos */}
      <FlatList
        data={filteredDocuments}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Card
            style={styles.documentCard}
            onPress={() =>
              navigation.navigate('DocumentDetail', {document: item})
            }>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text style={styles.typeEmoji}>
                  {getTypeEmoji(item.type)}
                </Text>
                <View style={styles.cardContent}>
                  <Text variant="titleMedium" numberOfLines={1} style={styles.cardTitle}>
                    {item.name}
                  </Text>
                  <View style={styles.cardDetails}>
                    <Text variant="bodySmall">📄 Tipo: {item.type}</Text>
                    <Text variant="bodySmall">📁 Categoría: {item.category}</Text>
                    <Text variant="bodySmall">📅 Fecha: {item.date}</Text>
                  </View>
                </View>
                <Text style={styles.chevron}>▶</Text>
              </View>
            </Card.Content>
          </Card>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📂</Text>
            <Text variant="bodyMedium" style={styles.emptyText}>
              {loading 
                ? 'Cargando documentos...'
                : searchQuery || selectedCategory !== 'Todas'
                ? 'No se encontraron documentos'
                : 'No hay documentos todavía'}
            </Text>
            {!loading && documents.length === 0 && (
              <Text 
                style={styles.emptyButton}
                onPress={() => navigation.navigate('AddTab')}
              >
                ➕ Agregar primer documento
              </Text>
            )}
          </View>
        }
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddTab')}
        label="Agregar"
      />
    </View>
  );
};

// Estilos iguales...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchbar: {
    margin: 16,
    marginBottom: 8,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filterTitle: {
    marginBottom: 8,
    color: '#666',
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryChip: {
    marginRight: 8,
    backgroundColor: '#E0E0E0',
  },
  selectedChip: {
    backgroundColor: '#2196F3',
  },
  selectedChipText: {
    color: '#FFFFFF',
  },
  documentCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    marginBottom: 4,
  },
  cardDetails: {
    gap: 2,
  },
  chevron: {
    fontSize: 16,
    color: '#ccc',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyButton: {
    marginTop: 8,
    color: '#2196F3',
    fontSize: 16,
    textAlign: 'center',
    padding: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default ListaDocumentosScreen;