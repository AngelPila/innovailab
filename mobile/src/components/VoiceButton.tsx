import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Alert } from 'react-native';
import * as Speech from 'expo-speech';

type Props = {
  isRecording: boolean;
  onToggleRecording: () => void;
  onTranscript: (text: string) => void;
  version: 'basic' | 'advanced';
};

export function VoiceButton({ isRecording, onToggleRecording, onTranscript, version }: Props) {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    checkVoiceSupport();
  }, []);

  const checkVoiceSupport = async () => {
    // En Expo, la funcionalidad de reconocimiento de voz requiere expo-speech
    // Para reconocimiento de voz real, necesitarías una API externa o un módulo nativo
    setIsSupported(true);
  };

  const handlePress = async () => {
    if (!isSupported) {
      Alert.alert(
        'No disponible',
        'El reconocimiento de voz no está disponible en tu dispositivo'
      );
      return;
    }

    if (isRecording) {
      // Simular finalización de grabación
      // En producción, aquí procesarías el audio grabado
      const mockTranscript = 'Quiero obtener mi pasaporte';
      onTranscript(mockTranscript);
      Alert.alert(
        'Nota',
        'En la versión completa, aquí se procesará el audio real. Por ahora es una demostración.'
      );
    }

    onToggleRecording();
  };

  const size = version === 'basic' ? 56 : 44;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { width: size, height: size, borderRadius: size / 2 },
        isRecording ? styles.recording : styles.idle,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text style={styles.icon}>{isRecording ? '⏹' : '🎤'}</Text>
      {isRecording && version === 'basic' && (
        <View style={styles.pulseBasic} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  idle: {
    backgroundColor: '#3b82f6',
  },
  recording: {
    backgroundColor: '#ef4444',
  },
  icon: {
    fontSize: 24,
  },
  pulseBasic: {
    position: 'absolute',
    width: '120%',
    height: '120%',
    borderRadius: 100,
    backgroundColor: '#ef4444',
    opacity: 0.3,
  },
});
