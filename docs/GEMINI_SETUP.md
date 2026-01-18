# 🤖 Gemini AI - Guía de Configuración

## ✅ La IA está integrada

El chatbot ahora usa **Google Gemini** para conversaciones inteligentes.

## 🔑 Obtener tu API Key GRATIS

### Paso 1: Ir al sitio de Google AI Studio
1. Abre tu navegador
2. Ve a: **https://makersuite.google.com/app/apikey**
3. Inicia sesión con tu cuenta de Google

### Paso 2: Crear API Key
1. Haz clic en el botón **"Create API Key"**
2. Selecciona tu proyecto de Google Cloud (o crea uno nuevo)
3. Copia la API key que te aparece

### Paso 3: Configurar en el proyecto
1. En la raíz del proyecto, crea un archivo llamado `.env`
2. Copia el contenido de `.env.example`
3. Reemplaza `tu_api_key_aqui` con tu API key real:

```env
VITE_GEMINI_API_KEY=TuApiKeyAquiPegada123456789
```

4. Guarda el archivo
5. Reinicia el servidor:
```bash
npm run dev
```

## 🎯 ¿Cómo saber si funciona?

Cuando inicies el servidor, verás en la consola:
- ✅ `Gemini AI inicializado correctamente` → Funciona perfecto
- ⚠️ `VITE_GEMINI_API_KEY no está configurada...` → Falta configurar

## 🆓 Límites Gratuitos

Gemini ofrece un tier **GRATIS** muy generoso:
- **60 requests por minuto**
- **Gratis para siempre**
- Sin tarjeta de crédito requerida
- Perfecto para desarrollo y producción pequeña/mediana

## 🔒 Seguridad

- ✅ El archivo `.env` está en `.gitignore` (no se sube a GitHub)
- ✅ Nunca compartas tu API key públicamente
- ✅ Si la expones accidentalmente, regenera una nueva en Google AI Studio

## 🚀 Funcionalidades con IA

Con Gemini activado, el chatbot puede:
- ✅ Entender preguntas en lenguaje natural
- ✅ Detectar automáticamente qué trámite necesitas
- ✅ Responder preguntas sobre requisitos, costos, tiempos
- ✅ Mantener contexto de la conversación
- ✅ Adaptar el lenguaje para adultos mayores

## 📝 Modo Sin IA (Fallback)

Si no configuras la API key, el chatbot funcionará en **modo básico**:
- Detecta trámites por palabras clave simples
- Respuestas predefinidas
- Sin contexto conversacional
- Funcional pero limitado

## ❓ Problemas Comunes

### "No veo el mensaje de IA inicializada"
- Verifica que el archivo se llame exactamente `.env` (no `.env.txt`)
- Asegúrate de que la key no tenga espacios al inicio/final
- Reinicia el servidor con `npm run dev`

### "Error 429: Too Many Requests"
- Superaste el límite de 60 requests/minuto
- Espera 1 minuto y vuelve a intentar
- Para producción, considera implementar rate limiting

### "Error 401: Invalid API Key"
- Tu API key es incorrecta
- Ve a Google AI Studio y genera una nueva
- Cópiala correctamente en `.env`

## 🎓 Recursos Adicionales

- [Documentación de Gemini](https://ai.google.dev/docs)
- [Gemini API Quickstart](https://ai.google.dev/tutorials/get_started_web)
- [Precios y Límites](https://ai.google.dev/pricing)

---

**¡Listo!** Una vez configurada la API key, tu chatbot tendrá conversaciones naturales e inteligentes. 🚀
