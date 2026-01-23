import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { tramitesService } from '../../services/tramitesService';
import { ubicacionesService } from '../../services/ubicacionesService';
import { ConsejosTips } from '../../components/ConsejosTips';
import { TarjetaUbicacion } from '../../components/TarjetaUbicacion';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'TramiteDetalle'>;
  route: RouteProp<RootStackParamList, 'TramiteDetalle'>;
};

export function TramiteDetalleScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { tramiteId } = route.params;
  const tramite = tramitesService.getPorId(tramiteId);

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

  const ubicaciones = ubicacionesService.obtenerPorTramite(tramiteId);

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{tramite.nombre}</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner informativo */}
        <View style={styles.banner}>
          <View style={[styles.bannerSection, { borderBottomWidth: 1, borderBottomColor: '#e9ecef' }]}>
            <Text style={styles.bannerLabel}>💰 Costo</Text>
            <Text style={styles.bannerValue}>${tramite.costo?.toFixed(2) || '0.00'}</Text>
          </View>
          <View style={styles.bannerSection}>
            <Text style={styles.bannerLabel}>⏱️ Tiempo estimado</Text>
            <Text style={styles.bannerValue}>{tramite.estimadoDias} días hábiles</Text>
          </View>
        </View>

        {/* Descripción */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Descripción</Text>
          <Text style={styles.description}>{tramite.descripcion}</Text>
        </View>

        {/* Requisitos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✓ Requisitos ({tramite.prerequisitos.length})</Text>
          <View style={styles.requisitosList}>
            {tramite.prerequisitos.map((req, index) => (
              <View key={req.id} style={styles.requisitoItem}>
                <View style={styles.requisitoNumber}>
                  <Text style={styles.requisitoNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.requisitoContent}>
                  <Text style={styles.requisitoName}>{req.nombre}</Text>
                  {req.descripcion && (
                    <Text style={styles.requisitoDescripcion}>{req.descripcion}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Pasos del proceso */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Pasos del proceso</Text>
          <View style={styles.pasosList}>
            {tramite.pasos.map((paso: any, index: number) => (
              <View key={paso.id || index} style={styles.pasoItem}>
                <View style={styles.pasoNumber}>
                  <Text style={styles.pasoNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.pasoText}>
                  {typeof paso === 'string' ? paso : paso.titulo || paso.nombre || 'Paso'}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Ubicaciones */}
        {ubicaciones.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📍 Dónde hacerlo</Text>
            <TarjetaUbicacion ubicaciones={ubicaciones} />
          </View>
        )}

        {/* Consejos útiles */}
        <ConsejosTips
          type="info"
          title="💡 Consejos útiles"
          consejos={[
            'Prepara todos los requisitos antes de comenzar',
            'Ten copias de los documentos originales',
            'Lleva los documentos en orden',
            'Llega con anticipación a tu cita',
          ]}
        />

        {/* Botón para comenzar */}
        <TouchableOpacity
          style={styles.startButton}
          onPress={() =>
            navigation.navigate('TramiteFlow', {
              tramiteId: tramite.id,
              version: 'advanced',
            })
          }
        >
          <Text style={styles.startButtonText}>Comenzar trámite →</Text>
        </TouchableOpacity>

        {/* Info adicional */}
        <ConsejosTips
          type="success"
          title="✨ Información importante"
          consejos={[
            '¿Preguntas? Usa el chat para hablar con un asesor',
            'Guarda confirmaciones de todos tus movimientos',
            'Recuerda que los plazos son aproximados',
          ]}
        />
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
  },
  backButton: {
    paddingVertical: 8,
    marginBottom: 8,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1f2937',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  banner: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginVertical: 14,
    borderRadius: 12,
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    overflow: 'hidden',
  },
  bannerSection: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  bannerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  bannerValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#3b82f6',
  },
  section: {
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  requisitosList: {
    gap: 10,
  },
  requisitoItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#ecfdf5',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
    gap: 12,
    alignItems: 'flex-start',
  },
  requisitoNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  requisitoNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  requisitoContent: {
    flex: 1,
  },
  requisitoName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  requisitoDescripcion: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  pasosList: {
    gap: 10,
  },
  pasoItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#dbeafe',
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    gap: 12,
    alignItems: 'center',
  },
  pasoNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pasoNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  pasoText: {
    flex: 1,
    fontSize: 13,
    color: '#1f2937',
    fontWeight: '500',
  },
  startButton: {
    marginHorizontal: 12,
    marginVertical: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#3b82f6',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
});
