// ==============================================
// 🎨 TEMA Y CONSTANTES - Govly App
// ==============================================

export const COLORS = {
  // Primarios
  primary: '#FACC15', // Amarillo Govly
  primaryDark: '#EAB308',
  primaryLight: '#FEF3C7',
  
  // Fondos
  bg: '#F3F4F6',
  bgLight: '#F9FAFB',
  white: '#FFFFFF',
  
  // Texto
  textMain: '#111827',
  textSec: '#6B7280',
  textLight: '#9CA3AF',
  
  // Colores de acento
  blue: '#3B82F6',
  blueLight: '#DBEAFE',
  green: '#10B981',
  greenLight: '#D1FAE5',
  red: '#EF4444',
  redLight: '#FEE2E2',
  
  // Bordes
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  
  // Overlays
  overlay: 'rgba(0,0,0,0.5)',
} as const;

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  yellow: {
    shadowColor: '#FACC15',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
} as const;

export const FONTS = {
  regular: {
    fontWeight: '400' as const,
  },
  medium: {
    fontWeight: '500' as const,
  },
  semiBold: {
    fontWeight: '600' as const,
  },
  bold: {
    fontWeight: '700' as const,
  },
  extraBold: {
    fontWeight: '800' as const,
  },
} as const;

export const SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

// Datos de trámites para la UI
export const TRAMITES_DATA = [
  { 
    id: 'pasaporte', 
    icon: 'passport', 
    title: 'Obtener Pasaporte', 
    desc: 'Primera vez o renovación', 
    time: '15 días', 
    cost: '$95.00' 
  },
  { 
    id: 'cedula', 
    icon: 'id-card', 
    title: 'Renovar Cédula', 
    desc: 'Por pérdida o caducidad', 
    time: '1 hora', 
    cost: '$16.00' 
  },
  { 
    id: 'licencia_conducir', 
    icon: 'car', 
    title: 'Licencia de Conducir', 
    desc: 'Tipo B o Profesional', 
    time: '2 horas', 
    cost: '$68.00' 
  },
] as const;

export const REQUIREMENTS_MOCK = [
  { id: '1', label: 'Cédula de identidad vigente', completed: true },
  { id: '2', label: 'Certificado de votación', completed: true },
  { id: '3', label: 'Turno impreso (Generado en web)', completed: false },
] as const;

export type TramiteData = typeof TRAMITES_DATA[number];
