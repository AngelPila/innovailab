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
    <div className="flex flex-col h-full bg-gradient-to-br from-green-50 to-emerald-50 p-6">
      {/* Encabezado */}
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Información de Pago
        </h2>
        <p className="text-xl text-gray-600">
          Este es el costo de tu {tramite.nombre.toLowerCase()}
        </p>
      </div>

      {/* Costo grande */}
      <div className="flex-1 flex items-center justify-center mb-12">
        <div className="bg-white rounded-3xl p-12 shadow-2xl text-center">
          <p className="text-2xl text-gray-600 mb-6">Monto a pagar:</p>
          <div className="text-6xl font-bold text-emerald-600 mb-8">
            ${costoTotal.toFixed(2)}
          </div>

          <div className="border-t-2 border-gray-200 pt-8">
            <p className="text-xl text-gray-700 mb-6">Métodos de Pago:</p>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
                <p className="font-bold text-blue-900 text-lg">Bancos Autorizados</p>
                <p className="text-blue-700">Banco del Pacífico, Pichincha, BanEcuador</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl border-2 border-purple-200">
                <p className="font-bold text-purple-900 text-lg">Ventanilla</p>
                <p className="text-purple-700">Registro Civil - Oficinas a nivel nacional</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botón confirmar */}
      <button
        onClick={onCompletar}
        className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-8 px-6 rounded-3xl transition-all transform hover:scale-105 active:scale-95 shadow-xl text-2xl flex items-center justify-center gap-4"
      >
        <CheckCircle2 className="w-8 h-8" />
        Confirmar y Continuar
      </button>

      {/* Info adicional */}
      <p className="text-center text-gray-600 text-lg mt-6">
        Tendrás que pagar en los bancos autorizados o en el Registro Civil
      </p>
    </div>
  );
}
