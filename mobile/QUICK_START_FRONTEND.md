# 🚀 Guía de Implementación - Frontend Enhancements

## Quick Start Guide

Para comenzar a usar las nuevas mejoras del frontend mobile:

### 1️⃣ Nuevos Componentes Disponibles

#### EstadoTramite
Muestra el estado de un trámite con badge de categoría, progreso y costo.

```tsx
import { EstadoTramite } from '../components';

<EstadoTramite
  tramite={tramite}
  pasoActual={1}
  totalPasos={4}
  onPress={() => console.log('Presionado')}
/>
```

#### ConsejosTips  
Componente flexible para mostrar consejos, advertencias o confirmaciones.

```tsx
import { ConsejosTips } from '../components';

<ConsejosTips
  type="success"
  title="¡Bien hecho!"
  consejos={[
    'Consejo 1',
    'Consejo 2',
    'Consejo 3',
  ]}
/>
```

#### TarjetaUbicacion
Muestra ubicaciones con teléfono clickeable, horarios y distancia.

```tsx
import { TarjetaUbicacion } from '../components';

const ubicaciones = ubicacionesService.obtenerPorTramite(tramiteId);
<TarjetaUbicacion ubicaciones={ubicaciones} />
```

#### TimelineProgreso
Timeline visual mostrando progreso del trámite.

```tsx
import { TimelineProgreso } from '../components';

<TimelineProgreso
  pasos={['Información', 'Requisitos', 'Pago', 'Seguimiento']}
  pasoActual={2}
/>
```

### 2️⃣ Pantallas Nuevas

#### TramitesListScreen
Catálogo de trámites con búsqueda y filtros.

```tsx
import { TramitesListScreen } from '../screens/Tramites';

// En tu navegador:
<Stack.Screen 
  name="Tramites" 
  component={TramitesListScreen} 
/>
```

#### HistorialScreen
Dashboard mostrando progreso de tus trámites.

```tsx
import { HistorialScreen } from '../screens/Tramites';

<Stack.Screen 
  name="Historial" 
  component={HistorialScreen} 
/>
```

#### TramiteDetalleScreen
Vista detallada de un trámite específico.

```tsx
import { TramiteDetalleScreen } from '../screens/Tramites';

<Stack.Screen 
  name="TramiteDetalle" 
  component={TramiteDetalleScreen}
  options={{ headerShown: false }}
/>
```

### 3️⃣ Componentes Mejorados

Los siguientes componentes han sido rediseñados:

- ✨ **ProgressBar** - Mejor proporción y colores
- ✨ **FaseContenido** - Mejor jerarquía visual
- ✨ **PrerequisitosCheck** - Diseño moderno
- ✨ **FasePago** - Tema azul cohesivo
- ✨ **FaseSeguimiento** - Celebratorio y visual

No requieren cambios en su uso, solo tienen mejor apariencia.

### 4️⃣ Actualizar AppNavigator

Si aún no está hecho, agrega estas rutas:

```typescript
// En src/navigation/AppNavigator.tsx

import { TramitesListScreen, HistorialScreen, TramiteDetalleScreen } from '../screens/Tramites';

export type RootStackParamList = {
  // ... otras rutas
  Tramites: undefined;
  Historial: undefined;
  TramiteDetalle: { tramiteId: string };
};

// En tu Stack Navigator:
<Stack.Screen 
  name="Tramites" 
  component={TramitesListScreen}
  options={{ headerShown: false }}
/>
<Stack.Screen 
  name="Historial" 
  component={HistorialScreen}
  options={{ headerShown: false }}
/>
<Stack.Screen 
  name="TramiteDetalle" 
  component={TramiteDetalleScreen}
  options={{ headerShown: false }}
/>
```

### 5️⃣ Usar en TramiteFlowScreen

El TramiteFlowScreen ya incluye los nuevos componentes:

```tsx
// Ya está integrado:
<EstadoTramite tramite={tramite} ... />
<ConsejosTips type="info" ... />
<TimelineProgreso ... />
```

### 6️⃣ Testing Checklist

- [ ] Verifica que EstadoTramite muestre bien los badges de categoría
- [ ] Prueba ConsejosTips en cada variante (info, warning, success, error)
- [ ] Haz clic en teléfonos en TarjetaUbicacion (debe abrir llamada)
- [ ] Verifica que TimelineProgreso se actualiza correctamente
- [ ] Prueba la búsqueda en TramitesListScreen
- [ ] Verifica el historial en HistorialScreen
- [ ] Comprueba que los colores se ven bien en tu dispositivo

### 7️⃣ Paleta de Colores de Referencia

```
Azul:       #3b82f6 (Principal)
Verde:      #10b981 (Éxito)
Ámbar:      #fbbf24 (Advertencia)
Rojo:       #f87171 (Error)
Claro:      #f0f9ff, #f8f9fa (Fondos)
Texto:      #1f2937 (Oscuro), #6b7280 (Gris)
Bordes:     #e9ecef, #bfdbfe
```

### 8️⃣ Exportaciones Centralizadas

Todos los componentes se exportan desde:

```typescript
// Componentes
import { 
  EstadoTramite, 
  ConsejosTips, 
  TarjetaUbicacion, 
  TimelineProgreso,
  ProgressBar,
  FaseContenido,
  // ... etc
} from '../components';

// Pantallas
import { 
  TramitesListScreen, 
  HistorialScreen, 
  TramiteDetalleScreen 
} from '../screens/Tramites';
```

### 9️⃣ Ejemplos de Uso Completo

#### Mostrar estado de trámite con timeline
```tsx
<View>
  <EstadoTramite tramite={tramite} pasoActual={2} totalPasos={4} />
  <TimelineProgreso 
    pasos={['Info', 'Requisitos', 'Pago', 'Seguimiento']} 
    pasoActual={1}
  />
</View>
```

#### Mostrar información con consejos
```tsx
<View>
  <ConsejosTips
    type="info"
    title="Información importante"
    consejos={['Verifica tus requisitos', 'Ten tus documentos listos']}
  />
  <TarjetaUbicacion ubicaciones={ubicaciones} />
</View>
```

#### Mostrar resultado exitoso
```tsx
<ConsejosTips
  type="success"
  title="¡Trámite completado!"
  consejos=[
    'Tu solicitud fue registrada',
    'Recibirás updates por email',
    'Puedes ver el historial aquí'
  ]
/>
```

### 🔟 Performance Tips

1. **Usa memoization para EstadoTramite si renderiza muchas**
   ```tsx
   const EstadoTramiteMemorized = React.memo(EstadoTramite);
   ```

2. **Lazy load TramiteDetalleScreen si es necesario**
   ```tsx
   const TramiteDetalleScreen = React.lazy(() => import('./TramiteDetalleScreen'));
   ```

3. **Optimiza listas con FlatList**
   ```tsx
   <FlatList
     data={tramites}
     renderItem={({ item }) => <EstadoTramite tramite={item} />}
     keyExtractor={item => item.id}
   />
   ```

---

## 🆘 Troubleshooting

### Las sombras no se ven
- Android requiere `elevation` en lugar de shadow properties
- Ambos están implementados en los componentes
- Verifica que tu dispositivo no tenga "shadow display" desactivado

### Los colores se ven diferentes
- Algunos dispositivos tienen calibración de color diferente
- Los colores están diseñados para ser accesibles
- Prueba en diferentes pantallas

### EstadoTramite no clickea
- Asegúrate de pasar `onPress` handler
- El componente está envuelto en `TouchableOpacity`
- Verifica que `activeOpacity` se aplique

### ConsejosTips no muestra contenido
- Verifica que `consejos` sea un array válido
- El `type` debe ser: 'info', 'warning', 'success' o 'error'
- Comprueba que `title` no esté vacío

### TarjetaUbicacion no abre llamadas
- Android requiere permiso `android.permission.CALL_PHONE`
- iOS debería funcionar sin permisos adicionales
- Verifica que el número de teléfono tenga formato correcto

---

## 📞 Support

Para problemas o preguntas:
1. Revisa esta documentación
2. Consulta FRONTEND_ENHANCEMENTS.md para detalles técnicos
3. Verifica los archivos de componentes directamente

---

**Última actualización**: Enero 23, 2026
**Estado**: ✅ Listo para usar
