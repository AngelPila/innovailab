# Cómo Agregar Más Redirecciones a Instituciones del Gobierno

## 📍 Ubicación del Archivo
`src/services/prerequisiteLinksService.ts`

## 🔍 Estructura Actual

El archivo contiene:

1. **Interface `PrerequisiteLink`** - Define la estructura de un enlace
2. **Objeto `PREREQUISITE_LINKS`** - Mapeo de prerequisitos a enlace
3. **Funciones de utilidad** - Para acceder a los datos

---

## 📋 Interface PrerequisiteLink

```typescript
export interface PrerequisiteLink {
  tipo: 'tramite' | 'url-gobierno' | 'otro';
  id?: string;           // ID del trámite o identificador
  nombre: string;        // Nombre mostrado en el botón
  url?: string;          // URL del sitio (para URLs de gobierno)
  descripcion?: string;  // Descripción de ayuda (opcional)
  icono?: string;        // Emoji para el botón (opcional)
}
```

---

## ➕ Cómo Agregar un Nuevo Prerequisito

### Paso 1: Identificar el ID del Prerequisito

Buscar en `src/data/tramites-catalog.json`:

```json
"prerequisitos": [
  {
    "id": "certificado_salud",  // ← Este es el ID
    "nombre": "Certificado de Salud",
    ...
  }
]
```

### Paso 2: Decidir el Tipo de Redirección

- **`tramite`** - Si existe un trámite en el app para obtenerlo
- **`url-gobierno`** - Si redirecciona a un sitio del gobierno
- **`otro`** - Si redirecciona a otro tipo de recurso

### Paso 3: Agregar la Entrada

En `prerequisiteLinksService.ts`, dentro del objeto `PREREQUISITE_LINKS`:

```typescript
const PREREQUISITE_LINKS: Record<string, PrerequisiteLink> = {
  // ... entradas existentes ...
  
  certificado_salud: {
    tipo: 'url-gobierno',
    url: 'https://www.ministeriosalud.gob.ec/',
    nombre: 'Solicitar Certificado de Salud',
    descripcion: 'Ministerio de Salud Pública',
    icono: '🏥',
  },
};
```

---

## 📚 Ejemplos Completos

### Ejemplo 1: Prerequisito con Trámite Relacionado

```typescript
// En tramites-catalog.json:
{
  "id": "cedula_renovacion",
  "nombre": "Cédula vigente para renovación"
  "tramiteRelacionado": "renovar_cedula"
}

// En prerequisiteLinksService.ts:
cedula_renovacion: {
  tipo: 'tramite',
  id: 'renovar_cedula',
  nombre: 'Renovar Cédula de Identidad',
  descripcion: 'Completa el trámite de renovación',
},
```

### Ejemplo 2: Prerequisito con URL del Ministerio del Trabajo

```typescript
afiliacion_trabajador: {
  tipo: 'url-gobierno',
  url: 'https://www.mintrabajo.gob.ec/',
  nombre: 'Afiliación en Ministerio del Trabajo',
  descripcion: 'Registra tu afiliación laboral',
  icono: '💼',
},
```

### Ejemplo 3: Prerequisito con URL del MIES

```typescript
bono_familia: {
  tipo: 'url-gobierno',
  url: 'https://www.mies.gob.ec/programa-ninez-familia',
  nombre: 'Solicitar Bono de Familia',
  descripcion: 'Ministerio de Inclusión Económica y Social',
  icono: '👨‍👩‍👧‍👦',
},
```

### Ejemplo 4: Prerequisito para Notaría Pública

```typescript
notarizacion_documento: {
  tipo: 'url-gobierno',
  url: 'https://www.funcionjudicial.gob.ec/notarias/',
  nombre: 'Notarizar Documento',
  descripcion: 'Búsqueda de notarías autorizadas',
  icono: '📋',
},
```

---

## 🏛️ URLs de Instituciones Ecuatorianas Comunes

| Institución | URL | Icono |
|-------------|-----|-------|
| Registro Civil | https://www.registrocivil.gob.ec/ | 🏛️ |
| SRI (Tributario) | https://www.sri.gob.ec/ | 💰 |
| IESS | https://www.iess.gob.ec/ | 🏢 |
| ANT (Tránsito) | https://www.ant.gob.ec/ | 🚗 |
| MIES | https://www.mies.gob.ec/ | 👨‍👩‍👧‍👦 |
| Ministerio de Salud | https://www.ministeriosalud.gob.ec/ | 🏥 |
| Ministerio del Trabajo | https://www.mintrabajo.gob.ec/ | 💼 |
| Banco Central | https://www.bce.fin.ec/ | 🏦 |
| SUPERBANCOS | https://www.superbancos.gob.ec/ | 🏦 |
| Registro de Propiedad | https://www.registropropiedad.gob.ec/ | 🏠 |
| Función Judicial | https://www.funcionjudicial.gob.ec/ | ⚖️ |
| SENESCYT | https://www.senescyt.gob.ec/ | 📚 |
| ARCOM | https://www.arcom.gob.ec/ | 📡 |

---

## 🎨 Emojis Recomendados por Categoría

| Categoría | Emojis |
|-----------|--------|
| Identidad | 🆔 👤 📝 |
| Documento/Registro | 📄 📋 📑 |
| Gobierno | 🏛️ 🏢 ⚖️ |
| Dinero/Fiscal | 💰 💸 💳 🏦 |
| Salud | 🏥 ⚕️ 💊 |
| Trabajo | 💼 🏭 👨‍💼 |
| Transporte | 🚗 🚕 ⛽ |
| Familia/Social | 👨‍👩‍👧‍👦 👶 🤝 |
| Propiedad | 🏠 🏡 🗝️ |
| Educación | 📚 🎓 👨‍🎓 |
| Justicia | ⚖️ 👨‍⚖️ 📜 |
| Comunicación | 📡 📞 💬 |
| Agricultura | 🌾 🚜 🐄 |

---

## 🔧 Agregar Múltiples Prerequisitos a la Vez

### Template para copiar/pegar:

```typescript
// NUEVA CATEGORÍA: [Nombre de la Categoría]
prerequisito_1: {
  tipo: 'url-gobierno',
  url: 'https://www.institucion1.gob.ec/',
  nombre: 'Acción 1',
  descripcion: 'Descripción del trámite',
  icono: '🔍',
},

prerequisito_2: {
  tipo: 'tramite',
  id: 'tramite_relacionado',
  nombre: 'Trámite Relacionado',
  descripcion: 'Descripción del trámite',
},

prerequisito_3: {
  tipo: 'url-gobierno',
  url: 'https://www.institucion2.gob.ec/',
  nombre: 'Acción 3',
  descripcion: 'Descripción del trámite',
  icono: '📱',
},
```

---

## ✅ Checklist Antes de Agregar

- [ ] Verificar que el ID del prerequisito existe en `tramites-catalog.json`
- [ ] Confirmar que la URL del gobierno es correcta
- [ ] Seleccionar un emoji apropiado
- [ ] Escribir nombre clara y concisa (máximo 50 caracteres)
- [ ] Testar que el botón aparece correctamente
- [ ] Verificar que la URL funciona en una nueva pestaña

---

## 🧪 Cómo Testear Nuevo Prerequisito

1. **Identificar un trámite que tenga ese prerequisito**
   ```json
   "prerequisitos": ["tu_nuevo_prerequisito"]
   ```

2. **Abrir el trámite en el app**

3. **Responder "No tengo" al prerequisito**

4. **Verificar que:**
   - ✅ Aparece el botón con el nombre correcto
   - ✅ El ícono se ve bien
   - ✅ Click abre la URL en nueva pestaña (o abre el trámite)
   - ✅ La descripción es clara

---

## 🔍 Debugging

Si el botón NO aparece:

1. Verificar que el ID en `prerequisiteLinksService.ts` coincide con el ID en `tramites-catalog.json`
2. Verificar que está dentro del objeto `PREREQUISITE_LINKS`
3. Abrir Console (F12) y buscar errores
4. Verificar que se importó `prerequisiteLinksService` en el componente

Si la URL NO funciona:

1. Probar la URL manualmente en navegador
2. Verificar que sea https:// (no http://)
3. Verificar que no haya caracteres especiales mal escapados
4. Buscar la URL oficial de la institución

---

## 📝 Comentarios en el Código

Es recomendable agregar comentarios para categorías:

```typescript
const PREREQUISITE_LINKS: Record<string, PrerequisiteLink> = {
  // ========== DOCUMENTOS DE IDENTIDAD ==========
  cedula_vigente: { ... },
  pasaporte_vigente: { ... },
  
  // ========== DOCUMENTOS TRIBUTARIOS ==========
  ruc_vigente: { ... },
  
  // ========== DOCUMENTOS LABORALES ==========
  afiliacion_iess: { ... },
};
```

---

## 🚀 Caso de Uso Real

### Agregar prerequisito para "Licencia de Conducir Profesional"

**Paso 1:** Encontrar en tramites-catalog.json
```json
{
  "id": "licencia_profesional",
  "nombre": "Licencia de Conducir Profesional"
}
```

**Paso 2:** Verificar si existe trámite relacionado
- ✅ Existe: `renovar_licencia_conducir`

**Paso 3:** Agregar a prerequisiteLinksService.ts
```typescript
licencia_profesional: {
  tipo: 'tramite',
  id: 'renovar_licencia_conducir',
  nombre: 'Renovar Licencia de Conducir',
  descripcion: 'Completa el trámite de renovación de licencia profesional',
},
```

**Paso 4:** Testear
- Abrir trámite que requiera "licencia_profesional"
- Responder "No tengo"
- Click en botón debe abrir el trámite de renovación de licencia

---

## 📞 Preguntas Frecuentes

**P: ¿Puedo agregar múltiples URLs para un mismo prerequisito?**
A: Actualmente no. El diseño soporta un destino por prerequisito. Si necesitas múltiples opciones, crear un prerequisito para cada una.

**P: ¿Cómo agrego un prerequisito sin URL?**
A: No agregues a `PREREQUISITE_LINKS`. El sistema mostrará el mensaje genérico "obtener por tu cuenta".

**P: ¿Las URLs deben ser exactas?**
A: Pueden ser URLs específicas de un servicio o la página principal de la institución. Lo importante es que sea útil para el usuario.

**P: ¿Puedo cambiar los colores de los botones?**
A: Los colores están definidos en los componentes (`PrerequisitosCheckBasic.tsx` y `AlertaFaltante.tsx`). Los botones de redirección siempre son azules por consistencia.

---

## 📚 Archivos Relacionados

- **Componente Principal:** `src/components/Tramites/PrerequisitosCheckBasic.tsx`
- **Componente Secundario:** `src/components/Validaciones/AlertaFaltante.tsx`
- **Datos:** `src/data/tramites-catalog.json`
- **Tipos:** `src/types/tramite.types.ts`

---

¡Listo! Con esta guía puedes agregar fácilmente nuevas redirecciones a instituciones del gobierno.
