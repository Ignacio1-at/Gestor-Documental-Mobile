import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider, configureFonts} from 'react-native-paper';
import {StatusBar} from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import {theme} from './src/styles/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const App = () => {
  return (
    <PaperProvider 
      theme={theme}
      settings={{
        icon: (props) => <MaterialCommunityIcons {...props} />,
      }}
    >
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;