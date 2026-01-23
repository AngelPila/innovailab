// Tipos principales para el sistema de trámites

export type TramiteCategoria =
  | 'identidad'
  | 'vehicular'
  | 'internacional'
  | 'educacion'
  | 'salud'
  | 'social'
  | 'tributario'
  | 'municipal'
  | 'legal'
  | 'transporte';

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
  condicional?: {
    tipoTramite?: TipoTramitePasaporte[];
    categoria?: CategoriaSolicitante[];
    esNaturalizado?: boolean;
  };
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
  segmento?: SegmentoUsuario;
  fechaInicio?: string;
  fechaUltimaActualizacion?: string;
}

export type Nacionalidad = 'ecuatoriano' | 'extranjero';
export type EstatusLegal = 'residente-legal' | 'irregular' | 'turistico';
export type TipoTramitePasaporte = 'primera-vez' | 'renovacion' | 'perdida-robo' | 'duplicado';
export type CategoriaSolicitante = 'adulto' | 'menor-edad' | 'adulto-mayor';

export interface SegmentoUsuario {
  // Identidad
  nacionalidad?: Nacionalidad;
  esNaturalizado?: boolean; // ecuatoriano por naturalización
  estatusLegal?: EstatusLegal; // si es extranjero
  
  // Tipo de trámite
  tipoTramite?: TipoTramitePasaporte;
  tienePasaporteAnterior?: boolean;
  
  // Características personales
  categoria?: CategoriaSolicitante;
  edadAproximada?: number;
  tieneDiscapacidad?: boolean;
  
  // Casos especiales
  esTramiteUrgente?: boolean;
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
