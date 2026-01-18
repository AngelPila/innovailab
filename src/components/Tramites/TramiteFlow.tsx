import { useEffect } from 'react';
import { useTramiteStore } from '../../store/tramiteStore';
import { tramitesService } from '../../services/tramitesService';
import { useTramiteFlow } from '../../hooks/useTramiteFlow';
import { CheckpointTabs } from './CheckpointTabs';
import { PrerequisitosCheck } from './PrerequisitosCheck';
import { RamaSecundaria } from './RamaSecundaria';
import { FaseContenido } from './FaseContenido';
import { ProgresoIndicator } from './ProgresoIndicator';
import { Clock, DollarSign, FileText } from 'lucide-react';
import type { FaseTramite } from '../../types/tramite.types';

interface Props {
  tramiteId: string;
  esRama?: boolean;
  onCompletarRama?: () => void;
}

export function TramiteFlow({ tramiteId, esRama = false, onCompletarRama }: Props) {
  const tramite = tramitesService.getPorId(tramiteId);
  const { iniciarTramite } = useTramiteStore();
  
  const {
    faseActual,
    pasoActual,
    fasesCompletadas,
    prerequisitosCumplidos,
    ramasActivas,
    cambiarFase,
    completarPaso,
    actualizarPrerequisitos,
    abrirRamaSecundaria,
    cerrarRama,
  } = useTramiteFlow(tramiteId);

  useEffect(() => {
    if (!esRama) {
      iniciarTramite(tramiteId);
    }
  }, [tramiteId, esRama, iniciarTramite]);

  if (!tramite) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Trámite no encontrado</p>
      </div>
    );
  }

  const handleValidacionCompleta = (cumplidos: Record<string, boolean>) => {
    actualizarPrerequisitos(cumplidos);
    
    // Si todos están cumplidos, avanzar a la siguiente fase
    const todosCumplidos = Object.values(cumplidos).every(v => v === true);
    if (todosCumplidos) {
      cambiarFase('documentacion');
    }
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
          </div>
        </div>
      )}

      {/* Tabs de navegación */}
      {!esRama && (
        <>
          <CheckpointTabs
            faseActual={faseActual}
            onCambiarFase={cambiarFase}
            fasesCompletadas={fasesCompletadas}
          />
          <ProgresoIndicator
            faseActual={faseActual}
            fasesCompletadas={fasesCompletadas}
          />
        </>
      )}

      {/* Contenido principal */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {/* Ramas secundarias activas */}
        {ramasActivas.length > 0 && (
          <div className="px-6 pt-6">
            {ramasActivas.map((rama) => {
              const tramiteRama = tramitesService.getPorId(rama.tramiteId);
              if (!tramiteRama) return null;

              return (
                <RamaSecundaria
                  key={rama.id}
                  rama={rama}
                  tramite={tramiteRama}
                  onCompletar={() => cerrarRama(rama.id, rama.prerequisitoAsociado)}
                  onCancelar={() => cerrarRama(rama.id, rama.prerequisitoAsociado, true)}
                />
              );
            })}
          </div>
        )}

        {/* Contenido de la fase actual */}
        {faseActual === 'requisitos' && (
          <PrerequisitosCheck
            prerequisitos={tramite.prerequisitos}
            prerequisitosCumplidos={prerequisitosCumplidos}
            onValidacionCompleta={handleValidacionCompleta}
            onIniciarRama={handleIniciarRama}
          />
        )}

        {faseActual !== 'requisitos' && pasoActual && (
          <FaseContenido
            paso={pasoActual}
            estaCompletado={false}
            onCompletar={() => {
              completarPaso(pasoActual.id);
              
              // Si es la última fase y es una rama, notificar
              if (esRama && faseActual === 'seguimiento' && onCompletarRama) {
                setTimeout(() => onCompletarRama(), 500);
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
