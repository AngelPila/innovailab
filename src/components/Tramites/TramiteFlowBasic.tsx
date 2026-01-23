import { useEffect, useState } from 'react';
import { useTramiteStore } from '../../store/tramiteStore';
import { tramitesService } from '../../services/tramitesService';
import { useTramiteFlow } from '../../hooks/useTramiteFlow';
import { ArrowLeft, Volume2, Settings } from 'lucide-react';
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
  onCambiarInterfaz?: () => void;
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
  onCambiarInterfaz,
}: Props) {
  const tramite = tramitesService.getPorId(tramiteId);
  const { iniciarTramite, progresoActual, progresoMultiple, setSegmentacion } = useTramiteStore();

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
      console.log('🔵 TramiteFlowBasic - Iniciando:', { tramiteId, esNuevaApertura });
      iniciarTramite(tramiteId, esNuevaApertura);

      // En modo básico, establecer un segmento por defecto para que los prerequisitos se carguen correctamente
      // Segmento genérico: primera vez obteniendo el documento
      if (esNuevaApertura || !progresoActual?.segmento) {
        console.log('🔵 TramiteFlowBasic - Seteando segmento por defecto');
        setSegmentacion({
          tipoTramite: 'primera-vez',
          categoria: 'adulto',
          esNaturalizado: false,
          nacionalidad: 'ecuatoriano',
        });
      }

      // SIMPLIFICACIÓN: Ir directo a verificación de documentos (sin información ni segmentación)
      if (esNuevaApertura || faseActual === 'informacion') {
        console.log('🔵 TramiteFlowBasic - Cambiando de informacion a documentacion');
        setTimeout(() => cambiarFase('documentacion'), 100);
      }
    }
  }, [tramiteId, esRama, progresoMultiple]);

  // Debug: Ver qué prerequisitos dinámicos tenemos
  useEffect(() => {
    console.log('🔵 TramiteFlowBasic - prerequisitosDinamicos:', prerequisitosDinamicos);
    console.log('🔵 TramiteFlowBasic - faseActual:', faseActual);
    console.log('🔵 TramiteFlowBasic - tramite:', tramite?.nombre);
  }, [prerequisitosDinamicos, faseActual, tramite]);

  if (!tramite) {
    console.log('🔴 TramiteFlowBasic - Trámite NO encontrado:', tramiteId);
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
    <div className="flex flex-col h-full bg-gradient-to-b from-yellow-50 to-white overflow-hidden">
      {/* Header GIGANTE y colorido */}
      <div className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 px-4 md:px-6 py-6 md:py-8 shadow-lg flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between gap-2 md:gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 md:gap-4 mb-2">
                <span className="text-4xl md:text-6xl flex-shrink-0">📋</span>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white drop-shadow-lg truncate">
                  {tramite.nombre}
                </h1>
              </div>
              <p className="text-base md:text-xl lg:text-2xl text-white font-bold drop-shadow">
                Te ayudaremos a completarlo
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {onCambiarInterfaz && (
                <button
                  onClick={onCambiarInterfaz}
                  className="px-3 md:px-6 py-3 md:py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl md:rounded-2xl transition-all transform hover:scale-105 text-xs md:text-base flex items-center gap-2 shadow-lg"
                  title="Cambiar a interfaz avanzada"
                >
                  <Settings className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden sm:inline">Interfaz avanzada</span>
                </button>
              )}
              {onVolverAlChat && (
                <button
                  onClick={onVolverAlChat}
                  className="px-4 md:px-8 py-3 md:py-4 bg-white hover:bg-gray-100 text-gray-900 font-bold rounded-xl md:rounded-2xl transition-all transform hover:scale-105 text-sm md:text-lg flex items-center gap-2 shadow-lg"
                >
                  <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="hidden sm:inline">Volver</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal - Una cosa a la vez */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden flex items-start md:items-center justify-center p-2 md:p-4">
        <div className="w-full max-w-2xl">
          {/* Fase: Documentación - Verificación simple */}
          {faseActual === 'documentacion' && (
            <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 lg:p-12 shadow-2xl">
              <PrerequisitosCheckBasic
                prerequisitos={prerequisitosDinamicos}
                prerequisitosCumplidos={prerequisitosCumplidos}
                onValidacionCompleta={handleValidacionCompleta}
              />
            </div>
          )}

          {/* Fase: Pago */}
          {faseActual === 'pago' && (
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden">
              <FasePagoBasic
                tramite={tramite}
                onCompletar={() => cambiarFase('seguimiento')}
              />
            </div>
          )}

          {/* Fase: Confirmación y seguimiento */}
          {faseActual === 'seguimiento' && (
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden">
              <FaseSeguimientoBasic tramite={tramite} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
