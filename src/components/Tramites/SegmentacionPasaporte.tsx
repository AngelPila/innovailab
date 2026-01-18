import { useState } from 'react';
import { Flag, FileText, Users, User, Accessibility, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { useTramiteStore } from '../../store/tramiteStore';
import type { Nacionalidad, TipoTramitePasaporte, CategoriaSolicitante, EstatusLegal } from '../../types/tramite.types';

interface Props {
  onConfirm?: () => void;
}

export function SegmentacionPasaporte({ onConfirm }: Props) {
  const { setSegmentacion } = useTramiteStore();
  const [paso, setPaso] = useState<number>(1);
  
  // Respuestas
  const [nacionalidad, setNacionalidad] = useState<Nacionalidad | null>(null);
  const [esNaturalizado, setEsNaturalizado] = useState<boolean | null>(null);
  const [estatusLegal, setEstatusLegal] = useState<EstatusLegal | null>(null);
  const [tipoTramite, setTipoTramite] = useState<TipoTramitePasaporte | null>(null);
  const [categoria, setCategoria] = useState<CategoriaSolicitante | null>(null);
  const [tieneDiscapacidad, setTieneDiscapacidad] = useState<boolean>(false);

  const handleContinuar = () => {
    // Guardar segmentación completa
    setSegmentacion({
      nacionalidad: nacionalidad || undefined,
      esNaturalizado: esNaturalizado || undefined,
      estatusLegal: estatusLegal || undefined,
      tipoTramite: tipoTramite || undefined,
      categoria: categoria || undefined,
      tieneDiscapacidad,
      edadAproximada: categoria === 'adulto-mayor' ? 65 : categoria === 'menor-edad' ? 15 : 35,
    });
    
    if (onConfirm) onConfirm();
  };

  // Paso 1: Nacionalidad
  if (paso === 1) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-yellow-100">
              <Flag className="w-7 h-7 text-yellow-700" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">¿Cuál es tu nacionalidad?</h2>
              <p className="text-gray-600 mt-1">Esto nos ayuda a guiarte mejor</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => { setNacionalidad('ecuatoriano'); setPaso(2); }}
              className="flex items-center justify-between p-6 border-2 border-gray-200 rounded-xl hover:border-yellow-400 hover:bg-yellow-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg group-hover:bg-yellow-200">
                  <Flag className="w-6 h-6 text-yellow-700" />
                </div>
                <span className="text-lg font-semibold text-gray-900">Soy ecuatoriano</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-yellow-600" />
            </button>

            <button
              onClick={() => { setNacionalidad('extranjero'); setPaso(3); }}
              className="flex items-center justify-between p-6 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200">
                  <Users className="w-6 h-6 text-blue-700" />
                </div>
                <span className="text-lg font-semibold text-gray-900">Soy extranjero</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Paso 2: Naturalización (solo si es ecuatoriano)
  if (paso === 2 && nacionalidad === 'ecuatoriano') {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-green-100">
              <FileText className="w-7 h-7 text-green-700" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">¿Cómo obtuviste la nacionalidad?</h2>
              <p className="text-gray-600 mt-1">Queremos asegurarnos de darte los pasos correctos</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => { setEsNaturalizado(false); setPaso(4); }}
              className="flex flex-col items-start p-6 border-2 border-gray-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all text-left"
            >
              <span className="text-lg font-semibold text-gray-900 mb-2">Por nacimiento</span>
              <span className="text-sm text-gray-600">Nací en Ecuador o mis padres son ecuatorianos</span>
            </button>

            <button
              onClick={() => { setEsNaturalizado(true); setPaso(4); }}
              className="flex flex-col items-start p-6 border-2 border-gray-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all text-left"
            >
              <span className="text-lg font-semibold text-gray-900 mb-2">Por naturalización</span>
              <span className="text-sm text-gray-600">Obtuve la nacionalidad siendo extranjero</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Paso 3: Estatus legal (solo si es extranjero)
  if (paso === 3 && nacionalidad === 'extranjero') {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-blue-100">
              <AlertCircle className="w-7 h-7 text-blue-700" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">¿Cuál es tu situación en Ecuador?</h2>
              <p className="text-gray-600 mt-1">Necesitamos saber tu estatus migratorio</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => { setEstatusLegal('residente-legal'); setPaso(99); }}
              className="w-full flex items-start p-5 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-left"
            >
              <CheckCircle2 className="w-6 h-6 text-green-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <span className="text-lg font-semibold text-gray-900 block mb-1">Tengo residencia legal</span>
                <span className="text-sm text-gray-600">Visa de trabajo, residencia temporal o permanente</span>
              </div>
            </button>

            <button
              onClick={() => { setEstatusLegal('turistico'); setPaso(99); }}
              className="w-full flex items-start p-5 border-2 border-gray-200 rounded-xl hover:border-yellow-400 hover:bg-yellow-50 transition-all text-left"
            >
              <AlertCircle className="w-6 h-6 text-yellow-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <span className="text-lg font-semibold text-gray-900 block mb-1">Estoy como turista</span>
                <span className="text-sm text-gray-600">Entré con visa de turista o sin visa</span>
              </div>
            </button>

            <button
              onClick={() => { setEstatusLegal('irregular'); setPaso(99); }}
              className="w-full flex items-start p-5 border-2 border-gray-200 rounded-xl hover:border-red-400 hover:bg-red-50 transition-all text-left"
            >
              <AlertCircle className="w-6 h-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <span className="text-lg font-semibold text-gray-900 block mb-1">Situación irregular</span>
                <span className="text-sm text-gray-600">Mi visa venció o entré sin documentos</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Paso 4: Tipo de trámite (solo para ecuatorianos)
  if (paso === 4 && nacionalidad === 'ecuatoriano') {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-purple-100">
              <FileText className="w-7 h-7 text-purple-700" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">¿Qué necesitas hacer?</h2>
              <p className="text-gray-600 mt-1">Selecciona tu situación</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => { setTipoTramite('primera-vez'); setPaso(5); }}
              className="p-5 border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all text-left"
            >
              <span className="text-lg font-semibold text-gray-900 block mb-1">Primera vez</span>
              <span className="text-sm text-gray-600">Nunca he tenido pasaporte</span>
            </button>

            <button
              onClick={() => { setTipoTramite('renovacion'); setPaso(5); }}
              className="p-5 border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all text-left"
            >
              <span className="text-lg font-semibold text-gray-900 block mb-1">Renovación</span>
              <span className="text-sm text-gray-600">Tengo pasaporte vencido o próximo a vencer</span>
            </button>

            <button
              onClick={() => { setTipoTramite('perdida-robo'); setPaso(5); }}
              className="p-5 border-2 border-gray-200 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition-all text-left"
            >
              <span className="text-lg font-semibold text-gray-900 block mb-1">Pérdida o robo</span>
              <span className="text-sm text-gray-600">Me robaron o perdí mi pasaporte</span>
            </button>

            <button
              onClick={() => { setTipoTramite('duplicado'); setPaso(5); }}
              className="p-5 border-2 border-gray-200 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all text-left"
            >
              <span className="text-lg font-semibold text-gray-900 block mb-1">Duplicado</span>
              <span className="text-sm text-gray-600">Necesito una copia adicional</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Paso 5: Categoría del solicitante
  if (paso === 5) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-indigo-100">
              <User className="w-7 h-7 text-indigo-700" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">¿Quién hará el trámite?</h2>
              <p className="text-gray-600 mt-1">Última pregunta para personalizar tu experiencia</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => { setCategoria('adulto'); setPaso(6); }}
              className="w-full p-5 border-2 border-gray-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 transition-all text-left"
            >
              <span className="text-lg font-semibold text-gray-900 block mb-1">Soy adulto (18-64 años)</span>
              <span className="text-sm text-gray-600">Trámite estándar</span>
            </button>

            <button
              onClick={() => { setCategoria('menor-edad'); setPaso(6); }}
              className="w-full p-5 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-left"
            >
              <span className="text-lg font-semibold text-gray-900 block mb-1">Soy menor de edad (menor de 18)</span>
              <span className="text-sm text-gray-600">Necesitarás permiso de tus padres o tutores</span>
            </button>

            <button
              onClick={() => { setCategoria('adulto-mayor'); setPaso(6); }}
              className="w-full p-5 border-2 border-gray-200 rounded-xl hover:border-green-400 hover:bg-green-50 transition-all text-left"
            >
              <span className="text-lg font-semibold text-gray-900 block mb-1">Soy adulto mayor (65+ años)</span>
              <span className="text-sm text-gray-600">Tendrás atención prioritaria</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Paso 6: Discapacidad (opcional)
  if (paso === 6) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-blue-100">
              <Accessibility className="w-7 h-7 text-blue-700" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">¿Tienes discapacidad registrada?</h2>
              <p className="text-gray-600 mt-1">Tendrás atención preferente</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => { setTieneDiscapacidad(true); handleContinuar(); }}
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all"
            >
              <span className="text-lg font-semibold text-gray-900">Sí, tengo carnet</span>
            </button>

            <button
              onClick={() => { setTieneDiscapacidad(false); handleContinuar(); }}
              className="p-6 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              <span className="text-lg font-semibold text-gray-900">No</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Paso 99: Mensaje de bloqueo para extranjeros
  if (paso === 99 && nacionalidad === 'extranjero') {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-orange-100">
              <AlertCircle className="w-7 h-7 text-orange-700" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Importante</h2>
            </div>
          </div>

          {estatusLegal === 'irregular' && (
            <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-lg mb-4">
              <p className="text-red-800 font-medium mb-2">Necesitas regularizar tu situación primero</p>
              <p className="text-red-700 text-sm">
                Para solicitar cualquier documento, debes acudir al Ministerio de Relaciones Exteriores 
                y regularizar tu estatus migratorio en Ecuador.
              </p>
            </div>
          )}

          {estatusLegal === 'turistico' && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-5 rounded-lg mb-4">
              <p className="text-yellow-800 font-medium mb-2">Como turista, no puedes sacar pasaporte ecuatoriano</p>
              <p className="text-yellow-700 text-sm">
                Si necesitas un pasaporte, debes solicitarlo en la embajada o consulado de tu país. 
                Si buscas quedarte en Ecuador, consulta los trámites de residencia en el Ministerio de Relaciones Exteriores.
              </p>
            </div>
          )}

          {estatusLegal === 'residente-legal' && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-lg mb-4">
              <p className="text-blue-800 font-medium mb-2">Solo ecuatorianos pueden obtener pasaporte ecuatoriano</p>
              <p className="text-blue-700 text-sm mb-3">
                Como residente legal extranjero, debes solicitar tu pasaporte en la embajada o consulado de tu país de origen.
              </p>
              <p className="text-blue-700 text-sm">
                Si deseas obtener la nacionalidad ecuatoriana, consulta los requisitos de naturalización 
                en el Ministerio de Relaciones Exteriores (normalmente requiere varios años de residencia legal).
              </p>
            </div>
          )}

          <button
            onClick={() => setPaso(1)}
            className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return null;
}
