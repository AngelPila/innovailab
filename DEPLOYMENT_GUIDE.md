# 🚀 Deployment & Compilation Guide

## Pre-Deployment Checklist

- [x] Código compilado sin errores
- [x] TypeScript validado (100% tipado)
- [x] Componentes testeados
- [x] Documentación completa
- [ ] **SIGUIENTE**: Compilación y distribución

---

## 📦 Pasos de Compilación

### 1. Preparar Ambiente (Si es necesario)
```bash
cd mobile
npm install
# o
yarn install
```

### 2. Validar que No hay Errores
```bash
# TypeScript check
npm run type-check
# o
npx tsc --noEmit
```

### 3. Compilar para Android (si aplica)
```bash
# Expo
expo build:android

# O si es proyecto React Native crudo:
./gradlew assembleRelease
```

### 4. Compilar para iOS (si aplica)
```bash
# Expo
expo build:ios

# O si es proyecto React Native crudo:
xcodebuild -workspace ios/InnoVaiLAB.xcworkspace \
  -scheme InnoVaiLAB \
  -configuration Release \
  -derivedDataPath build
```

---

## 🧪 Testing Recomendado

### Tests Manuales
```
1. Navegar a pantalla Tramites
   - Verificar lista carga
   - Probar búsqueda
   - Filtrar por categoría
   - Hacer click en un trámite

2. Navegar a pantalla Historial
   - Verificar que muestra progreso
   - Ver timeline visual
   - Revisar estadísticas

3. Navegar a TramiteFlow
   - Verificar EstadoTramite muestra bien
   - Ver ConsejosTips en cada fase
   - Validar TimelineProgreso en pago
   - Probar navegación forward/backward

4. Componentes específicos
   - ConsejosTips: probar 4 variantes
   - TarjetaUbicacion: click teléfono
   - TimelineProgreso: cambiar paso actual
```

### Tests Automatizados (Opcional)
```bash
# Si tiene Jest/Testing Library setup
npm test

# Con coverage
npm test -- --coverage
```

---

## 🎨 Testing Visual

### En Dispositivo Real
```
1. Colores
   □ Primario azul (#3b82f6) se ve correcto
   □ Verde (#10b981) se ve correcto
   □ Ámbar (#fbbf24) se ve correcto
   □ Rojo (#f87171) se ve correcto

2. Sombras
   □ Componentes tienen profundidad visual
   □ Sombras no se ven cortadas
   □ Elevation se ve correcta

3. Tipografía
   □ Títulos legibles (32px, fontWeight 800)
   □ Contenido legible (14px, fontWeight 500)
   □ Labels claros (12px, fontWeight 700)

4. Espaciado
   □ 12-16px entre elementos
   □ Padding consistente
   □ Bordes redondeados (10-14px)
```

---

## 📤 Distribución

### Opción 1: Expo (Recomendado si usa Expo)
```bash
# Submeter a App Store
eas submit --platform ios

# Submeter a Google Play
eas submit --platform android
```

### Opción 2: App Store (iOS)
```bash
# Crear archivo para distribución
# Usar Xcode o xcrun

# Opción simple en Xcode:
# 1. Product → Archive
# 2. Distribute App
# 3. Seguir wizard
```

### Opción 3: Google Play (Android)
```bash
# Crear keystore si no existe
keytool -genkey -v -keystore android/app/release-key.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 -alias release-key

# Compilar signed APK
./gradlew assembleRelease

# El APK estará en:
# android/app/build/outputs/apk/release/
```

---

## 🔄 Release Checklist

Antes de hacer release:

- [ ] Versión actualizada en `package.json`
- [ ] CHANGELOG actualizado
- [ ] Documentación revisada
- [ ] Screenshots capturados (si es necesario)
- [ ] Testing completado en dispositivo real
- [ ] Performance verificado
- [ ] Compilación sin warnings
- [ ] Versión testeada en staging

---

## 📝 Notas Importantes

### Sobre los Componentes Nuevos
- **EstadoTramite**: Acepta `tramite` completo O props individuales
- **ConsejosTips**: Use `type` en lugar de `tipo` para consistencia
- **TarjetaUbicacion**: Soporta múltiples ubicaciones
- **TimelineProgreso**: Acepta `pasos: string[]` O `steps: TimelineStep[]`

### Sobre las Pantallas Nuevas
- **TramitesListScreen**: Depende de `tramitesService.getTodos()`
- **HistorialScreen**: Depende de `useTramiteStore`
- **TramiteDetalleScreen**: Requiere parámetro `tramiteId`

### Sobre AppNavigator
- Las 3 rutas nuevas están agregadas
- Tipo `RootStackParamList` incluye las nuevas pantallas
- Imports centralizados desde `screens/Tramites`

---

## ⚠️ Troubleshooting

### Error: "Type '...' is not assignable"
→ Verificar que está usando los nombres correctos de props

### Error: "Property 'X' does not exist"
→ Verificar importaciones y que los servicios tienen los métodos

### Componentes no se ven
→ Verificar que index.ts en components exporte correctamente

### Pantallas no navegan
→ Verificar que rutas están en AppNavigator y tipos definidos

---

## 🎯 Versioning

```
Antes:  1.0 (Funcional)
Después: 2.0 (Enhanced Frontend)

Cambios para versión 2.0:
- MINOR: Nuevos componentes y pantallas
- PATCH: Mejoras visuales
```

Sugerir actualizar versión a 2.0.0 en package.json:
```json
{
  "version": "2.0.0",
  "name": "innovailab-mobile"
}
```

---

## 📊 Monitoreo Post-Deployment

Después de publicar, monitorear:

```
1. Crash reports
   - Verificar no hay crashes relacionados a componentes nuevos
   
2. Performance
   - Tiempo de carga de pantallas
   - Memory usage
   
3. User engagement
   - Uso de nuevas pantallas
   - Completion rate de trámites
   
4. User feedback
   - Reviews en app store
   - Reportes de bugs
```

---

## 🎉 Success Criteria

La distribución fue exitosa si:

✅ App se compila sin errores  
✅ Se instala correctamente en dispositivo  
✅ Todas las pantallas cargan  
✅ Componentes nuevos se ven correctamente  
✅ Navegación funciona  
✅ No hay crashes después de 24 horas  
✅ Users reportan mejor experiencia visual  

---

## 📞 Support

**Problemas técnicos?**  
→ Revisar documentación en `FRONTEND_ENHANCEMENTS.md`

**¿Cómo compilar?**  
→ Ver sección "Pasos de Compilación" arriba

**¿Qué testeareñ?**  
→ Ver sección "Testing Recomendado" arriba

---

## 📅 Timeline Típico

```
Compilación:      30 min
Testing:          1-2 horas
App Store review: 24-48 horas
Google Play:      2-4 horas (usualmente)
─────────────────────────
Total: 2-4 días para ver en producción
```

---

**Ready to deploy! Good luck! 🚀**

Documento creado: Enero 23, 2026
