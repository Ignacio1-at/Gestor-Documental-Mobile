```markdown
# Gestor Documental Mobile

Aplicación móvil para gestionar documentos PDF e imágenes desarrollada en React Native con TypeScript.

## Requisitos

Asegúrate de tener configurado el entorno de React Native siguiendo la [guía oficial](https://reactnative.dev/docs/environment-setup).

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Ignacio1-at/Gestor-Documental-Mobile.git
cd Gestor-Documental-Mobile

# Instalar dependencias
npm install

# Para iOS (opcional)
cd ios && bundle install && bundle exec pod install && cd ..
```

## Ejecutar la aplicación

### Paso 1: Iniciar Metro

```bash
npm start
```

### Paso 2: Ejecutar en dispositivo

#### Android
```bash
npm run android
```

#### iOS
```bash
npm run ios
```

## Funcionalidades actuales

- Navegación entre pantallas (tabs y stack)
- Lista de documentos con búsqueda
- Formulario para agregar documentos
- Categorización de archivos
- Interfaz con Material Design

## Próximas funcionalidades

- Selección de archivos PDF
- Captura y selección de imágenes
- Almacenamiento local
- Visualizador de documentos
- Editar y eliminar documentos

## Tecnologías

- React Native 0.74.5
- TypeScript
- React Navigation
- React Native Paper
- Vector Icons

## Estructura del proyecto

```
src/
├── navigation/     # Configuración de navegación
├── screens/        # Pantallas de la app
├── styles/         # Temas y estilos
└── types/          # Tipos de TypeScript
```

## Problemas comunes

Si tienes problemas ejecutando la app:

1. Limpia el caché: `npx react-native start --reset-cache`
2. Reinstala dependencias: `rm -rf node_modules && npm install`
3. Para Android: verifica que el emulador esté corriendo

## Estado del proyecto

Este es el primer entregable con la estructura base y navegación funcionando. Las funcionalidades principales se implementarán en las siguientes fases.