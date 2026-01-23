# InnovaiLab Mobile - React Native

Aplicación móvil de asistente gubernamental construida con React Native y Expo.

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 18+
- Expo CLI
- Expo Go app (iOS/Android) para testing

### Instalación

```bash
cd mobile
npm install
```

### Ejecutar en Desarrollo

```bash
# Iniciar servidor de desarrollo
npm start

# Ejecutar en iOS (requiere macOS)
npm run ios

# Ejecutar en Android
npm run android

# Ejecutar en web
npm run web
```

### Escanear QR con Expo Go
1. Instala Expo Go en tu teléfono desde App Store o Play Store
2. Ejecuta `npm start`
3. Escanea el código QR con la app Expo Go

## 📱 Características

### Modo Básico
- Interfaz simplificada para adultos mayores
- Textos y botones grandes
- Navegación paso a paso
- Integración de voz

### Modo Avanzado
- Interfaz completa con todas las funciones
- Navegación rápida entre trámites
- Vistas detalladas

## 🏗️ Estructura del Proyecto

```
mobile/
├── src/
│   ├── components/       # Componentes reutilizables
│   │   └── VoiceButton.tsx
│   ├── navigation/       # Configuración de navegación
│   │   └── AppNavigator.tsx
│   ├── screens/          # Pantallas principales
│   │   ├── InterfaceSelectionScreen.tsx
│   │   ├── ChatScreen.tsx
│   │   └── TramiteFlowScreen.tsx
│   ├── services/         # Servicios (AI, trámites, etc.)
│   ├── store/            # Estado global (Zustand)
│   ├── types/            # Definiciones de tipos TypeScript
│   └── data/             # Datos estáticos (catálogos)
├── App.tsx               # Punto de entrada
└── package.json
```

## 🔧 Tecnologías Utilizadas

- **React Native** - Framework móvil
- **Expo** - Plataforma de desarrollo
- **TypeScript** - Tipado estático
- **React Navigation** - Navegación entre pantallas
- **Zustand** - Gestión de estado
- **Axios** - Peticiones HTTP
- **Expo Speech** - Síntesis de voz

## 📦 Diferencias con la Versión Web

### Componentes Migrados
- ✅ Selección de interfaz (Básica/Avanzada)
- ✅ Chat con IA
- ✅ Flujo de trámites simplificado
- ✅ Botón de voz
- ✅ Stores y servicios

### Funcionalidades Adaptadas
- UI adaptada a React Native (View, Text, TouchableOpacity)
- Navegación con React Navigation en lugar de estado local
- Estilos con StyleSheet en lugar de Tailwind CSS
- Input de voz adaptado a capacidades móviles

### Pendientes de Implementación
- 🔄 Mapas integrados
- 🔄 Múltiples pestañas de trámites
- 🔄 Integración completa de reconocimiento de voz
- 🔄 Notificaciones push
- 🔄 Almacenamiento offline

## 🔑 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto mobile:

```env
EXPO_PUBLIC_API_URL=https://your-api-url.com
EXPO_PUBLIC_GEMINI_API_KEY=your-gemini-key
```

## 🚢 Build y Deploy

### Build de Desarrollo
```bash
expo build:android
expo build:ios
```

### Build de Producción con EAS
```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Configurar proyecto
eas build:configure

# Build para Android
eas build --platform android

# Build para iOS
eas build --platform ios
```

## 📄 Licencia

MIT

## 👥 Contribuciones

Para contribuir al proyecto móvil, sigue los mismos lineamientos que el proyecto web principal.
