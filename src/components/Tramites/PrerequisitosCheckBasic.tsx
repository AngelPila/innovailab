import { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, ArrowRight, RotateCcw, HelpCircle, X } from 'lucide-react';
import type { Prerequisito } from '../../types/tramite.types';
import { tramitesService } from '../../services/tramitesService';

interface Props {
  prerequisitos: Prerequisito[];
  prerequisitosCumplidos: Record<string, boolean>;
  onValidacionCompleta: (cumplidos: Record<string, boolean>) => void;
  onAbrirTramiteRelacionado?: (tramiteId: string, nombreTramite: string) => void;
}

/**
 * Versión simplificada de PrerequisitosCheck para adultos mayores
 * - Botones GIGANTES Sí/No
 * - Una pregunta a la vez
 * - Texto grande y claro
 * - Sin complejidad de "omitir"
 */
export function PrerequisitosCheckBasic({
  prerequisitos,
  prerequisitosCumplidos,
  onValidacionCompleta,
  onAbrirTramiteRelacionado,
}: Props) {
  const [respuestas, setRespuestas] = useState<Record<string, boolean>>(prerequisitosCumplidos);
  const [indiceActual, setIndiceActual] = useState<number>(0);
  const [prerequisitoFaltante, setPrerequistoFaltante] = useState<Prerequisito | null>(null);
  const [mostrarComoConseguir, setMostrarComoConseguir] = useState<boolean>(false);

  const requisitoActual = prerequisitos[indiceActual];
  const todosRespondidos = prerequisitos.every((pre) => respuestas[pre.id] !== undefined);

  const handleRespuesta = (tieneDocumento: boolean) => {
    const nuevasRespuestas = {
      ...respuestas,
      [requisitoActual.id]: tieneDocumento,
    };
    setRespuestas(nuevasRespuestas);

    // Si respondió NO, mostrar pantalla de prerequisito faltante
    if (!tieneDocumento) {
      setTimeout(() => {
        setPrerequistoFaltante(requisitoActual);
      }, 300);
      return;
    }

    // Si no es el último, avanzar al siguiente
    if (indiceActual < prerequisitos.length - 1) {
      setTimeout(() => setIndiceActual(indiceActual + 1), 300);
    } else {
      // Si es el último y respondió, mostrar resumen
      setTimeout(() => {
        onValidacionCompleta(nuevasRespuestas);
      }, 300);
    }
  };

  const handleContinuarSinPrerequisito = () => {
    setPrerequistoFaltante(null);
    
    // Si no es el último, avanzar al siguiente
    if (indiceActual < prerequisitos.length - 1) {
      setTimeout(() => setIndiceActual(indiceActual + 1), 300);
    } else {
      // Si es el último, completar validación
      setTimeout(() => {
        onValidacionCompleta(respuestas);
      }, 300);
    }
  };

  const handleVolverAIntentar = () => {
    // Marcar como que aún no ha respondido y volver a preguntar
    const nuevasRespuestas = { ...respuestas };
    delete nuevasRespuestas[prerequisitoFaltante!.id];
    setRespuestas(nuevasRespuestas);
    setPrerequistoFaltante(null);
  };

  const handleIrATramiteRelacionado = () => {
    if (prerequisitoFaltante?.tramiteRelacionado) {
      const tramite = tramitesService.getPorId(prerequisitoFaltante.tramiteRelacionado);
      if (tramite && onAbrirTramiteRelacionado) {
        onAbrirTramiteRelacionado(tramite.id, tramite.nombre);
      }
    }
  };

  const requisitosCumplidos = prerequisitos.filter((p) => respuestas[p.id] === true).length;

  if (!requisitoActual) {
    return null;
  }

  // Pantalla de prerequisito faltante
  if (prerequisitoFaltante) {
    const tramiteRelacionado = prerequisitoFaltante.tramiteRelacionado
      ? tramitesService.getPorId(prerequisitoFaltante.tramiteRelacionado)
      : null;

    // Modal de instrucciones "¿Cómo conseguir?"
    if (mostrarComoConseguir) {
      return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 md:px-8 py-6 md:py-8 flex items-center justify-between sticky top-0">
              <h2 className="text-2xl md:text-4xl font-black text-white flex items-center gap-3">
                <HelpCircle className="w-8 h-8 md:w-10 md:h-10" />
                Pasos para obtener
              </h2>
              <button
                onClick={() => setMostrarComoConseguir(false)}
                className="bg-white hover:bg-gray-100 text-gray-900 p-3 md:p-4 rounded-xl transition-all"
              >
                <X className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            </div>

            {/* Contenido */}
            <div className="p-6 md:p-8 space-y-6">
              {/* Título del documento */}
              <div>
                <p className="text-sm md:text-base font-semibold text-gray-500 uppercase tracking-wider mb-2">Documento requerido</p>
                <h3 className="text-2xl md:text-4xl font-black text-gray-900">{prerequisitoFaltante.nombre}</h3>
              </div>

              {/* Descripción */}
              {prerequisitoFaltante.descripcion && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 md:p-6 rounded-lg">
                  <p className="text-lg md:text-2xl text-gray-700">{prerequisitoFaltante.descripcion}</p>
                </div>
              )}

              {/* Pregunta de validación */}
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 md:p-6 rounded-lg">
                <p className="text-lg md:text-2xl text-gray-700">
                  <strong className="text-gray-900">Validación requerida:</strong> {prerequisitoFaltante.preguntaValidacion}
                </p>
              </div>

              {/* Instrucciones generales */}
              <div>
                <h4 className="text-xl md:text-3xl font-bold text-gray-900 mb-4">¿Dónde obtenerlo?</h4>
                <div className="bg-green-50 border-l-4 border-green-500 p-4 md:p-6 rounded-lg">
                  <p className="text-base md:text-xl text-gray-700">
                    {prerequisitoFaltante.tipo === 'documento' && (
                      <>Este documento lo puedes obtener en las oficinas gubernamentales correspondientes o a través de plataformas en línea autorizadas. Consulta con tu institución local para más detalles.</>
                    )}
                    {prerequisitoFaltante.tipo === 'validacion' && (
                      <>Deberás validar esta información en el sistema. Prepara los datos personales y documentación necesaria.</>
                    )}
                    {prerequisitoFaltante.tipo === 'archivo' && (
                      <>Necesitarás preparar y cargar este archivo. Asegúrate de que esté en el formato correcto y con toda la información requerida.</>
                    )}
                  </p>
                </div>
              </div>

              {/* Si hay un trámite relacionado */}
              {tramiteRelacionado && (
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 md:p-6 rounded-lg">
                  <p className="text-base md:text-xl text-gray-700">
                    <strong className="text-gray-900">💡 Consejo:</strong> Tienes un trámite relacionado <strong>"{tramiteRelacionado.nombre}"</strong> que te puede ayudar a obtener este documento.
                  </p>
                </div>
              )}

              {/* Botón cerrar */}
              <button
                onClick={() => setMostrarComoConseguir(false)}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-black py-5 md:py-8 px-6 md:px-8 rounded-2xl md:rounded-3xl transition-all transform hover:scale-105 active:scale-95 shadow-2xl text-lg md:text-2xl"
              >
                Entendido, volver
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-12 xl:gap-16 h-full p-6 md:p-12">
        {/* COLUMNA IZQUIERDA: Información del documento */}
        <div className="flex flex-col items-center lg:items-start justify-center text-center lg:text-left lg:border-r lg:border-gray-200 lg:pr-12 xl:pr-16">
          {/* Icono de alerta */}
          <div className="mb-8">
            <div className="bg-orange-100 rounded-full p-8 md:p-12 inline-block">
              <AlertCircle className="w-16 h-16 md:w-24 md:h-24 text-orange-600" />
            </div>
          </div>

          {/* Mensaje */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6">
            Documento Faltante
          </h2>
          <p className="text-xl md:text-3xl lg:text-4xl text-gray-700 mb-4 font-bold">
            {prerequisitoFaltante.nombre}
          </p>
          <p className="text-lg md:text-2xl lg:text-3xl text-gray-600 max-w-3xl">
            {prerequisitoFaltante.descripcion}
          </p>
        </div>

        {/* COLUMNA DERECHA: Opciones */}
        <div className="flex flex-col justify-center gap-4 mt-8 lg:mt-0">
          {/* Si hay trámite relacionado, mostrar opción de ir */}
          {tramiteRelacionado && (
            <button
              onClick={handleIrATramiteRelacionado}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-black py-6 md:py-10 px-6 md:px-8 rounded-2xl md:rounded-3xl transition-all transform hover:scale-105 active:scale-95 shadow-2xl text-xl md:text-2xl flex items-center justify-center gap-4"
            >
              <span>Obtener {tramiteRelacionado.nombre}</span>
              <ArrowRight className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          )}

          {/* ¿Cómo conseguir? - Botón para mostrar instrucciones */}
          <button
            onClick={() => setMostrarComoConseguir(true)}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-black py-6 md:py-10 px-6 md:px-8 rounded-2xl md:rounded-3xl transition-all transform hover:scale-105 active:scale-95 shadow-2xl text-xl md:text-2xl flex items-center justify-center gap-4"
          >
            <HelpCircle className="w-6 h-6 md:w-8 md:h-8" />
            <span>¿Cómo conseguir?</span>
          </button>

          {/* Volver a intentar */}
          <button
            onClick={handleVolverAIntentar}
            className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-gray-900 font-black py-6 md:py-10 px-6 md:px-8 rounded-2xl md:rounded-3xl transition-all transform hover:scale-105 active:scale-95 shadow-2xl text-xl md:text-2xl flex items-center justify-center gap-4"
          >
            <RotateCcw className="w-6 h-6 md:w-8 md:h-8" />
            <span>Ya lo tengo, volver a intentar</span>
          </button>

          {/* Continuar sin este prerequisito - SIEMPRE mostrar opción */}
          <button
            onClick={handleContinuarSinPrerequisito}
            className="w-full bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-5 md:py-8 px-6 md:px-8 rounded-2xl md:rounded-3xl transition-all transform hover:scale-105 active:scale-95 shadow-xl text-lg md:text-xl"
          >
            Continuar sin este documento
          </button>

          {/* Si no es opcional, mostrar advertencia pero dejar continuar */}
          {!prerequisitoFaltante.esOpcional && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 text-left">
              <p className="text-amber-900 font-semibold text-base md:text-lg">
                ⚠️ <strong>Nota importante:</strong> Este documento es recomendado. Podrás obtenerlo después, pero es mejor tenerlo antes de continuar.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-12 xl:gap-16 min-h-0 overflow-hidden h-full">
      {/* COLUMNA IZQUIERDA: Encabezado y progreso */}
      <div className="flex flex-col lg:border-r lg:border-gray-200 lg:pr-12 xl:pr-16 justify-between lg:py-8">
        {/* Encabezado */}
        <div className="mb-6 md:mb-12 flex-shrink-0">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 md:mb-6">
            Verifica tus documentos
          </h2>
          <p className="text-lg md:text-2xl lg:text-3xl text-gray-700 font-bold">
            Pregunta {indiceActual + 1} de {prerequisitos.length}
          </p>
        </div>

        {/* Barra de progreso visual GRANDE */}
        <div className="mb-6 md:mb-16 flex-shrink-0">
          <div className="w-full h-4 md:h-6 bg-gray-200 rounded-full overflow-hidden shadow-lg">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-300"
              style={{
                width: `${((indiceActual + 1) / prerequisitos.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Resumen de progreso */}
        <div className="text-center lg:text-left text-gray-600 flex-shrink-0 mt-auto">
          <p className="text-base md:text-lg lg:text-xl font-semibold">
            {requisitosCumplidos} de {prerequisitos.length} documentos confirmados
          </p>
        </div>
      </div>

      {/* COLUMNA DERECHA: Pregunta y botones */}
      <div className="flex flex-col justify-center min-h-0 lg:py-8 gap-8 lg:gap-12">
        {/* Pregunta actual - GIGANTE */}
        <div className="flex-1 flex flex-col items-center justify-center mb-8 md:mb-12 lg:mb-16 overflow-y-auto min-h-0">
          <div className="text-center max-w-3xl px-2">
            <p className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-6 md:mb-8 leading-relaxed">
              {requisitoActual.preguntaValidacion}
            </p>

            {requisitoActual.descripcion && (
              <p className="text-lg md:text-2xl lg:text-3xl text-gray-600 mb-6 md:mb-10 font-semibold">
                {requisitoActual.descripcion}
              </p>
            )}
          </div>
        </div>

        {/* Botones Sí/No GIGANTES */}
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 flex-shrink-0">
          <button
            onClick={() => handleRespuesta(true)}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black py-6 md:py-10 px-6 md:px-8 rounded-2xl md:rounded-3xl transition-all transform hover:scale-105 active:scale-95 shadow-2xl text-xl md:text-3xl flex items-center justify-center gap-3 md:gap-4"
          >
            <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0" />
            <span>Sí, tengo</span>
          </button>

          <button
            onClick={() => handleRespuesta(false)}
            className="flex-1 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-black py-6 md:py-10 px-6 md:px-8 rounded-2xl md:rounded-3xl transition-all transform hover:scale-105 active:scale-95 shadow-2xl text-xl md:text-3xl flex items-center justify-center gap-3 md:gap-4"
          >
            <XCircle className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0" />
            <span>No tengo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
