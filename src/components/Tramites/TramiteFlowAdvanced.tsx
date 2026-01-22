import { useEffect, useState } from 'react';
import { useTramiteStore } from '../../store/tramiteStore';
import { tramitesService } from '../../services/tramitesService';
import { useTramiteFlow } from '../../hooks/useTramiteFlow';
import { ProgressBar } from './ProgressBar';
import { ArrowLeft } from 'lucide-react';
import type { FaseTramite } from '../../types/tramite.types';
import { SegmentacionPasaporte } from './SegmentacionPasaporte';
import { SegmentacionLicencia } from './SegmentacionLicencia';
import { PrerequisitosCheck } from './PrerequisitosCheck';
import { FaseContenido } from './FaseContenido';
import { FaseContenidoLicencia } from './FaseContenidoLicencia';
import { FasePago } from './FasePago';
import { FaseSeguimiento } from './FaseSeguimiento';

interface Props {
  tramiteId: string;
  esRama?: boolean;
  onCompletarRama?: () => void;
  onAbrirRamaEnPestaña?: (tramiteId: string, nombreTramite: string, prerequisitoId: string) => void;
  tabsAbiertos?: string[];
  onVolverAlChat?: () => void;
}

const PASOS = ['Información', 'Requisitos', 'Pago', 'Seguimiento'];

/**
 * TramiteFlowAdvanced - Versión completa para jóvenes y usuarios regulares
 * Características:
 * - Barra de progreso visible
 * - Flujo rápido y directo
 * - Menos instrucciones
 * - Todas las funcionalidades
 * - Historial y sincronización disponibles
 */
export function TramiteFlowAdvanced({
  tramiteId,
  esRama = false,
  onCompletarRama,
  onAbrirRamaEnPestaña,
  tabsAbiertos = [],
  onVolverAlChat,
}: Props) {
  const tramite = tramitesService.getPorId(tramiteId);
  const { iniciarTramite, progresoActual, progresoMultiple } = useTramiteStore();

  const {
    faseActual,
    pasoActual,
    fasesCompletadas,
    prerequisitosCumplidos,
    prerequisitosDinamicos,
    cambiarFase,
    completarPaso,
    actualizarPrerequisitos,
  } = useTramiteFlow(tramiteId);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!esRama) {
      const esNuevaApertura = !progresoMultiple[tramiteId];
      iniciarTramite(tramiteId, esNuevaApertura);
    }
  }, [tramiteId, esRama, progresoMultiple]);

  // Saltar directamente a requisitos SOLO para pasaporte
  // Para licencia, mostrar Información primero
  useEffect(() => {
    if (faseActual === 'informacion' && tramiteId !== 'licencia_conducir') {
      cambiarFase('requisitos');
    }
  }, []);

  // Actualizar el índice del paso actual
  useEffect(() => {
    const faseIndex = PASOS.findIndex(
      (p) => p.toLowerCase().replace(' ', '') === faseActual
    );
    if (faseIndex !== -1) {
      setCurrentStepIndex(faseIndex);
    }
  }, [faseActual]);

  if (!tramite) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Trámite no encontrado</p>
      </div>
    );
  }

  const handleValidacionCompleta = (cumplidos: Record<string, boolean>) => {
    actualizarPrerequisitos(cumplidos);
    setTimeout(() => cambiarFase('pago'), 300);
  };

  const handleNavegación = (nuevaFase: FaseTramite) => {
    cambiarFase(nuevaFase);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Progress Bar */}
      <ProgressBar
        currentStep={currentStepIndex + 1}
        totalSteps={PASOS.length}
        stepLabels={PASOS}
      />

      {/* Header compacto */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <span className="text-lg font-bold text-yellow-700">📋</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{tramite.nombre}</h1>
              <p className="text-sm text-gray-500">Paso {currentStepIndex + 1} de {PASOS.length}</p>
            </div>
          </div>
          {onVolverAlChat && (
            <button
              onClick={onVolverAlChat}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Volver al chat"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 py-6">
          {/* Fase: Información */}
          {faseActual === 'informacion' && (
            <>
              {tramiteId === 'licencia_conducir' ? (
                <FaseContenidoLicencia
                  onCompletar={() => cambiarFase('requisitos')}
                />
              ) : (
                <>
                  <FaseContenido
                    paso={pasoActual!}
                    estaCompletado={fasesCompletadas.includes('informacion')}
                    onCompletar={() => cambiarFase('requisitos')}
                  />

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => handleNavegación('requisitos')}
                      className="flex-1 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg"
                    >
                      Siguiente
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {/* Fase: Requisitos con segmentación */}
          {faseActual === 'requisitos' && (
            <>
              {tramiteId === 'licencia_conducir' ? (
                <SegmentacionLicencia
                  onConfirm={() => {
                    setTimeout(() => {
                      cambiarFase('pago');
                    }, 300);
                  }}
                />
              ) : (
                <SegmentacionPasaporte
                  onConfirm={() => {
                    setTimeout(() => {
                      cambiarFase('pago');
                    }, 300);
                  }}
                />
              )}

              <PrerequisitosCheck
                prerequisitos={prerequisitosDinamicos}
                prerequisitosCumplidos={prerequisitosCumplidos}
                onValidacionCompleta={handleValidacionCompleta}
                onAbrirRamaEnPestaña={onAbrirRamaEnPestaña}
              />
            </>
          )}

          {/* Fase: Pago */}
          {faseActual === 'pago' && (
            <>
              <FasePago
                tramite={tramite}
                onCompletar={() => cambiarFase('seguimiento')}
              />
            </>
          )}

          {/* Fase: Seguimiento */}
          {faseActual === 'seguimiento' && (
            <>
              <FaseSeguimiento
                tramite={tramite}
                tabsAbiertos={tabsAbiertos}
              />
            </>
          )}
        </div>
      </div>

      {/* Footer con navegación compacta */}
      <div className="bg-white border-t border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => {
              if (currentStepIndex > 0) {
                const fases: FaseTramite[] = ['informacion', 'requisitos', 'pago', 'seguimiento'];
                cambiarFase(fases[currentStepIndex - 1]);
              } else if (onVolverAlChat) {
                onVolverAlChat();
              }
            }}
            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
          >
            Anterior
          </button>

          <span className="text-sm text-gray-500">
            {currentStepIndex + 1} / {PASOS.length}
          </span>

          <button
            onClick={() => {
              if (currentStepIndex < PASOS.length - 1) {
                const fases: FaseTramite[] = ['informacion', 'requisitos', 'pago', 'seguimiento'];
                cambiarFase(fases[currentStepIndex + 1]);
              }
            }}
            disabled={currentStepIndex === PASOS.length - 1}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
