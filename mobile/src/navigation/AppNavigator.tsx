import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { InterfaceSelectionScreen } from '../screens/InterfaceSelectionScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { TramiteFlowScreen } from '../screens/TramiteFlowScreen';

export type RootStackParamList = {
  InterfaceSelection: undefined;
  Chat: { version: 'basic' | 'advanced' };
  TramiteFlow: { tramiteId: string; version: 'basic' | 'advanced' };
};

const Stack = createStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="InterfaceSelection"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="InterfaceSelection"
          component={InterfaceSelectionScreen}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
        />
        <Stack.Screen
          name="TramiteFlow"
          component={TramiteFlowScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
