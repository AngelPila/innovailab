# Arquitectura del Sistema de Redirecciones

## 🏗️ Diagrama General

```
┌─────────────────────────────────────────────────────────────┐
│                     USUARIO EN TRAMITE                      │
│              (PrerequisitosCheckBasic o Check)              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
         ┌──────────────────────────┐
         │  ¿Tienes el documento?   │
         └───┬──────────────────────┘
             │
        ┌────┴─────┐
        ▼          ▼
      [SÍ]       [NO]
        │          │
        │          ▼
        │    ┌───────────────────────────────────┐
        │    │   Pantalla Documento Faltante     │
        │    │   (PrerequisitosCheckBasic)       │
        │    └────────┬────────────────────────┘
        │             │
        │             ▼
        │    ┌────────────────────────────────────────┐
        │    │ prerequisiteLinksService.getLink()     │
        │    └────────┬──────────────────┬────────────┘
        │             │                  │
        │        ┌────▼────┐        ┌────▼─────┐
        │        ▼         ▼        ▼          ▼
        │  Trámite   URL Gobierno   Otra    Sin Mapeo
        │  Interno   del SRI, etc   Opción
        │    │           │           │         │
        │    ▼           ▼           ▼         ▼
        │  [Azul]     [Azul+🔗]  [Otro]   [Gris]
        │  Botón      Botón      Botón   Mensaje
        │    │           │           │         │
        │    └───────┬───┴────┬──────┴─────────┘
        │            │        │
        └────────────┼─┬──────┼─────┐
                     │ │      │     │
                     ▼ ▼      ▼     ▼
                Abre  Abre  Info  Omitir
                Trám  URL   Help  o
                ite   Nueva       Continuar
                     Pestaña

```

---

## 📂 Estructura de Archivos

```
src/
├── services/
│   ├── prerequisiteLinksService.ts ✨ NUEVO
│   │   ├── Interface: PrerequisiteLink
│   │   ├── Objeto: PREREQUISITE_LINKS
│   │   │   ├── cedula_vigente → renovar_cedula
│   │   │   ├── pasaporte_vigente → obtener_pasaporte
│   │   │   ├── licencia_vigente → renovar_licencia
│   │   │   ├── certificado_nacimiento → registrocivil.gob.ec
│   │   │   ├── ruc_vigente → sri.gob.ec
│   │   │   ├── afiliacion_iess → iess.gob.ec
│   │   │   └── ... 14+ más
│   │   └── Funciones: getPrerequisiteLink(), getGovernmentUrl(), etc.
│   └── tramitesService.ts (existente)
│
├── components/
│   ├── Tramites/
│   │   ├── TramiteFlowBasic.tsx (usado por)
│   │   ├── PrerequisitosCheckBasic.tsx 🔧 MODIFICADO
│   │   │   ├── handleRespuesta()
│   │   │   ├── handleIrATramiteRelacionado()
│   │   │   ├── handleIrAEnlaceGobierno() ✨ NUEVO
│   │   │   └── Importa: prerequisiteLinksService
│   │   │
│   │   ├── PrerequisitosCheck.tsx 🔧 MODIFICADO
│   │   │   └── Importa: prerequisiteLinksService
│   │   │       (AlertaFaltante maneja la lógica)
│   │   │
│   │   └── TramiteFlowAdvanced.tsx (usa PrerequisitosCheck)
│   │
│   └── Validaciones/
│       └── AlertaFaltante.tsx 🔧 MODIFICADO
│           ├── handleAbrirEnlace() ✨ NUEVO
│           ├── Lógica condicional para 3 casos
│           └── Importa: prerequisiteLinksService
│
└── data/
    └── tramites-catalog.json (contiene prerequisitos)
```

---

## 🔀 Flujo de Datos

```
                    ┌──────────────────────┐
                    │  tramites-catalog.json│
                    │  (prerequisitos)      │
                    └──────────────┬────────┘
                                   │
                        ┌──────────▼──────────┐
                        │ Component carga      │
                        │ prerequisitos        │
                        └──────────┬───────────┘
                                   │
                   ┌───────────────▼───────────────┐
                   │ Usuario responde "No tengo"   │
                   └───────────────┬───────────────┘
                                   │
            ┌──────────────────────▼──────────────────────┐
            │ prerequisiteLinksService.getPrerequisiteLink│
            │ (id, tramiteRelacionado)                    │
            └──────────────────────┬──────────────────────┘
                                   │
                   ┌───────────────▼───────────────┐
                   │ Retorna PrerequisiteLink:     │
                   │ { tipo, id, url, nombre }    │
                   └───────────────┬───────────────┘
                                   │
            ┌──────────────────────▼──────────────────────┐
            │  Componente renderiza botón apropiado       │
            │  según tipo de redirección                  │
            └──────────────────────┬──────────────────────┘
                                   │
                ┌──────────┬────────┼────────┬──────────┐
                │          │        │        │          │
                ▼          ▼        ▼        ▼          ▼
            Trámite    URL Gov.   Info    Omitir    Continuar
            Interno    Nueva      Modal   Doc.      Sin Doc.
                       Pestaña
```

---

## 🎬 Secuencia de Interacción (Caso: Cédula Faltante)

```
USUARIO                          COMPONENTE                    SERVICIO
  │                                 │                            │
  │─ Click "No tengo" ─────────────>│                            │
  │                                 │                            │
  │                                 │─ Usuario responde NO ─────>│
  │                                 │  handleRespuesta()         │
  │                                 │                            │
  │                                 │─ Mostrar prelim. faltante ─│
  │                                 │  handleRespuesta() completa│
  │                                 │                            │
  │                                 │─ getPrerequisiteLink() ───>│
  │                                 │  (id: cedula_vigente)      │
  │                                 │                            │
  │                                 │<─ Retorna: {              │
  │                                 │    tipo: 'tramite',       │
  │                                 │    id: 'renovar_cedula',  │
  │                                 │    nombre: 'Renovar...'   │
  │                                 │  }                        │
  │                                 │                            │
  │<─ Botón azul "Obtener Cédula" ──│                            │
  │   Renovación"                   │                            │
  │                                 │                            │
  │─ Click Botón ─────────────────>│                            │
  │                                 │                            │
  │                                 │─ handleIrATramiteRel() ───│
  │                                 │  onAbrirTramiteRelacionado│
  │                                 │  ('renovar_cedula')       │
  │                                 │                            │
  │<─ Abre trámite "Renovar Cédula" │                            │
  │   en la app                     │                            │
  │                                 │                            │
  │─ ... usuario completa renovación │                           │
  │                                 │                            │
  │─ Vuelve a Pasaporte ───────────>│                            │
  │                                 │                            │
  │─ Click "Ya lo tengo" ──────────>│                            │
  │                                 │                            │
  │<─ Continúa con siguiente prereq  │                            │
  │                                 │                            │
```

---

## 🎬 Secuencia de Interacción (Caso: RUC del SRI)

```
USUARIO                          COMPONENTE                    SERVICIO
  │                                 │                            │
  │─ Click "No tengo" ─────────────>│                            │
  │                                 │                            │
  │                                 │─ Mostrar prelim. faltante ─│
  │                                 │  handleRespuesta() completa│
  │                                 │                            │
  │                                 │─ getPrerequisiteLink() ───>│
  │                                 │  (id: ruc_vigente,        │
  │                                 │   tramiteRelacionado: nil) │
  │                                 │                            │
  │                                 │<─ Retorna: {              │
  │                                 │    tipo: 'url-gobierno',  │
  │                                 │    url: 'sri.gob.ec',     │
  │                                 │    nombre: 'RUC'          │
  │                                 │  }                        │
  │                                 │                            │
  │<─ Botón azul "RUC SRI" 🔗 ─────│                            │
  │                                 │                            │
  │─ Click Botón ─────────────────>│                            │
  │                                 │                            │
  │                                 │─ handleIrAEnlaceGobierno()│
  │                                 │  window.open(..._blank...)│
  │                                 │                            │
  │<─ Abre sri.gob.ec en ──────────│                            │
  │   nueva pestaña                 │                            │
  │                                 │                            │
  │─ ... usuario solicita RUC ─────│                            │
  │                                 │                            │
  │─ Vuelve a la app ──────────────>│                            │
  │                                 │                            │
  │─ Click "Ya lo tengo" ──────────>│                            │
  │                                 │                            │
  │<─ Continúa con siguiente prereq  │                            │
  │                                 │                            │
```

---

## 🔗 Integraciones

### Con PrerequisitosCheckBasic.tsx

```typescript
// Import
import { prerequisiteLinksService } from '../../services/prerequisiteLinksService';

// En handleRespuesta()
if (!tieneDocumento) {
  setPrerequistoFaltante(requisitoActual); // Muestra pantalla
}

// En handleIrAEnlaceGobierno()
const handleIrAEnlaceGobierno = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

// En renderizado
const enlace = prerequisiteLinksService.getPrerequisiteLink(
  prerequisitoFaltante.id
);

if (enlace?.url) {
  <button onClick={() => handleIrAEnlaceGobierno(enlace.url)}>
    {enlace.nombre} <ExternalLink />
  </button>
}
```

### Con AlertaFaltante.tsx

```typescript
// Import
import { prerequisiteLinksService } from '../../services/prerequisiteLinksService';

// En componente
const enlace = prerequisiteLinksService.getPrerequisiteLink(
  prerequisito.id,
  prerequisito.tramiteRelacionado
);

// Renderizado condicional
{enlace && enlace.url && (
  <button onClick={() => handleAbrirEnlace(enlace.url)}>
    <ExternalLink className="w-4 h-4" />
    {enlace.nombre}
  </button>
)}
```

---

## 📊 Estado de las Integraciones

| Componente | Estado | Funcionalidad |
|-----------|--------|--------------|
| PrerequisitosCheckBasic | ✅ Actualizado | Botones de redirección |
| AlertaFaltante | ✅ Actualizado | Botones en componente reutilizable |
| PrerequisitosCheck | ✅ Actualizado | Usa AlertaFaltante (indirectamente) |
| prerequisiteLinksService | ✅ Nuevo | Mapeo centralizado |

---

## 🎯 Casos Cubiertos

```
Prerequisito Faltante
    ├─ Con tramiteRelacionado
    │  └─ Botón: "Obtener [Trámite] →" (azul)
    │     Acción: Abre trámite en app
    │
    ├─ Sin tramiteRelacionado, con URL
    │  └─ Botón: "[Servicio] 🔗" (azul)
    │     Acción: Abre URL nueva pestaña
    │
    └─ Sin tramiteRelacionado, sin URL
       └─ Mensaje: "Obtener por tu cuenta"
          Acción: Usuario lo obtiene por su cuenta
```

---

## 🔄 Ciclo de Vida

```
1. APP INICIA
   ├─ Carga tramites-catalog.json
   └─ Prerrequisitos disponibles

2. USUARIO ENTRA A TRAMITE
   ├─ Ve preguntas de prerequisitos
   └─ Responde Sí/No

3. USUARIO RESPONDE "NO"
   ├─ Se muestra pantalla "Documento Faltante"
   ├─ Se llama prerequisiteLinksService.getLink()
   └─ Se renderiza botón según resultado

4. USUARIO CLICKEA BOTÓN
   ├─ Abre trámite (si existe)
   ├─ Abre URL (si existe)
   └─ Ve instrucciones (siempre)

5. USUARIO COMPLETA ACCIÓN
   ├─ Vuelve a la app
   ├─ Marca "Ya lo tengo"
   └─ Continúa con siguiente prerequisito
```

---

## 💾 Estado Persistente

```
prerequisitosCumplidos: {
  cedula_vigente: false,        // El usuario no tiene
  foto_carnet: true,            // El usuario tiene
  partida_nacimiento: false,    // El usuario no tiene
  ruc: false,                   // El usuario no tiene
}

// Cuando usuario completa el documento:
prerequisitosCumplidos: {
  cedula_vigente: true,         // Ahora tiene
  foto_carnet: true,
  partida_nacimiento: false,
  ruc: false,
}
```

---

## 🧪 Testing Matrix

| Escenario | Componente | Entrada | Salida | Estado |
|-----------|-----------|---------|--------|--------|
| A1 | PrerequisitosCheckBasic | No tiene + tramiteRelacionado | Botón azul trámite | ✅ |
| A2 | PrerequisitosCheckBasic | No tiene + URL gobierno | Botón azul URL | ✅ |
| A3 | PrerequisitosCheckBasic | No tiene + sin mapeo | Mensaje gris | ✅ |
| B1 | AlertaFaltante | No tiene + tramiteRelacionado | Botón rojo trámite | ✅ |
| B2 | AlertaFaltante | No tiene + URL gobierno | Botón azul URL | ✅ |
| B3 | AlertaFaltante | No tiene + sin mapeo | Mensaje gris | ✅ |

---

## 🚀 Deployment

```
1. Código actualizado localmente
   └─ Sin errores de compilación ✅

2. Build:
   npm run build
   └─ Build exitoso ✅

3. Test:
   npm run dev
   └─ Funcionamiento manual ✅

4. Deploy:
   git push
   └─ CI/CD pipeline
      └─ Build en servidor
      └─ Deploy automático ✅
```

---

## 📞 Soporte y Mantenimiento

### Cambiar una URL
1. Abrir `src/services/prerequisiteLinksService.ts`
2. Buscar el prerequisito
3. Cambiar el campo `url`
4. No requiere cambios en componentes

### Agregar nuevo prerequisito
1. Abrir `src/services/prerequisiteLinksService.ts`
2. Agregar entrada a `PREREQUISITE_LINKS`
3. Sistema automáticamente lo muestra

### Remover un mapeo
1. Abrir `src/services/prerequisiteLinksService.ts`
2. Comentar o eliminar entrada
3. Sistema mostrará mensaje genérico

---

**Versión:** 1.0  
**Última actualización:** 2024  
**Status:** ✅ Completado y Funcional
