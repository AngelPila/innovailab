import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, SHADOWS, FONTS, RADIUS, SPACING, SIZES } from '../../constants/theme';

// ==============================================
// 🎨 COMPONENTES UI REUTILIZABLES
// ==============================================

// --- Action Card (Tarjeta de Trámite) ---
interface ActionCardProps {
  title: string;
  subtitle: string;
  icon: 'passport' | 'id-card' | 'car';
  onPress: () => void;
}

export function ActionCard({ title, subtitle, icon, onPress }: ActionCardProps) {
  const getIcon = () => {
    switch (icon) {
      case 'passport':
        return <Text style={styles.cardIconPassport}>📄</Text>;
      case 'id-card':
        return <Text style={styles.cardIconId}>👤</Text>;
      case 'car':
        return <Text style={styles.cardIconCar}>⚡</Text>;
      default:
        return <Text>📋</Text>;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.actionCard}
      activeOpacity={0.7}
    >
      <View style={styles.actionCardIconContainer}>
        {getIcon()}
      </View>
      <View style={styles.actionCardContent}>
        <Text style={styles.actionCardTitle}>{title}</Text>
        <Text style={styles.actionCardSubtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.actionCardChevron}>›</Text>
    </TouchableOpacity>
  );
}

// --- Chat Bubble ---
interface ChatBubbleProps {
  message: string;
  isUser: boolean;
}

export function ChatBubble({ message, isUser }: ChatBubbleProps) {
  return (
    <View style={[styles.bubbleContainer, isUser ? styles.bubbleRight : styles.bubbleLeft]}>
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
        <Text style={[styles.bubbleText, isUser ? styles.bubbleTextUser : styles.bubbleTextAssistant]}>
          {message}
        </Text>
      </View>
    </View>
  );
}

// --- Tramite Info Card (para mostrar en chat) ---
interface TramiteInfoCardProps {
  title: string;
  time: string;
  cost: string;
  onPress: () => void;
}

export function TramiteInfoCard({ title, time, cost, onPress }: TramiteInfoCardProps) {
  return (
    <View style={styles.tramiteInfoCard}>
      <View style={styles.tramiteInfoHeader}>
        <Text style={styles.tramiteInfoIcon}>📄</Text>
        <Text style={styles.tramiteInfoTitle}>{title}</Text>
      </View>
      <View style={styles.tramiteInfoDetails}>
        <Text style={styles.tramiteInfoDetail}>Tiempo: {time}</Text>
        <Text style={styles.tramiteInfoDetail}>Costo Oficial: {cost}</Text>
      </View>
      <TouchableOpacity onPress={onPress} style={styles.tramiteInfoButton}>
        <Text style={styles.tramiteInfoButtonText}>Ver Guía del Trámite</Text>
        <Text style={styles.tramiteInfoButtonChevron}>›</Text>
      </TouchableOpacity>
    </View>
  );
}

// --- Stepper (Indicador de pasos) ---
interface StepperProps {
  currentStep: number;
  totalSteps?: number;
  labels?: string[];
}

export function Stepper({ currentStep, totalSteps = 3, labels = ['Información', 'Requisitos', 'Dónde ir'] }: StepperProps) {
  return (
    <View style={styles.stepperContainer}>
      <View style={styles.stepperRow}>
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step, index) => (
          <React.Fragment key={step}>
            <View style={[
              styles.stepCircle,
              currentStep >= step ? styles.stepCircleActive : styles.stepCircleInactive
            ]}>
              <Text style={[
                styles.stepNumber,
                currentStep >= step ? styles.stepNumberActive : styles.stepNumberInactive
              ]}>
                {step}
              </Text>
            </View>
            {index < totalSteps - 1 && (
              <View style={[
                styles.stepLine,
                currentStep > step ? styles.stepLineActive : styles.stepLineInactive
              ]} />
            )}
          </React.Fragment>
        ))}
      </View>
      <Text style={styles.stepLabel}>{labels[currentStep - 1]}</Text>
    </View>
  );
}

// --- Info Box ---
interface InfoBoxProps {
  children: React.ReactNode;
  variant?: 'warning' | 'info' | 'success';
}

export function InfoBox({ children, variant = 'warning' }: InfoBoxProps) {
  const getStyle = () => {
    switch (variant) {
      case 'info':
        return styles.infoBoxBlue;
      case 'success':
        return styles.infoBoxGreen;
      default:
        return styles.infoBoxYellow;
    }
  };

  return (
    <View style={[styles.infoBox, getStyle()]}>
      <Text style={styles.infoBoxIcon}>ℹ️</Text>
      <Text style={styles.infoBoxText}>{children}</Text>
    </View>
  );
}

// --- Stat Card (Costo/Tiempo) ---
interface StatCardProps {
  label: string;
  value: string;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

// --- Requirement Item ---
interface RequirementItemProps {
  label: string;
  completed: boolean;
  onToggle: () => void;
}

export function RequirementItem({ label, completed, onToggle }: RequirementItemProps) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      style={[
        styles.requirementItem,
        completed ? styles.requirementItemCompleted : styles.requirementItemPending
      ]}
      activeOpacity={0.7}
    >
      <View style={styles.requirementContent}>
        <Text style={styles.requirementLabel}>{label}</Text>
        <Text style={[
          styles.requirementStatus,
          completed ? styles.requirementStatusCompleted : styles.requirementStatusPending
        ]}>
          {completed ? 'Listo' : 'Toque para marcar'}
        </Text>
      </View>
      {completed ? (
        <Text style={styles.requirementCheckmark}>✓</Text>
      ) : (
        <View style={styles.requirementCircle} />
      )}
    </TouchableOpacity>
  );
}

// --- Integration Item ---
interface IntegrationItemProps {
  icon: string;
  label: string;
  connected: boolean;
  onPress?: () => void;
}

export function IntegrationItem({ icon, label, connected, onPress }: IntegrationItemProps) {
  return (
    <TouchableOpacity
      style={styles.integrationItem}
      onPress={onPress}
      disabled={connected}
      activeOpacity={connected ? 1 : 0.7}
    >
      <Text style={styles.integrationIcon}>{icon}</Text>
      <Text style={styles.integrationLabel}>{label}</Text>
      {connected ? (
        <Text style={styles.integrationConnected}>✓</Text>
      ) : (
        <Text style={styles.integrationConnect}>Conectar</Text>
      )}
    </TouchableOpacity>
  );
}

// --- Action Button (Agendar/WhatsApp) ---
interface ActionButtonProps {
  icon: string;
  title: string;
  subtitle: string;
  variant: 'blue' | 'green';
  onPress: () => void;
}

export function ActionButton({ icon, title, subtitle, variant, onPress }: ActionButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.actionButton,
        variant === 'blue' ? styles.actionButtonBlue : styles.actionButtonGreen
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.actionButtonIcon}>{icon}</Text>
      <View style={styles.actionButtonContent}>
        <Text style={[
          styles.actionButtonTitle,
          variant === 'blue' ? styles.actionButtonTitleBlue : styles.actionButtonTitleGreen
        ]}>
          {title}
        </Text>
        <Text style={[
          styles.actionButtonSubtitle,
          variant === 'blue' ? styles.actionButtonSubtitleBlue : styles.actionButtonSubtitleGreen
        ]}>
          {subtitle}
        </Text>
      </View>
      <Text style={[
        styles.actionButtonChevron,
        variant === 'blue' ? styles.actionButtonChevronBlue : styles.actionButtonChevronGreen
      ]}>
        ›
      </Text>
    </TouchableOpacity>
  );
}

// ==============================================
// 📐 ESTILOS
// ==============================================

const styles = StyleSheet.create({
  // Action Card
  actionCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.base,
    borderRadius: RADIUS.xl,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  actionCardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.bgLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.base,
  },
  cardIconPassport: {
    fontSize: 24,
  },
  cardIconId: {
    fontSize: 24,
  },
  cardIconCar: {
    fontSize: 24,
  },
  actionCardContent: {
    flex: 1,
  },
  actionCardTitle: {
    fontSize: SIZES.base,
    ...FONTS.bold,
    color: COLORS.textMain,
  },
  actionCardSubtitle: {
    fontSize: SIZES.sm,
    color: COLORS.textSec,
    marginTop: 2,
  },
  actionCardChevron: {
    fontSize: 24,
    color: COLORS.textLight,
  },

  // Chat Bubble
  bubbleContainer: {
    width: '100%',
    marginBottom: SPACING.base,
  },
  bubbleRight: {
    alignItems: 'flex-end',
  },
  bubbleLeft: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    padding: SPACING.md,
    borderRadius: RADIUS.xl,
  },
  bubbleUser: {
    backgroundColor: COLORS.textMain,
    borderBottomRightRadius: SPACING.xs,
  },
  bubbleAssistant: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderBottomLeftRadius: SPACING.xs,
  },
  bubbleText: {
    fontSize: SIZES.sm,
    lineHeight: 20,
  },
  bubbleTextUser: {
    color: COLORS.white,
  },
  bubbleTextAssistant: {
    color: COLORS.textMain,
  },

  // Tramite Info Card
  tramiteInfoCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.base,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginLeft: 0,
    maxWidth: '85%',
    ...SHADOWS.sm,
  },
  tramiteInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  tramiteInfoIcon: {
    fontSize: 18,
  },
  tramiteInfoTitle: {
    fontSize: SIZES.base,
    ...FONTS.bold,
    color: COLORS.textMain,
  },
  tramiteInfoDetails: {
    marginBottom: SPACING.md,
    gap: 4,
  },
  tramiteInfoDetail: {
    fontSize: SIZES.sm,
    color: COLORS.textSec,
  },
  tramiteInfoButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.base,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  tramiteInfoButtonText: {
    fontSize: SIZES.sm,
    ...FONTS.bold,
    color: COLORS.textMain,
  },
  tramiteInfoButtonChevron: {
    fontSize: 16,
    color: COLORS.textMain,
  },

  // Stepper
  stepperContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.xl,
    ...SHADOWS.sm,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.xxl,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  stepCircleActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    ...SHADOWS.md,
  },
  stepCircleInactive: {
    backgroundColor: COLORS.bgLight,
    borderColor: COLORS.border,
  },
  stepNumber: {
    fontSize: SIZES.sm,
    ...FONTS.bold,
  },
  stepNumberActive: {
    color: COLORS.textMain,
  },
  stepNumberInactive: {
    color: COLORS.textLight,
  },
  stepLine: {
    flex: 1,
    height: 4,
    marginHorizontal: SPACING.sm,
    borderRadius: 2,
  },
  stepLineActive: {
    backgroundColor: COLORS.primary,
  },
  stepLineInactive: {
    backgroundColor: COLORS.border,
  },
  stepLabel: {
    textAlign: 'center',
    fontSize: SIZES.sm,
    ...FONTS.semiBold,
    color: COLORS.textSec,
  },

  // Info Box
  infoBox: {
    flexDirection: 'row',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.md,
    marginTop: SPACING.base,
    borderWidth: 1,
  },
  infoBoxYellow: {
    backgroundColor: COLORS.primaryLight,
    borderColor: '#FDE68A',
  },
  infoBoxBlue: {
    backgroundColor: COLORS.blueLight,
    borderColor: '#93C5FD',
  },
  infoBoxGreen: {
    backgroundColor: COLORS.greenLight,
    borderColor: '#86EFAC',
  },
  infoBoxIcon: {
    fontSize: 16,
  },
  infoBoxText: {
    flex: 1,
    fontSize: SIZES.xs,
    color: '#92400E',
    lineHeight: 16,
  },

  // Stat Card
  statCard: {
    flex: 1,
    backgroundColor: COLORS.blueLight,
    padding: SPACING.base,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: SIZES.sm,
    ...FONTS.semiBold,
    color: COLORS.blue,
    marginBottom: SPACING.xs,
  },
  statValue: {
    fontSize: SIZES.xl,
    ...FONTS.bold,
    color: COLORS.textMain,
  },

  // Requirement Item
  requirementItem: {
    padding: SPACING.base,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  requirementItemCompleted: {
    backgroundColor: COLORS.greenLight,
    borderColor: '#86EFAC',
  },
  requirementItemPending: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
  },
  requirementContent: {
    flex: 1,
  },
  requirementLabel: {
    fontSize: SIZES.md,
    ...FONTS.medium,
    color: COLORS.textMain,
  },
  requirementStatus: {
    fontSize: SIZES.xs,
    marginTop: 4,
  },
  requirementStatusCompleted: {
    color: COLORS.green,
  },
  requirementStatusPending: {
    color: COLORS.textLight,
  },
  requirementCheckmark: {
    fontSize: 24,
    color: COLORS.green,
  },
  requirementCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
  },

  // Integration Item
  integrationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  integrationIcon: {
    fontSize: 18,
  },
  integrationLabel: {
    flex: 1,
    fontSize: SIZES.md,
    color: COLORS.textSec,
  },
  integrationConnected: {
    fontSize: 16,
    color: COLORS.green,
  },
  integrationConnect: {
    fontSize: SIZES.xs,
    ...FONTS.bold,
    color: COLORS.primaryDark,
  },

  // Action Button
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.base,
    borderRadius: RADIUS.lg,
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  actionButtonBlue: {
    backgroundColor: COLORS.blueLight,
  },
  actionButtonGreen: {
    backgroundColor: COLORS.greenLight,
  },
  actionButtonIcon: {
    fontSize: 18,
  },
  actionButtonContent: {
    flex: 1,
  },
  actionButtonTitle: {
    fontSize: SIZES.sm,
    ...FONTS.bold,
  },
  actionButtonTitleBlue: {
    color: COLORS.blue,
  },
  actionButtonTitleGreen: {
    color: COLORS.green,
  },
  actionButtonSubtitle: {
    fontSize: SIZES.xs,
    marginTop: 2,
  },
  actionButtonSubtitleBlue: {
    color: '#3B82F6',
  },
  actionButtonSubtitleGreen: {
    color: '#059669',
  },
  actionButtonChevron: {
    fontSize: 16,
  },
  actionButtonChevronBlue: {
    color: COLORS.blue,
  },
  actionButtonChevronGreen: {
    color: COLORS.green,
  },
});
