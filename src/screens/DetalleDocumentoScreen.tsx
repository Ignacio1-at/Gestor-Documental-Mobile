import React from 'react';
import {View, StyleSheet, ScrollView, Alert} from 'react-native';
import {Text, Card, Button, Chip} from 'react-native-paper';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'DocumentDetail'>;

const DetalleDocumentoScreen = ({route}: Props) => {
  const {document} = route.params;

  if (!document) {
    return (
      <View style={styles.container}>
        <Text variant="bodyMedium">No se pudo cargar el documento</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.documentName}>
            {document.name}
          </Text>
          <View style={styles.chipContainer}>
            <Chip icon="file" style={styles.chip}>
              {document.type}
            </Chip>
            <Chip icon="folder" style={styles.chip}>
              {document.category}
            </Chip>
          </View>
          <Text variant="bodyMedium">Fecha: {document.date}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.previewTitle}>
            Vista Previa
          </Text>
          <Text variant="bodyMedium" style={styles.previewText}>
            {document.type === 'PDF'
              ? '📄 Visualizador PDF (En desarrollo)'
              : '🖼️ Visualizador imagen (En desarrollo)'}
          </Text>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          style={styles.button}
          icon="eye"
          onPress={() => Alert.alert('Funcionalidad en desarrollo')}>
          Ver Documento
        </Button>
      </View>
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
  },
  chipContainer: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  chip: {
    marginRight: 8,
  },
  previewTitle: {
    marginBottom: 12,
  },
  previewText: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginVertical: 20,
    fontSize: 16,
  },
  buttonContainer: {
    padding: 16,
  },
  button: {
    marginVertical: 4,
  },
});

export default DetalleDocumentoScreen;