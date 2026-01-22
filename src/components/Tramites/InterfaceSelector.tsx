import { Users, Zap, Clock, BookOpen, Volume2, Maximize2 } from 'lucide-react';

interface Props {
  onSelectBasic: () => void;
  onSelectAdvanced: () => void;
}

export function InterfaceSelector({ onSelectBasic, onSelectAdvanced }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Bienvenido a Govly
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Elige la interfaz que mejor se adapte a ti
          </p>
        </div>

        {/* Opciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Opción Básica - Adultos Mayores */}
          <button
            onClick={onSelectBasic}
            className="group relative overflow-hidden rounded-3xl transition-all duration-300 hover:shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity" />
            
            <div className="bg-white border-2 border-gray-200 group-hover:border-blue-400 rounded-3xl p-8 md:p-10 transition-all">
              {/* Icono Principal */}
              <div className="flex justify-center mb-6">
                <div className="bg-blue-50 group-hover:bg-blue-100 rounded-2xl p-6 transition-colors">
                  <Users className="w-12 h-12 text-blue-600" />
                </div>
              </div>

              {/* Título */}
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-center">
                Versión Básica
              </h2>

              {/* Descripción */}
              <p className="text-gray-600 text-center mb-8 text-lg">
                Diseñada para ofrecer una experiencia clara y sencilla
              </p>

              {/* Características */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">✓</span>
                  </div>
                  <span className="text-base font-medium">Botones grandes y claros</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">✓</span>
                  </div>
                  <span className="text-base font-medium">Instrucciones paso a paso</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">✓</span>
                  </div>
                  <span className="text-base font-medium">Texto legible y grande</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">✓</span>
                  </div>
                  <span className="text-base font-medium">Resumen antes de enviar</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-600">✓</span>
                  </div>
                  <span className="text-base font-medium">Control de voz disponible</span>
                </div>
              </div>

              {/* Botón CTA */}
              <button
                onClick={onSelectBasic}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 transform group-hover:scale-105 shadow-lg"
              >
                Usar Versión Básica
              </button>
            </div>
          </button>

          {/* Opción Avanzada - Jóvenes */}
          <button
            onClick={onSelectAdvanced}
            className="group relative overflow-hidden rounded-3xl transition-all duration-300 hover:shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-amber-600 opacity-0 group-hover:opacity-10 transition-opacity" />
            
            <div className="bg-white border-2 border-gray-200 group-hover:border-yellow-400 rounded-3xl p-8 md:p-10 transition-all">
              {/* Icono Principal */}
              <div className="flex justify-center mb-6">
                <div className="bg-yellow-50 group-hover:bg-yellow-100 rounded-2xl p-6 transition-colors">
                  <Zap className="w-12 h-12 text-yellow-600" />
                </div>
              </div>

              {/* Título */}
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-center">
                Versión Avanzada
              </h2>

              {/* Descripción */}
              <p className="text-gray-600 text-center mb-8 text-lg">
                Rápida, eficiente y cargada de funcionalidades
              </p>

              {/* Características */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-yellow-600">✓</span>
                  </div>
                  <span className="text-base font-medium">Flujo rápido y directo</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-yellow-600">✓</span>
                  </div>
                  <span className="text-base font-medium">Barra de progreso visible</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-yellow-600">✓</span>
                  </div>
                  <span className="text-base font-medium">Menos instrucciones</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-yellow-600">✓</span>
                  </div>
                  <span className="text-base font-medium">Todas las características</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-yellow-600">✓</span>
                  </div>
                  <span className="text-base font-medium">Historial y sincronización</span>
                </div>
              </div>

              {/* Botón CTA */}
              <button
                onClick={onSelectAdvanced}
                className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 transform group-hover:scale-105 shadow-lg"
              >
                Usar Versión Avanzada
              </button>
            </div>
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Siempre puedes cambiar tu preferencia en los ajustes
          </p>
        </div>
      </div>
    </div>
  );
}
