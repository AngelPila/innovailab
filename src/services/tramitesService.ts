import tramitesCatalog from '../data/tramites-catalog.json';
import type { Tramite } from '../types/tramite.types';

class TramitesService {
  private tramites: Tramite[];

  constructor() {
    this.tramites = tramitesCatalog.tramites as Tramite[];
  }

  // Obtener todos los trámites
  getTodos(): Tramite[] {
    return this.tramites;
  }

  // Obtener un trámite por ID
  getPorId(id: string): Tramite | undefined {
    return this.tramites.find((t) => t.id === id);
  }

  // Buscar trámites por nombre o descripción
  buscar(query: string): Tramite[] {
    const queryLower = query.toLowerCase();
    return this.tramites.filter(
      (t) =>
        t.nombre.toLowerCase().includes(queryLower) ||
        t.descripcion.toLowerCase().includes(queryLower)
    );
  }

  // Detectar intención de trámite desde texto
  detectarIntencion(mensaje: string): Tramite | null {
    const mensajeLower = mensaje.toLowerCase();

    // Mapeo de palabras clave a IDs de trámites
    const mapeoIntenciones: Record<string, string> = {
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

    // Buscar coincidencias
    for (const [palabra, tramiteId] of Object.entries(mapeoIntenciones)) {
      if (mensajeLower.includes(palabra)) {
        return this.getPorId(tramiteId) || null;
      }
    }

    return null;
  }

  // Obtener trámites por categoría
  getPorCategoria(categoria: string): Tramite[] {
    return this.tramites.filter((t) => t.categoria === categoria);
  }

  // Obtener trámites relacionados (para pre-requisitos)
  getTramitesRelacionados(tramiteId: string): Tramite[] {
    const tramite = this.getPorId(tramiteId);
    if (!tramite) return [];

    const tramitesRelacionados: Tramite[] = [];

    tramite.prerequisitos.forEach((pre) => {
      if (pre.tramiteRelacionado) {
        const relacionado = this.getPorId(pre.tramiteRelacionado);
        if (relacionado) {
          tramitesRelacionados.push(relacionado);
        }
      }
    });

    return tramitesRelacionados;
  }

  // Obtener prerequisitos dinámicos según segmentación
  getPrerequisitosCondicionales(tramiteId: string, segmento?: any): any[] {
    const tramite = this.getPorId(tramiteId);
    if (!tramite) return [];

    // Filtrar prerequisitos según condiciones
    const prerequisitosFiltrados = tramite.prerequisitos.filter((pre) => {
      // Si no tiene condición, siempre se incluye
      if (!pre.condicional) return true;

      // Verificar tipo de trámite
      if (pre.condicional.tipoTramite && segmento?.tipoTramite) {
        if (!pre.condicional.tipoTramite.includes(segmento.tipoTramite)) {
          return false;
        }
      }

      // Verificar categoría
      if (pre.condicional.categoria && segmento?.categoria) {
        if (!pre.condicional.categoria.includes(segmento.categoria)) {
          return false;
        }
      }

      // Verificar naturalización
      if (pre.condicional.esNaturalizado !== undefined && segmento?.esNaturalizado !== undefined) {
        if (pre.condicional.esNaturalizado !== segmento.esNaturalizado) {
          return false;
        }
      }

      return true;
    });

    return prerequisitosFiltrados;
  }
}

// Exportar instancia única (singleton)
export const tramitesService = new TramitesService();
