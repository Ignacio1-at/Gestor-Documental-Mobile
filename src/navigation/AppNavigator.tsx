import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import ListaDocumentosScreen from '../screens/ListaDocumentosScreen';
import AgregarDocumentoScreen from '../screens/AgregarDocumentoScreen';
import DetalleDocumentoScreen from '../screens/DetalleDocumentoScreen';
import {RootStackParamList} from '../types';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {backgroundColor: '#2196F3'},
      headerTintColor: '#fff',
      headerTitleStyle: {fontWeight: 'bold'},
    }}>
    <Stack.Screen 
      name="Home" 
      component={HomeScreen} 
      options={{title: 'Gestor Documental'}} 
    />
    <Stack.Screen 
      name="DocumentDetail" 
      component={DetalleDocumentoScreen} 
      options={{title: 'Documento'}} 
    />
  </Stack.Navigator>
);

const DocumentStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {backgroundColor: '#2196F3'},
      headerTintColor: '#fff',
      headerTitleStyle: {fontWeight: 'bold'},
    }}>
    <Stack.Screen 
      name="DocumentList" 
      component={ListaDocumentosScreen} 
      options={{title: 'Mis Documentos'}} 
    />
    <Stack.Screen 
      name="DocumentDetail" 
      component={DetalleDocumentoScreen} 
      options={{title: 'Documento'}} 
    />
  </Stack.Navigator>
);

const AppNavigator = () => (
  <Tab.Navigator
    screenOptions={({route}) => ({
      tabBarIcon: ({focused, color, size}) => {
        let iconName: string = 'home';
        if (route.name === 'HomeTab') {
          iconName = 'home';
        } else if (route.name === 'DocumentsTab') {
          iconName = 'folder';
        } else if (route.name === 'AddTab') {
          iconName = 'add';
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
      headerShown: false,
      tabBarActiveTintColor: '#2196F3',
      tabBarInactiveTintColor: 'gray',
    })}>
    <Tab.Screen 
      name="HomeTab" 
      component={HomeStack} 
      options={{title: 'Inicio'}} 
    />
    <Tab.Screen 
      name="DocumentsTab" 
      component={DocumentStack} 
      options={{title: 'Documentos'}} 
    />
    <Tab.Screen 
      name="AddTab" 
      component={AgregarDocumentoScreen} 
      options={{title: 'Agregar'}} 
    />
  </Tab.Navigator>
);

export default AppNavigator;