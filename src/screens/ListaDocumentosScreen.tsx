import React, {useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {Text, Card, Searchbar, FAB} from 'react-native-paper';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Document, RootStackParamList} from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'DocumentList'>;

const ListaDocumentosScreen = ({navigation}: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [documents] = useState<Document[]>([
    {
      id: '1',
      name: 'Documento Ejemplo.pdf',
      type: 'PDF',
      date: '2025-08-08',
      category: 'Personal',
    },
    {
      id: '2',
      name: 'Imagen Ejemplo.jpg',
      type: 'Imagen',
      date: '2025-08-07',
      category: 'Trabajo',
    },
  ]);

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar documentos..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      
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
              <Text variant="titleMedium" numberOfLines={1} style={styles.cardTitle}>
                {item.name}
              </Text>
              <Text variant="bodySmall">Tipo: {item.type}</Text>
              <Text variant="bodySmall">Categoría: {item.category}</Text>
              <Text variant="bodySmall">Fecha: {item.date}</Text>
            </Card.Content>
          </Card>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyMedium">
              {searchQuery
                ? 'No se encontraron documentos'
                : 'No hay documentos todavía'}
            </Text>
          </View>
        }
      />
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddTab')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchbar: {
    margin: 16,
  },
  documentCard: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  cardTitle: {
    marginBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default ListaDocumentosScreen;