import { useEffect, useState } from 'react';
import { useTramiteStore } from '../../store/tramiteStore';
import { tramitesService } from '../../services/tramitesService';
import { useTramiteFlow } from '../../hooks/useTramiteFlow';
import { ArrowLeft, Volume2 } from 'lucide-react';
import type { FaseTramite } from '../../types/tramite.types';
import { PrerequisitosCheckBasic } from './PrerequisitosCheckBasic';
import { FasePagoBasic } from './FasePagoBasic';
import { FaseSeguimientoBasic } from './FaseSeguimientoBasic';

interface Props {
  tramiteId: string;
  esRama?: boolean;
  onCompletarRama?: () => void;
  onAbrirRamaEnPestaña?: (tramiteId: string, nombreTramite: string, prerequisitoId: string) => void;
  tabsAbiertos?: string[];
  onVolverAlChat?: () => void;
}

/**
 * TramiteFlowBasic - Versión ULTRA SIMPLIFICADA para adultos mayores
 * - SIN segmentación
 * - Flujo directo: Requisitos → Pago → Confirmación
 * - Botones GIGANTES
 * - Textos ENORMES y claros
 * - Una pregunta a la vez
 */
export function TramiteFlowBasic({
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
    prerequisitosCumplidos,
    prerequisitosDinamicos,
    cambiarFase,
    actualizarPrerequisitos,
  } = useTramiteFlow(tramiteId);

  useEffect(() => {
    if (!esRama) {
      const esNuevaApertura = !progresoMultiple[tramiteId];
      iniciarTramite(tramiteId, esNuevaApertura);
    }
  }, [tramiteId, esRama, progresoMultiple]);

  // SIMPLIFICACIÓN: Ir directo a verificación de documentos (sin información ni segmentación)
  useEffect(() => {
    if (faseActual === 'informacion') {
      cambiarFase('documentacion');
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

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-yellow-50 to-white">
      {/* Header GIGANTE y colorido */}
      <div className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 px-6 py-8 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-6xl">📋</span>
                <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg">
                  {tramite.nombre}
                </h1>
              </div>
              <p className="text-xl md:text-2xl text-white font-bold drop-shadow">
                Te ayudaremos a completarlo
              </p>
            </div>
            {onVolverAlChat && (
              <button
                onClick={onVolverAlChat}
                className="px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 font-bold rounded-2xl transition-all transform hover:scale-105 text-lg flex items-center gap-2 shadow-lg"
              >
                <ArrowLeft className="w-6 h-6" />
                Volver
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contenido principal - Una cosa a la vez */}
      <div className="flex-1 overflow-y-auto flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Fase: Documentación - Verificación simple */}
          {faseActual === 'documentacion' && (
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl">
              <PrerequisitosCheckBasic
                prerequisitos={prerequisitosDinamicos}
                prerequisitosCumplidos={prerequisitosCumplidos}
                onValidacionCompleta={handleValidacionCompleta}
              />
            </div>
          )}

          {/* Fase: Pago */}
          {faseActual === 'pago' && (
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <FasePagoBasic
                tramite={tramite}
                onCompletar={() => cambiarFase('seguimiento')}
              />
            </div>
          )}

          {/* Fase: Confirmación y seguimiento */}
          {faseActual === 'seguimiento' && (
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <FaseSeguimientoBasic tramite={tramite} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
