import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, StyleSheet} from 'react-native';
import AgregarDocumentoScreen from '../screens/AgregarDocumentoScreen';
import {RootStackParamList} from '../types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {HomeStack, DocumentStack} from './StackNavigators';

const Tab = createBottomTabNavigator<RootStackParamList>();

const CustomTabBarIcon = ({ iconName, focused, isAddButton = false }: any) => {
  if (isAddButton) {
    return (
      <View style={[styles.addButtonContainer, focused && styles.addButtonFocused]}>
        <Icon name="add" size={24} color="#FFFFFF" />
      </View>
    );
  }

  return (
    <Icon 
      name={iconName} 
      size={24} 
      color={focused ? '#E91E63' : '#6C7B95'} 
    />
  );
};

const HeaderIcon = ({ iconName, color = '#FFFFFF' }: any) => (
  <Icon name={iconName} size={20} color={color} style={styles.headerIcon} />
);

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({route}) => ({
      tabBarIcon: ({focused}) => {
        let iconName = 'home';
        let isAddButton = false;

        if (route.name === 'HomeTab') {
          iconName = 'home';
        } else if (route.name === 'AddTab') {
          isAddButton = true;
        } else if (route.name === 'DocumentsTab') {
          iconName = 'folder';
        }

        return (
          <CustomTabBarIcon 
            iconName={iconName} 
            focused={focused}
            isAddButton={isAddButton}
          />
        );
      },
      headerShown: false,
      tabBarActiveTintColor: '#E91E63',
      tabBarInactiveTintColor: '#6C7B95',
      tabBarStyle: {
        backgroundColor: '#FFFFFF',
        borderTopColor: '#E1E8ED',
        borderTopWidth: 1,
        elevation: 12,
        shadowColor: '#E91E63',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        height: 70,
        paddingBottom: 10,
        paddingTop: 5,
      },
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '600',
        marginTop: 2,
      },
      tabBarItemStyle: {
        paddingVertical: 5,
      },
    })}>
    <Tab.Screen
      name="HomeTab"
      component={HomeStack}
      options={{
        title: 'Inicio',
        tabBarLabel: 'Inicio',
        headerShown: false,
      }}
    />
    <Tab.Screen
      name="AddTab"
      component={AgregarDocumentoScreen}
      options={{
        title: 'Agregar Documento',
        tabBarLabel: '', // Quitar el label del tab
        headerShown: true,
        headerStyle: {backgroundColor: '#E91E63'},
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {fontWeight: '600', fontSize: 18},
        headerLeft: () => <HeaderIcon iconName="upload-file" />,
      }}
    />
    <Tab.Screen
      name="DocumentsTab"
      component={DocumentStack}
      options={{
        title: 'Documentos',
        tabBarLabel: 'Documentos',
        headerShown: false,
      }}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  addButtonContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#E91E63',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    marginTop: -5,
  },
  addButtonFocused: {
    backgroundColor: '#C2185B',
    elevation: 8,
    shadowOpacity: 0.4,
    transform: [{ scale: 1.05 }],
  },
  headerIcon: {
    marginLeft: 20, // Aumentar el margen para alejar el icono del borde
  },
});

export default TabNavigator;
