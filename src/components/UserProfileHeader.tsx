import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Text,
  Avatar,
  Card,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuthStore } from '../store/authStore';

const UserProfileHeader = () => {
  const { user, logout } = useAuthStore();

  if (!user) return null;

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const formatLoginTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getGreetingIcon = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'wb-sunny';
    if (hour < 18) return 'wb-sunny';
    return 'nights-stay';
  };

  return (
    <Card style={styles.container}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.content}>
          {/* Info del usuario - MÁS COMPACTA */}
          <View style={styles.userInfo}>
            <Avatar.Text
              size={40} // ✅ Más pequeño
              label={user.name.charAt(0).toUpperCase()}
              style={styles.avatar}
              labelStyle={styles.avatarLabel}
            />
            <View style={styles.userDetails}>
              <View style={styles.greetingContainer}>
                <Icon 
                  name={getGreetingIcon()} 
                  size={14} 
                  color="#E91E63" 
                  style={styles.greetingIcon}
                />
                <Text variant="titleSmall" style={styles.greeting} numberOfLines={1}>
                  {getTimeGreeting()}, {user.name}!
                </Text>
              </View>
              
              {/* ✅ Info más sutil */}
              <View style={styles.userMeta}>
                <View style={styles.metaItem}>
                  <Icon name="person" size={12} color="#8E9AAF" />
                  <Text style={styles.metaText}>{user.username}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Icon name="access-time" size={12} color="#8E9AAF" />
                  <Text style={styles.metaText}>{formatLoginTime(user.loginTime)}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* ✅ Botón logout más sutil */}
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Icon name="logout" size={16} color="#E91E63" />
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    marginBottom: 8, // ✅ Menos espacio abajo
    elevation: 2, // ✅ Menos elevación
    backgroundColor: '#FFFFFF',
    borderRadius: 12, // ✅ Menos redondeado
    shadowColor: '#E91E63',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardContent: {
    paddingVertical: 12, // ✅ Menos padding vertical
    paddingHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#E91E63',
    marginRight: 12, // ✅ Menos margen
  },
  avatarLabel: {
    fontSize: 18, // ✅ Más pequeño
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4, // ✅ Menos espacio
  },
  greetingIcon: {
    marginRight: 4,
  },
  greeting: {
    color: '#2E3A59',
    fontWeight: '600',
    fontSize: 14, // ✅ Más pequeño
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, // ✅ Espacio entre items
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 10, // ✅ Texto muy pequeño
    color: '#8E9AAF',
  },
  logoutButton: {
    padding: 8, // ✅ Más pequeño
    borderRadius: 8,
    backgroundColor: '#FCE4EC',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 36, // ✅ Más pequeño
    minHeight: 36,
  },
});

export default UserProfileHeader;