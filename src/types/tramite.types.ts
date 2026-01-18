// Tipos principales para el sistema de trámites

export type TramiteCategoria = 'identidad' | 'vehicular' | 'internacional' | 'educacion' | 'salud';

export type FaseTramite = 'informacion' | 'requisitos' | 'documentacion' | 'pago' | 'seguimiento';

export type EstadoRama = 'pendiente' | 'en-progreso' | 'completado' | 'cancelado';

export interface Tramite {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: TramiteCategoria;
  prerequisitos: Prerequisito[];
  pasos: PasoTramite[];
  estimadoDias: number;
  costo?: number;
  icono?: string;
}

export interface Prerequisito {
  id: string;
  nombre: string; // "Cédula vigente", "Pasaporte vigente"
  tipo: 'documento' | 'validacion' | 'archivo';
  tramiteRelacionado?: string; // ID del trámite para obtenerlo
  esOpcional: boolean;
  preguntaValidacion: string; // "¿Tienes tu cédula vigente?"
  descripcion?: string;
}

export interface PasoTramite {
  id: string;
  orden: number;
  fase: FaseTramite;
  titulo: string;
  descripcion: string;
  contenido?: string;
  validaciones?: string[];
  esOpcional?: boolean;
}

export interface ProgresoUsuario {
  tramiteActual: string | null;
  prerequisitosCumplidos: Record<string, boolean>;
  faseActual: FaseTramite;
  pasosCompletados: string[];
  ramasAbiertas: RamaSecundaria[];
  documentosSubidos: Record<string, boolean>;
  fechaInicio?: string;
  fechaUltimaActualizacion?: string;
}

export interface RamaSecundaria {
  id: string;
  tramiteId: string;
  parenteTramiteId: string;
  estado: EstadoRama;
  contexto: string; // Por qué se abrió esta rama
  prerequisitoAsociado: string; // ID del prerequisito que falta
  fechaApertura: string;
  fechaCierre?: string;
}

export interface ValidacionRespuesta {
  prerequisitoId: string;
  tieneDocumento: boolean;
  notas?: string;
}

export interface ContextoTramite {
  tramite: Tramite;
  progreso: ProgresoUsuario;
  ramasActivas: RamaSecundaria[];
  prerequisitosFaltantes: Prerequisito[];
}
