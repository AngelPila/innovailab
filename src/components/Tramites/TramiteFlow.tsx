import { useEffect } from 'react';
import { useTramiteStore } from '../../store/tramiteStore';
import { tramitesService } from '../../services/tramitesService';
import { useTramiteFlow } from '../../hooks/useTramiteFlow';
import { CheckpointTabs } from './CheckpointTabs';
import { PrerequisitosCheck } from './PrerequisitosCheck';
import { FaseContenido } from './FaseContenido';
import { FasePago } from './FasePago';
import { FaseSeguimiento } from './FaseSeguimiento';
import { Clock, DollarSign, FileText, ArrowLeft, MessageCircle } from 'lucide-react';
import type { FaseTramite } from '../../types/tramite.types';
import { SegmentacionPasaporte } from './SegmentacionPasaporte';

interface Props {
  tramiteId: string;
  esRama?: boolean;
  onCompletarRama?: () => void;
  onAbrirRamaEnPestaña?: (tramiteId: string, nombreTramite: string, prerequisitoId: string) => void;
  tabsAbiertos?: string[];
  onVolverAlChat?: () => void;
}

export function TramiteFlow({ tramiteId, esRama = false, onCompletarRama, onAbrirRamaEnPestaña, tabsAbiertos = [], onVolverAlChat }: Props) {
  const tramite = tramitesService.getPorId(tramiteId);
  const { iniciarTramite, progresoActual, progresoMultiple } = useTramiteStore();

  const {
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
  } = useTramiteFlow(tramiteId);

  useEffect(() => {
    if (!esRama) {
      // Si el tramite ya existe en progresoMultiple, recuperar su estado
      // Si no existe, crear uno nuevo (reset=true)
      const esNuevaApertura = !progresoMultiple[tramiteId];
      iniciarTramite(tramiteId, esNuevaApertura);
    } else {
      // Si es rama, comenzar directamente en requisitos
      iniciarTramite(tramiteId, false);
      // Cambiar fase en siguiente ciclo para evitar loop infinito
      setTimeout(() => cambiarFase('requisitos'), 0);
    }
  }, [tramiteId, esRama, progresoMultiple]);

  if (!tramite) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Trámite no encontrado</p>
      </div>
    );
  }

  const handleValidacionCompleta = (cumplidos: Record<string, boolean>) => {
    actualizarPrerequisitos(cumplidos);

    // Avanzar a la fase de PAGO después de completar requisitos
    setTimeout(() => cambiarFase('pago'), 300);
    console.log('✅ Requisitos completados:', cumplidos);
  };

  const handleIniciarRama = (tramiteRelacionadoId: string, prerequisitoId: string) => {
    const tramiteRelacionado = tramitesService.getPorId(tramiteRelacionadoId);
    if (tramiteRelacionado) {
      abrirRamaSecundaria(tramiteRelacionadoId, prerequisitoId, tramiteRelacionado.nombre);
    }
  };

  // Mapeo de iconos por trámite
  const getTramiteIcon = (tramiteId: string) => {
    const iconMap: Record<string, string> = {
      'obtener_pasaporte': '🛂',
      'renovacion_cedula': '🆔',
      'visa_americana': '🇺🇸',
      'licencia_conducir': '🚗',
      'registro_propiedad': '🏠',
      'matrimonio_civil': '💒',
      'partida_nacimiento': '👶',
      'antecedentes_penales': '📋',
    };
    return iconMap[tramiteId] || '📄';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Contenido principal scrolleable - incluye header */}
      <div className="flex-1 overflow-y-auto">
        {/* Encabezado del trámite - ahora dentro del scroll */}
        {!esRama && (
          <div className="bg-gradient-to-br from-yellow-400 via-yellow-400 to-amber-500 px-6 py-8 relative overflow-hidden">
            {/* Elementos decorativos */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="absolute top-1/2 right-10 w-20 h-20 bg-white/5 rounded-full" />

            <div className="max-w-4xl mx-auto relative">
              {/* Título con icono y botón de volver */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-4">
                  <span className="text-5xl drop-shadow-md">{getTramiteIcon(tramite.id)}</span>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">{tramite.nombre}</h1>
                </div>

                {/* Botón volver al chat o trámite principal - derecha */}
                {onVolverAlChat && (
                  <button
                    onClick={onVolverAlChat}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 hover:bg-white text-gray-800 
                               rounded-lg transition-all duration-300 text-xs font-semibold shadow-sm hover:shadow-md
                               hover:-translate-y-0.5 backdrop-blur-sm flex-shrink-0 mt-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    {esRama ? (
                      <>
                        <FileText className="w-3.5 h-3.5" />
                        Volver
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-3.5 h-3.5" />
                        Volver
                      </>
                    )}
                  </button>
                )}
              </div>
              <p className="text-lg text-gray-800/90 mb-6 max-w-2xl">{tramite.descripcion}</p>
            </div>
          </div>
        )}

        {/* Tabs de navegación */}
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <CheckpointTabs
            faseActual={faseActual}
            onCambiarFase={cambiarFase}
            fasesCompletadas={fasesCompletadas}
          />
        </div>

        {/* Contenido de las fases */}
        <div className="bg-gray-50">
          {/* Ramas secundarias - REMOVIDAS - ahora se abren como pestañas */}

          {/* Contenido de la fase actual */}
          {faseActual === 'requisitos' && (
            <PrerequisitosCheck
              prerequisitos={prerequisitosDinamicos}
              prerequisitosCumplidos={prerequisitosCumplidos}
              onValidacionCompleta={handleValidacionCompleta}
              onAbrirRamaEnPestaña={onAbrirRamaEnPestaña}
            />
          )}

          {/* Segmentación para pasaporte dentro de Información */}
          {tramite.id === 'obtener_pasaporte' && faseActual === 'informacion' && (
            <SegmentacionPasaporte />
          )}

          {/* Fase de Pago */}
          {faseActual === 'pago' && (
            <FasePago
              tramite={tramite}
              tabsIds={tabsAbiertos}
              onCompletar={() => {
                completarPaso('paso_pago');

                // Si es rama, notificar
                if (esRama && onCompletarRama) {
                  setTimeout(() => onCompletarRama(), 500);
                }
              }}
            />
          )}

          {/* Fase de Seguimiento */}
          {faseActual === 'seguimiento' && (
            <FaseSeguimiento
              tramite={tramite}
              tabsAbiertos={tabsAbiertos}
              prerequisitosCumplidos={prerequisitosCumplidos}
            />
          )}

          {/* Fases genéricas (Información) */}
          {faseActual === 'informacion' && pasoActual && (
            <FaseContenido
              paso={pasoActual}
              estaCompletado={false}
              onCompletar={() => {
                completarPaso(pasoActual.id);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
