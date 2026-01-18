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

  return (
    <div className="flex flex-col h-full">
      {/* Encabezado del trámite */}
      {!esRama && (
        <div className="bg-yellow-400 px-6 py-6">
          <div className="max-w-4xl mx-auto">
            {/* Botón volver al chat */}
            {onVolverAlChat && (
              <button
                onClick={onVolverAlChat}
                className="flex items-center gap-2 mb-4 px-4 py-2 bg-white/80 hover:bg-white text-gray-800 rounded-lg transition-colors text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                <MessageCircle className="w-4 h-4" />
                Volver al Chat
              </button>
            )}
            
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{tramite.nombre}</h1>
            <p className="text-lg text-gray-700 mb-4">{tramite.descripcion}</p>
            
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2 text-gray-800">
                <Clock className="w-5 h-5" />
                <span className="font-medium">{tramite.estimadoDias} días</span>
              </div>
              {tramite.costo && (
                <div className="flex items-center gap-2 text-gray-800">
                  <DollarSign className="w-5 h-5" />
                  <span className="font-medium">${tramite.costo.toFixed(2)}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-800">
                <FileText className="w-5 h-5" />
                <span className="font-medium">{tramite.prerequisitos.length} requisitos</span>
              </div>
            </div>

            {tramite.id === 'obtener_pasaporte' && (
              <p className="mt-2 text-sm text-gray-800">
                <strong>Nota:</strong> Los requisitos se ajustan según tu caso. {progresoActual?.segmento?.categoria === 'adulto-mayor' && 'Tendrás atención prioritaria.'}
                {progresoActual?.segmento?.tieneDiscapacidad && ' Atención preferente disponible.'}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Tabs de navegación - SIEMPRE visible */}
      <CheckpointTabs
        faseActual={faseActual}
        onCambiarFase={cambiarFase}
        fasesCompletadas={fasesCompletadas}
      />

      {/* Contenido principal */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
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
  );
}
