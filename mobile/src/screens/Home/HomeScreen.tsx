import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { ActionCard } from '../../components/ui/GovlyUI';
import { COLORS, SHADOWS, FONTS, RADIUS, SPACING, SIZES, TRAMITES_DATA } from '../../constants/theme';
import { SidebarDrawer } from '../../components/ui/SidebarDrawer';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

export function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mode, setMode] = useState<'basic' | 'advanced'>('basic');

  const handleTramitePress = (tramiteId: string) => {
    navigation.navigate('TramiteFlowNew', { tramiteId, version: mode });
  };

  const handleGoToChat = () => {
    setMode('advanced');
    navigation.navigate('ChatNew', { version: 'advanced' });
  };

  const handleModeChange = (newMode: 'basic' | 'advanced') => {
    setMode(newMode);
    setSidebarOpen(false);
    if (newMode === 'advanced') {
      navigation.navigate('ChatNew', { version: 'advanced' });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSidebarOpen(true)} style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        
        <View style={styles.logoContainer}>
          <Text style={styles.logoIcon}>⚡</Text>
          <Text style={styles.logoText}>Govly</Text>
        </View>
        
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarIcon}>👤</Text>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView 
        style={styles.mainContent}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeGreeting}>Hola,</Text>
          <Text style={styles.welcomeTitle}>
            ¿Qué trámite quieres{' '}
            <Text style={styles.highlightText}>gestionar</Text>
            {' '}hoy?
          </Text>
        </View>

        {/* Tramites List */}
        <View style={styles.tramitesSection}>
          {TRAMITES_DATA.map((tramite) => (
            <ActionCard
              key={tramite.id}
              title={tramite.title}
              subtitle={tramite.desc}
              icon={tramite.icon as 'passport' | 'id-card' | 'car'}
              onPress={() => handleTramitePress(tramite.id)}
            />
          ))}
        </View>

        {/* Chat Button */}
        <TouchableOpacity 
          style={styles.chatButton}
          onPress={handleGoToChat}
          activeOpacity={0.8}
        >
          <Text style={styles.chatButtonText}>Ir al Asistente Virtual (Chat)</Text>
          <Text style={styles.chatButtonIcon}>➤</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Sidebar Drawer */}
      <SidebarDrawer
        visible={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentMode={mode}
        onModeChange={handleModeChange}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgLight,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.base,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  menuButton: {
    padding: SPACING.sm,
  },
  menuIcon: {
    fontSize: 24,
    color: COLORS.textSec,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  logoIcon: {
    fontSize: 24,
    color: COLORS.primary,
  },
  logoText: {
    fontSize: SIZES.lg,
    ...FONTS.bold,
    color: COLORS.textMain,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  avatarIcon: {
    fontSize: 16,
    color: COLORS.white,
  },

  // Main Content
  mainContent: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.xl,
  },

  // Welcome Section
  welcomeSection: {
    marginTop: SPACING.base,
    marginBottom: SPACING.xxl,
  },
  welcomeGreeting: {
    fontSize: SIZES.lg,
    color: COLORS.textSec,
    marginBottom: SPACING.xs,
  },
  welcomeTitle: {
    fontSize: 30,
    ...FONTS.extraBold,
    color: COLORS.textMain,
    lineHeight: 38,
  },
  highlightText: {
    backgroundColor: COLORS.primaryLight,
    color: '#B45309',
    paddingHorizontal: 4,
  },

  // Tramites Section
  tramitesSection: {
    marginBottom: SPACING.xl,
  },

  // Chat Button
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.textMain,
    padding: SPACING.base,
    borderRadius: RADIUS.xl,
    gap: SPACING.md,
    ...SHADOWS.lg,
  },
  chatButtonText: {
    fontSize: SIZES.base,
    color: COLORS.white,
    ...FONTS.medium,
  },
  chatButtonIcon: {
    fontSize: 18,
    color: COLORS.white,
  },
});
