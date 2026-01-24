import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { InterfaceSelectionScreen } from '../screens/InterfaceSelectionScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { TramiteFlowScreen } from '../screens/TramiteFlowScreen';
// New Govly Screens
import { HomeScreen } from '../screens/Home/HomeScreen';
import { ChatScreenNew } from '../screens/ChatScreenNew';
import { TramiteFlowScreenNew } from '../screens/TramiteFlowScreenNew';
// New Tramites Screens
import { TramitesListScreen, HistorialScreen, TramiteDetalleScreen } from '../screens/Tramites';

export type RootStackParamList = {
  // Legacy screens
  InterfaceSelection: undefined;
  Chat: { version: 'basic' | 'advanced' };
  TramiteFlow: { tramiteId: string; version: 'basic' | 'advanced' };
  // New Govly screens
  Home: undefined;
  ChatNew: { version: 'basic' | 'advanced' };
  TramiteFlowNew: { tramiteId: string; version: 'basic' | 'advanced' };
  // New Tramites screens
  Tramites: undefined;
  Historial: undefined;
  TramiteDetalle: { tramiteId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {/* New Govly Screens (Primary) */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen
          name="ChatNew"
          component={ChatScreenNew}
        />
        <Stack.Screen
          name="TramiteFlowNew"
          component={TramiteFlowScreenNew}
        />
        
        {/* Legacy Screens (kept for compatibility) */}
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
        {/* New Tramites Screens */}
        <Stack.Screen
          name="Tramites"
          component={TramitesListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Historial"
          component={HistorialScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TramiteDetalle"
          component={TramiteDetalleScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
