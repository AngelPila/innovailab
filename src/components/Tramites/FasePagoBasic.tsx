import { DollarSign, CheckCircle2 } from 'lucide-react';
import type { Tramite } from '../../types/tramite.types';

interface Props {
  tramite: Tramite;
  onCompletar: () => void;
}

/**
 * Versión simplificada de FasePago para adultos mayores
 * - Solo costo total y métodos de pago
 * - Botón gigante "Confirmar"
 * - Sin listas largas
 */
export function FasePagoBasic({ tramite, onCompletar }: Props) {
  const costoTotal = tramite.costo || 0;

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-green-50 to-emerald-50 p-4 md:p-6 overflow-y-auto">
      {/* Encabezado */}
      <div className="mb-8 flex-shrink-0">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
          Información de Pago
        </h2>
        <p className="text-base md:text-lg text-gray-600">
          Este es el costo de tu {tramite.nombre.toLowerCase()}
        </p>
      </div>

      {/* Costo grande */}
      <div className="flex-1 flex items-center justify-center py-6 md:py-8">
        <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-lg md:shadow-2xl text-center w-full max-w-md">
          <p className="text-lg md:text-xl text-gray-600 mb-4">Monto a pagar:</p>
          <div className="text-4xl md:text-5xl font-bold text-emerald-600 mb-6">
            ${costoTotal.toFixed(2)}
          </div>

          <div className="border-t-2 border-gray-200 pt-6">
            <p className="text-lg md:text-xl text-gray-700 mb-4">Métodos de Pago:</p>
            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded-lg md:rounded-xl border-2 border-blue-200">
                <p className="font-bold text-blue-900 text-sm md:text-base">Bancos Autorizados</p>
                <p className="text-blue-700 text-xs md:text-sm">Banco del Pacífico, Pichincha, BanEcuador</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg md:rounded-xl border-2 border-purple-200">
                <p className="font-bold text-purple-900 text-sm md:text-base">Ventanilla</p>
                <p className="text-purple-700 text-xs md:text-sm">Registro Civil - Oficinas a nivel nacional</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botón confirmar */}
      <button
        onClick={onCompletar}
        className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-5 md:py-7 px-4 md:px-6 rounded-2xl md:rounded-3xl transition-all transform hover:scale-105 active:scale-95 shadow-lg md:shadow-xl text-lg md:text-xl flex items-center justify-center gap-3 flex-shrink-0"
      >
        <CheckCircle2 className="w-6 md:w-8 h-6 md:h-8" />
        Confirmar y Continuar
      </button>

      {/* Info adicional */}
      <p className="text-center text-gray-600 text-xs md:text-sm mt-4 flex-shrink-0">
        Tendrás que pagar en los bancos autorizados o en el Registro Civil
      </p>
    </div>
  );
}
