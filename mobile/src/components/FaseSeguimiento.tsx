import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import type { Tramite } from '../types/tramite.types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  tramite: Tramite;
}

export function FaseSeguimiento({ tramite }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
    >
      <View style={styles.card}>
        {/* Encabezado */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconLarge}>✅</Text>
          </View>
          <Text style={styles.title}>¡Todo listo!</Text>
          <Text style={styles.subtitle}>
            Has completado todos los requisitos necesarios
          </Text>
        </View>

        {/* Estado completado */}
        <View style={styles.completedSection}>
          <View style={styles.completedHeader}>
            <Text style={styles.completedIcon}>✓</Text>
            <Text style={styles.completedTitle}>Requisitos cumplidos</Text>
          </View>
          <Text style={styles.completedText}>
            Has completado todos los requisitos necesarios para tu <Text style={styles.bold}>{tramite.nombre}</Text>.
          </Text>
        </View>

        {/* Próximos pasos */}
        <View style={styles.stepsSection}>
          <Text style={styles.stepsTitle}>Próximos pasos:</Text>
          
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTextBold}>Acércate al Registro Civil</Text>
              <Text style={styles.stepText}>Con todos tus documentos</Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTextBold}>Paga en ventanilla</Text>
              <Text style={styles.stepText}>
                El monto total aproximado es ${(tramite.costo || 0).toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTextBold}>Toma tu cita</Text>
              <Text style={styles.stepText}>
                Puedes agendar en línea o en la oficina
              </Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTextBold}>Recibe tu documento</Text>
              <Text style={styles.stepText}>
                Tiempo estimado: {tramite.estimadoDias || 7} días hábiles
              </Text>
            </View>
          </View>
        </View>

        {/* Información adicional */}
        <View style={styles.infoSection}>
          <Text style={styles.infoIcon}>💡</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Consejo:</Text>
            <Text style={styles.infoText}>
              Lleva copias adicionales de tus documentos por si acaso.
              Verifica los horarios de atención antes de ir.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 24,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  iconContainer: {
    marginBottom: 16,
  },
  iconLarge: {
    fontSize: 72,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  completedSection: {
    backgroundColor: '#dcfce7',
    borderRadius: 14,
    padding: 18,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#22c55e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  completedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  completedIcon: {
    fontSize: 22,
    color: '#15803d',
    marginRight: 10,
  },
  completedTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#166534',
  },
  completedText: {
    fontSize: 14,
    color: '#166534',
    lineHeight: 21,
  },
  bold: {
    fontWeight: '800',
  },
  stepsSection: {
    backgroundColor: '#f0f9ff',
    borderLeftWidth: 5,
    borderLeftColor: '#0284c7',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  stepsTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 18,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  stepContent: {
    flex: 1,
  },
  stepTextBold: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  stepText: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 20,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fef08a',
    borderRadius: 12,
    padding: 18,
    borderWidth: 2,
    borderColor: '#fbbf24',
  },
  infoIcon: {
    fontSize: 28,
    marginRight: 14,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: '#92400e',
    lineHeight: 20,
  },
});
