import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigation from './Type/StackNavigation';
import Toast from 'react-native-toast-message';

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <StackNavigation />
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </NavigationContainer>
  );
}
