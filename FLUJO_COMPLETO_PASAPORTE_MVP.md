# 📋 FLUJO COMPLETO: OBTENER PASAPORTE (MVP)

## 🎯 Objetivo
Documentar el flujo COMPLETO desde "Obtener Pasaporte" hasta la última sección (Seguimiento), para entender exactamente qué pasos y decisiones hay.

---

## 🚀 INICIO: Usuario elige "Obtener Pasaporte"

```
Usuario en chat → Escribe "Quiero pasaporte" o similar
    ↓
Sistema detecta intención → activa TramiteFlow para "obtener_pasaporte"
    ↓
Se muestra pantalla inicial del trámite (encabezado amarillo con info)
```

---

## 📍 FASE 1: INFORMACIÓN GENERAL

**Componente:** `FaseContenido.tsx`

**Lo que muestra:**
- Título: "Obtener Pasaporte"
- Descripción: "Solicita tu pasaporte ecuatoriano"
- Tiempo estimado: 15 días
- Costo: $95.00
- Validez: 10 años

**Acciones del usuario:**
- Lee la información
- Click en botón "Continuar" → **Avanza a FASE 2 (REQUISITOS)**

---

## 📍 FASE 2: SEGMENTACIÓN (ÁRBOL DE DECISIONES)

**Componente:** `SegmentacionPasaporte.tsx`

Este es el corazón del MVP. Aquí el sistema hará PREGUNTAS para personalizar el flujo.

### **PASO 1: Nacionalidad**
```
¿Cuál es tu nacionalidad?
├─ Soy ecuatoriano → Ir a PASO 2
└─ Soy extranjero → Ir a PASO 3
```

---

### **OPCIÓN A: Si elige "Soy ecuatoriano" → PASO 2**

**Pregunta:** ¿Cómo obtuviste la nacionalidad?
```
├─ Por nacimiento (nací en Ecuador o mis padres son ecuatorianos)
│  └─ Ir a PASO 4: Tipo de trámite de pasaporte
│
└─ Por naturalización (obtuve nacionalidad siendo extranjero)
   └─ Ir a PASO 4: Tipo de trámite de pasaporte
     (pero se agregará REQUISITO: "Carta de naturalización")
```

---

### **OPCIÓN B: Si elige "Soy extranjero" → PASO 3**

**Pregunta:** ¿Cuál es tu situación en Ecuador?
```
├─ Tengo residencia legal (visa trabajo, residencia temporal/permanente)
│  └─ Ir a PASO 99: Resumen y continuar
│
├─ Soy turista (estoy de paso)
│  └─ Ir a PASO 99: Resumen y continuar
│
└─ Mi situación es irregular
   └─ BLOQUEADO: "Lo siento, no podemos proceder en este momento"
```

---

### **PASO 4: Tipo de trámite de pasaporte**

**Pregunta:** ¿Qué tipo de pasaporte necesitas?
```
├─ Primera vez (nunca he tenido pasaporte)
│  └─ Requisitos base + "Acta de nacimiento"
│
├─ Renovación (mi pasaporte expiró o va a expirar)
│  └─ Requisitos base + "Pasaporte anterior"
│
├─ Pérdida o robo (perdí mi pasaporte)
│  └─ Requisitos base + "Denuncia policial"
│
└─ Duplicado (necesito una copia del pasaporte)
   └─ Requisitos base + "Pasaporte anterior"
```

---

### **PASO 5: Categoría (Edad)**

**Pregunta:** ¿Cuántos años tienes?
```
├─ Menor de edad (< 18 años)
│  └─ Se agregan requisitos: "Autorización padres" + "Acta nacimiento"
│
├─ Adulto (18 - 65 años)
│  └─ Requisitos normales
│
└─ Adulto mayor (> 65 años)
   └─ Atención prioritaria + requisitos normales
```

---

### **PASO 6: ¿Tienes discapacidad?**

**Pregunta:** ¿Tienes alguna discapacidad registrada?
```
├─ Sí → Se proporciona atención preferente
└─ No → Continúa normal
```

---

### **PASO 99: Resumen de segmentación**

Se muestra un resumen visual tipo:
```
✅ TU PERFIL:
━━━━━━━━━━━━━━━━━━
📍 Nacionalidad: Ecuatoriano
📍 Tipo: Por naturalización
📍 Tipo de pasaporte: Primera vez
📍 Edad: Adulto
📍 Discapacidad: No
━━━━━━━━━━━━━━━━━━

Click en "Continuar" → Ir a FASE 3 (REQUISITOS)
```

---

## 📍 FASE 3: REQUISITOS (VALIDACIÓN)

**Componente:** `PrerequisitosCheck.tsx`

Se muestran SOLO los requisitos aplicables según las decisiones anteriores.

### **Requisitos SIEMPRE:**
- ✅ Cédula de identidad vigente
- ✅ Certificado de votación actualizado
- ✅ Foto tipo pasaporte reciente

### **Requisitos CONDICIONALES:**
- Si es **naturalizado**: + Carta de naturalización
- Si es **renovación**: + Pasaporte anterior
- Si es **pérdida/robo**: + Denuncia policial
- Si es **menor de edad**: + Autorización padres + Acta nacimiento
- Si es **extranjero**: Podría variar

---

### **Ejemplo de interfaz de requisitos:**

Para cada requisito se muestra:
```
📋 Requisito: "Cédula de identidad vigente"
Descripción: "Tu cédula debe estar vigente y en buen estado"

[  ] No tengo
[✓] Tengo
```

**Usuario marca "Tengo" para cada requisito que posee.**

**Validación:**
- Si marca TODO como "Tengo" → Verde, puede continuar
- Si falta algo → Rojo, muestra opción de abrir rama secundaria (ej: renovar cédula)

---

## 📍 FASE 4: DOCUMENTACIÓN (SUBIR ARCHIVOS)

**Componente:** `FaseContenido.tsx` + Input de archivos

Se pide que el usuario suba:
- Cédula escaneada
- Certificado de votación
- Foto tipo pasaporte
- (+ otros según segmentación)

**Interfaz:**
```
Arrastra o haz click para subir:
[  ] Cédula (escaneada) - PDF/JPG
[  ] Certificado votación - PDF/JPG
[  ] Foto pasaporte - JPG/PNG
[  ] Carta naturalización - PDF (si aplica)
```

---

## 📍 FASE 5: PAGO

**Componente:** `FaseContenido.tsx` + Métodos de pago

Se muestra:
```
💳 TOTAL A PAGAR: $95.00

Métodos de pago disponibles:
├─ Tarjeta de crédito/débito
├─ Transferencia bancaria
└─ En ventanilla (Registro Civil)
```

---

## 📍 FASE 6: SEGUIMIENTO

**Componente:** `FaseContenido.tsx`

Se muestra:
```
✅ TRÁMITE ENVIADO

📝 Código de seguimiento: PAP-2026-001234
📅 Retiro en: 15 días hábiles (después de 2026-02-02)
📍 Lugar: Cualquier oficina del Registro Civil

Puedes rastrear tu solicitud en: [LINK]
```

---

## 🎬 FLUJO SUGERIDO PARA PROBAR MVP

### **Escenario 1: Ecuatoriano por nacimiento, primera vez, adulto**

```
1. Usuario: "Quiero pasaporte"
   → Entra a Obtener Pasaporte

2. FASE 1: Lee información
   → Click "Continuar"

3. FASE 2: Segmentación
   ├─ Paso 1: Elige "Soy ecuatoriano"
   ├─ Paso 2: Elige "Por nacimiento"
   ├─ Paso 4: Elige "Primera vez"
   ├─ Paso 5: Elige "Adulto"
   ├─ Paso 6: Elige "No tengo discapacidad"
   └─ Paso 99: Ve resumen → "Continuar"

4. FASE 3: Requisitos
   ├─ Cédula vigente: Marca "Tengo" ✓
   ├─ Certificado votación: Marca "Tengo" ✓
   └─ Foto pasaporte: Marca "Tengo" ✓
   → Todos OK → "Continuar"

5. FASE 4: Documentación
   ├─ Sube cédula (archivo)
   ├─ Sube certificado (archivo)
   ├─ Sube foto (archivo)
   → Todos subidos → "Continuar"

6. FASE 5: Pago
   ├─ Lee total: $95.00
   ├─ Selecciona método: "Tarjeta de crédito"
   └─ Click "Pagar" → Redirige a pasarela

7. FASE 6: Seguimiento
   ├─ Ve código PAP-2026-001234
   ├─ Retiro en 15 días
   └─ ✅ TRÁMITE COMPLETADO
```

---

### **Escenario 2: Ecuatoriano naturalizado, renovación, adulto mayor**

```
1. Usuario: "Necesito renovar mi pasaporte"
   → Entra a Obtener Pasaporte

2. FASE 1: Lee información → "Continuar"

3. FASE 2: Segmentación
   ├─ Paso 1: "Soy ecuatoriano"
   ├─ Paso 2: "Por naturalización" ⚠️ Se recordará para agregar requisito
   ├─ Paso 4: "Renovación" ⚠️ Se pedirá pasaporte anterior
   ├─ Paso 5: "Adulto mayor" ⚠️ Atención prioritaria
   ├─ Paso 6: "No"
   └─ Paso 99: Resumen + "Continuar"

4. FASE 3: Requisitos (ADAPTADOS)
   ├─ Cédula vigente: "Tengo" ✓
   ├─ Certificado votación: "Tengo" ✓
   ├─ Foto pasaporte: "Tengo" ✓
   ├─ Pasaporte anterior: "Tengo" ✓ (por ser renovación)
   └─ Carta naturalización: "Tengo" ✓ (por ser naturalizado)
   → Todos OK → "Continuar"

5. FASE 4: Documentación
   ├─ Sube todos los archivos
   └─ "Continuar"

6. FASE 5: Pago
   ├─ Total: $95.00
   ├─ (Nota: Atención prioritaria puede tener descuento o tramitación más rápida)
   └─ "Pagar"

7. FASE 6: Seguimiento
   ├─ ✅ TRÁMITE COMPLETADO
   └─ (Nota: Adulto mayor, prioritario)
```

---

### **Escenario 3: Extranjero, residente legal, primera vez**

```
1. Usuario: "Quiero pasaporte ecuatoriano"
   → Entra a Obtener Pasaporte

2. FASE 1: Lee información → "Continuar"

3. FASE 2: Segmentación
   ├─ Paso 1: "Soy extranjero" ⚠️ Otro árbol
   ├─ Paso 3: "Tengo residencia legal"
   ├─ Paso 4: "Primera vez"
   ├─ Paso 5: "Adulto"
   ├─ Paso 6: "No"
   └─ Paso 99: Resumen → "Continuar"

4. FASE 3: Requisitos (ADAPTADOS)
   ├─ Documento de identidad del país origen
   ├─ Certificado de residencia legal
   ├─ Foto pasaporte
   └─ (Otros según legislación)
   → "Continuar"

5. FASE 4: Documentación
   ├─ Sube documentos
   └─ "Continuar"

6. FASE 5: Pago
   └─ "Pagar"

7. FASE 6: Seguimiento
   └─ ✅ COMPLETADO
```

---

## 📊 ÁRBOL DE DECISIÓN VISUAL

```
                         OBTENER PASAPORTE
                              |
                    ¿Nacionalidad?
                       /          \
                      /            \
              ECUATORIANO      EXTRANJERO
                  |                  |
            ¿Cómo?              ¿Estatus?
           /     \             /    |    \
         Por    Por       Legal Turista Irregular
      Nacim.  Natur.              |    BLOQUEADO
         |      |                 |
         └──┬──┘                  |
            |____________¿Tipo____?
                    /  |  |  \
                   /   |  |   \
               Primera Reno Pérdida Dup
               Vez      vación  Robo
                    \   |  |  /
                     ¿Edad?
                    /  |  \
                  <18 18-65 >65
                  |    |    |
              Menor Adulto A.Mayor
                |    |    |
              (+ req) Normal (Prior.)
                  |
              ¿Discapacidad?
                 / \
                Sí  No
                |    |
           (Prefer) Normal
                |
         FASE 3: REQUISITOS
                |
         FASE 4: DOCUMENTACIÓN
                |
         FASE 5: PAGO
                |
         FASE 6: SEGUIMIENTO
```

---

## ✅ CHECKLIST DE COMPONENTES NECESARIOS

- [ ] `SegmentacionPasaporte.tsx` - Árbol de decisiones (CRÍTICO)
- [ ] `PrerequisitosCheck.tsx` - Validación de requisitos
- [ ] `FaseContenido.tsx` - Contenido de cada fase
- [ ] Actualizar `tramites-catalog.json` - Requisitos condicionales por segmento
- [ ] `tramiteStore.ts` - Guardar segmentación en estado global
- [ ] `useTramiteFlow.ts` - Lógica de navegación entre fases
- [ ] Métodos de pago (integración con pasarela)
- [ ] Sistema de seguimiento con código único

---

## 🎯 MVP ALCANCE

**IN SCOPE (Lo que SÍ hacemos):**
- ✅ Árbol de decisiones de segmentación
- ✅ Requisitos dinámicos según segmento
- ✅ 6 fases completas
- ✅ UI responsive
- ✅ Guardado de progreso (Zustand)

**OUT OF SCOPE (Lo que NO hacemos aún):**
- ❌ Integración real con Registro Civil
- ❌ Pasarela de pago real (puede ser mockup)
- ❌ Email confirmaciones
- ❌ API real para seguimiento
- ❌ Autenticación de usuarios

