import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { 
  Stepper, 
  InfoBox, 
  StatCard, 
  RequirementItem, 
  ActionButton 
} from '../components/ui/GovlyUI';
import { 
  COLORS, 
  SHADOWS, 
  FONTS, 
  RADIUS, 
  SPACING, 
  SIZES, 
  TRAMITES_DATA,
  REQUIREMENTS_MOCK 
} from '../constants/theme';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'TramiteFlowNew'>;
  route: RouteProp<RootStackParamList, 'TramiteFlowNew'>;
};

type Requirement = {
  id: string;
  label: string;
  completed: boolean;
};

export function TramiteFlowScreenNew({ navigation, route }: Props) {
  const { tramiteId, version } = route.params;
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(1);
  const [requirements, setRequirements] = useState<Requirement[]>(
    REQUIREMENTS_MOCK.map(r => ({ ...r }))
  );

  // Encontrar el trámite
  const tramite = TRAMITES_DATA.find(t => t.id === tramiteId);

  const handleBack = () => {
    if (version === 'basic') {
      navigation.navigate('Home');
    } else {
      navigation.navigate('ChatNew', { version: 'advanced' });
    }
  };

  const toggleRequirement = (id: string) => {
    setRequirements(prev => 
      prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r)
    );
  };

  const handleContinue = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Volver al inicio
      setStep(1);
      navigation.navigate('Home');
    }
  };

  if (!tramite) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Trámite no encontrado</Text>
          <TouchableOpacity style={styles.errorButton} onPress={handleBack}>
            <Text style={styles.errorButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{tramite.title}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Stepper */}
      <Stepper currentStep={step} />

      {/* Main Content */}
      <ScrollView 
        style={styles.mainContent}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* STEP 1: Información */}
        {step === 1 && (
          <View style={styles.stepContent}>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>¿Qué necesitas saber?</Text>
              <Text style={styles.infoText}>
                El pasaporte ordinario se entrega a los ecuatorianos que requieran viajar al exterior. 
                Este trámite es personal e intransferible.
              </Text>
              <View style={styles.bulletList}>
                <View style={styles.bulletItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.bulletText}>Vigencia: 10 años</Text>
                </View>
                <View style={styles.bulletItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.bulletText}>Entrega: 15 a 30 días</Text>
                </View>
              </View>

              <InfoBox>
                Recuerda que el pago lo realizas directamente en el banco o en la plataforma oficial del gobierno, no en esta app.
              </InfoBox>
            </View>

            <View style={styles.statsRow}>
              <StatCard label="Costo Oficial" value={tramite.cost} />
              <View style={styles.statsSpacer} />
              <StatCard label="Tiempo" value={tramite.time} />
            </View>
          </View>
        )}

        {/* STEP 2: Requisitos */}
        {step === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Prepara tus documentos</Text>
            <Text style={styles.stepSubtitle}>
              Asegúrate de tener todo esto antes de salir de casa.
            </Text>

            <View style={styles.requirementsList}>
              {requirements.map(req => (
                <RequirementItem
                  key={req.id}
                  label={req.label}
                  completed={req.completed}
                  onToggle={() => toggleRequirement(req.id)}
                />
              ))}
            </View>

            <Text style={styles.requirementsHint}>
              Marca los requisitos a medida que los consigas para llevar un control.
            </Text>
          </View>
        )}

        {/* STEP 3: Dónde ir */}
        {step === 3 && (
          <View style={styles.stepContent}>
            <View style={styles.mapHeader}>
              <Text style={styles.mapTitle}>¿A dónde ir?</Text>
              <Text style={styles.mapSubtitle}>
                Esta es la agencia más cercana a tu ubicación.
              </Text>
            </View>

            {/* Fake Map */}
            <View style={styles.mapContainer}>
              <View style={styles.mapPlaceholder}>
                {/* Grid lines */}
                <View style={styles.mapGridOverlay} />
                
                {/* Pin */}
                <View style={styles.mapPinContainer}>
                  <Text style={styles.mapPin}>📍</Text>
                  <View style={styles.mapPinLabel}>
                    <Text style={styles.mapPinLabelText}>Registro Civil</Text>
                  </View>
                </View>
              </View>

              {/* Location Info */}
              <View style={styles.locationInfo}>
                <View style={styles.locationDetails}>
                  <Text style={styles.locationName}>Agencia Centro</Text>
                  <Text style={styles.locationAddress}>Av. 9 de Octubre y Pichincha</Text>
                  <Text style={styles.locationStatus}>Abierto hasta las 17:00</Text>
                </View>
                <TouchableOpacity style={styles.directionsButton}>
                  <Text style={styles.directionsButtonText}>Cómo llegar</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <ActionButton
                icon="📅"
                title="Agendar Recordatorio"
                subtitle="Te avisaremos 1 hora antes de salir."
                variant="blue"
                onPress={() => console.log('Agendar')}
              />
              <ActionButton
                icon="📱"
                title="Enviar info a WhatsApp"
                subtitle="Ten la dirección a la mano."
                variant="green"
                onPress={() => console.log('WhatsApp')}
              />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Button */}
      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + SPACING.base }]}>
        {step < 3 ? (
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Continuar</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.finishButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.finishButtonText}>Volver al Inicio</Text>
          </TouchableOpacity>
        )}
      </View>
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
  backButton: {
    padding: SPACING.sm,
  },
  backIcon: {
    fontSize: 24,
    color: COLORS.textSec,
  },
  headerTitle: {
    flex: 1,
    fontSize: SIZES.base,
    ...FONTS.bold,
    color: COLORS.textMain,
    textAlign: 'center',
    marginHorizontal: SPACING.base,
  },
  headerSpacer: {
    width: 40,
  },

  // Main Content
  mainContent: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.xl,
  },
  stepContent: {
    flex: 1,
  },

  // Step 1: Info
  infoCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.xl,
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  infoTitle: {
    fontSize: SIZES.xl,
    ...FONTS.bold,
    color: COLORS.textMain,
    marginBottom: SPACING.base,
  },
  infoText: {
    fontSize: SIZES.base,
    color: COLORS.textSec,
    lineHeight: 24,
    marginBottom: SPACING.base,
  },
  bulletList: {
    marginTop: SPACING.base,
    gap: SPACING.sm,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.textMain,
  },
  bulletText: {
    fontSize: SIZES.sm,
    color: COLORS.textSec,
  },
  statsRow: {
    flexDirection: 'row',
  },
  statsSpacer: {
    width: SPACING.base,
  },

  // Step 2: Requirements
  stepTitle: {
    fontSize: SIZES.lg,
    ...FONTS.bold,
    color: COLORS.textMain,
    marginBottom: SPACING.sm,
  },
  stepSubtitle: {
    fontSize: SIZES.sm,
    color: COLORS.textSec,
    marginBottom: SPACING.xl,
  },
  requirementsList: {
    marginBottom: SPACING.base,
  },
  requirementsHint: {
    fontSize: SIZES.xs,
    color: COLORS.textLight,
    textAlign: 'center',
    maxWidth: 250,
    alignSelf: 'center',
    lineHeight: 18,
  },

  // Step 3: Map
  mapHeader: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  mapTitle: {
    fontSize: SIZES.xxl,
    ...FONTS.bold,
    color: COLORS.textMain,
  },
  mapSubtitle: {
    fontSize: SIZES.base,
    color: COLORS.textSec,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  mapContainer: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    marginBottom: SPACING.base,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: COLORS.bgLight,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapGridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
    borderWidth: 1,
    borderColor: COLORS.textLight,
  },
  mapPinContainer: {
    alignItems: 'center',
  },
  mapPin: {
    fontSize: 40,
  },
  mapPinLabel: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    marginTop: SPACING.xs,
    ...SHADOWS.sm,
  },
  mapPinLabelText: {
    fontSize: SIZES.xs,
    ...FONTS.bold,
    color: COLORS.textMain,
  },
  locationInfo: {
    backgroundColor: COLORS.white,
    padding: SPACING.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  locationDetails: {
    flex: 1,
  },
  locationName: {
    fontSize: SIZES.sm,
    ...FONTS.bold,
    color: COLORS.textMain,
  },
  locationAddress: {
    fontSize: SIZES.xs,
    color: COLORS.textSec,
    marginTop: 2,
  },
  locationStatus: {
    fontSize: 10,
    ...FONTS.bold,
    color: COLORS.green,
    marginTop: 4,
  },
  directionsButton: {
    backgroundColor: COLORS.blue,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    ...SHADOWS.sm,
  },
  directionsButtonText: {
    fontSize: SIZES.xs,
    ...FONTS.bold,
    color: COLORS.white,
  },
  actionButtons: {
    marginTop: SPACING.base,
  },

  // Bottom Container
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.xl,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.base,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    ...SHADOWS.yellow,
  },
  continueButtonText: {
    fontSize: SIZES.lg,
    ...FONTS.bold,
    color: COLORS.textMain,
  },
  finishButton: {
    backgroundColor: COLORS.textMain,
    paddingVertical: SPACING.base,
    borderRadius: RADIUS.xl,
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  finishButtonText: {
    fontSize: SIZES.base,
    ...FONTS.bold,
    color: COLORS.white,
  },

  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  errorText: {
    fontSize: SIZES.lg,
    color: COLORS.textSec,
    marginBottom: SPACING.xl,
  },
  errorButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.base,
    borderRadius: RADIUS.lg,
  },
  errorButtonText: {
    fontSize: SIZES.base,
    ...FONTS.bold,
    color: COLORS.textMain,
  },
});
