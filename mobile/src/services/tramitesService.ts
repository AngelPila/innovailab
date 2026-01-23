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

    // LÓGICA ESPECIAL PARA PASAPORTE
    if (tramiteId === 'obtener_pasaporte') {
      return this.getPrerequisitosPasaporte(tramite, segmento);
    }

    // LÓGICA GENÉRICA PARA OTROS TRÁMITES
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

  // LÓGICA ESPECIAL PARA PASAPORTE
  private getPrerequisitosPasaporte(tramite: Tramite, segmento?: any): any[] {
    // Requisitos base (siempre requeridos)
    const prerequisitosBase = [
      'cedula_vigente_pasaporte',
      'certificado_votacion',
      'foto_pasaporte',
    ];

    const requisitosRequeridos = new Set(prerequisitosBase);

    // CASO 1: Usuario es MENOR DE EDAD
    if (segmento?.categoria === 'menor-edad') {
      requisitosRequeridos.add('autorizacion_padres');
      requisitosRequeridos.add('acta_nacimiento_menor');
    }

    // CASO 2: Usuario es NATURALIZADO
    if (segmento?.esNaturalizado === true) {
      requisitosRequeridos.add('carta_naturalizacion');
    }

    // CASO 3: Usuario es EXTRANJERO
    if (segmento?.nacionalidad === 'extranjero') {
      // Extranjeros pueden necesitar documentación adicional
      // Por ahora, solo los requisitos base
    }

    // CASO 4: Usuario perdió/robó su pasaporte
    if (segmento?.tipoTramite === 'perdida-robo') {
      requisitosRequeridos.add('denuncia_perdida');
      // NO necesita pasaporte anterior si lo perdió
      requisitosRequeridos.delete('pasaporte_anterior');
    }

    // CASO 5: Usuario renueva pasaporte existente
    if (segmento?.tipoTramite === 'renovacion') {
      requisitosRequeridos.add('pasaporte_anterior');
      // NO necesita denuncia si es renovación normal
      requisitosRequeridos.delete('denuncia_perdida');
    }

    // Filtrar y retornar solo los requisitos necesarios
    return tramite.prerequisitos.filter((pre) =>
      requisitosRequeridos.has(pre.id)
    );
  }

  // LÓGICA ESPECIAL PARA LICENCIA DE CONDUCIR
  getRequisitosDinamicosLicencia(tipoLicencia: string, esRenovacion: boolean, esProfesional: boolean): any[] {
    const tramite = this.getPorId('licencia_conducir');
    if (!tramite) return [];

    // Requisitos base (siempre requeridos)
    const requisitosBase = ['cedula_vigente_licencia', 'tipo_sangre', 'curso_conduccion'];

    const requisitosRequeridos = new Set(requisitosBase);

    // CASO 1: Es licencia profesional
    if (esProfesional) {
      requisitosRequeridos.add('verificacion_antecedentes');
      requisitosRequeridos.add('capacitacion_avanzada');
    }

    // CASO 2: Es renovación (no primera vez)
    if (esRenovacion) {
      requisitosRequeridos.add('licencia_anterior');
      requisitosRequeridos.delete('curso_conduccion'); // Ya lo completó en la primera
    }

    // CASO 3: Según tipo de licencia
    if (tipoLicencia === 'a') {
      // Motocicleta - requisitos específicos
      requisitosRequeridos.add('examen_motos');
    } else if (tipoLicencia === 'b') {
      // Vehículos particulares - requisitos estándar (ya están)
    } else if (tipoLicencia === 'c' || tipoLicencia === 'd' || tipoLicencia === 'e') {
      // Transporte pesado
      requisitosRequeridos.add('certificado_salud_completo');
      requisitosRequeridos.add('examen_vision_profesional');
    }

    // Retornar los requisitos mapeados al catálogo
    return tramite.prerequisitos.filter((pre) =>
      requisitosRequeridos.has(pre.id)
    );
  }
}

// Exportar instancia única (singleton)
export const tramitesService = new TramitesService();
