# 🎤 Integración de Reconocimiento de Voz

## Descripción General

Se ha implementado la funcionalidad de **Speech-to-Text** usando la **Web Speech API** nativa del navegador, sin costos adicionales. Esta solución está optimizada para adultos mayores con feedback visual claro.

## 📁 Estructura de Archivos Creados

```
src/
├── hooks/
│   └── useVoiceRecognition.ts    # Hook personalizado para manejar la Web Speech API
└── components/
    └── Voice/
        ├── VoiceButton.tsx        # Componente visual del botón de voz
        └── index.ts               # Archivo de exportación
```

## 🔧 Componentes

### 1. **useVoiceRecognition.ts** (Hook)

Hook personalizado que encapsula toda la lógica de reconocimiento de voz:

**Características:**

- ✅ Configurado en español de Ecuador (`es-EC`)
- ✅ Usa `useRef` para evitar duplicidad de listeners
- ✅ Maneja estados: `isListening`, `transcript`, `error`
- ✅ Detecta automáticamente si el navegador soporta la API
- ✅ Resultados intermedios mientras el usuario habla
- ✅ Manejo robusto de errores

**Estados retornados:**

```typescript
{
  isListening: boolean;      // Si está escuchando actualmente
  transcript: string;        // Texto reconocido
  isSupported: boolean;      // Si el navegador soporta la API
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  error: string | null;      // Mensajes de error amigables
}
```

### 2. **VoiceButton.tsx** (Componente Visual)

Botón circular estilizado con Tailwind CSS optimizado para accesibilidad.

**Características de Accesibilidad:**

- 🔴 **Animación pulse** cuando está grabando (Tailwind's `animate-pulse`)
- 🔴 **Indicador visual adicional** (punto rojo pulsante en la esquina)
- 🔴 **Sombra brillante** roja cuando está activo
- 💬 **Preview del texto** que se está reconociendo en tiempo real
- ⚠️ **Mensajes de error** claros y visibles
- ♿ **ARIA labels** para lectores de pantalla

**Props:**

```typescript
interface VoiceButtonProps {
  onResult: (text: string) => void; // Callback con el texto reconocido
  className?: string; // Clases CSS opcionales
}
```

## 🔌 Integración en ChatInput

El componente se integró en [src/chat/ChatInput.tsx](src/chat/ChatInput.tsx):

```tsx
import { VoiceButton } from "../components/Voice";

// Handler para recibir el texto reconocido
const handleVoiceResult = (text: string) => {
  setInputValue(text);
};

// Uso en el JSX
<VoiceButton onResult={handleVoiceResult} />;
```

**Flujo de funcionamiento:**

1. Usuario hace click en el botón del micrófono
2. El botón cambia a rojo con animación pulse
3. El usuario habla
4. Se muestra el texto reconocido en tiempo real
5. Al terminar (pausa automática), el texto se inserta en el input
6. El usuario puede editarlo o enviarlo directamente

## 🌐 Compatibilidad de Navegadores

La Web Speech API está soportada en:

- ✅ **Chrome** (Desktop y Mobile)
- ✅ **Edge** (Chromium)
- ✅ **Safari** (iOS 14.5+)
- ⚠️ **Firefox** (soporte limitado)

Si el navegador no soporta la API, el botón se muestra deshabilitado con un ícono de micrófono tachado.

## 🎨 Estados Visuales

| Estado             | Apariencia                                          |
| ------------------ | --------------------------------------------------- |
| **Inactivo**       | Gris, hover con fondo suave                         |
| **Grabando**       | Rojo brillante con `animate-pulse` + punto pulsante |
| **Transcribiendo** | Muestra preview del texto en tooltip                |
| **Error**          | Mensaje rojo en tooltip                             |
| **No soportado**   | Ícono tachado, deshabilitado                        |

## 🚀 Uso en Otros Componentes

Para usar el `VoiceButton` en cualquier otro componente:

```tsx
import { VoiceButton } from "@/components/Voice";

function MyComponent() {
  const [text, setText] = useState("");

  const handleVoiceInput = (recognizedText: string) => {
    setText(recognizedText);
    // O cualquier otra lógica
  };

  return <VoiceButton onResult={handleVoiceInput} />;
}
```

## ⚙️ Configuración Avanzada

Para cambiar el idioma, edita [src/hooks/useVoiceRecognition.ts](src/hooks/useVoiceRecognition.ts):

```typescript
recognition.lang = "es-EC"; // Cambiar según necesidad
// Opciones: 'es-ES', 'es-MX', 'en-US', etc.
```

## 🔒 Permisos

La primera vez que el usuario use el micrófono, el navegador solicitará permiso. Si lo deniega, se mostrará un mensaje de error claro.

## 📝 Notas Técnicas

- **Sin dependencias externas**: 100% Web Speech API nativa
- **Sin costos**: No requiere servicios externos
- **Cleanup automático**: Los listeners se limpian correctamente al desmontar
- **Reintentos**: El usuario puede volver a intentar en cualquier momento
- **Resultados intermedios**: Muestra lo que va reconociendo en tiempo real

## 🎯 Optimización para Adultos Mayores

1. **Feedback visual prominente** con animaciones claras
2. **Tamaño de botón adecuado** (touch-friendly)
3. **Mensajes de error amigables** sin jerga técnica
4. **Preview en tiempo real** para confirmar que está escuchando
5. **Colores contrastantes** (rojo/blanco cuando está activo)

---

**¿Preguntas o mejoras?** Este sistema es extensible y puede adaptarse a futuras necesidades del proyecto INNOVaiTECH.
