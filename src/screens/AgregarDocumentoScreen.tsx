import React, {useState} from 'react';
import {View, StyleSheet, Alert, ScrollView} from 'react-native';
import {
  Text,
  Button,
  Card,
  TextInput,
  Menu,
} from 'react-native-paper';

const AgregarDocumentoScreen = () => {
  const [documentName, setDocumentName] = useState('');
  const [category, setCategory] = useState('Personal');
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const categories = ['Personal', 'Trabajo', 'Educación', 'Salud', 'Finanzas'];

  const pickDocument = async () => {
    Alert.alert('Funcionalidad PDF', 'Selector de PDF en desarrollo');
  };

  const pickImage = async () => {
    Alert.alert('Funcionalidad Imagen', 'Selector de imagen en desarrollo');
  };

  const saveDocument = () => {
    if (!documentName.trim()) {
      Alert.alert('Error', 'Debe ingresar un nombre para el documento');
      return;
    }

    Alert.alert(
      'Éxito',
      'Documento guardado correctamente\n(Funcionalidad completa en desarrollo)',
      [
        {
          text: 'OK',
          onPress: () => {
            setDocumentName('');
            setCategory('Personal');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Agregar Documento
      </Text>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Seleccionar Archivo
          </Text>
          <View style={styles.buttonRow}>
            <Button
              mode="contained"
              onPress={pickDocument}
              style={styles.button}
              icon="file-pdf-box">
              PDF
            </Button>
            <Button
              mode="outlined"
              onPress={pickImage}
              style={styles.button}
              icon="image">
              Imagen
            </Button>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Información del Documento
          </Text>
          
          <TextInput
            label="Nombre del documento"
            value={documentName}
            onChangeText={setDocumentName}
            style={styles.input}
            mode="outlined"
          />

          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setMenuVisible(true)}
                style={styles.input}
                icon="chevron-down">
                Categoría: {category}
              </Button>
            }>
            {categories.map(cat => (
              <Menu.Item
                key={cat}
                onPress={() => {
                  setCategory(cat);
                  setMenuVisible(false);
                }}
                title={cat}
              />
            ))}
          </Menu>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={saveDocument}
        style={styles.saveButton}
        icon="content-save">
        Guardar Documento
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  title: {
    margin: 16,
    textAlign: 'center',
  },
  card: {
    margin: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  button: {
    flex: 0.4,
  },
  input: {
    marginVertical: 8,
  },
  saveButton: {
    margin: 16,
    marginTop: 24,
  },
});

export default AgregarDocumentoScreen;