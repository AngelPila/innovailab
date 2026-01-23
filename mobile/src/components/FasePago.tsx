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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  costoSection: {
    backgroundColor: '#d1fae5',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  costoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#065f46',
    marginBottom: 4,
  },
  costoValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  instructionsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  instructionBullet: {
    fontSize: 16,
    color: '#3b82f6',
    marginRight: 8,
    marginTop: 2,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  onlineSection: {
    marginBottom: 20,
  },
  linkButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  linkButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  locationsSection: {
    marginBottom: 20,
  },
  locationCard: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  locationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  locationDetail: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },
  continuarButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continuarButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
