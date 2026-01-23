import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { aiService } from '../services/aiService';
import { tramitesService } from '../services/tramitesService';
import { VoiceButton } from '../components/VoiceButton';

type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  tramiteId?: string;
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Chat'>;
  route: RouteProp<RootStackParamList, 'Chat'>;
};

export function ChatScreen({ navigation, route }: Props) {
  const { version } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Mensaje de bienvenida
    const welcomeMessage: Message = {
      id: Date.now(),
      role: 'assistant',
      content: version === 'basic'
        ? '¡Hola! Soy tu asistente. ¿En qué trámite te puedo ayudar hoy?'
        : '¡Hola! Soy Gobot, tu asistente gubernamental. ¿Qué trámite necesitas realizar?',
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: inputValue,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    try {
      const respuestaIA = await aiService.sendMessage(inputValue);
      const tramiteDetectado = aiService.detectarTramiteEnRespuesta(respuestaIA);

      if (tramiteDetectado) {
        const tramiteInfo = tramitesService.getPorId(tramiteDetectado);
        const assistantMessage: Message = {
          id: Date.now() + 1,
          role: 'assistant',
          content: tramiteInfo
            ? `¡Excelente! Te ayudaré con ${tramiteInfo.nombre}. Toca aquí para comenzar.`
            : 'Detecté tu trámite. Toca aquí para comenzar.',
          tramiteId: tramiteDetectado,
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const assistantMessage: Message = {
          id: Date.now() + 1,
          role: 'assistant',
          content: aiService.limpiarRespuesta(respuestaIA),
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Lo siento, hubo un error. Por favor intenta de nuevo.',
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    // Scroll al final
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleVoiceTranscript = (transcript: string) => {
    setInputValue(transcript);
  };

  const handleMessagePress = (message: Message) => {
    if (message.tramiteId) {
      navigation.navigate('TramiteFlow', {
        tramiteId: message.tramiteId,
        version,
      });
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';
    const isClickable = !!item.tramiteId;

    return (
      <TouchableOpacity
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.assistantMessage,
        ]}
        onPress={() => handleMessagePress(item)}
        disabled={!isClickable}
        activeOpacity={isClickable ? 0.7 : 1}
      >
        <Text
          style={[
            styles.messageText,
            isUser ? styles.userText : styles.assistantText,
            version === 'basic' && styles.largeText,
          ]}
        >
          {item.content}
        </Text>
        {isClickable && (
          <Text style={styles.clickableHint}>👆 Toca para continuar</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <View style={[
          styles.header,
          version === 'basic' ? styles.headerBasic : styles.headerAdvanced
        ]}>
          <Text style={[
            styles.headerTitle,
            version === 'basic' && styles.largeText
          ]}>
            {version === 'basic' ? 'Tu Asistente' : 'Gobot - Asistente Gubernamental'}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>← Cambiar modo</Text>
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              version === 'basic' && styles.largeInput
            ]}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder={version === 'basic' ? 'Escribe aquí...' : 'Escribe tu mensaje...'}
            placeholderTextColor="#9ca3af"
            multiline
            maxLength={500}
          />
          <VoiceButton
            isRecording={isRecording}
            onToggleRecording={() => setIsRecording(!isRecording)}
            onTranscript={handleVoiceTranscript}
            version={version}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              version === 'basic' && styles.largeSendButton
            ]}
            onPress={handleSend}
          >
            <Text style={styles.sendButtonText}>
              {version === 'basic' ? '📤' : '➤'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerBasic: {
    backgroundColor: '#fef3c7',
  },
  headerAdvanced: {
    backgroundColor: '#dbeafe',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  backButton: {
    marginTop: 8,
  },
  backButtonText: {
    color: '#3b82f6',
    fontSize: 14,
  },
  messagesList: {
    padding: 16,
    gap: 12,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#3b82f6',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  messageText: {
    fontSize: 16,
  },
  userText: {
    color: '#ffffff',
  },
  assistantText: {
    color: '#1f2937',
  },
  largeText: {
    fontSize: 20,
  },
  clickableHint: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  largeInput: {
    fontSize: 18,
    paddingVertical: 14,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeSendButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
