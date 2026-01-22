import { useEffect, useState } from 'react';
import { useTramiteStore } from '../../store/tramiteStore';
import { tramitesService } from '../../services/tramitesService';
import { useTramiteFlow } from '../../hooks/useTramiteFlow';
import { ArrowLeft, MapPin } from 'lucide-react';
import { SummaryReview } from './SummaryReview';
import type { FaseTramite } from '../../types/tramite.types';
import { SegmentacionPasaporte } from './SegmentacionPasaporte';
import { SegmentacionLicencia } from './SegmentacionLicencia';
import { PrerequisitosCheckBasic } from './PrerequisitosCheckBasic';
import { FaseContenido } from './FaseContenido';
import { FaseContenidoLicencia } from './FaseContenidoLicencia';
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
 * TramiteFlowBasic - Versión simplificada para adultos mayores
 * Características:
 * - Botones más grandes
 * - Menos instrucciones
 * - Resumen antes de finalizar
 * - Pasos claros y directos
 * - Textos más grandes
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
    pasoActual,
    fasesCompletadas,
    prerequisitosCumplidos,
    prerequisitosDinamicos,
    cambiarFase,
    completarPaso,
    actualizarPrerequisitos,
  } = useTramiteFlow(tramiteId);

  const [mostrarResumen, setMostrarResumen] = useState(false);

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

  if (!tramite) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Trámite no encontrado</p>
      </div>
    );
  }

  const handleValidacionCompleta = (cumplidos: Record<string, boolean>) => {
    actualizarPrerequisitos(cumplidos);
    setMostrarResumen(true);
  };

  const handleConfirmarResumen = () => {
    setMostrarResumen(false);
    setTimeout(() => cambiarFase('pago'), 300);
  };

  const handleEditarSeccion = (seccion: string) => {
    setMostrarResumen(false);
    const faseMap: Record<string, FaseTramite> = {
      informacion: 'informacion',
      requisitos: 'requisitos',
      documentacion: 'documentacion',
      pago: 'pago',
      seguimiento: 'seguimiento',
    };
    cambiarFase(faseMap[seccion] || 'informacion');
  };

  // Renderizar resumen si está activo
  if (mostrarResumen && progresoActual) {
    return (
      <SummaryReview
        tramiteNombre={tramite.nombre}
        progreso={progresoActual}
        prerequisitosInfo={prerequisitosDinamicos.map((p) => ({
          id: p.id,
          nombre: p.nombre,
        }))}
        onConfirm={handleConfirmarResumen}
        onEdit={handleEditarSeccion}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header minimalista */}
      <div className="bg-gradient-to-r from-yellow-400 to-amber-500 px-6 py-6 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                {tramite.nombre}
              </h1>
              <p className="text-yellow-50 text-sm md:text-base">
                Seguiremos paso a paso
              </p>
            </div>
            {onVolverAlChat && (
              <button
                onClick={onVolverAlChat}
                className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-800 font-bold rounded-lg transition-colors text-sm md:text-base"
              >
                ← Volver
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-8">
          {/* Fase: Información */}
          {faseActual === 'informacion' && tramiteId === 'licencia_conducir' && (
            <div>
              <FaseContenidoLicencia
                onCompletar={() => {
                  setTimeout(() => {
                    cambiarFase('requisitos');
                  }, 300);
                }}
              />
            </div>
          )}

          {/* Fase: Requisitos */}
          {faseActual === 'requisitos' && (
            <div>
              {tramiteId === 'licencia_conducir' ? (
                <SegmentacionLicencia
                  onConfirm={() => {
                    setTimeout(() => {
                      cambiarFase('documentacion');
                    }, 300);
                  }}
                />
              ) : (
                <SegmentacionPasaporte
                  onConfirm={() => {
                    setTimeout(() => {
                      cambiarFase('documentacion');
                    }, 300);
                  }}
                />
              )}
            </div>
          )}

          {/* Fase: Documentación */}
          {faseActual === 'documentacion' && (
            <div className="h-full">
              <PrerequisitosCheckBasic
                prerequisitos={prerequisitosDinamicos}
                prerequisitosCumplidos={prerequisitosCumplidos}
                onValidacionCompleta={handleValidacionCompleta}
              />
            </div>
          )}

          {/* Fase: Pago */}
          {faseActual === 'pago' && (
            <div className="h-full">
              <FasePagoBasic
                tramite={tramite}
                onCompletar={() => cambiarFase('seguimiento')}
              />
            </div>
          )}

          {/* Fase: Seguimiento */}
          {faseActual === 'seguimiento' && (
            <div className="h-full">
              <FaseSeguimientoBasic
                tramite={tramite}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
