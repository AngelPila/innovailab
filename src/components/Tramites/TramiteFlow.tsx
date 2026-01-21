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
              {/* Botón volver al chat */}
              {onVolverAlChat && (
                <button
                  onClick={onVolverAlChat}
                  className="flex items-center gap-2 mb-5 px-4 py-2.5 bg-white/90 hover:bg-white text-gray-800 
                             rounded-xl transition-all duration-300 text-sm font-semibold shadow-md hover:shadow-lg
                             hover:-translate-y-0.5 backdrop-blur-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <MessageCircle className="w-4 h-4" />
                  Volver al Chat
                </button>
              )}
              
              {/* Título con icono */}
              <div className="flex items-center gap-4 mb-3">
                <span className="text-5xl drop-shadow-md">{getTramiteIcon(tramite.id)}</span>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">{tramite.nombre}</h1>
              </div>
              <p className="text-lg text-gray-800/90 mb-5 max-w-2xl">{tramite.descripcion}</p>
              
              {/* Badges de información */}
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-xl shadow-sm">
                  <Clock className="w-5 h-5 text-gray-700" />
                  <span className="font-semibold text-gray-800">{tramite.estimadoDias} días</span>
                </div>
                {tramite.costo && (
                  <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-xl shadow-sm">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-gray-800">${tramite.costo.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-xl shadow-sm">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-800">{tramite.prerequisitos.length} requisitos</span>
                </div>
              </div>

              {tramite.id === 'obtener_pasaporte' && (
                <div className="mt-4 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/50">
                  <p className="text-sm text-gray-800">
                    <strong>💡 Nota:</strong> Los requisitos se ajustan según tu caso. {progresoActual?.segmento?.categoria === 'adulto-mayor' && '👴 Tendrás atención prioritaria.'}
                    {progresoActual?.segmento?.tieneDiscapacidad && ' ♿ Atención preferente disponible.'}
                  </p>
                </div>
              )}
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
