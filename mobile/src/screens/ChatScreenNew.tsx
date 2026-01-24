import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { ChatBubble, TramiteInfoCard } from '../components/ui/GovlyUI';
import { SidebarDrawer } from '../components/ui/SidebarDrawer';
import { COLORS, SHADOWS, FONTS, RADIUS, SPACING, SIZES, TRAMITES_DATA } from '../constants/theme';
import { aiService } from '../services/aiService';

type Message = {
  id: number;
  text: string;
  isUser: boolean;
  tramiteId?: string;
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'ChatNew'>;
  route: RouteProp<RootStackParamList, 'ChatNew'>;
};

export function ChatScreenNew({ navigation, route }: Props) {
  const { version } = route.params;
  const insets = useSafeAreaInsets();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mode, setMode] = useState<'basic' | 'advanced'>(version);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Hola, soy Govly. ¿Qué trámite quieres gestionar hoy?', isUser: false }
  ]);
  const [activeTramite, setActiveTramite] = useState<typeof TRAMITES_DATA[number] | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = { 
      id: Date.now(), 
      text: input, 
      isUser: true 
    };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');

    // Simular respuesta (puedes integrar el aiService aquí)
    setTimeout(() => {
      let responseText = 'Puedo ayudarte con Pasaportes, Cédulas o Licencias.';
      let detectedTramite: typeof TRAMITES_DATA[number] | null = null;

      if (currentInput.toLowerCase().includes('pasaporte')) {
        responseText = 'Perfecto, te guiaré para obtener tu pasaporte. He detectado que necesitas saber dónde hacerlo. ¿Empezamos?';
        detectedTramite = TRAMITES_DATA.find(t => t.id === 'pasaporte') || null;
      } else if (currentInput.toLowerCase().includes('cédula') || currentInput.toLowerCase().includes('cedula')) {
        responseText = '¡Claro! Te ayudo con la renovación de tu cédula. ¿Empezamos?';
        detectedTramite = TRAMITES_DATA.find(t => t.id === 'cedula') || null;
      } else if (currentInput.toLowerCase().includes('licencia')) {
        responseText = 'Entendido, te ayudaré con la licencia de conducir. ¿Empezamos?';
        detectedTramite = TRAMITES_DATA.find(t => t.id === 'licencia_conducir') || null;
      }

      if (detectedTramite) {
        setActiveTramite(detectedTramite);
      }

      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: responseText, 
        isUser: false,
        tramiteId: detectedTramite?.id
      }]);
    }, 1000);
  };

  const handleModeChange = (newMode: 'basic' | 'advanced') => {
    setMode(newMode);
    setSidebarOpen(false);
    if (newMode === 'basic') {
      navigation.navigate('Home');
    }
  };

  const handleStartTramite = () => {
    if (activeTramite) {
      navigation.navigate('TramiteFlowNew', { tramiteId: activeTramite.id, version: mode });
    }
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isLastMessage = index === messages.length - 1;
    const showTramiteCard = !item.isUser && activeTramite && isLastMessage && item.tramiteId;

    return (
      <View>
        <ChatBubble message={item.text} isUser={item.isUser} />
        {showTramiteCard && (
          <View style={styles.tramiteCardContainer}>
            <TramiteInfoCard
              title={activeTramite.title}
              time={activeTramite.time}
              cost={activeTramite.cost}
              onPress={handleStartTramite}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSidebarOpen(true)} style={styles.headerButton}>
            <Text style={styles.headerIcon}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Govly 3.0</Text>
          <TouchableOpacity 
            onPress={() => handleModeChange('basic')} 
            style={styles.headerButton}
          >
            <Text style={styles.headerIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={[styles.messagesList, { paddingBottom: 20 }]}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Input */}
        <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, SPACING.base) }]}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Escribe 'Quiero mi pasaporte'..."
              placeholderTextColor={COLORS.textLight}
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />
            {input ? (
              <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                <Text style={styles.sendIcon}>➤</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.micButton}>
                <Text style={styles.micIcon}>🎤</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Sidebar */}
      <SidebarDrawer
        visible={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentMode={mode}
        onModeChange={handleModeChange}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgLight,
  },
  keyboardView: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.base,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  headerButton: {
    padding: SPACING.sm,
  },
  headerIcon: {
    fontSize: 24,
    color: COLORS.textSec,
  },
  headerTitle: {
    fontSize: SIZES.lg,
    ...FONTS.bold,
    color: COLORS.textMain,
  },

  // Messages
  messagesList: {
    padding: SPACING.base,
  },
  tramiteCardContainer: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.base,
  },

  // Input
  inputContainer: {
    padding: SPACING.base,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgLight,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: SIZES.base,
    color: COLORS.textMain,
    paddingVertical: SPACING.xs,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  sendIcon: {
    fontSize: 18,
    color: COLORS.white,
  },
  micButton: {
    padding: SPACING.xs,
  },
  micIcon: {
    fontSize: 20,
    color: COLORS.textSec,
  },
});
