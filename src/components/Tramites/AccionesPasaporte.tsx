import { useState } from 'react';
import { CalendarPlus, QrCode } from 'lucide-react';
import { registroCivilService, type Turno } from '../../services/registroCivilService';

interface Props {
  tramiteId: string;
}

export function AccionesPasaporte({ tramiteId }: Props) {
  const [turnos, setTurnos] = useState<Turno[] | null>(null);
  const [ordenPago, setOrdenPago] = useState<{ codigo: string; qrDataUrl: string } | null>(null);
  const [loadingTurnos, setLoadingTurnos] = useState(false);
  const [loadingOrden, setLoadingOrden] = useState(false);

  const consultarTurnos = async () => {
    setLoadingTurnos(true);
    const r = await registroCivilService.consultarTurnos(tramiteId);
    setTurnos(r);
    setLoadingTurnos(false);
  };

  const generarOrdenPago = async () => {
    setLoadingOrden(true);
    const r = await registroCivilService.generarOrdenPago(tramiteId);
    setOrdenPago(r);
    setLoadingOrden(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Gestión de Citas y Pagos</h3>
        <p className="text-gray-600 mb-4">Demo: acciones rápidas para el trámite de pasaporte.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={consultarTurnos}
            className="flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
            disabled={loadingTurnos}
          >
            <CalendarPlus className="w-5 h-5" />
            {loadingTurnos ? 'Consultando turnos...' : 'Consultar turnos disponibles'}
          </button>

          <button
            onClick={generarOrdenPago}
            className="flex items-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
            disabled={loadingOrden}
          >
            <QrCode className="w-5 h-5" />
            {loadingOrden ? 'Generando orden...' : 'Generar orden de pago (QR)'}
          </button>
        </div>

        {turnos && (
          <div className="mt-6">
            <h4 className="font-semibold text-gray-800 mb-2">Turnos disponibles</h4>
            <ul className="space-y-2">
              {turnos.map((t) => (
                <li key={t.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                  <span className="text-gray-700">{new Date(t.fechaISO).toLocaleString()}</span>
                  <span className="text-sm text-gray-600">{t.agencia}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {ordenPago && (
          <div className="mt-6">
            <h4 className="font-semibold text-gray-800 mb-2">Orden de pago</h4>
            <div className="flex items-center gap-4">
              <img src={ordenPago.qrDataUrl} alt="QR pago" className="w-24 h-24 border rounded" />
              <div>
                <p className="text-gray-700 font-mono">{ordenPago.codigo}</p>
                <p className="text-xs text-gray-500">Muestra este QR en ventanilla o guarda el código.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
