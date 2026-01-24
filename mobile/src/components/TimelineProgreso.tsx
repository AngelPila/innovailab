import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

interface TimelineStep {
  id?: string;
  titulo?: string;
  title?: string;
  descripcion?: string;
  description?: string;
  estado?: 'completado' | 'actual' | 'pendiente';
  icon?: string;
}

interface Props {
  steps?: TimelineStep[];
  pasos?: string[];
  pasoActual?: number;
}

export function TimelineProgreso({ steps, pasos, pasoActual = 0 }: Props) {
  // Convertir pasos simples a formato TimelineStep
  const finalSteps = steps || (pasos?.map((paso, index) => ({
    id: `paso-${index}`,
    titulo: paso,
    title: paso,
    descripcion: '',
    description: '',
    estado: index < pasoActual ? 'completado' as const : index === pasoActual ? 'actual' as const : 'pendiente' as const,
    icon: undefined,
  })) || []);
  const getEstadoColor = (estado: string) => {
    const colors: Record<string, any> = {
      completado: {
        circleBg: '#10b981',
        circleBorder: '#059669',
        icon: '✓',
        textColor: '#10b981',
      },
      actual: {
        circleBg: '#3b82f6',
        circleBorder: '#1d4ed8',
        icon: '●',
        textColor: '#3b82f6',
      },
      pendiente: {
        circleBg: '#e5e7eb',
        circleBorder: '#d1d5db',
        icon: '○',
        textColor: '#9ca3af',
      },
    };
    return colors[estado] || colors.pendiente;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Línea de tiempo</Text>

      <View style={styles.timeline}>
        {finalSteps.map((step, index) => {
          const colors = getEstadoColor(step.estado || 'pendiente');
          const isLast = index === finalSteps.length - 1;

          return (
            <View key={step.id} style={styles.timelineItem}>
              {/* Línea vertical */}
              {!isLast && (
                <View
                  style={[
                    styles.verticalLine,
                    {
                      backgroundColor:
                        step.estado === 'completado'
                          ? '#10b981'
                          : '#e5e7eb',
                    },
                  ]}
                />
              )}

              {/* Círculo del estado */}
              <View style={styles.circleContainer}>
                <View
                  style={[
                    styles.circle,
                    {
                      backgroundColor: colors.circleBg,
                      borderColor: colors.circleBorder,
                    },
                  ]}
                >
                  <Text style={styles.circleIcon}>{step.icon || colors.icon}</Text>
                </View>
              </View>

              {/* Contenido */}
              <View
                style={[
                  styles.content,
                  (step.estado || 'pendiente') === 'actual' && styles.contentActual,
                ]}
              >
                <Text
                  style={[
                    styles.stepTitulo,
                    { color: colors.textColor },
                  ]}
                >
                  {step.titulo || step.title || 'Paso'}
                </Text>
                {(step.descripcion || step.description) && (
                  <Text style={styles.stepDescripcion}>
                    {step.descripcion || step.description}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    marginHorizontal: 12,
  },
  titulo: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  timeline: {
    marginLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  verticalLine: {
    position: 'absolute',
    left: 20,
    top: 48,
    width: 3,
    height: 52,
  },
  circleContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  circleIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    paddingTop: 4,
  },
  contentActual: {
    backgroundColor: '#f0f9ff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  stepTitulo: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  stepDescripcion: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 20,
  },
});
