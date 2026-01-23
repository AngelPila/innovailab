import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface Props {
  tramite?: any;
  titulo?: string;
  categoria?: string;
  costo?: number;
  diasEstimados?: number;
  progreso?: number;
  pasoActual?: number;
  totalPasos?: number;
  onPress: () => void;
}

export function EstadoTramite({
  tramite,
  titulo,
  categoria,
  costo,
  diasEstimados,
  progreso,
  pasoActual = 0,
  totalPasos = 100,
  onPress,
}: Props) {
  // Si se pasa un tramite, usar sus datos, si no usar los props individuales
  const finalTitulo = titulo || tramite?.nombre || 'Trámite';
  const finalCategoria = categoria || tramite?.categoria || 'general';
  const finalCosto = costo !== undefined ? costo : tramite?.costo || 0;
  const finalDias = diasEstimados !== undefined ? diasEstimados : tramite?.estimadoDias || 0;
  const finalProgreso = progreso !== undefined ? progreso : pasoActual;
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      identidad: '#3b82f6',
      internacional: '#8b5cf6',
      vehicular: '#f59e0b',
      social: '#10b981',
      salud: '#ec4899',
      municipal: '#14b8a6',
      tributario: '#f97316',
      legal: '#6366f1',
      transporte: '#06b6d4',
      default: '#6b7280',
    };
    return colors[category] || colors.default;
  };

  const categoryColor = getCategoryColor(finalCategoria);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: categoryColor },
          ]}
        >
          <Text style={styles.categoryText}>{finalCategoria[0].toUpperCase()}</Text>
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.titulo} numberOfLines={2}>
            {finalTitulo}
          </Text>
          <Text style={styles.categoria}>{finalCategoria}</Text>
        </View>
        <Text style={styles.progresoIndicador}>{finalProgreso}%</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>💰 Costo</Text>
          <Text style={styles.infoValue}>${finalCosto.toFixed(2)}</Text>
        </View>
        <View style={styles.infoDivider} />
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>⏱️ Plazo</Text>
          <Text style={styles.infoValue}>{finalDias} días</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(finalProgreso, 100)}%`,
                backgroundColor: categoryColor,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>Progreso del trámite</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Ver detalles →</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    marginHorizontal: 12,
    marginVertical: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
  },
  headerContent: {
    flex: 1,
    marginRight: 10,
  },
  titulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 2,
  },
  categoria: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  progresoIndicador: {
    fontSize: 16,
    fontWeight: '800',
    color: '#3b82f6',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
  },
  infoLabel: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 8,
  },
  footerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3b82f6',
  },
});
