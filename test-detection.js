// Test script para verificar la detección de trámites
// Run with: node test-detection.js

import fs from 'fs';

const catalog = JSON.parse(fs.readFileSync('./src/data/tramites-catalog.json', 'utf-8'));

class TramitesService {
  constructor() {
    this.tramites = catalog.tramites;
  }

  getPorId(id) {
    return this.tramites.find((t) => t.id === id);
  }

  detectarIntencion(mensaje) {
    const mensajeLower = mensaje.toLowerCase();

    const mapeoIntenciones = {
      cédula: 'renovacion_cedula',
      cedula: 'renovacion_cedula',
      renovar: 'renovacion_cedula',
      pasaporte: 'obtener_pasaporte',
      visa: 'visa_americana',
      'visa americana': 'visa_americana',
      'estados unidos': 'visa_americana',
      licencia: 'licencia_conducir',
      'licencia de conducir': 'licencia_conducir',
      conducir: 'licencia_conducir',
      manejar: 'licencia_conducir',
    };

    for (const [palabra, tramiteId] of Object.entries(mapeoIntenciones)) {
      if (mensajeLower.includes(palabra)) {
        return this.getPorId(tramiteId) || null;
      }
    }

    return null;
  }
}

const tramitesService = new TramitesService();

// Test 1: Detectar "pasaporte"
console.log('Test 1: "Quiero sacar pasaporte"');
const test1 = tramitesService.detectarIntencion('Quiero sacar pasaporte');
console.log('Resultado:', test1 ? test1.nombre : 'NO DETECTADO');
console.log('ID:', test1?.id);
console.log('');

// Test 2: Detectar "obtener pasaporte"
console.log('Test 2: "Necesito obtener pasaporte"');
const test2 = tramitesService.detectarIntencion('Necesito obtener pasaporte');
console.log('Resultado:', test2 ? test2.nombre : 'NO DETECTADO');
console.log('');

// Test 3: Ver todos los trámites
console.log('Test 3: Todos los trámites en el catálogo:');
catalog.tramites.forEach((t) => {
  console.log(`  - ${t.id}: ${t.nombre}`);
});
