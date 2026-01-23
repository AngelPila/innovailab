import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import type { PasoTramite } from '../types/tramite.types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  paso: PasoTramite;
  estaCompletado: boolean;
  onCompletar: () => void;
}

// Parsear contenido para extraer información
function parseContenido(contenido: string | undefined) {
  if (!contenido) return { tiempo: null, costo: null, vigencia: null, otroContenido: '' };
  
  const lineas = contenido.split('\n');
  let tiempo: string | null = null;
  let costo: string | null = null;
  let vigencia: string | null = null;
  const otrasLineas: string[] = [];

  lineas.forEach(linea => {
    if (linea.includes('Tiempo estimado')) {
      const match = linea.match(/(\d+)\s*días/);
      if (match) tiempo = match[1];
    } else if (linea.includes('Costo')) {
      const match = linea.match(/\$([0-9.]+)/);
      if (match) costo = match[1];
    } else if (linea.includes('Vigencia')) {
      const match = linea.match(/Vigencia:\s*(.+)/);
      if (match) vigencia = match[1];
    } else if (linea.trim()) {
      otrasLineas.push(linea);
    }
  });

  return { tiempo, costo, vigencia, otroContenido: otrasLineas.join('\n') };
}

export function FaseContenido({ paso, estaCompletado, onCompletar }: Props) {
  const { tiempo, costo, vigencia, otroContenido } = parseContenido(paso.contenido);
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.icon}>ℹ️</Text>
          <View style={styles.headerText}>
            <Text style={styles.title}>{paso.titulo}</Text>
            <Text style={styles.description}>{paso.descripcion}</Text>
          </View>
          {estaCompletado && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>✓ Completado</Text>
            </View>
          )}
        </View>

        {/* Información General */}
        {paso.titulo === 'Información General' && (tiempo || costo || vigencia) && (
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Información General</Text>
            
            {tiempo && (
              <View style={[styles.infoCard, styles.infoCardTiempo]}>
                <Text style={styles.infoCardIcon}>⏱️</Text>
                <View style={styles.infoCardContent}>
                  <Text style={styles.infoCardLabel}>Tiempo Estimado</Text>
                  <Text style={styles.infoCardValue}>{tiempo} días</Text>
                </View>
              </View>
            )}

            {costo && (
              <View style={[styles.infoCard, styles.infoCardCosto]}>
                <Text style={styles.infoCardIcon}>💰</Text>
                <View style={styles.infoCardContent}>
                  <Text style={styles.infoCardLabel}>Costo</Text>
                  <Text style={styles.infoCardValue}>${costo}</Text>
                </View>
              </View>
            )}

            {vigencia && (
              <View style={[styles.infoCard, styles.infoCardVigencia]}>
                <Text style={styles.infoCardIcon}>📅</Text>
                <View style={styles.infoCardContent}>
                  <Text style={styles.infoCardLabel}>Vigencia</Text>
                  <Text style={styles.infoCardValue}>{vigencia}</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Contenido adicional */}
        {otroContenido && (
          <View style={styles.additionalContent}>
            <Text style={styles.additionalContentText}>{otroContenido}</Text>
          </View>
        )}

        {/* Documentos requeridos */}
        {paso.validaciones && paso.validaciones.length > 0 && (
          <View style={styles.validacionesSection}>
            <Text style={styles.validacionesTitle}>Documentos requeridos:</Text>
            {paso.validaciones.map((validacion, idx) => (
              <View key={idx} style={styles.validacionItem}>
                <Text style={styles.validacionBullet}>•</Text>
                <Text style={styles.validacionText}>{validacion}</Text>
              </View>
            ))}
          </View>
        )}

        {!estaCompletado && (
          <TouchableOpacity
            style={styles.completarButton}
            onPress={onCompletar}
          >
            <Text style={styles.completarButtonText}>Continuar →</Text>
          </TouchableOpacity>
        )}
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  icon: {
    fontSize: 32,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 22,
  },
  completedBadge: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  completedText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '600',
  },
  infoSection: {
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  infoCardTiempo: {
    backgroundColor: '#fef3c7',
    borderColor: '#fbbf24',
  },
  infoCardCosto: {
    backgroundColor: '#dcfce7',
    borderColor: '#22c55e',
  },
  infoCardVigencia: {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6',
  },
  infoCardIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  infoCardContent: {
    flex: 1,
  },
  infoCardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#78350f',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoCardValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1f2937',
  },
  additionalContent: {
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#0ea5e9',
    marginBottom: 20,
  },
  additionalContentText: {
    fontSize: 14,
    color: '#0c4a6e',
    lineHeight: 22,
    fontWeight: '500',
  },
  validacionesSection: {
    marginBottom: 20,
  },
  validacionesTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  validacionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  validacionBullet: {
    fontSize: 18,
    color: '#3b82f6',
    marginRight: 10,
    marginTop: 2,
  },
  validacionText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 21,
  },
  completarButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  completarButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});
