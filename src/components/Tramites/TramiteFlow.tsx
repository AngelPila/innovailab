import { useEffect, useState } from 'react';
import { useTramiteStore } from '../../store/tramiteStore';
import { tramitesService } from '../../services/tramitesService';
import { useTramiteFlow } from '../../hooks/useTramiteFlow';
import { useInterfaceStore } from '../../store/interfaceStore';
import { CheckpointTabs } from './CheckpointTabs';
import { PrerequisitosCheck } from './PrerequisitosCheck';
import { FaseContenido } from './FaseContenido';
import { FasePago } from './FasePago';
import { FaseSeguimiento } from './FaseSeguimiento';
import { InterfaceSelector } from './InterfaceSelector';
import { TramiteFlowBasic } from './TramiteFlowBasic';
import { TramiteFlowAdvanced } from './TramiteFlowAdvanced';
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
  const { selectedVersion, selectVersion } = useInterfaceStore();
  const [showSelector, setShowSelector] = useState(!selectedVersion && !esRama);

  console.log('🟣 TramiteFlow - Render:', { tramiteId, selectedVersion, showSelector, tramiteNombre: tramite?.nombre });

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

  // Mostrar selector de interfaz si no hay versión seleccionada
  if (showSelector && !selectedVersion) {
    return (
      <InterfaceSelector
        onSelectBasic={() => {
          selectVersion('basic');
          setShowSelector(false);
        }}
        onSelectAdvanced={() => {
          selectVersion('advanced');
          setShowSelector(false);
        }}
      />
    );
  }

  // Renderizar la versión seleccionada
  if (selectedVersion === 'basic' || !selectedVersion) {
    console.log('🟣 TramiteFlow - Renderizando TramiteFlowBasic');
    return (
      <TramiteFlowBasic
        tramiteId={tramiteId}
        esRama={esRama}
        onCompletarRama={onCompletarRama}
        onAbrirRamaEnPestaña={onAbrirRamaEnPestaña}
        tabsAbiertos={tabsAbiertos}
        onVolverAlChat={onVolverAlChat}
        onCambiarInterfaz={() => {
          selectVersion('advanced');
          setShowSelector(false);
        }}
      />
    );
  }

  if (selectedVersion === 'advanced') {
    console.log('🟣 TramiteFlow - Renderizando TramiteFlowAdvanced');
    return (
      <TramiteFlowAdvanced
        tramiteId={tramiteId}
        esRama={esRama}
        onCompletarRama={onCompletarRama}
        onAbrirRamaEnPestaña={onAbrirRamaEnPestaña}
        tabsAbiertos={tabsAbiertos}
        onVolverAlChat={onVolverAlChat}
      />
    );
  }

  return null;
}
