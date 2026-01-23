import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProgresoUsuario, RamaSecundaria, FaseTramite } from '../types/tramite.types';

interface TramiteStore {
  // Estado
  progresoActual: ProgresoUsuario | null;
  progresoMultiple: Record<string, ProgresoUsuario>; // Guardar progreso de cada tramite abierto
  
  // Acciones
  iniciarTramite: (tramiteId: string, reset?: boolean) => void;
  obtenerProgresoTramite: (tramiteId: string) => ProgresoUsuario;
  guardarProgresoTramite: (tramiteId: string, progreso: ProgresoUsuario) => void;
  actualizarPrerequisito: (prerequisitoId: string, cumplido: boolean) => void;
  abrirRama: (rama: RamaSecundaria) => void;
  cerrarRama: (ramaId: string) => void;
  cambiarFase: (nuevaFase: FaseTramite) => void;
  completarPaso: (pasoId: string) => void;
  subirDocumento: (documentoId: string) => void;
  limpiarProgreso: () => void;
  actualizarProgresoRama: (ramaId: string, completado: boolean) => void;
  setSegmentacion: (segmento: ProgresoUsuario['segmento']) => void;
}

const estadoInicial: ProgresoUsuario = {
  tramiteActual: null,
  prerequisitosCumplidos: {},
  faseActual: 'informacion',
  pasosCompletados: [],
  ramasAbiertas: [],
  documentosSubidos: {},
  fechaInicio: undefined,
  fechaUltimaActualizacion: undefined,
};

export const useTramiteStore = create<TramiteStore>()(
  persist(
    (set, get) => ({
      progresoActual: null,
      progresoMultiple: {},

      obtenerProgresoTramite: (tramiteId: string) => {
        const state = get();
        // Si existe en progresoMultiple, devolverlo; si no, crear uno nuevo
        if (state.progresoMultiple[tramiteId]) {
          return state.progresoMultiple[tramiteId];
        }
        // Retornar estado inicial vacío
        return {
          ...estadoInicial,
          tramiteActual: tramiteId,
          fechaInicio: new Date().toISOString(),
          fechaUltimaActualizacion: new Date().toISOString(),
        };
      },

      guardarProgresoTramite: (tramiteId: string, progreso: ProgresoUsuario) => {
        set((state) => ({
          progresoMultiple: {
            ...state.progresoMultiple,
            [tramiteId]: progreso,
          },
        }));
      },

      iniciarTramite: (tramiteId: string, reset: boolean = false) => {
        set((state) => {
          // Si reset=true, crear nuevo progreso (primera vez)
          if (reset) {
            const nuevoProgreso: ProgresoUsuario = {
              ...estadoInicial,
              tramiteActual: tramiteId,
              fechaInicio: new Date().toISOString(),
              fechaUltimaActualizacion: new Date().toISOString(),
            };

            return {
              progresoActual: nuevoProgreso,
              progresoMultiple: {
                ...state.progresoMultiple,
                [tramiteId]: nuevoProgreso,
              },
            };
          }

          // Si reset=false, recuperar progreso anterior o crear uno nuevo
          if (state.progresoMultiple[tramiteId]) {
            return {
              progresoActual: state.progresoMultiple[tramiteId],
            };
          }

          // Si no existe, crear uno nuevo
          const nuevoProgreso: ProgresoUsuario = {
            ...estadoInicial,
            tramiteActual: tramiteId,
            fechaInicio: new Date().toISOString(),
            fechaUltimaActualizacion: new Date().toISOString(),
          };

          return {
            progresoActual: nuevoProgreso,
            progresoMultiple: {
              ...state.progresoMultiple,
              [tramiteId]: nuevoProgreso,
            },
          };
        });
      },

      actualizarPrerequisito: (prerequisitoId: string, cumplido: boolean) => {
        set((state) => {
          if (!state.progresoActual) return state;

          const tramiteId = state.progresoActual.tramiteActual;
          if (!tramiteId) return state;

          const nuevoProgreso = {
            ...state.progresoActual,
            prerequisitosCumplidos: {
              ...state.progresoActual.prerequisitosCumplidos,
              [prerequisitoId]: cumplido,
            },
            fechaUltimaActualizacion: new Date().toISOString(),
          };

          return {
            progresoActual: nuevoProgreso,
            progresoMultiple: {
              ...state.progresoMultiple,
              [tramiteId]: nuevoProgreso,
            },
          };
        });
      },

      abrirRama: (rama: RamaSecundaria) => {
        set((state) => {
          if (!state.progresoActual) return state;

          // Evitar duplicados
          const yaExiste = state.progresoActual.ramasAbiertas.some(
            (r) => r.tramiteId === rama.tramiteId && r.estado !== 'completado'
          );

          if (yaExiste) return state;

          return {
            progresoActual: {
              ...state.progresoActual,
              ramasAbiertas: [...state.progresoActual.ramasAbiertas, rama],
              fechaUltimaActualizacion: new Date().toISOString(),
            },
          };
        });
      },

      cerrarRama: (ramaId: string) => {
        set((state) => {
          if (!state.progresoActual) return state;

          return {
            progresoActual: {
              ...state.progresoActual,
              ramasAbiertas: state.progresoActual.ramasAbiertas.map((rama) =>
                rama.id === ramaId
                  ? { ...rama, estado: 'completado' as const, fechaCierre: new Date().toISOString() }
                  : rama
              ),
              fechaUltimaActualizacion: new Date().toISOString(),
            },
          };
        });
      },

      cambiarFase: (nuevaFase: FaseTramite) => {
        set((state) => {
          if (!state.progresoActual) return state;

          const tramiteId = state.progresoActual.tramiteActual;
          if (!tramiteId) return state;

          const nuevoProgreso = {
            ...state.progresoActual,
            faseActual: nuevaFase,
            fechaUltimaActualizacion: new Date().toISOString(),
          };

          return {
            progresoActual: nuevoProgreso,
            progresoMultiple: {
              ...state.progresoMultiple,
              [tramiteId]: nuevoProgreso,
            },
          };
        });
      },

      completarPaso: (pasoId: string) => {
        set((state) => {
          if (!state.progresoActual) return state;

          const yaCompletado = state.progresoActual.pasosCompletados.includes(pasoId);
          if (yaCompletado) return state;

          return {
            progresoActual: {
              ...state.progresoActual,
              pasosCompletados: [...state.progresoActual.pasosCompletados, pasoId],
              fechaUltimaActualizacion: new Date().toISOString(),
            },
          };
        });
      },

      subirDocumento: (documentoId: string) => {
        set((state) => {
          if (!state.progresoActual) return state;

          return {
            progresoActual: {
              ...state.progresoActual,
              documentosSubidos: {
                ...state.progresoActual.documentosSubidos,
                [documentoId]: true,
              },
              fechaUltimaActualizacion: new Date().toISOString(),
            },
          };
        });
      },

      actualizarProgresoRama: (ramaId: string, completado: boolean) => {
        set((state) => {
          if (!state.progresoActual) return state;

          return {
            progresoActual: {
              ...state.progresoActual,
              ramasAbiertas: state.progresoActual.ramasAbiertas.map((rama) =>
                rama.id === ramaId
                  ? {
                      ...rama,
                      estado: completado ? ('completado' as const) : ('en-progreso' as const),
                      fechaCierre: completado ? new Date().toISOString() : undefined,
                    }
                  : rama
              ),
              fechaUltimaActualizacion: new Date().toISOString(),
            },
          };
        });
      },

      limpiarProgreso: () => {
        set({ progresoActual: null, progresoMultiple: {} });
      },

      setSegmentacion: (segmento) => {
        set((state) => {
          if (!state.progresoActual) return state;
          return {
            progresoActual: {
              ...state.progresoActual,
              segmento: segmento || undefined,
              fechaUltimaActualizacion: new Date().toISOString(),
            },
          };
        });
      },
    }),
    {
      name: 'govly-tramite-storage',
    }
  )
);
