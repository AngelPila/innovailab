import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { tramitesService } from '../services/tramitesService';
import { useTramiteStore } from '../store/tramiteStore';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'TramiteFlow'>;
  route: RouteProp<RootStackParamList, 'TramiteFlow'>;
};

export function TramiteFlowScreen({ navigation, route }: Props) {
  const { tramiteId, version } = route.params;
  const tramite = tramitesService.getPorId(tramiteId);
  const { iniciarTramite, setSegmentacion } = useTramiteStore();
  const [paso, setPaso] = useState<'requisitos' | 'pago' | 'completado'>('requisitos');
  const [prerequisitos, setPrerequisitos] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (tramite) {
      iniciarTramite(tramiteId, true);
      
      // Setear segmento por defecto para modo básico
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

  const handleTogglePrerequisito = (id: string) => {
    setPrerequisitos(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleContinuar = () => {
    if (paso === 'requisitos') {
      setPaso('pago');
    } else if (paso === 'pago') {
      setPaso('completado');
    }
  };

  const requisitosBase = tramite.prerequisitos.slice(0, 3); // Primeros 3 requisitos
  const todosCompletos = requisitosBase.every(req => prerequisitos[req.id]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={[
          styles.header,
          version === 'basic' ? styles.headerBasic : styles.headerAdvanced
        ]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>← Volver</Text>
          </TouchableOpacity>
          <Text style={[
            styles.title,
            version === 'basic' && styles.largeTitle
          ]}>
            {tramite.nombre}
          </Text>
          <Text style={styles.description}>{tramite.descripcion}</Text>
        </View>

        {/* Contenido según paso */}
        <View style={styles.content}>
          {paso === 'requisitos' && (
            <View>
              <Text style={[
                styles.stepTitle,
                version === 'basic' && styles.largeText
              ]}>
                📋 Verifica tus requisitos
              </Text>
              <Text style={styles.stepSubtitle}>
                Marca los documentos que ya tienes:
              </Text>

              {requisitosBase.map(req => (
                <TouchableOpacity
                  key={req.id}
                  style={[
                    styles.requisito,
                    prerequisitos[req.id] && styles.requisitoCompleto,
                    version === 'basic' && styles.requisitoBasic
                  ]}
                  onPress={() => handleTogglePrerequisito(req.id)}
                >
                  <Text style={[
                    styles.requisitoIcon,
                    version === 'basic' && styles.largeIcon
                  ]}>
                    {prerequisitos[req.id] ? '✅' : '⬜'}
                  </Text>
                  <Text style={[
                    styles.requisitoText,
                    version === 'basic' && styles.largeText
                  ]}>
                    {req.nombre}
                  </Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={[
                  styles.continueButton,
                  version === 'basic' && styles.largeContinueButton,
                  !todosCompletos && styles.disabledButton
                ]}
                onPress={handleContinuar}
                disabled={!todosCompletos}
              >
                <Text style={[
                  styles.continueButtonText,
                  version === 'basic' && styles.largeText
                ]}>
                  Continuar al pago →
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {paso === 'pago' && (
            <View>
              <Text style={[
                styles.stepTitle,
                version === 'basic' && styles.largeText
              ]}>
                💳 Información de Pago
              </Text>
              <View style={styles.infoCard}>
                <Text style={[styles.infoLabel, version === 'basic' && styles.largeText]}>
                  Costo del trámite:
                </Text>
                <Text style={[styles.infoValue, version === 'basic' && styles.largeText]}>
                  ${tramite.costo?.toFixed(2) || '0.00'}
                </Text>
              </View>
              <View style={styles.infoCard}>
                <Text style={[styles.infoLabel, version === 'basic' && styles.largeText]}>
                  Tiempo estimado:
                </Text>
                <Text style={[styles.infoValue, version === 'basic' && styles.largeText]}>
                  {tramite.estimadoDias || 'N/A'} días hábiles
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.continueButton,
                  version === 'basic' && styles.largeContinueButton
                ]}
                onPress={handleContinuar}
              >
                <Text style={[
                  styles.continueButtonText,
                  version === 'basic' && styles.largeText
                ]}>
                  Confirmar →
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {paso === 'completado' && (
            <View style={styles.completadoContainer}>
              <Text style={styles.completadoEmoji}>✅</Text>
              <Text style={[
                styles.completadoTitle,
                version === 'basic' && styles.largeTitle
              ]}>
                ¡Listo!
              </Text>
              <Text style={[
                styles.completadoText,
                version === 'basic' && styles.largeText
              ]}>
                Has completado la solicitud de {tramite.nombre}
              </Text>
              <TouchableOpacity
                style={[
                  styles.continueButton,
                  version === 'basic' && styles.largeContinueButton
                ]}
                onPress={() => navigation.navigate('Chat', { version })}
              >
                <Text style={[
                  styles.continueButtonText,
                  version === 'basic' && styles.largeText
                ]}>
                  Volver al chat
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
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
    backgroundColor: '#dbeafe',
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
  requisito: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    marginBottom: 12,
  },
  requisitoBasic: {
    padding: 20,
  },
  requisitoCompleto: {
    borderColor: '#10b981',
    backgroundColor: '#d1fae5',
  },
  requisitoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  largeIcon: {
    fontSize: 32,
  },
  requisitoText: {
    fontSize: 16,
    color: '#1f2937',
    flex: 1,
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
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  completadoContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  completadoEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  completadoTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  completadoText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 30,
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
