import { useMemo } from 'react';
import { useTramiteStore } from '../store/tramiteStore';
import { tramitesService } from '../services/tramitesService';
import type { FaseTramite, RamaSecundaria } from '../types/tramite.types';

export function useTramiteFlow(tramiteId: string) {
  const store = useTramiteStore();
  const tramite = tramitesService.getPorId(tramiteId);

  // Usar directamente progresoActual del store
  const faseActual = store.progresoActual?.faseActual || 'informacion';
  
  // Convertir pasosCompletados (string[]) a fasesCompletadas (FaseTramite[])
  const fasesCompletadas: FaseTramite[] = useMemo(() => {
    const pasos = store.progresoActual?.pasosCompletados || [];
    const fasesSet = new Set<FaseTramite>();
    if (tramite) {
      tramite.pasos.forEach(paso => {
        if (pasos.includes(paso.id)) {
          fasesSet.add(paso.fase);
        }
      });
    }
    return Array.from(fasesSet);
  }, [store.progresoActual?.pasosCompletados, tramite]);

  // Obtener prerequisitos cumplidos del store
  const prerequisitosCumplidos = useMemo(() => {
    return store.progresoActual?.prerequisitosCumplidos || {};
  }, [store.progresoActual?.prerequisitosCumplidos]);

  // Obtener prerequisitos dinámicos según segmentación
  const prerequisitosDinamicos = useMemo(() => {
    if (!tramite) return [];
    const segmento = store.progresoActual?.segmento;
    return tramitesService.getPrerequisitosCondicionales(tramiteId, segmento);
  }, [tramiteId, tramite, store.progresoActual?.segmento]);

  // Obtener ramas activas
  const ramasActivas = useMemo(() => {
    return (
      store.progresoActual?.ramasAbiertas.filter(
        (rama) => rama.estado === 'en-progreso' || rama.estado === 'pendiente'
      ) || []
    );
  }, [store.progresoActual?.ramasAbiertas]);

  // Obtener paso actual según la fase
  const pasoActual = useMemo(() => {
    if (!tramite) return null;
    return tramite.pasos.find((p) => p.fase === faseActual) || null;
  }, [tramite, faseActual]);

  const cambiarFase = (nuevaFase: FaseTramite) => {
    store.cambiarFase(nuevaFase);
  };

  const completarPaso = (pasoId: string) => {
    store.completarPaso(pasoId);
    
    const fases: FaseTramite[] = ['informacion', 'requisitos', 'pago', 'seguimiento'];
    const indiceActual = fases.indexOf(faseActual);
    if (indiceActual < fases.length - 1) {
      const siguienteFase = fases[indiceActual + 1];
      setTimeout(() => cambiarFase(siguienteFase), 500);
    }
  };

  const actualizarPrerequisitos = (cumplidos: Record<string, boolean>) => {
    Object.entries(cumplidos).forEach(([id, valor]) => {
      store.actualizarPrerequisito(id, valor);
    });
  };

  const abrirRamaSecundaria = (tramiteRelacionadoId: string, prerequisitoId: string, contexto: string) => {
    const rama: RamaSecundaria = {
      id: `rama-${Date.now()}`,
      tramiteId: tramiteRelacionadoId,
      parenteTramiteId: tramiteId,
      estado: 'en-progreso',
      contexto: `Necesitas completar: ${contexto}`,
      prerequisitoAsociado: prerequisitoId,
      fechaApertura: new Date().toISOString(),
    };

    store.abrirRama(rama);
  };

  const cerrarRama = (ramaId: string, prerequisitoId: string, cancelar = false) => {
    store.cerrarRama(ramaId);
    
    if (!cancelar) {
      store.actualizarPrerequisito(prerequisitoId, true);
    }
  };

  return {
    faseActual,
    pasoActual,
    fasesCompletadas,
    prerequisitosCumplidos,
    prerequisitosDinamicos,
    ramasActivas,
    cambiarFase,
    completarPaso,
    actualizarPrerequisitos,
    abrirRamaSecundaria,
    cerrarRama,
  };
}
