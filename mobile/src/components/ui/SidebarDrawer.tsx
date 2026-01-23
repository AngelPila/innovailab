import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS, FONTS, RADIUS, SPACING, SIZES } from '../../constants/theme';
import { IntegrationItem } from './GovlyUI';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = SCREEN_WIDTH * 0.8;

interface SidebarDrawerProps {
  visible: boolean;
  onClose: () => void;
  currentMode: 'basic' | 'advanced';
  onModeChange: (mode: 'basic' | 'advanced') => void;
}

export function SidebarDrawer({ visible, onClose, currentMode, onModeChange }: SidebarDrawerProps) {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -SIDEBAR_WIDTH,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleModeToggle = () => {
    const newMode = currentMode === 'basic' ? 'advanced' : 'basic';
    onModeChange(newMode);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Overlay */}
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <TouchableOpacity style={styles.overlayTouchable} onPress={onClose} activeOpacity={1} />
        </Animated.View>

        {/* Sidebar */}
        <Animated.View 
          style={[
            styles.sidebar, 
            { 
              transform: [{ translateX: slideAnim }],
              paddingTop: insets.top + SPACING.base,
            }
          ]}
        >
          {/* Header */}
          <View style={styles.sidebarHeader}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoIcon}>⚡</Text>
              <Text style={styles.logoText}>Govly</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.sidebarContent} showsVerticalScrollIndicator={false}>
            {/* Historial */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>HISTORIAL</Text>
              <TouchableOpacity style={styles.historyItem}>
                <Text style={styles.historyIcon}>📄</Text>
                <Text style={styles.historyText}>Pasaporte - Ayer</Text>
              </TouchableOpacity>
            </View>

            {/* Integraciones */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>INTEGRACIONES</Text>
              <IntegrationItem
                icon="📅"
                label="Google Calendar"
                connected={true}
              />
              <IntegrationItem
                icon="📱"
                label="WhatsApp"
                connected={false}
                onPress={() => console.log('Connect WhatsApp')}
              />
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={[styles.sidebarFooter, { paddingBottom: insets.bottom + SPACING.base }]}>
            <TouchableOpacity 
              style={styles.modeButton}
              onPress={handleModeToggle}
              activeOpacity={0.7}
            >
              <Text style={styles.modeButtonIcon}>⚙️</Text>
              <Text style={styles.modeButtonText}>
                Cambiar a Modo {currentMode === 'basic' ? 'Avanzado' : 'Básico'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
  },
  overlayTouchable: {
    flex: 1,
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: COLORS.white,
    ...SHADOWS.lg,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
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
    fontSize: SIZES.xl,
    ...FONTS.bold,
    color: COLORS.textMain,
  },
  closeButton: {
    padding: SPACING.sm,
  },
  closeIcon: {
    fontSize: 24,
    color: COLORS.textSec,
  },
  sidebarContent: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
  },
  section: {
    marginTop: SPACING.xxl,
  },
  sectionTitle: {
    fontSize: SIZES.xs,
    ...FONTS.bold,
    color: COLORS.textLight,
    letterSpacing: 1.5,
    marginBottom: SPACING.base,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.md,
  },
  historyIcon: {
    fontSize: 18,
    color: COLORS.textLight,
  },
  historyText: {
    fontSize: SIZES.md,
    color: COLORS.textSec,
  },
  sidebarFooter: {
    padding: SPACING.xl,
    backgroundColor: COLORS.bgLight,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
    ...SHADOWS.sm,
  },
  modeButtonIcon: {
    fontSize: 18,
  },
  modeButtonText: {
    fontSize: SIZES.sm,
    ...FONTS.medium,
    color: COLORS.textSec,
  },
});
