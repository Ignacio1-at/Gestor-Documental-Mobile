import React, { useEffect } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';
import {StatusBar, View} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import LoginScreen from './src/screens/LoginScreen';
import {theme} from './src/styles/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuthStore } from './src/store/authStore';

const App = () => {
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();

  useEffect(() => {
    // Inicializar autenticación al cargar la app
    initializeAuth();
  }, [initializeAuth]);

  // Mostrar loading mientras se inicializa
  if (isLoading) {
    return (
      <PaperProvider 
        theme={theme}
        settings={{
          icon: (props) => <MaterialCommunityIcons {...props} />,
        }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider 
      theme={theme}
      settings={{
        icon: (props) => <MaterialCommunityIcons {...props} />,
      }}
    >
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />
      <NavigationContainer>
        {isAuthenticated ? <AppNavigator /> : <LoginScreen />}
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;