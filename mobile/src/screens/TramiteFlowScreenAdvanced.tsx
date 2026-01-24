import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { tramitesService } from '../services/tramitesService';
import { useTramiteStore } from '../store/tramiteStore';
import { useTramiteFlow } from '../../hooks/useTramiteFlow';
import { ProgressBar } from '../components/ProgressBar';
import { SegmentacionPasaporte } from '../components/SegmentacionPasaporte';
import { PrerequisitosCheck } from '../components/PrerequisitosCheck';
import { FaseContenido } from '../components/FaseContenido';
import { FasePago } from '../components/FasePago';
import { FaseSeguimiento } from '../components/FaseSeguimiento';
import type { FaseTramite } from '../types/tramite.types';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'TramiteFlow'>;
  route: RouteProp<RootStackParamList, 'TramiteFlow'>;
};

const PASOS = ['Información', 'Requisitos', 'Pago', 'Seguimiento'];

export function TramiteFlowScreen({ navigation, route }: Props) {
  const { tramiteId, version } = route.params;
  const tramite = tramitesService.getPorId(tramiteId);
  const { iniciarTramite, setSegmentacion, progresoMultiple } = useTramiteStore();

  const {
    faseActual,
    pasoActual,
    fasesCompletadas,
    prerequisitosCumplidos,
    prerequisitosDinamicos,
    cambiarFase,
    completarPaso,
    actualizarPrerequisitos,
  } = useTramiteFlow(tramiteId);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (tramite) {
      const esNuevaApertura = !progresoMultiple[tramiteId];
      iniciarTramite(tramiteId, esNuevaApertura);
      
      // Para modo básico, setear segmento por defecto
      if (version === 'basic') {
        setSegmentacion({
          tipoTramite: 'primera-vez',
          categoria: 'adulto',
          esNaturalizado: false,
          nacionalidad: 'ecuatoriano',
        });
      }
    }
  }, [tramiteId]);

  // Saltar directamente a requisitos en modo avanzado para pasaporte
  useEffect(() => {
    if (version === 'advanced' && faseActual === 'informacion' && tramiteId !== 'licencia_conducir') {
      cambiarFase('requisitos');
    }
  }, [version, faseActual]);

  // Actualizar el índice del paso actual
  useEffect(() => {
    const faseIndex = PASOS.findIndex(
      (p) => p.toLowerCase().replace(' ', '') === faseActual
    );
    if (faseIndex !== -1) {
      setCurrentStepIndex(faseIndex);
    }
  }, [faseActual]);

  if (!tramite) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Trámite no encontrado</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleValidacionCompleta = (cumplidos: Record<string, boolean>) => {
    actualizarPrerequisitos(cumplidos);
    setTimeout(() => cambiarFase('pago'), 300);
  };

  // Renderizado de modo básico (el existente)
  if (version === 'basic') {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {/* Header */}
          <View style={[styles.header, styles.headerBasic]}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>← Volver</Text>
            </TouchableOpacity>
            <Text style={[styles.title, styles.largeTitle]}>
              {tramite.nombre}
            </Text>
            <Text style={styles.description}>{tramite.descripcion}</Text>
          </View>

          {/* Contenido básico simplificado */}
          <View style={styles.content}>
            <Text style={[styles.stepTitle, styles.largeText]}>
              🎯 Trámite simplificado
            </Text>
            <Text style={styles.stepSubtitle}>
              Te guiaremos paso a paso
            </Text>
            
            <TouchableOpacity
              style={[styles.continueButton, styles.largeContinueButton]}
              onPress={() => navigation.navigate('Chat', { version })}
            >
              <Text style={[styles.continueButtonText, styles.largeText]}>
                Comenzar
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Renderizado de modo avanzado
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Barra de progreso */}
      <ProgressBar
        currentStep={currentStepIndex + 1}
        totalSteps={PASOS.length}
        stepLabels={PASOS}
      />

      {/* Header compacto */}
      <View style={styles.headerAdvanced}>
        <View style={styles.headerContent}>
          <View style={styles.iconBox}>
            <Text style={styles.iconBoxText}>📋</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>{tramite.nombre}</Text>
            <Text style={styles.headerSubtitle}>
              Paso {currentStepIndex + 1} de {PASOS.length}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerBackButton}
        >
          <Text style={styles.headerBackButtonText}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido principal */}
      <ScrollView
        style={styles.mainContent}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        {/* Fase: Información */}
        {faseActual === 'informacion' && pasoActual && (
          <>
            <FaseContenido
              paso={pasoActual}
              estaCompletado={fasesCompletadas.includes('informacion')}
              onCompletar={() => cambiarFase('requisitos')}
            />
          </>
        )}

        {/* Fase: Requisitos con segmentación */}
        {faseActual === 'requisitos' && (
          <>
            <SegmentacionPasaporte
              onConfirm={() => {
                setTimeout(() => {
                  cambiarFase('pago');
                }, 300);
              }}
            />

            <PrerequisitosCheck
              prerequisitos={prerequisitosDinamicos}
              prerequisitosCumplidos={prerequisitosCumplidos}
              onValidacionCompleta={handleValidacionCompleta}
            />
          </>
        )}

        {/* Fase: Pago */}
        {faseActual === 'pago' && (
          <FasePago
            tramite={tramite}
            onCompletar={() => cambiarFase('seguimiento')}
          />
        )}

        {/* Fase: Seguimiento */}
        {faseActual === 'seguimiento' && (
          <FaseSeguimiento tramite={tramite} />
        )}
      </ScrollView>

      {/* Footer con navegación */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }] }>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => {
            if (currentStepIndex > 0) {
              const fases: FaseTramite[] = ['informacion', 'requisitos', 'pago', 'seguimiento'];
              cambiarFase(fases[currentStepIndex - 1]);
            } else {
              navigation.goBack();
            }
          }}
        >
          <Text style={styles.footerButtonText}>Anterior</Text>
        </TouchableOpacity>

        <Text style={styles.footerProgress}>
          {currentStepIndex + 1} / {PASOS.length}
        </Text>

        <TouchableOpacity
          style={[
            styles.footerButton,
            styles.footerButtonNext,
            currentStepIndex === PASOS.length - 1 && styles.footerButtonDisabled
          ]}
          onPress={() => {
            if (currentStepIndex < PASOS.length - 1) {
              const fases: FaseTramite[] = ['informacion', 'requisitos', 'pago', 'seguimiento'];
              cambiarFase(fases[currentStepIndex + 1]);
            }
          }}
          disabled={currentStepIndex === PASOS.length - 1}
        >
          <Text style={[
            styles.footerButtonText,
            styles.footerButtonNextText
          ]}>
            Siguiente
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerBasic: {
    backgroundColor: '#fef3c7',
  },
  headerAdvanced: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconBoxText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  headerBackButton: {
    padding: 8,
  },
  headerBackButtonText: {
    fontSize: 24,
    color: '#6b7280',
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  largeTitle: {
    fontSize: 32,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
  },
  content: {
    padding: 20,
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  largeText: {
    fontSize: 20,
  },
  continueButton: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  largeContinueButton: {
    padding: 24,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  footerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  footerButtonNext: {
    backgroundColor: '#f59e0b',
  },
  footerButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  footerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  footerButtonNextText: {
    color: '#ffffff',
  },
  footerProgress: {
    fontSize: 13,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
