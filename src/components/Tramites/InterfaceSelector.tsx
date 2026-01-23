import { Users, Zap, Clock, BookOpen, Volume2, Maximize2 } from 'lucide-react';

interface Props {
  onSelectBasic: () => void;
  onSelectAdvanced: () => void;
}

export function InterfaceSelector({ onSelectBasic, onSelectAdvanced }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50 flex items-center justify-center p-3 md:p-4 overflow-hidden">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-6 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2 md:mb-4">
            Bienvenido a Govly
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Elige tu interfaz
          </p>
        </div>

        {/* Opciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 px-2 md:px-0">
          {/* Opción Básica - Adultos Mayores */}
          <button
            onClick={onSelectBasic}
            className="group relative overflow-hidden rounded-2xl md:rounded-3xl transition-all duration-300 hover:shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity" />
            
            <div className="bg-white border-2 border-gray-200 group-hover:border-blue-400 rounded-2xl md:rounded-3xl p-5 md:p-10 transition-all">
              {/* Icono Principal */}
              <div className="flex justify-center mb-4 md:mb-6">
                <div className="bg-blue-50 group-hover:bg-blue-100 rounded-2xl p-4 md:p-6 transition-colors">
                  <Users className="w-10 md:w-12 h-10 md:h-12 text-blue-600" />
                </div>
              </div>

              {/* Título */}
              <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4 text-center">
                Versión Básica
              </h2>

              {/* Descripción */}
              <p className="text-gray-600 text-center mb-5 md:mb-8 text-sm md:text-lg">
                Clara y sencilla
              </p>

              {/* Características */}
              <div className="space-y-2 mb-5 md:mb-8">
                <div className="flex items-center gap-2 text-gray-700 text-sm md:text-base">
                  <div className="flex-shrink-0 w-4 h-4 md:w-5 md:h-5 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">✓</span>
                  </div>
                  <span className="font-medium">Botones grandes</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 text-sm md:text-base">
                  <div className="flex-shrink-0 w-4 h-4 md:w-5 md:h-5 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">✓</span>
                  </div>
                  <span className="font-medium">Texto legible</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 text-sm md:text-base">
                  <div className="flex-shrink-0 w-4 h-4 md:w-5 md:h-5 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">✓</span>
                  </div>
                  <span className="font-medium">Control de voz</span>
                </div>
              </div>

              {/* Botón CTA */}
              <button
                onClick={onSelectBasic}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 md:py-4 px-4 md:px-6 rounded-xl md:rounded-2xl transition-all duration-200 transform group-hover:scale-105 shadow-lg text-base md:text-lg"
              >
                Versión Básica
              </button>
            </div>
          </button>

          {/* Opción Avanzada - Jóvenes */}
          <button
            onClick={onSelectAdvanced}
            className="group relative overflow-hidden rounded-2xl md:rounded-3xl transition-all duration-300 hover:shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-amber-600 opacity-0 group-hover:opacity-10 transition-opacity" />
            
            <div className="bg-white border-2 border-gray-200 group-hover:border-yellow-400 rounded-2xl md:rounded-3xl p-5 md:p-10 transition-all">
              {/* Icono Principal */}
              <div className="flex justify-center mb-4 md:mb-6">
                <div className="bg-yellow-50 group-hover:bg-yellow-100 rounded-2xl p-4 md:p-6 transition-colors">
                  <Zap className="w-10 md:w-12 h-10 md:h-12 text-yellow-600" />
                </div>
              </div>

              {/* Título */}
              <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4 text-center">
                Versión Avanzada
              </h2>

              {/* Descripción */}
              <p className="text-gray-600 text-center mb-5 md:mb-8 text-sm md:text-lg">
                Rápida y eficiente
              </p>

              {/* Características */}
              <div className="space-y-2 mb-5 md:mb-8">
                <div className="flex items-center gap-2 text-gray-700 text-sm md:text-base">
                  <div className="flex-shrink-0 w-4 h-4 md:w-5 md:h-5 rounded-full bg-yellow-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-yellow-600">✓</span>
                  </div>
                  <span className="font-medium">Flujo rápido</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 text-sm md:text-base">
                  <div className="flex-shrink-0 w-4 h-4 md:w-5 md:h-5 rounded-full bg-yellow-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-yellow-600">✓</span>
                  </div>
                  <span className="font-medium">Progreso visual</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 text-sm md:text-base">
                  <div className="flex-shrink-0 w-4 h-4 md:w-5 md:h-5 rounded-full bg-yellow-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-yellow-600">✓</span>
                  </div>
                  <span className="font-medium">Todas las funciones</span>
                </div>
              </div>

              {/* Botón CTA */}
              <button
                onClick={onSelectAdvanced}
                className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white font-bold py-3 md:py-4 px-4 md:px-6 rounded-xl md:rounded-2xl transition-all duration-200 transform group-hover:scale-105 shadow-lg text-base md:text-lg"
              >
                Versión Avanzada
              </button>
            </div>
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-6 md:mt-12 text-center px-4">
          <p className="text-gray-500 text-xs md:text-sm">
            Puedes cambiar tu preferencia después
          </p>
        </div>
      </div>
    </div>
  );
}
