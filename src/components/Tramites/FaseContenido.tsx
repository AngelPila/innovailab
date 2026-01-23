import type { PasoTramite } from '../../types/tramite.types';
import { CheckCircle2, Clock, DollarSign, FileText, Info, MapPin, Calendar } from 'lucide-react';

interface Props {
  paso: PasoTramite;
  estaCompletado: boolean;
  onCompletar: () => void;
}

const ICONOS_FASE = {
  informacion: Info,
  requisitos: FileText,
  documentacion: FileText,
  pago: DollarSign,
  seguimiento: MapPin,
};

const COLOR_FASE: Record<string, string> = {
  informacion: 'bg-blue-50 text-blue-700',
  requisitos: 'bg-amber-50 text-amber-700',
  documentacion: 'bg-indigo-50 text-indigo-700',
  pago: 'bg-emerald-50 text-emerald-700',
  seguimiento: 'bg-sky-50 text-sky-700',
};

// Parsear contenido para extraer información de badges
function parseContenido(contenido: string | undefined) {
  if (!contenido) return { tiempo: null, costo: null, vigencia: null, otroContenido: '' };

  const lineas = contenido.split('\n');
  let tiempo: string | null = null;
  let costo: string | null = null;
  let vigencia: string | null = null;
  const otrasLineas: string[] = [];

  lineas.forEach(linea => {
    if (linea.includes('Tiempo estimado')) {
      const match = linea.match(/(\d+)\s*días/);
      if (match) tiempo = match[1];
    } else if (linea.includes('Costo')) {
      const match = linea.match(/\$([0-9.]+)/);
      if (match) costo = match[1];
    } else if (linea.includes('Vigencia')) {
      const match = linea.match(/Vigencia:\s*(.+)/);
      if (match) vigencia = match[1];
    } else if (linea.trim()) {
      otrasLineas.push(linea);
    }
  });

  return { tiempo, costo, vigencia, otroContenido: otrasLineas.join('\n') };
}

export function FaseContenido({ paso, estaCompletado, onCompletar }: Props) {
  const IconoFase = ICONOS_FASE[paso.fase];
  const colorFase = COLOR_FASE[paso.fase] || 'bg-gray-100 text-gray-700';
  const { tiempo, costo, vigencia, otroContenido } = parseContenido(paso.contenido);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className={`p-3 rounded-xl ${colorFase}`}>
            <IconoFase className="w-8 h-8" />
          </div>

          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{paso.titulo}</h2>
            <p className="text-lg text-gray-600 leading-relaxed">{paso.descripcion}</p>
          </div>

          {estaCompletado && (
            <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg border border-green-200 shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-semibold text-sm">Completado</span>
            </div>
          )}
        </div>

        {/* Sección de Información General con Badges */}
        {paso.titulo === 'Información General' && (tiempo || costo || vigencia) && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información General</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tiempo && (
                <div className="flex items-center gap-4 rounded-xl border border-yellow-200 bg-yellow-50/70 px-5 py-4 shadow-sm">
                  <span className="p-2 rounded-lg bg-yellow-100">
                    <Clock className="w-6 h-6 text-yellow-700" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-yellow-800">Tiempo Estimado</p>
                    <p className="text-xl font-bold text-gray-900">{tiempo} días</p>
                  </div>
                </div>
              )}

              {costo && (
                <div className="flex items-center gap-4 rounded-xl border border-green-200 bg-green-50/70 px-5 py-4 shadow-sm">
                  <span className="p-2 rounded-lg bg-green-100">
                    <DollarSign className="w-6 h-6 text-green-700" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-green-800">Costo</p>
                    <p className="text-xl font-bold text-gray-900">${costo}</p>
                  </div>
                </div>
              )}

              {vigencia && (
                <div className="flex items-center gap-4 rounded-xl border border-blue-200 bg-blue-50/70 px-5 py-4 shadow-sm">
                  <span className="p-2 rounded-lg bg-blue-100">
                    <Calendar className="w-6 h-6 text-blue-700" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-blue-800">Vigencia</p>
                    <p className="text-xl font-bold text-gray-900">{vigencia}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contenido adicional si existe */}
        {otroContenido && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
            <pre className="whitespace-pre-wrap font-sans text-gray-700 text-base leading-relaxed">
              {otroContenido}
            </pre>
          </div>
        )}

        {paso.validaciones && paso.validaciones.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Documentos requeridos:</h3>
            <ul className="space-y-2">
              {paso.validaciones.map((validacion, idx) => (
                <li key={idx} className="flex items-center gap-2 text-gray-700">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  {validacion}
                </li>
              ))}
            </ul>
          </div>
        )}

        {!estaCompletado && (
          <button
            onClick={onCompletar}
            className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg font-bold text-lg transition-colors"
          >
            Listo
          </button>
        )}
      </div>
    </div>
  );
}
