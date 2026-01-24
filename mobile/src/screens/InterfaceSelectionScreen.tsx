import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useInterfaceStore } from '../store/interfaceStore';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'InterfaceSelection'>;
};

export function InterfaceSelectionScreen({ navigation }: Props) {
  const { selectVersion } = useInterfaceStore();
  const insets = useSafeAreaInsets();

  const handleSelectBasic = () => {
    selectVersion('basic');
    navigation.navigate('Chat', { version: 'basic' });
  };

  const handleSelectAdvanced = () => {
    selectVersion('advanced');
    navigation.navigate('Chat', { version: 'advanced' });
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        <Text style={styles.title}>Elige tu experiencia</Text>
        <Text style={styles.subtitle}>
          Selecciona la interfaz que mejor se adapte a ti
        </Text>

        <View style={styles.cardsContainer}>
          {/* Modo Básico */}
          <TouchableOpacity
            style={[styles.card, styles.basicCard]}
            onPress={handleSelectBasic}
            activeOpacity={0.8}
          >
            <Text style={styles.emoji}>👴👵</Text>
            <Text style={styles.cardTitle}>Modo Fácil</Text>
            <Text style={styles.cardDescription}>
              Interfaz simple con botones grandes y navegación asistida
            </Text>
            <View style={styles.features}>
              <Text style={styles.feature}>✓ Textos grandes</Text>
              <Text style={styles.feature}>✓ Botones grandes</Text>
              <Text style={styles.feature}>✓ Voz integrada</Text>
              <Text style={styles.feature}>✓ Paso a paso</Text>
            </View>
          </TouchableOpacity>

          {/* Modo Avanzado */}
          <TouchableOpacity
            style={[styles.card, styles.advancedCard]}
            onPress={handleSelectAdvanced}
            activeOpacity={0.8}
          >
            <Text style={styles.emoji}>👨‍💼👩‍💼</Text>
            <Text style={styles.cardTitle}>Modo Completo</Text>
            <Text style={styles.cardDescription}>
              Interfaz completa con todas las funciones y opciones avanzadas
            </Text>
            <View style={styles.features}>
              <Text style={styles.feature}>✓ Navegación rápida</Text>
              <Text style={styles.feature}>✓ Múltiples trámites</Text>
              <Text style={styles.feature}>✓ Vista detallada</Text>
              <Text style={styles.feature}>✓ Mapas integrados</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');
const cardWidth = width > 700 ? 320 : width * 0.85;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 40,
    textAlign: 'center',
  },
  cardsContainer: {
    gap: 24,
    width: '100%',
    alignItems: 'center',
  },
  card: {
    width: cardWidth,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  basicCard: {
    backgroundColor: '#fef3c7',
    borderWidth: 3,
    borderColor: '#f59e0b',
  },
  advancedCard: {
    backgroundColor: '#dbeafe',
    borderWidth: 3,
    borderColor: '#3b82f6',
  },
  emoji: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 14,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 20,
  },
  features: {
    gap: 8,
  },
  feature: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
});
