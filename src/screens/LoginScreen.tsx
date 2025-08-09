import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Chip,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuthStore } from '../store/authStore';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoading, loginError, clearError } = useAuthStore();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor ingresa usuario y contraseña');
      return;
    }

    clearError();
    const success = await login(username.trim(), password);
  };

  const fillTestCredentials = () => {
    setUsername('admin');
    setPassword('admin123');
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* ✅ Header más elegante */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <Icon name="folder-special" size={48} color="#E91E63" />
              <View style={styles.logoAccent}>
                <Icon name="lock" size={16} color="#FFFFFF" />
              </View>
            </View>
          </View>
          
          <Text variant="headlineMedium" style={styles.appTitle}>
            Gestor Documental
          </Text>
          <Text variant="bodyMedium" style={styles.appSubtitle}>
            Organiza tus documentos de forma segura
          </Text>
        </View>

        {/* ✅ Formulario más compacto */}
        <Card style={styles.loginCard}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.loginHeader}>
              <Icon name="login" size={20} color="#E91E63" />
              <Text variant="titleLarge" style={styles.loginTitle}>
                Iniciar Sesión
              </Text>
            </View>

            {/* ✅ Chip mejorado */}
            <Chip
              icon={() => <Icon name="lightbulb-outline" size={14} color="#E91E63" />}
              style={styles.testChip}
              textStyle={styles.testChipText}
              onPress={fillTestCredentials}>
              Credenciales de prueba
            </Chip>

            {/* ✅ Inputs con íconos vectoriales */}
            <TextInput
              label="Usuario"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon icon={() => <Icon name="person" size={20} color="#6C7B95" />} />}
              autoCapitalize="none"
              autoCorrect={false}
              disabled={isLoading}
              outlineColor="#E1E8ED"
              activeOutlineColor="#E91E63"
            />

            <TextInput
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              mode="outlined"
              secureTextEntry={!showPassword}
              left={<TextInput.Icon icon={() => <Icon name="lock" size={20} color="#6C7B95" />} />}
              right={
                <TextInput.Icon
                  icon={() => (
                    <Icon 
                      name={showPassword ? 'visibility-off' : 'visibility'} 
                      size={20} 
                      color="#6C7B95" 
                    />
                  )}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              disabled={isLoading}
              outlineColor="#E1E8ED"
              activeOutlineColor="#E91E63"
            />

            {/* ✅ Error mejorado */}
            {loginError && (
              <View style={styles.errorContainer}>
                <Icon name="error-outline" size={16} color="#D32F2F" style={styles.errorIcon} />
                <Text style={styles.errorText}>{loginError}</Text>
              </View>
            )}

            {/* ✅ Botón mejorado */}
            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.loginButton}
              labelStyle={styles.loginButtonText}
              disabled={isLoading}
              loading={isLoading}
              icon={() => <Icon name="login" size={16} color="#FFFFFF" />}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </Card.Content>
        </Card>

        {/* ✅ Info compacta */}
        <View style={styles.credentialsInfo}>
          <View style={styles.infoRow}>
            <Icon name="info-outline" size={14} color="#8E9AAF" />
            <Text variant="bodySmall" style={styles.infoTitle}>
              Credenciales de prueba
            </Text>
          </View>
          <Text variant="bodySmall" style={styles.infoText}>
            Usuario: admin • Contraseña: admin123
          </Text>
        </View>

        {/* ✅ Footer minimalista */}
        <View style={styles.footer}>
          <Text variant="bodySmall" style={styles.footerText}>
            Aplicación de prueba técnica
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FCE4EC',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    position: 'relative',
  },
  logoAccent: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E91E63',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  appTitle: {
    textAlign: 'center',
    color: '#2E3A59',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  appSubtitle: {
    textAlign: 'center',
    color: '#6C7B95',
  },
  loginCard: {
    elevation: 4,
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  cardContent: {
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  loginHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 8,
  },
  loginTitle: {
    color: '#2E3A59',
    fontWeight: '600',
  },
  testChip: {
    alignSelf: 'center',
    marginBottom: 20,
    backgroundColor: '#FCE4EC',
    borderWidth: 1,
    borderColor: '#F8BBD9',
  },
  testChipText: {
    color: '#E91E63',
    fontSize: 12,
    fontWeight: '500',
  },
  input: {
    marginVertical: 6,
    backgroundColor: '#FFFFFF',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#D32F2F',
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    color: '#D32F2F',
    flex: 1,
    fontSize: 13,
  },
  loginButton: {
    marginTop: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E91E63',
    elevation: 3,
  },
  loginButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  credentialsInfo: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E1E8ED',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  infoTitle: {
    fontWeight: '600',
    color: '#2E3A59',
    fontSize: 12,
  },
  infoText: {
    color: '#6C7B95',
    fontSize: 11,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#8E9AAF',
    textAlign: 'center',
    fontSize: 11,
  },
});

export default LoginScreen;