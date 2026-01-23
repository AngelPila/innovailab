import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import type { Tramite } from '../types/tramite.types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  tramite: Tramite;
  onCompletar: () => void;
}

export function FasePago({ tramite, onCompletar }: Props) {
  const costoBase = tramite.costo || 0;
  const insets = useSafeAreaInsets();

  const obtenerInfoPago = (tramiteId: string) => {
    const infoMap: Record<string, any> = {
      'obtener_pasaporte': {
        title: 'Pago de Pasaporte',
        cost: costoBase,
        locations: [
          {
            name: 'Registro Civil - Sede Principal',
            address: 'Av. 10 de Agosto y Esmeraldas, Quito',
            phone: '1-800-11-2929',
          },
          {
            name: 'Banco del Pacífico',
            address: 'Múltiples sucursales',
            phone: '1-800-222-000',
          },
        ],
        onlineUrl: 'https://www.registrocivil.gob.ec/',
        instructions: [
          'El pago se realiza en efectivo o transferencia',
          'Presenta el comprobante al retirar tu pasaporte',
          'El costo incluye emisión y trámites',
        ]
      },
      'renovacion_cedula': {
        title: 'Pago de Renovación de Cédula',
        cost: costoBase,
        locations: [
          {
            name: 'Registro Civil',
            address: 'Av. 10 de Agosto y Esmeraldas, Quito',
            phone: '1-800-11-2929',
          },
        ],
        onlineUrl: 'https://www.registrocivil.gob.ec/',
        instructions: [
          'La primera emisión es gratuita',
          'Las renovaciones tienen costo administrativo',
          'Guarda el comprobante de pago',
        ]
      },
    };

    return infoMap[tramiteId] || {
      title: 'Información de Pago',
      cost: costoBase,
      locations: [],
      onlineUrl: 'https://www.registrocivil.gob.ec/',
      instructions: ['Comunícate con la institución para información de pago']
    };
  };

  const infoPago = obtenerInfoPago(tramite.id);

  const handleOpenUrl = (url: string) => {
    Linking.openURL(url).catch(err => console.error('Error al abrir URL:', err));
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.icon}>💰</Text>
          <View style={styles.headerText}>
            <Text style={styles.title}>{infoPago.title}</Text>
            <Text style={styles.subtitle}>
              Aquí está la información sobre cómo realizar el pago
            </Text>
          </View>
        </View>

        {/* Costo Total */}
        <View style={styles.costoSection}>
          <Text style={styles.costoLabel}>Costo Total</Text>
          <Text style={styles.costoValue}>${infoPago.cost.toFixed(2)}</Text>
        </View>

        {/* Instrucciones */}
        {infoPago.instructions && infoPago.instructions.length > 0 && (
          <View style={styles.instructionsSection}>
            <Text style={styles.sectionTitle}>📋 Instrucciones de Pago</Text>
            {infoPago.instructions.map((instruction: string, idx: number) => (
              <View key={idx} style={styles.instructionItem}>
                <Text style={styles.instructionBullet}>•</Text>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Pago en línea */}
        {infoPago.onlineUrl && (
          <View style={styles.onlineSection}>
            <Text style={styles.sectionTitle}>🌐 Pago en Línea</Text>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => handleOpenUrl(infoPago.onlineUrl)}
            >
              <Text style={styles.linkButtonText}>Ir al sitio web oficial →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Ubicaciones */}
        {infoPago.locations && infoPago.locations.length > 0 && (
          <View style={styles.locationsSection}>
            <Text style={styles.sectionTitle}>📍 Lugares de Pago</Text>
            {infoPago.locations.map((location: any, idx: number) => (
              <View key={idx} style={styles.locationCard}>
                <Text style={styles.locationName}>{location.name}</Text>
                <Text style={styles.locationDetail}>📍 {location.address}</Text>
                {location.phone && (
                  <Text style={styles.locationDetail}>📞 {location.phone}</Text>
                )}
                {location.hours && (
                  <Text style={styles.locationDetail}>⏰ {location.hours}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Botón continuar */}
        <TouchableOpacity
          style={styles.continuarButton}
          onPress={onCompletar}
        >
          <Text style={styles.continuarButtonText}>
            Continuar al seguimiento →
          </Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  icon: {
    fontSize: 36,
    marginRight: 14,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  costoSection: {
    backgroundColor: 'linear-gradient(135deg, #dcfce7 0%, #d1fae5 100%)',
    padding: 24,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#22c55e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  costoLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#16a34a',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  costoValue: {
    fontSize: 42,
    fontWeight: '900',
    color: '#15803d',
  },
  instructionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  instructionBullet: {
    fontSize: 18,
    color: '#3b82f6',
    marginRight: 10,
    marginTop: 2,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  onlineSection: {
    marginBottom: 24,
  },
  linkButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  linkButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  locationsSection: {
    marginBottom: 24,
  },
  locationCard: {
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#0284c7',
  },
  locationName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0c4a6e',
    marginBottom: 10,
  },
  locationDetail: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 6,
    fontWeight: '500',
  },
  continuarButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  continuarButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});
