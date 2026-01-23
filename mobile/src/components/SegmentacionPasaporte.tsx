import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTramiteStore } from '../store/tramiteStore';
import type { Nacionalidad, TipoTramitePasaporte, CategoriaSolicitante, EstatusLegal } from '../types/tramite.types';

interface Props {
  onConfirm?: () => void;
}

export function SegmentacionPasaporte({ onConfirm }: Props) {
  const { setSegmentacion } = useTramiteStore();
  const [paso, setPaso] = useState<number>(1);
  
  // Respuestas
  const [nacionalidad, setNacionalidad] = useState<Nacionalidad | null>(null);
  const [esNaturalizado, setEsNaturalizado] = useState<boolean | null>(null);
  const [estatusLegal, setEstatusLegal] = useState<EstatusLegal | null>(null);
  const [tipoTramite, setTipoTramite] = useState<TipoTramitePasaporte | null>(null);
  const [categoria, setCategoria] = useState<CategoriaSolicitante | null>(null);
  const [tieneDiscapacidad, setTieneDiscapacidad] = useState<boolean>(false);

  const handleContinuar = () => {
    setSegmentacion({
      nacionalidad: nacionalidad || undefined,
      esNaturalizado: esNaturalizado || undefined,
      estatusLegal: estatusLegal || undefined,
      tipoTramite: tipoTramite || undefined,
      categoria: categoria || undefined,
      tieneDiscapacidad,
      edadAproximada: categoria === 'adulto-mayor' ? 65 : categoria === 'menor-edad' ? 15 : 35,
    });
    
    if (onConfirm) onConfirm();
  };

  // Paso 1: Nacionalidad
  if (paso === 1) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.icon}>🏴</Text>
            <View style={styles.headerText}>
              <Text style={styles.title}>¿Cuál es tu nacionalidad?</Text>
              <Text style={styles.subtitle}>Esto nos ayuda a guiarte mejor</Text>
            </View>
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => { setNacionalidad('ecuatoriano'); setPaso(2); }}
            >
              <View style={styles.optionContent}>
                <Text style={styles.optionIcon}>🇪🇨</Text>
                <Text style={styles.optionText}>Soy ecuatoriano</Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => { setNacionalidad('extranjero'); setPaso(3); }}
            >
              <View style={styles.optionContent}>
                <Text style={styles.optionIcon}>🌍</Text>
                <Text style={styles.optionText}>Soy extranjero</Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  // Paso 2: Naturalización
  if (paso === 2 && nacionalidad === 'ecuatoriano') {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.icon}>📋</Text>
            <View style={styles.headerText}>
              <Text style={styles.title}>¿Cómo obtuviste la nacionalidad?</Text>
              <Text style={styles.subtitle}>Queremos asegurarnos de darte los pasos correctos</Text>
            </View>
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => { setEsNaturalizado(false); setPaso(4); }}
            >
              <View style={styles.optionContentColumn}>
                <Text style={styles.optionTextBold}>Por nacimiento</Text>
                <Text style={styles.optionSubtext}>Nací en Ecuador o mis padres son ecuatorianos</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => { setEsNaturalizado(true); setPaso(4); }}
            >
              <View style={styles.optionContentColumn}>
                <Text style={styles.optionTextBold}>Por naturalización</Text>
                <Text style={styles.optionSubtext}>Obtuve la nacionalidad siendo extranjero</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  // Paso 3: Estatus legal
  if (paso === 3 && nacionalidad === 'extranjero') {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.icon}>⚠️</Text>
            <View style={styles.headerText}>
              <Text style={styles.title}>¿Cuál es tu situación en Ecuador?</Text>
              <Text style={styles.subtitle}>Necesitamos saber tu estatus migratorio</Text>
            </View>
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => { setEstatusLegal('residente-legal'); setPaso(4); }}
            >
              <View style={styles.optionContentColumn}>
                <Text style={styles.optionTextBold}>✅ Tengo residencia legal</Text>
                <Text style={styles.optionSubtext}>Visa de trabajo, residencia temporal o permanente</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => { setEstatusLegal('turistico'); setPaso(4); }}
            >
              <View style={styles.optionContentColumn}>
                <Text style={styles.optionTextBold}>🎫 Estoy de turista</Text>
                <Text style={styles.optionSubtext}>Tengo visa de turista o estoy de visita</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => { setEstatusLegal('refugiado'); setPaso(4); }}
            >
              <View style={styles.optionContentColumn}>
                <Text style={styles.optionTextBold}>🛡️ Soy refugiado o solicitante de asilo</Text>
                <Text style={styles.optionSubtext}>Tengo estatus de refugiado o lo estoy solicitando</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  // Paso 4: Tipo de trámite
  if (paso === 4) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.icon}>📝</Text>
            <View style={styles.headerText}>
              <Text style={styles.title}>¿Qué tipo de trámite necesitas?</Text>
              <Text style={styles.subtitle}>Selecciona tu situación</Text>
            </View>
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => { setTipoTramite('primera-vez'); setPaso(5); }}
            >
              <View style={styles.optionContentColumn}>
                <Text style={styles.optionTextBold}>Primera vez</Text>
                <Text style={styles.optionSubtext}>Nunca he tenido pasaporte</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => { setTipoTramite('renovacion'); setPaso(5); }}
            >
              <View style={styles.optionContentColumn}>
                <Text style={styles.optionTextBold}>Renovación</Text>
                <Text style={styles.optionSubtext}>Mi pasaporte está por vencer o ya venció</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => { setTipoTramite('perdida'); setPaso(5); }}
            >
              <View style={styles.optionContentColumn}>
                <Text style={styles.optionTextBold}>Pérdida o robo</Text>
                <Text style={styles.optionSubtext}>Perdí mi pasaporte o me lo robaron</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  // Paso 5: Categoría
  if (paso === 5) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.icon}>👤</Text>
            <View style={styles.headerText}>
              <Text style={styles.title}>¿En qué categoría te encuentras?</Text>
              <Text style={styles.subtitle}>Selecciona la que mejor te describa</Text>
            </View>
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => { setCategoria('menor-edad'); setPaso(6); }}
            >
              <View style={styles.optionContentColumn}>
                <Text style={styles.optionTextBold}>Menor de edad</Text>
                <Text style={styles.optionSubtext}>Menor de 18 años</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => { setCategoria('adulto'); setPaso(6); }}
            >
              <View style={styles.optionContentColumn}>
                <Text style={styles.optionTextBold}>Adulto</Text>
                <Text style={styles.optionSubtext}>Entre 18 y 64 años</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => { setCategoria('adulto-mayor'); setPaso(6); }}
            >
              <View style={styles.optionContentColumn}>
                <Text style={styles.optionTextBold}>Adulto mayor</Text>
                <Text style={styles.optionSubtext}>65 años o más</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  // Paso 6: Discapacidad
  if (paso === 6) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.icon}>♿</Text>
            <View style={styles.headerText}>
              <Text style={styles.title}>¿Tienes alguna discapacidad?</Text>
              <Text style={styles.subtitle}>Esto nos ayuda a brindarte mejor servicio</Text>
            </View>
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => { setTieneDiscapacidad(false); handleContinuar(); }}
            >
              <Text style={styles.optionTextBold}>No</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => { setTieneDiscapacidad(true); handleContinuar(); }}
            >
              <Text style={styles.optionTextBold}>Sí</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  return null;
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
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
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionContentColumn: {
    flex: 1,
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  optionTextBold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  optionSubtext: {
    fontSize: 13,
    color: '#6b7280',
  },
  arrow: {
    fontSize: 20,
    color: '#9ca3af',
  },
});
