import {DefaultTheme} from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#E91E63', // Rosa corporativo como en la imagen
    accent: '#FF4081', // Rosa más claro para acentos
    background: '#F8F9FA', // Fondo más suave
    surface: '#FFFFFF',
    text: '#2E3A59', // Azul oscuro corporativo para texto
    onSurface: '#2E3A59',
    onBackground: '#2E3A59',
    secondary: '#6C7B95', // Gris azulado para texto secundario
    outline: '#E1E8ED',
  },
};