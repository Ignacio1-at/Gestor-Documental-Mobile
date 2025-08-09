import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ListaDocumentosScreen from '../screens/ListaDocumentosScreen';
import DetalleDocumentoScreen from '../screens/DetalleDocumentoScreen';
import { RootStackParamList } from '../types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StyleSheet, TouchableOpacity } from 'react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();

const HeaderIcon = ({ iconName, color = '#FFFFFF' }: any) => (
    <Icon name={iconName} size={20} color={color} style={styles.headerIcon} />
);

const BackButton = ({ onPress }: any) => (
    <TouchableOpacity onPress={onPress} style={styles.backButton}>
        <Icon
            name="arrow-back"
            size={24}
            color="#FFFFFF"
        />
    </TouchableOpacity>
);

export const HomeStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerStyle: { backgroundColor: '#E91E63' },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: { fontWeight: '600', fontSize: 18 },
            headerShadowVisible: true,
        }}>
        <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
                headerShown: false, // Ocultar header en HomeScreen
            }}
        />
        <Stack.Screen
            name="DocumentDetail"
            component={DetalleDocumentoScreen}
            options={({ navigation }) => ({
                title: 'Detalle',
                headerLeft: () => (
                    <BackButton onPress={() => navigation.goBack()} />
                ),
            })}
        />
    </Stack.Navigator>
);

export const DocumentStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerStyle: { backgroundColor: '#E91E63' },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: { fontWeight: '600', fontSize: 18 },
            headerShadowVisible: true,
        }}>
        <Stack.Screen
            name="DocumentList"
            component={ListaDocumentosScreen}
            options={{
                title: 'Mis Documentos',
                headerLeft: () => <HeaderIcon iconName="folder-open" />,
            }}
        />
        <Stack.Screen
            name="DocumentDetail"
            component={DetalleDocumentoScreen}
            options={({ navigation }) => ({
                title: 'Detalle',
                headerLeft: () => (
                    <BackButton onPress={() => navigation.goBack()} />
                ),
            })}
        />
    </Stack.Navigator>
);

const styles = StyleSheet.create({
    headerIcon: {
        marginLeft: 20, // Aumentar el margen para alejar el icono del borde
        marginRight: 10,
    },
    backButton: {
        marginLeft: 15,
        padding: 8,
    },
});
