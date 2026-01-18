import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (tramiteId: string) => void;
}

const tramites = [
  { id: 'renovacion_cedula', nombre: 'Renovación de Cédula', emoji: '📋' },
  { id: 'obtener_pasaporte', nombre: 'Obtención de Pasaporte', emoji: '🛂' },
  { id: 'licencia_conducir', nombre: 'Licencia de Conducir', emoji: '🚗' },
  { id: 'visa_americana', nombre: 'Visa Americana', emoji: '🌍' },
];

export function SelectTramiteModal({ isOpen, onClose, onSelect }: Props) {
  if (!isOpen) return null;

  const handleSelect = (tramiteId: string) => {
    onSelect(tramiteId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 animate-slideUp">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Selecciona tu trámite
            </h2>
            <p className="text-gray-600">
              Elige el trámite para el que necesitas generar una ruta
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Grid de opciones */}
        <div className="grid grid-cols-2 gap-4">
          {tramites.map((tramite) => (
            <button
              key={tramite.id}
              onClick={() => handleSelect(tramite.id)}
              className="group relative p-6 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl hover:border-govly-secondary hover:shadow-lg transition-all duration-300 text-left"
            >
              <div className="flex flex-col items-center text-center gap-3">
                <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                  {tramite.emoji}
                </span>
                <span className="text-lg font-semibold text-gray-800 group-hover:text-govly-secondary transition-colors">
                  {tramite.nombre}
                </span>
              </div>
              
              {/* Efecto de gradiente al hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-govly-secondary/0 to-govly-secondary/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            La ruta se optimizará según los lugares necesarios para tu trámite
          </p>
        </div>
      </div>
    </div>
  );
}

export default SelectTramiteModal;
