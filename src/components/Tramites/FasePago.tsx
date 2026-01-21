import { DollarSign, CheckCircle2, Info } from 'lucide-react';
import { useTramiteStore } from '../../store/tramiteStore';
import { tramitesService } from '../../services/tramitesService';
import type { Tramite } from '../../types/tramite.types';

interface Props {
  tramite: Tramite;
  onCompletar: () => void;
  tabsIds?: string[];
}

export function FasePago({ tramite, onCompletar, tabsIds = [] }: Props) {
  const { progresoActual } = useTramiteStore();
  
  // Calcular costo total (tramite principal + trámites secundarios abiertos)
  const costoBase = tramite.costo || 0;
  
  // Identificar los trámites secundarios abiertos basados en tabsIds
  const tramitesSecundarios = tramite.prerequisitos
    ?.filter(p => {
      if (!p.tramiteRelacionado) return false;
      // p.tramiteRelacionado es un ID, obtener el tramite completo
      const tramiteRel = tramitesService.getPorId(p.tramiteRelacionado);
      if (!tramiteRel) return false;
      
      // Buscar si algún tab contiene el nombre del trámite (ignorando ↳ y mayúsculas/minúsculas)
      return tabsIds.some(tabId => {
        const tabNormalizado = tabId.toLowerCase().replace('↳', '').trim();
        const tramiteNormalizado = tramiteRel.nombre.toLowerCase().trim();
        return tabNormalizado.includes(tramiteNormalizado) || tramiteNormalizado.includes(tabNormalizado);
      });
    })
    .map(p => {
      const tramiteRel = tramitesService.getPorId(p.tramiteRelacionado!);
      return {
        nombre: tramiteRel?.nombre || 'Trámite desconocido',
        costo: tramiteRel?.costo || 0,
        id: p.tramiteRelacionado!,
      };
    }) || [];
  
  const costoSecundario = tramitesSecundarios.reduce((total, t) => total + t.costo, 0);
  const costoTotal = costoBase + costoSecundario;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <DollarSign className="w-8 h-8 text-green-600" />
          Costos Estimados
        </h2>
        <p className="text-gray-600 mb-6">Aquí está el desglose de los costos aproximados de tu trámite</p>

        {/* Desglose de costos */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 mb-6 border-2 border-green-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Desglose:</h3>
          
          <div className="space-y-3">
            {/* Trámite principal */}
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{tramite.nombre}</p>
                  <p className="text-xs text-gray-500">Costo principal</p>
                </div>
              </div>
              <span className="font-bold text-lg text-green-600">${costoBase.toFixed(2)}</span>
            </div>

            {/* Trámites secundarios abiertos */}
            {tramitesSecundarios.map((tramiteSecundario) => (
              <div key={tramiteSecundario.id} className="flex items-center justify-between p-4 bg-white rounded-lg border-l-4 border-yellow-400">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{tramiteSecundario.nombre}</p>
                    <p className="text-xs text-gray-500">Trámite adicional abierto</p>
                  </div>
                </div>
                <span className="font-bold text-lg text-yellow-600">${tramiteSecundario.costo.toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t-2 border-green-300 mt-6 pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl font-bold text-gray-900">COSTO TOTAL:</span>
              <span className="text-4xl font-bold text-green-600">${costoTotal.toFixed(2)}</span>
            </div>
            {tramitesSecundarios.length > 0 && (
              <p className="text-sm text-green-700 mt-3">
                ✓ Incluye {tramitesSecundarios.length} trámite{tramitesSecundarios.length !== 1 ? 's' : ''} adicional{tramitesSecundarios.length !== 1 ? 'es' : ''} que has abierto
              </p>
            )}
          </div>
        </div>

        {/* Información importante */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-6 flex gap-3">
          <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-blue-900 mb-1">Información de pago</p>
            <p className="text-sm text-blue-800">
              Los costos mostrados son los valores oficiales vigentes del Registro Civil de Ecuador. El pago se realiza directamente en las oficinas del Registro Civil o bancos autorizados.
            </p>
          </div>
        </div>

        {/* Botón de confirmación */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={onCompletar}
            className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg transition-all shadow-lg"
          >
            <span className="text-white">→ Continuar a Seguimiento</span>
          </button>
        </div>
      </div>
    </div>
  );
}
