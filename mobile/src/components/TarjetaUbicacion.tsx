import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';

interface Ubicacion {
  id: string;
  nombre: string;
  direccion: string;
  ciudad: string;
  telefono?: string;
  horario?: string;
  distancia?: number;
}

interface Props {
  ubicaciones: Ubicacion[];
  titulo?: string;
}

export function TarjetaUbicacion({ ubicaciones, titulo = 'Ubicaciones disponibles' }: Props) {
  const handleLlamar = (telefono?: string) => {
    if (telefono) {
      Linking.openURL(`tel:${telefono}`).catch(() => {
        console.log('No se puede llamar');
      });
    }
  };

  if (ubicaciones.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>📍</Text>
        <Text style={styles.titulo}>{titulo}</Text>
      </View>

      {ubicaciones.map((ubicacion, index) => (
        <View
          key={ubicacion.id}
          style={[
            styles.ubicacionCard,
            index !== ubicaciones.length - 1 && styles.ubicacionCardNotLast,
          ]}
        >
          <View style={styles.ubicacionHeader}>
            <View style={styles.ubicacionMainInfo}>
              <Text style={styles.ubicacionNombre}>{ubicacion.nombre}</Text>
              {ubicacion.distancia && (
                <Text style={styles.ubicacionDistancia}>
                  {ubicacion.distancia.toFixed(1)} km
                </Text>
              )}
            </View>
          </View>

          <View style={styles.ubicacionDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>🏢</Text>
              <Text style={styles.detailText}>{ubicacion.direccion}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>🏙️</Text>
              <Text style={styles.detailText}>{ubicacion.ciudad}</Text>
            </View>

            {ubicacion.horario && (
              <View style={styles.detailItem}>
                <Text style={styles.detailIcon}>🕐</Text>
                <Text style={styles.detailText}>{ubicacion.horario}</Text>
              </View>
            )}

            {ubicacion.telefono && (
              <TouchableOpacity
                style={styles.detailItem}
                onPress={() => handleLlamar(ubicacion.telefono)}
              >
                <Text style={styles.detailIcon}>📞</Text>
                <Text style={[styles.detailText, styles.telefonoLink]}>
                  {ubicacion.telefono}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingHorizontal: 16,
  },
  icon: {
    fontSize: 24,
    marginRight: 10,
  },
  titulo: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1f2937',
  },
  ubicacionCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0284c7',
    padding: 14,
    marginHorizontal: 12,
    marginBottom: 12,
  },
  ubicacionCardNotLast: {
    marginBottom: 12,
  },
  ubicacionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ubicacionMainInfo: {
    flex: 1,
  },
  ubicacionNombre: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0c4a6e',
    marginBottom: 4,
  },
  ubicacionDistancia: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0284c7',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  ubicacionDetails: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 10,
    marginTop: 2,
  },
  detailText: {
    flex: 1,
    fontSize: 13,
    color: '#0c4a6e',
    fontWeight: '500',
    lineHeight: 20,
  },
  telefonoLink: {
    color: '#0284c7',
    textDecorationLine: 'underline',
  },
});
