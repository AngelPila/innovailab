/**
 * Servicio de mapeo de prerequisitos a enlaces (trámites relacionados o URLs de gobierno)
 * Proporciona información sobre dónde obtener cada documento faltante
 */

export interface PrerequisiteLink {
  tipo: 'tramite' | 'url-gobierno' | 'otro';
  id?: string; // ID del trámite relacionado o identificador único
  nombre: string;
  url?: string;
  descripcion?: string;
  icono?: string;
}

const PREREQUISITE_LINKS: Record<string, PrerequisiteLink> = {
  // DOCUMENTOS DE IDENTIDAD
  cedula_vigente: {
    tipo: 'tramite',
    id: 'renovar_cedula',
    nombre: 'Renovar Cédula de Identidad',
    descripcion: 'Solicita una nueva cédula de identidad vigente',
  },
  cedula_vigente_pasaporte: {
    tipo: 'tramite',
    id: 'renovar_cedula',
    nombre: 'Renovar Cédula de Identidad',
    descripcion: 'Necesaria como requisito previo para el pasaporte',
  },
  pasaporte_vigente: {
    tipo: 'tramite',
    id: 'obtener_pasaporte',
    nombre: 'Obtener Pasaporte',
    descripcion: 'Solicita tu pasaporte ecuatoriano',
  },
  licencia_vigente: {
    tipo: 'tramite',
    id: 'renovar_licencia_conducir',
    nombre: 'Renovar Licencia de Conducir',
    descripcion: 'Renueva tu licencia de conducir',
  },
  
  // DOCUMENTOS DE REGISTRO CIVIL
  certificado_nacimiento: {
    tipo: 'url-gobierno',
    url: 'https://www.registrocivil.gob.ec/',
    nombre: 'Solicitar Certificado de Nacimiento',
    descripcion: 'Dirígete al Registro Civil más cercano',
    icono: '🏛️',
  },
  partida_nacimiento: {
    tipo: 'url-gobierno',
    url: 'https://www.registrocivil.gob.ec/',
    nombre: 'Solicitar Partida de Nacimiento',
    descripcion: 'Dirígete al Registro Civil más cercano',
    icono: '🏛️',
  },
  certificado_matrimonio: {
    tipo: 'url-gobierno',
    url: 'https://www.registrocivil.gob.ec/',
    nombre: 'Solicitar Certificado de Matrimonio',
    descripcion: 'Dirígete al Registro Civil más cercano',
    icono: '🏛️',
  },
  divorcio_legal: {
    tipo: 'url-gobierno',
    url: 'https://www.registrocivil.gob.ec/',
    nombre: 'Registrar Divorcio en Registro Civil',
    descripcion: 'Dirígete al Registro Civil más cercano',
    icono: '⚖️',
  },
  
  // DOCUMENTOS LABORALES Y SEGURIDAD SOCIAL
  afiliacion_iess: {
    tipo: 'url-gobierno',
    url: 'https://www.iess.gob.ec/',
    nombre: 'Registrarse en el IESS',
    descripcion: 'Instituto Ecuatoriano de Seguridad Social',
    icono: '🏢',
  },
  historial_laboral: {
    tipo: 'url-gobierno',
    url: 'https://www.iess.gob.ec/',
    nombre: 'Historial Laboral del IESS',
    descripcion: 'Solicita tu historial laboral en el IESS',
    icono: '📋',
  },
  
  // DOCUMENTOS FISCALES Y TRIBUTARIOS
  ruc_vigente: {
    tipo: 'url-gobierno',
    url: 'https://www.sri.gob.ec/',
    nombre: 'Solicitar RUC en el SRI',
    descripcion: 'Registro Único de Contribuyentes',
    icono: '🏛️',
  },
  ruc: {
    tipo: 'url-gobierno',
    url: 'https://www.sri.gob.ec/',
    nombre: 'Solicitar RUC en el SRI',
    descripcion: 'Registro Único de Contribuyentes',
    icono: '🏛️',
  },
  situacion_tributaria_certificada: {
    tipo: 'url-gobierno',
    url: 'https://www.sri.gob.ec/',
    nombre: 'Certificado de Situación Tributaria - SRI',
    descripcion: 'Solicita tu certificado en el SRI',
    icono: '📄',
  },
  
  // DOCUMENTOS DE VEHICULOS
  titulo_vehiculo: {
    tipo: 'url-gobierno',
    url: 'https://www.ant.gob.ec/',
    nombre: 'Trámites Vehiculares - ANT',
    descripcion: 'Agencia Nacional de Tránsito',
    icono: '🚗',
  },
  permiso_circulacion: {
    tipo: 'url-gobierno',
    url: 'https://www.ant.gob.ec/',
    nombre: 'Permiso de Circulación - ANT',
    descripcion: 'Agencia Nacional de Tránsito',
    icono: '🚗',
  },
  soat: {
    tipo: 'url-gobierno',
    url: 'https://www.ant.gob.ec/',
    nombre: 'Seguro SOAT',
    descripcion: 'Seguro Obligatorio de Accidentes de Tránsito',
    icono: '📋',
  },
  
  // DOCUMENTOS BANCARIOS
  cuenta_bancaria: {
    tipo: 'url-gobierno',
    url: 'https://www.superbancos.gob.ec/',
    nombre: 'Abrir Cuenta Bancaria',
    descripcion: 'Contacta a tu banco de preferencia',
    icono: '🏦',
  },
  
  // DOCUMENTOS DE PROPIEDAD
  escritura_propiedad: {
    tipo: 'url-gobierno',
    url: 'https://www.registropropiedad.gob.ec/',
    nombre: 'Registro de Propiedad',
    descripcion: 'Registra tu propiedad ante el Registro',
    icono: '🏠',
  },
};

/**
 * Obtiene el enlace para un prerequisito específico
 * Primero busca tramiteRelacionado, luego busca en el mapeo de URLs
 */
export function getPrerequisiteLink(
  prerequisiteId: string,
  tramiteRelacionadoId?: string
): PrerequisiteLink | null {
  // Si existe un trámite relacionado, devolverlo primero
  if (tramiteRelacionadoId) {
    return {
      tipo: 'tramite',
      id: tramiteRelacionadoId,
      nombre: 'Realizar trámite relacionado',
      descripcion: 'Este documento se obtiene a través de otro trámite',
    };
  }

  // Buscar en el mapeo de prerequisitos
  return PREREQUISITE_LINKS[prerequisiteId] || null;
}

/**
 * Obtiene todos los links disponibles para un prerequisito
 * Útil para proporcionar múltiples opciones
 */
export function getAllPrerequisiteLinks(prerequisiteId: string): PrerequisiteLink[] {
  const mainLink = PREREQUISITE_LINKS[prerequisiteId];
  if (!mainLink) return [];
  return [mainLink];
}

/**
 * Retorna la URL de gobierno o null si no existe
 */
export function getGovernmentUrl(prerequisiteId: string): string | null {
  const link = PREREQUISITE_LINKS[prerequisiteId];
  if (link && link.tipo === 'url-gobierno' && link.url) {
    return link.url;
  }
  return null;
}

/**
 * Obtiene el ícono para un tipo de gobierno
 */
export function getGovernmentIcon(prerequisiteId: string): string {
  const link = PREREQUISITE_LINKS[prerequisiteId];
  if (link && link.icono) {
    return link.icono;
  }
  return '🏛️'; // Ícono por defecto
}

export const prerequisiteLinksService = {
  getPrerequisiteLink,
  getAllPrerequisiteLinks,
  getGovernmentUrl,
  getGovernmentIcon,
};
