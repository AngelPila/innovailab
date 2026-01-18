export const tramiteLugaresConfig: Record<string, string[]> = {
  'renovacion_cedula': ['registro_civil', 'banco'],
  'obtencion_pasaporte': ['registro_civil', 'banco', 'notaria'],
  'obtener_pasaporte': ['registro_civil', 'banco', 'notaria'],
  'licencia_conducir': ['registro_civil', 'banco'],
  'tramite_visa': ['banco'],
  'visa_americana': ['banco'],
};

export function getPlacesForTramite(tramiteId: string): string[] {
  return tramiteLugaresConfig[tramiteId] || ['registro_civil', 'banco'];
}

export const placeLabelMap: Record<string, string> = {
  'registro_civil': 'Registro Civil',
  'banco': 'Banco',
  'notaria': 'Notaría',
};
