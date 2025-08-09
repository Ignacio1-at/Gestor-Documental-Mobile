import React from 'react';
import {View, StyleSheet, ScrollView, Dimensions} from 'react-native';
import {Card, Text, Button} from 'react-native-paper';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';
import UserProfileHeader from '../components/UserProfileHeader';
import Icon from 'react-native-vector-icons/MaterialIcons';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const { width } = Dimensions.get('window');

const HomeScreen = ({navigation}: Props) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header del usuario */}
      <UserProfileHeader />
      
      {/* Contenido principal centrado */}
      <View style={styles.mainContent}>
        {/* Icono principal */}
        <View style={styles.iconContainer}>
          <View style={styles.iconBackground}>
            <Icon name="folder-special" size={64} color="#E91E63" />
          </View>
        </View>
        
        {/* Título principal */}
        <Text variant="headlineLarge" style={styles.mainTitle}>
          Bienvenido al Gestor Documental
        </Text>
        
        {/* Subtítulo */}
        <Text variant="bodyLarge" style={styles.subtitle}>
          Organiza tus documentos PDF e imágenes de forma sencilla y eficiente
        </Text>
        
        {/* Botón principal */}
        <Button
          mode="contained"
          style={styles.primaryButton}
          labelStyle={styles.primaryButtonText}
          icon={() => <Icon name="play-arrow" size={20} color="#FFFFFF" />}
          onPress={() => navigation.navigate('DocumentsTab')}>
          Iniciar
        </Button>
        
        {/* Botón secundario */}
        <View style={styles.secondaryButtons}>
          <Button
            mode="outlined"
            style={styles.secondaryButton}
            labelStyle={styles.secondaryButtonText}
            icon={() => <Icon name="add-circle-outline" size={18} color="#E91E63" />}
            onPress={() => navigation.navigate('AddTab')}>
            Agregar Documento
          </Button>
        </View>
        
        {/* Información adicional con iconos */}
        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Icon name="security" size={16} color="#6C7B95" style={styles.infoIcon} />
            <Text variant="bodySmall" style={styles.infoText}>
              Almacenamiento local y seguro
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Icon name="phone-android" size={16} color="#6C7B95" style={styles.infoIcon} />
            <Text variant="bodySmall" style={styles.infoText}>
              Optimizado para móviles
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  contentContainer: {
    flexGrow: 1,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
    marginTop: -40,
  },
  iconContainer: {
    marginBottom: 32,
    alignItems: 'center',
  },
  iconBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FCE4EC',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  mainTitle: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#2E3A59',
    fontWeight: 'bold',
    lineHeight: 40,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 48,
    color: '#6C7B95',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  primaryButton: {
    width: width - 64,
    paddingVertical: 12,
    marginBottom: 20,
    borderRadius: 25,
    elevation: 4,
    backgroundColor: '#E91E63',
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  secondaryButtons: {
    width: '100%',
    marginBottom: 32,
  },
  secondaryButton: {
    paddingVertical: 8,
    borderRadius: 20,
    borderColor: '#E91E63',
    borderWidth: 1.5,
  },
  secondaryButtonText: {
    color: '#E91E63',
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    alignItems: 'center',
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoIcon: {
    marginRight: 4,
  },
  infoText: {
    color: '#6C7B95',
    textAlign: 'center',
  },
});

export default HomeScreen;