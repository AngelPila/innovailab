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
    backgroundColor: '#f9fafb',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    margin: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    marginBottom: 16,
  },
  iconLarge: {
    fontSize: 64,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  completedSection: {
    backgroundColor: '#d1fae5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#10b981',
  },
  completedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  completedIcon: {
    fontSize: 20,
    color: '#059669',
    marginRight: 8,
  },
  completedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#065f46',
  },
  completedText: {
    fontSize: 14,
    color: '#065f46',
  },
  bold: {
    fontWeight: 'bold',
  },
  stepsSection: {
    backgroundColor: '#eff6ff',
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  stepsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  stepContent: {
    flex: 1,
  },
  stepTextBold: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  stepText: {
    fontSize: 13,
    color: '#6b7280',
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#78350f',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#78350f',
  },
});
