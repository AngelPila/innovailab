# Guía Visual - Sistema de Redirecciones para Prerequisitos Faltantes

## 🎯 Objetivo
Cuando un usuario no tiene un documento requerido, el sistema le proporciona un botón de acción para obtenerlo.

---

## 📱 Pantalla 1: Pregunta sobre Prerequisito

```
┌─────────────────────────────────────────────┐
│  Verifica tus documentos                    │
│  Pregunta 1 de 3                            │
│                                             │
│  [████░░░░░░░░░░░░░░░░░░] 33% completado  │
├─────────────────────────────────────────────┤
│                                             │
│  ¿Tienes tu cédula vigente?                │
│                                             │
│  ┌───────────────────────────────────┐     │
│  │   Sí, tengo  ✓                    │     │
│  └───────────────────────────────────┘     │
│                                             │
│  ┌───────────────────────────────────┐     │
│  │   No tengo  ✗                     │     │
│  └───────────────────────────────────┘     │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 📱 Pantalla 2: Usuario Responde "No Tengo"

### CASO A: Documento con Trámite Relacionado
*(Ejemplo: Cédula vigente → renovar_cedula)*

```
┌─────────────────────────────────────────────┐
│            Documento Faltante               │
│                                             │
│          ⚠️ Alerta Naranja                  │
│                                             │
│  Cédula vigente                            │
│  Documento de identidad actualizado        │
├─────────────────────────────────────────────┤
│                                             │
│  ┌───────────────────────────────────┐     │
│  │ 🔵 Obtener Renovar Cédula → 🔗   │     │
│  │  (Abre el trámite en la app)     │     │
│  └───────────────────────────────────┘     │
│                                             │
│  ┌───────────────────────────────────┐     │
│  │ 🟣 ❓ ¿Cómo conseguir?           │     │
│  │  (Muestra instrucciones)         │     │
│  └───────────────────────────────────┘     │
│                                             │
│  ┌───────────────────────────────────┐     │
│  │ 🟡 ↻ Ya lo tengo, volver a    │     │
│  │  intentar (Reintentar)          │     │
│  └───────────────────────────────────┘     │
│                                             │
│  ┌───────────────────────────────────┐     │
│  │ ⚫ Continuar sin este documento    │     │
│  └───────────────────────────────────┘     │
│                                             │
└─────────────────────────────────────────────┘
```

---

### CASO B: Documento SIN Trámite Relacionado (pero con URL del gobierno)
*(Ejemplo: Partida de nacimiento → registrocivil.gob.ec)*

```
┌─────────────────────────────────────────────┐
│            Documento Faltante               │
│                                             │
│          ⚠️ Alerta Naranja                  │
│                                             │
│  Partida de nacimiento                     │
│  Documento emitido por Registro Civil      │
├─────────────────────────────────────────────┤
│                                             │
│  ┌───────────────────────────────────┐     │
│  │ 🔵 Solicitar Partida de Nac... 🔗│     │
│  │  (Abre registrocivil.gob.ec)     │     │
│  │  (En nueva pestaña)              │     │
│  └───────────────────────────────────┘     │
│                                             │
│  ┌───────────────────────────────────┐     │
│  │ 🟣 ❓ ¿Cómo conseguir?           │     │
│  │  (Muestra instrucciones)         │     │
│  └───────────────────────────────────┘     │
│                                             │
│  ┌───────────────────────────────────┐     │
│  │ 🟡 ↻ Ya lo tengo, volver a    │     │
│  │  intentar                        │     │
│  └───────────────────────────────────┘     │
│                                             │
│  ┌───────────────────────────────────┐     │
│  │ ⚫ Continuar sin este documento    │     │
│  └───────────────────────────────────┘     │
│                                             │
└─────────────────────────────────────────────┘
```

---

### CASO C: Documento SIN Opciones de Redirección
*(Ejemplo: Foto tipo carnet actualizada)*

```
┌─────────────────────────────────────────────┐
│            Documento Faltante               │
│                                             │
│          ⚠️ Alerta Naranja                  │
│                                             │
│  Foto tipo carnet actualizada              │
│  Fondo blanco, sin lentes, 3x4 cm         │
├─────────────────────────────────────────────┤
│                                             │
│  📌 Deberás obtener este documento por     │
│  tu cuenta. Una vez lo tengas, marca       │
│  la opción "Sí" arriba.                    │
│                                             │
│  ┌───────────────────────────────────┐     │
│  │ 🟣 ❓ ¿Cómo conseguir?           │     │
│  │  (Muestra instrucciones)         │     │
│  └───────────────────────────────────┘     │
│                                             │
│  ┌───────────────────────────────────┐     │
│  │ 🟡 ↻ Ya lo tengo, volver a    │     │
│  │  intentar                        │     │
│  └───────────────────────────────────┘     │
│                                             │
│  ┌───────────────────────────────────┐     │
│  │ ⚫ Continuar sin este documento    │     │
│  └───────────────────────────────────┘     │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Interacción

### Opción A: Usuario hace clic en botón de trámite relacionado

```
Usuario: "Obtener Renovar Cédula"
    ↓
    → Se abre el trámite de renovación de cédula
    → Usuario completa la renovación
    → Vuelve al trámite anterior
    → Marca "Ya lo tengo, volver a intentar"
    → Continúa con el siguiente prerequisito
```

### Opción B: Usuario hace clic en enlace de gobierno

```
Usuario: "Solicitar Partida de Nacimiento"
    ↓
    → Se abre https://www.registrocivil.gob.ec/ (nueva pestaña)
    → Usuario sigue instrucciones en el sitio del gobierno
    → Usuario vuelve a la app
    → Marca "Ya lo tengo, volver a intentar"
    → Continúa con el siguiente prerequisito
```

### Opción C: Usuario omite el prerequisito

```
Usuario: "Continuar sin este documento"
    ↓
    → Se guarda que falta este documento
    → Continúa con el siguiente prerequisito
    → Al final, puede completarlo posteriormente
```

---

## 📊 Mapeo de Instituciones

| Documento | Tipo | Destino |
|-----------|------|---------|
| Cédula vigente | Trámite | renovar_cedula |
| Pasaporte vigente | Trámite | obtener_pasaporte |
| Licencia de conducir | Trámite | renovar_licencia_conducir |
| Partida de nacimiento | URL | registrocivil.gob.ec |
| Certificado de matrimonio | URL | registrocivil.gob.ec |
| RUC | URL | sri.gob.ec |
| IESS | URL | iess.gob.ec |
| Título de vehículo | URL | ant.gob.ec |
| Permiso de circulación | URL | ant.gob.ec |
| Cuenta bancaria | URL | superbancos.gob.ec |

---

## 🎨 Código Relevante

### Botón para Trámite Relacionado (PrerequisitosCheckBasic.tsx)
```jsx
{tramiteRelacionado && (
  <button
    onClick={handleIrATramiteRelacionado}
    className="bg-gradient-to-r from-blue-500 to-indigo-600 ..."
  >
    <span>Obtener {tramiteRelacionado.nombre}</span>
    <ArrowRight className="w-6 h-6" />
  </button>
)}
```

### Botón para URL del Gobierno (PrerequisitosCheckBasic.tsx)
```jsx
{!tramiteRelacionado && (
  <button
    onClick={() => handleIrAEnlaceGobierno(enlace.url)}
    className="bg-gradient-to-r from-blue-500 to-indigo-600 ..."
  >
    <span>{enlace.nombre}</span>
    <ExternalLink className="w-6 h-6" />
  </button>
)}
```

### AlertaFaltante Component (Usado en PrerequisitosCheck.tsx)
```jsx
{prerequisito.tramiteRelacionado && (
  <button onClick={onAbrirRama}>
    <Plus className="w-4 h-4" />
    Abrir en nueva pestaña
  </button>
)}

{!prerequisito.tramiteRelacionado && enlace?.url && (
  <button onClick={() => handleAbrirEnlace(enlace.url)}>
    <ExternalLink className="w-4 h-4" />
    {enlace.nombre}
  </button>
)}
```

---

## ✅ Pruebas Sugeridas

1. **Probar con cédula vigente** (tiene trámite relacionado)
   - Debe mostrar botón azul "Obtener Renovar Cédula"
   - Click debe abrir el trámite

2. **Probar con partida de nacimiento** (tiene URL de gobierno)
   - Debe mostrar botón azul "Solicitar Partida de Nacimiento"
   - Click debe abrir registrocivil.gob.ec en nueva pestaña

3. **Probar con foto carnet** (sin opciones)
   - Debe mostrar mensaje informativo
   - Botón "¿Cómo conseguir?" debe funcionar

4. **Probar omitir prerequisito**
   - Debe permitir continuar sin el documento
   - Debe marcarse como omitido

5. **Probar modo avanzado** (PrerequisitosCheck)
   - Los botones de redirección deben aparecer en AlertaFaltante
   - Debe funcionar igual que en el modo básico

---

## 🚀 Extensibilidad

Para agregar un nuevo prerequisito con redirección:

### En `prerequisiteLinksService.ts`:
```typescript
const PREREQUISITE_LINKS: Record<string, PrerequisiteLink> = {
  // Agregar entrada:
  nuevo_prerequisito: {
    tipo: 'url-gobierno',
    url: 'https://www.institucion.gob.ec/',
    nombre: 'Solicitar Nuevo Documento',
    descripcion: 'Descripción clara del trámite',
    icono: '🏛️',
  },
};
```

¡Eso es todo! El sistema automáticamente mostrará el botón en la pantalla de prerequisito faltante.

---

## 📝 Notas Finales

- ✅ Las URLs de gobierno se abren en **nueva pestaña**
- ✅ Los trámites relacionados se abren dentro de la **misma app**
- ✅ Todo es **responsive** y funciona en móvil
- ✅ Compatible con **accesibilidad**
- ✅ Los botones tienen **colores consistentes** con el diseño

Color scheme:
- 🔵 **Azul** = Acción primaria (ir a trámite/URL)
- 🟣 **Púrpura/Rosa** = Información adicional (¿Cómo conseguir?)
- 🟡 **Amarillo/Ámbar** = Acciones de recuperación (reintentar)
- ⚫ **Gris** = Acciones secundarias (continuar sin documento)
