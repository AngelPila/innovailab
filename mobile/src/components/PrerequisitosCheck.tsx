import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import type { Prerequisito } from '../types/tramite.types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  prerequisitos: Prerequisito[];
  prerequisitosCumplidos: Record<string, boolean>;
  onValidacionCompleta: (cumplidos: Record<string, boolean>) => void;
}

export function PrerequisitosCheck({ 
  prerequisitos, 
  prerequisitosCumplidos, 
  onValidacionCompleta,
}: Props) {
  const [respuestas, setRespuestas] = useState<Record<string, boolean>>(prerequisitosCumplidos);
  const [omitidos, setOmitidos] = useState<Record<string, boolean>>({});
  const [indiceActual, setIndiceActual] = useState<number>(0);
  const insets = useSafeAreaInsets();

  const handleRespuesta = (prerequisitoId: string, tieneDocumento: boolean) => {
    const nuevasRespuestas = {
      ...respuestas,
      [prerequisitoId]: tieneDocumento,
    };
    setRespuestas(nuevasRespuestas);
    
    if (indiceActual < prerequisitos.length - 1) {
      setTimeout(() => setIndiceActual(indiceActual + 1), 300);
    }
  };

  const handleOmitir = (prerequisitoId: string) => {
    setOmitidos(prev => ({ ...prev, [prerequisitoId]: true }));
    const nuevasRespuestas = { ...respuestas, [prerequisitoId]: true };
    setRespuestas(nuevasRespuestas);
    
    if (indiceActual < prerequisitos.length - 1) {
      setTimeout(() => setIndiceActual(indiceActual + 1), 300);
    }
  };

  const handleRetroceder = () => {
    if (indiceActual > 0) {
      setIndiceActual(indiceActual - 1);
    }
  };

  const requisitoActual = prerequisitos[indiceActual];
  const respuestaActual = respuestas[requisitoActual?.id];
  
  const todosRespondidos = prerequisitos.every((pre) => respuestas[pre.id] !== undefined);
  const faltantes = prerequisitos.filter((pre) => respuestas[pre.id] === false && !omitidos[pre.id]);
  const puedeAvanzar = todosRespondidos && faltantes.length === 0;

  const requisitosNoTengo = prerequisitos
    .slice(0, indiceActual)
    .filter((pre) => respuestas[pre.id] === false && !omitidos[pre.id]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Verificación de Requisitos</Text>
            <Text style={styles.subtitle}>
              Verifica que tengas todos los documentos necesarios
            </Text>
          </View>
          {indiceActual > 0 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleRetroceder}
            >
              <Text style={styles.backButtonText}>← Anterior</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Indicador de progreso */}
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>
              Requisito {indiceActual + 1} de {prerequisitos.length}
            </Text>
            <Text style={styles.progressPercent}>
              {Math.round(((indiceActual + 1) / prerequisitos.length) * 100)}% completado
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressBarFill,
                { width: `${((indiceActual + 1) / prerequisitos.length) * 100}%` }
              ]}
            />
          </View>
        </View>

        {/* Requisito actual */}
        {requisitoActual && (
          <View style={styles.requisitoActual}>
            {omitidos[requisitoActual.id] ? (
              <View style={styles.requisitoOmitido}>
                <Text style={styles.requisitoOmitidoText}>⏭️ {requisitoActual.preguntaValidacion}</Text>
                <Text style={styles.requisitoOmitidoSubtext}>Omitido - podrás completarlo después</Text>
              </View>
            ) : (
              <>
                <View style={[
                  styles.requisitoCard,
                  respuestaActual === true && styles.requisitoCardApproved,
                  respuestaActual === false && styles.requisitoCardRejected,
                ]}>
                  <Text style={styles.requisitoPregunta}>{requisitoActual.preguntaValidacion}</Text>
                  {requisitoActual.descripcion && (
                    <Text style={styles.requisitoDescripcion}>{requisitoActual.descripcion}</Text>
                  )}
                  
                  {respuestas[requisitoActual.id] === undefined && (
                    <View style={styles.botonesRespuesta}>
                      <TouchableOpacity
                        style={[styles.botonRespuesta, styles.botonSi]}
                        onPress={() => handleRespuesta(requisitoActual.id, true)}
                      >
                        <Text style={styles.botonRespuestaText}>✓ Sí, lo tengo</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.botonRespuesta, styles.botonNo]}
                        onPress={() => handleRespuesta(requisitoActual.id, false)}
                      >
                        <Text style={styles.botonRespuestaText}>✗ No lo tengo</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  
                  {respuestas[requisitoActual.id] === true && (
                    <View style={styles.respuestaIndicador}>
                      <Text style={styles.respuestaSi}>✓ Sí lo tengo</Text>
                    </View>
                  )}
                  
                  {respuestas[requisitoActual.id] === false && (
                    <View style={styles.respuestaIndicador}>
                      <Text style={styles.respuestaNo}>✗ No lo tengo</Text>
                    </View>
                  )}
                </View>

                {respuestas[requisitoActual.id] === false && (
                  <View style={styles.alertaFaltante}>
                    <Text style={styles.alertaTitle}>⚠️ Documento faltante</Text>
                    <Text style={styles.alertaText}>
                      {requisitoActual.tramiteRelacionado 
                        ? 'Puedes obtener este documento iniciando otro trámite'
                        : 'Necesitarás conseguir este documento para continuar'}
                    </Text>
                    <TouchableOpacity
                      style={styles.botonOmitir}
                      onPress={() => handleOmitir(requisitoActual.id)}
                    >
                      <Text style={styles.botonOmitirText}>Omitir por ahora</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
          </View>
        )}

        {/* Requisitos pendientes */}
        {requisitosNoTengo.length > 0 && (
          <View style={styles.requisitosPendientes}>
            <Text style={styles.requisitosPendientesTitle}>
              📋 Requisitos pendientes ({requisitosNoTengo.length})
            </Text>
            {requisitosNoTengo.map((prerequisito) => (
              <View key={prerequisito.id} style={styles.requisitoPendiente}>
                <Text style={styles.requisitoPendienteText}>
                  ✗ {prerequisito.nombre}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Botón de continuar */}
        {puedeAvanzar && (
          <TouchableOpacity
            style={styles.botonContinuar}
            onPress={() => onValidacionCompleta(respuestas)}
          >
            <Text style={styles.botonContinuarText}>Continuar al pago →</Text>
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
    marginBottom: 20,
  },
  headerContent: {
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
  },
  progressContainer: {
    marginBottom: 24,
    backgroundColor: '#f0f9ff',
    padding: 14,
    borderRadius: 10,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0c4a6e',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0284c7',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#bae6fd',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0284c7',
    borderRadius: 4,
  },
  requisitoActual: {
    marginBottom: 24,
  },
  requisitoCard: {
    padding: 18,
    backgroundColor: '#f9fafb',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  requisitoCardApproved: {
    borderColor: '#10b981',
    backgroundColor: '#ecfdf5',
  },
  requisitoCardRejected: {
    borderColor: '#f87171',
    backgroundColor: '#fef2f2',
  },
  requisitoPregunta: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 10,
  },
  requisitoDescripcion: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 14,
    fontStyle: 'italic',
  },
  botonesRespuesta: {
    flexDirection: 'row',
    gap: 10,
  },
  botonRespuesta: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  botonSi: {
    backgroundColor: '#10b981',
  },
  botonNo: {
    backgroundColor: '#f87171',
  },
  botonRespuestaText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  respuestaIndicador: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  respuestaSi: {
    fontSize: 15,
    fontWeight: '700',
    color: '#10b981',
  },
  respuestaNo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f87171',
  },
  alertaFaltante: {
    marginTop: 14,
    padding: 14,
    backgroundColor: '#fef08a',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fbbf24',
  },
  alertaTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#78350f',
    marginBottom: 6,
  },
  alertaText: {
    fontSize: 13,
    color: '#92400e',
    marginBottom: 10,
    lineHeight: 20,
  },
  botonOmitir: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#f59e0b',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  botonOmitirText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  requisitoOmitido: {
    padding: 14,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
  },
  requisitoOmitidoText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 6,
    fontWeight: '500',
  },
  requisitoOmitidoSubtext: {
    fontSize: 12,
    color: '#9ca3af',
  },
  requisitosPendientes: {
    marginTop: 20,
    padding: 14,
    backgroundColor: '#fee2e2',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fca5a5',
  },
  requisitosPendientesTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#7f1d1d',
    marginBottom: 10,
  },
  requisitoPendiente: {
    paddingVertical: 8,
  },
  requisitoPendienteText: {
    fontSize: 13,
    color: '#991b1b',
  },
  botonContinuar: {
    marginTop: 24,
    paddingVertical: 16,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  botonContinuarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});
