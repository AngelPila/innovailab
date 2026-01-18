import { CheckCircle2, AlertCircle, ArrowRight, Clock } from 'lucide-react';
import { tramitesService } from '../../services/tramitesService';
import { LugaresRuta } from '../Mapa';
import type { Tramite } from '../../types/tramite.types';

interface Props {
  tramite: Tramite;
  tabsAbiertos?: string[];
  prerequisitosCumplidos?: Record<string, boolean>;
}

export function FaseSeguimiento({ tramite, tabsAbiertos = [], prerequisitosCumplidos = {} }: Props) {
  // Identificar requisitos pendientes (trámites secundarios abiertos)
  const requisitosPendientes = tramite.prerequisitos.filter(p => {
    if (!p.tramiteRelacionado) return false;
    const tramiteRel = tramitesService.getPorId(p.tramiteRelacionado);
    if (!tramiteRel) return false;
    
    const estaAbiertoEnTab = tabsAbiertos.some(tab => {
      const tabNormalizado = tab.toLowerCase().replace('↳', '').trim();
      const tramiteNormalizado = tramiteRel.nombre.toLowerCase().trim();
      return tabNormalizado.includes(tramiteNormalizado) || tramiteNormalizado.includes(tabNormalizado);
    });
    
    return !prerequisitosCumplidos[p.id] && estaAbiertoEnTab;
  });

  const todosCompletos = requisitosPendientes.length === 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {/* Encabezado */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className={`p-4 rounded-full ${todosCompletos ? 'bg-green-100' : 'bg-yellow-100'}`}>
              {todosCompletos ? (
                <CheckCircle2 className="w-16 h-16 text-green-600" />
              ) : (
                <Clock className="w-16 h-16 text-yellow-600" />
              )}
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {todosCompletos ? '¡Todo listo!' : 'Trámite en Progreso'}
          </h2>
          <p className="text-lg text-gray-600">
            {todosCompletos 
              ? 'Has completado todos los requisitos necesarios' 
              : 'Estos son los trámites que aún necesitas completar'}
          </p>
        </div>

        {/* Trámites pendientes */}
        {!todosCompletos && (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-yellow-900 text-lg mb-2">Requisitos pendientes</h3>
                <p className="text-sm text-yellow-800">
                  Para completar tu trámite de <strong>{tramite.nombre}</strong>, primero necesitas:
                </p>
              </div>
            </div>
            
            <div className="space-y-3 mt-4">
              {requisitosPendientes.map((p, index) => {
                const tramiteRel = p.tramiteRelacionado ? tramitesService.getPorId(p.tramiteRelacionado) : null;
                return (
                  <div key={p.id} className="bg-white border-l-4 border-yellow-400 rounded-lg p-4 flex items-center gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-yellow-700">{index + 1}</span>
                    </div>
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-900">{tramiteRel?.nombre || p.nombre}</p>
                      <p className="text-sm text-gray-600">
                        Tiempo estimado: {tramiteRel?.estimadoDias || 7} días · Costo: ${(tramiteRel?.costo || 0).toFixed(2)}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-yellow-600" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Estado completado */}
        {todosCompletos && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              <h3 className="font-bold text-green-900 text-lg">Requisitos cumplidos ✓</h3>
            </div>
            <p className="text-green-800">
              Has completado todos los requisitos necesarios para tu <strong>{tramite.nombre}</strong>.
            </p>
          </div>
        )}

        {/* Componente de Lugares y Ruta - Solo mostrar cuando todos los requisitos están completos */}
        {todosCompletos && (
          <div className="mb-6">
            <LugaresRuta 
              tramiteId={tramite.id} 
              nombreTramite={tramite.nombre}
            />
          </div>
        )}

        {/* Próximos pasos */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Próximos pasos:</h3>
          
          <ol className="space-y-4">
            {!todosCompletos ? (
              <>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</span>
                  <div>
                    <p className="text-gray-700"><strong>Completa los trámites abiertos:</strong></p>
                    <p className="text-sm text-gray-600 mt-1">Haz clic en las pestañas de arriba para continuar con cada trámite</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">2</span>
                  <div>
                    <p className="text-gray-700"><strong>Vuelve aquí:</strong></p>
                    <p className="text-sm text-gray-600 mt-1">Una vez completados, regresa a esta pestaña para continuar</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">3</span>
                  <div>
                    <p className="text-gray-700"><strong>Finaliza el proceso:</strong></p>
                    <p className="text-sm text-gray-600 mt-1">Cuando todo esté listo, podrás proceder con tu {tramite.nombre.toLowerCase()}</p>
                  </div>
                </li>
              </>
            ) : (
              <>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">1</span>
                  <p className="text-gray-700"><strong>Acércate al Registro Civil:</strong> Con todos tus documentos</p>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">2</span>
                  <p className="text-gray-700"><strong>Paga en ventanilla:</strong> El monto total aproximado es ${(tramite.costo || 0).toFixed(2)}</p>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">3</span>
                  <p className="text-gray-700"><strong>Espera el proceso:</strong> Aproximadamente {tramite.estimadoDias} días hábiles</p>
                </li>
              </>
            )}
          </ol>
        </div>

        {/* Advertencia si hay pendientes */}
        {!todosCompletos && (
          <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-800">
              <strong>⚠️ Importante:</strong> No puedes completar este trámite hasta que termines todos los requisitos previos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
