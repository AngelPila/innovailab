import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProgresoUsuario, RamaSecundaria, FaseTramite } from '../types/tramite.types';

interface TramiteStore {
  // Estado
  progresoActual: ProgresoUsuario | null;
  
  // Acciones
  iniciarTramite: (tramiteId: string) => void;
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

      iniciarTramite: (tramiteId: string) => {
        set({
          progresoActual: {
            ...estadoInicial,
            tramiteActual: tramiteId,
            fechaInicio: new Date().toISOString(),
            fechaUltimaActualizacion: new Date().toISOString(),
          },
        });
      },

      actualizarPrerequisito: (prerequisitoId: string, cumplido: boolean) => {
        set((state) => {
          if (!state.progresoActual) return state;

          return {
            progresoActual: {
              ...state.progresoActual,
              prerequisitosCumplidos: {
                ...state.progresoActual.prerequisitosCumplidos,
                [prerequisitoId]: cumplido,
              },
              fechaUltimaActualizacion: new Date().toISOString(),
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

          return {
            progresoActual: {
              ...state.progresoActual,
              faseActual: nuevaFase,
              fechaUltimaActualizacion: new Date().toISOString(),
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
        set({ progresoActual: null });
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
