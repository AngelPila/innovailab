# Redirecciones para Prerequisitos Faltantes - Implementación

## Resumen de Cambios

Se ha implementado un sistema de redirecciones inteligentes para cada prerequisito faltante. Cuando un usuario no tiene un documento requerido, ahora puede:

1. **Realizar un trámite relacionado** (si existe `tramiteRelacionado`)
2. **Acceder a una página del gobierno** (si existe mapeo en el servicio)

## Archivos Modificados

### 1. **Nuevo servicio: `prerequisiteLinksService.ts`** 
**Ruta:** `src/services/prerequisiteLinksService.ts`

Mapea cada prerequisito a su correspondiente enlace (trámite o URL del gobierno):

- **Documentos de Identidad**: Cédula, Pasaporte, Licencia
- **Documentos de Registro Civil**: Certificados de nacimiento, matrimonio, divorcio
- **Documentos Laborales**: Afiliación IESS, historial laboral
- **Documentos Fiscales**: RUC del SRI, certificados tributarios
- **Documentos Vehiculares**: ANT (Agencia Nacional de Tránsito)
- **Otros**: Cuentas bancarias, escrituras de propiedad

**Funciones principales:**
- `getPrerequisiteLink()` - Obtiene el enlace para un prerequisito
- `getGovernmentUrl()` - Obtiene la URL del gobierno
- `getAllPrerequisiteLinks()` - Lista todos los enlaces disponibles

### 2. **Actualización: `PrerequisitosCheckBasic.tsx`**
**Ruta:** `src/components/Tramites/PrerequisitosCheckBasic.tsx`

**Cambios:**
- Agregada importación de `ExternalLink` icon
- Importado `prerequisiteLinksService`
- Agregada función `handleIrAEnlaceGobierno()` para abrir URLs
- Actualizada pantalla de prerequisito faltante:
  - Si existe `tramiteRelacionado`: Botón azul "Obtener [Trámite]" con flecha
  - Si NO existe y hay URL: Botón azul con el nombre del servicio y ícono de enlace externo
  - Botón púrpura "¿Cómo conseguir?" para ver instrucciones
  - Botón amarillo "Ya lo tengo, volver a intentar"
  - Botón gris "Continuar sin este documento"

### 3. **Actualización: `AlertaFaltante.tsx`** (componente reutilizable)
**Ruta:** `src/components/Validaciones/AlertaFaltante.tsx`

**Cambios:**
- Agregada importación de `ExternalLink` icon
- Importado `prerequisiteLinksService`
- Agregada función `handleAbrirEnlace()` para abrir URLs en nueva pestaña
- Lógica mejorada:
  - Si existe `tramiteRelacionado`: Botón rojo "Abrir en nueva pestaña"
  - Si NO existe pero hay URL del gobierno: Botón azul con el nombre del servicio
  - Si NO existe ni URL: Mensaje informativo gris
  - Siempre disponible: Botón "Omitir por ahora"

### 4. **Actualización: `PrerequisitosCheck.tsx`**
**Ruta:** `src/components/Tramites/PrerequisitosCheck.tsx`

**Cambios:**
- Importado `ExternalLink` icon y `prerequisiteLinksService`
- (El componente AlertaFaltante ya maneja toda la lógica de redirecciones)

## Flujo de Funcionalidad

### Escenario 1: Prerequisito con trámite relacionado
```
Usuario responde "No tengo" a un prerequisito
  ↓
Se muestra pantalla "Documento Faltante"
  ↓
Botón "Obtener [Trámite Relacionado]" → Abre ese trámite
  ↓
Usuario completa el trámite
```

### Escenario 2: Prerequisito sin trámite, pero con URL de gobierno
```
Usuario responde "No tengo" a un prerequisito
  ↓
Se muestra pantalla "Documento Faltante"
  ↓
Botón "[Nombre del Servicio]" → Abre página del gobierno en nueva pestaña
  ↓
Usuario sigue instrucciones en el sitio del gobierno
```

### Escenario 3: Prerequisito sin opciones de redirección
```
Usuario responde "No tengo" a un prerequisito
  ↓
Se muestra pantalla "Documento Faltante"
  ↓
Mensaje: "Deberás obtener este documento por tu cuenta"
  ↓
Usuario marca "Ya lo tengo" cuando lo complete
```

## Mapeos de Gobierno Implementados

### Identidad
- **Cédula vigente** → `renovar_cedula` (trámite)
- **Pasaporte vigente** → `obtener_pasaporte` (trámite)
- **Licencia vigente** → `renovar_licencia_conducir` (trámite)

### Registro Civil
- **Certificado/Partida de nacimiento** → https://www.registrocivil.gob.ec/
- **Certificado de matrimonio** → https://www.registrocivil.gob.ec/
- **Divorcio legal** → https://www.registrocivil.gob.ec/

### Seguridad Social
- **Afiliación IESS** → https://www.iess.gob.ec/
- **Historial laboral** → https://www.iess.gob.ec/

### Tributario
- **RUC** → https://www.sri.gob.ec/
- **Certificado tributario** → https://www.sri.gob.ec/

### Transporte/Vehicular
- **Título de vehículo** → https://www.ant.gob.ec/
- **Permiso de circulación** → https://www.ant.gob.ec/
- **SOAT** → https://www.ant.gob.ec/

### Otros
- **Cuenta bancaria** → https://www.superbancos.gob.ec/
- **Escritura de propiedad** → https://www.registropropiedad.gob.ec/

## Cómo Agregar Nuevos Mapeos

En `prerequisiteLinksService.ts`, agregar entradas al objeto `PREREQUISITE_LINKS`:

```typescript
const PREREQUISITE_LINKS: Record<string, PrerequisiteLink> = {
  // Ejemplo: Nuevo prerequisito
  mi_nuevo_prerequisito: {
    tipo: 'url-gobierno',
    url: 'https://www.institucion.gob.ec/',
    nombre: 'Solicitar Mi Documento',
    descripcion: 'Dirígete a la institución correspondiente',
    icono: '🏛️',
  },
};
```

## Beneficios

✅ **Accesibilidad mejorada**: Usuarios pueden obtener fácilmente documentos faltantes sin navegar por múltiples sitios

✅ **Experiencia fluida**: Redirecciones directas a trámites relacionados o sitios del gobierno

✅ **Información clara**: Cada botón indica claramente adónde va (nueva pestaña para URLs externas)

✅ **Escalable**: Fácil agregar nuevos mapeos sin modificar componentes

✅ **Consistencia**: Se usa el mismo servicio en PrerequisitosCheckBasic y AlertaFaltante

## Testing Manual

Para probar:

1. Ir a cualquier trámite que requiera un prerequisito
2. Responder "No tengo" para algún documento
3. Debería aparecer un botón con el nombre del trámite o servicio
4. Click debería abrir el trámite o página (en nueva pestaña para URLs)

## Notas Técnicas

- Las URLs externas se abren con `window.open(..., '_blank', 'noopener,noreferrer')` por seguridad
- Los trámites relacionados usan el flujo normal de navegación del app
- El servicio es agnóstico a componentes (puede usarse en otros lugares)
- Compatible con versiones anteriores (prerequisitos sin mapeos funcionan normalmente)
