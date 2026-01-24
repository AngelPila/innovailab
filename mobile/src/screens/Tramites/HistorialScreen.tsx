import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTramiteStore } from '../../store/tramiteStore';
import { tramitesService } from '../../services/tramitesService';
import { EstadoTramite } from '../../components/EstadoTramite';
import { ConsejosTips } from '../../components/ConsejosTips';
import { TimelineProgreso } from '../../components/TimelineProgreso';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Historial'>;
};

export function HistorialScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { progresoMultiple, obtenerProgresoTramite } = useTramiteStore();
  const [historialTramites, setHistorialTramites] = useState<any[]>([]);

  useEffect(() => {
    const tramites = Object.keys(progresoMultiple).map(tramiteId => {
      const tramite = tramitesService.getPorId(tramiteId);
      const progreso = obtenerProgresoTramite(tramiteId);
      return {
        ...tramite,
        progreso,
        faseActual: progreso?.faseActual || 'informacion',
      };
    });
    setHistorialTramites(tramites);
  }, [progresoMultiple]);

  const tramitesCompletados = historialTramites.filter(
    t => t.faseActual === 'seguimiento'
  );
  const tramitesEnProgreso = historialTramites.filter(
    t => t.faseActual !== 'seguimiento' && t.faseActual !== 'informacion'
  );
  const tramitesIniciados = historialTramites.filter(
    t => t.faseActual === 'informacion'
  );

  const calcularProgreso = (faseActual: string): number => {
    const fases = ['informacion', 'requisitos', 'pago', 'seguimiento'];
    const index = fases.indexOf(faseActual);
    return Math.round(((index + 1) / fases.length) * 100);
  };

  const renderTramiteCard = (tramite: any) => (
    <TouchableOpacity
      key={tramite.id}
      style={styles.tramiteCard}
      onPress={() =>
        navigation.navigate('TramiteFlow', {
          tramiteId: tramite.id,
          version: 'advanced',
        })
      }
      activeOpacity={0.7}
    >
      <EstadoTramite
        tramite={tramite}
        pasoActual={calcularProgreso(tramite.faseActual)}
        totalPasos={100}
        onPress={() => {}}
      />
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateIcon}>📋</Text>
      <Text style={styles.emptyStateTitle}>Sin historial</Text>
      <Text style={styles.emptyStateText}>
        No has iniciado ningún trámite aún
      </Text>
      <TouchableOpacity
        style={styles.emptyStateButton}
        onPress={() => navigation.navigate('Tramites')}
      >
        <Text style={styles.emptyStateButtonText}>Explorar trámites</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Tu historial</Text>
        <Text style={styles.subtitle}>
          {historialTramites.length} trámite{historialTramites.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {historialTramites.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            {/* Consejos */}
            <ConsejosTips
              type="info"
              title="📊 Tu progreso"
              consejos={[
                `${tramitesCompletados.length} completado${tramitesCompletados.length !== 1 ? 's' : ''}`,
                `${tramitesEnProgreso.length} en progreso`,
                `${tramitesIniciados.length} iniciado${tramitesIniciados.length !== 1 ? 's' : ''}`,
              ]}
            />

            {/* Resumen de Estadísticas */}
            <View style={styles.statsContainer}>
              <View style={[styles.statCard, styles.statCardCompleted]}>
                <Text style={styles.statNumber}>{tramitesCompletados.length}</Text>
                <Text style={styles.statLabel}>Completados</Text>
              </View>
              <View style={[styles.statCard, styles.statCardProgress]}>
                <Text style={styles.statNumber}>{tramitesEnProgreso.length}</Text>
                <Text style={styles.statLabel}>En progreso</Text>
              </View>
              <View style={[styles.statCard, styles.statCardInitiated]}>
                <Text style={styles.statNumber}>{tramitesIniciados.length}</Text>
                <Text style={styles.statLabel}>Iniciados</Text>
              </View>
            </View>

            {/* Trámites Completados */}
            {tramitesCompletados.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>✅ Completados</Text>
                <View style={styles.tramitesList}>
                  {tramitesCompletados.map(renderTramiteCard)}
                </View>
              </View>
            )}

            {/* Trámites en Progreso */}
            {tramitesEnProgreso.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>⏳ En progreso</Text>
                <View style={styles.tramitesList}>
                  {tramitesEnProgreso.map(tramite => (
                    <View key={tramite.id} style={styles.tramiteCardContainer}>
                      {renderTramiteCard(tramite)}
                      <TimelineProgreso
                        pasos={['Información', 'Requisitos', 'Pago', 'Seguimiento']}
                        pasoActual={
                          ['informacion', 'requisitos', 'pago', 'seguimiento'].indexOf(
                            tramite.faseActual
                          )
                        }
                      />
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Trámites Iniciados */}
            {tramitesIniciados.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🆕 Iniciados recientemente</Text>
                <View style={styles.tramitesList}>
                  {tramitesIniciados.map(renderTramiteCard)}
                </View>
              </View>
            )}

            {/* Tips */}
            <ConsejosTips
              type="success"
              title="💡 Mantente actualizado"
              consejos={[
                'Recibirás notificaciones sobre el progreso',
                'Puedes reanudar en cualquier momento',
                'Verifica tu email para confirmaciones',
              ]}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
  },
  statCard: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statCardCompleted: {
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#86efac',
  },
  statCardProgress: {
    backgroundColor: '#fef08a',
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  statCardInitiated: {
    backgroundColor: '#dbeafe',
    borderWidth: 1,
    borderColor: '#93c5fd',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  section: {
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  tramitesList: {
    gap: 10,
  },
  tramiteCard: {
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e9ecef',
    overflow: 'hidden',
  },
  tramiteCardContainer: {
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e9ecef',
    overflow: 'hidden',
    paddingBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  emptyStateIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyStateButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
  },
  emptyStateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});
