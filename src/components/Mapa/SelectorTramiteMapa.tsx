import { useState } from 'react';
import { X, MapPin, FileText, BookOpen, Car, CreditCard, Building2 } from 'lucide-react';
import { tramitesService } from '../../services/tramitesService';

interface Props {
  onSelectTramite: (tramiteId: string, nombreTramite: string) => void;
  onClose: () => void;
}

const TRAMITES_DISPONIBLES = [
  {
    id: 'renovacion_cedula',
    nombre: 'Renovación de Cédula',
    descripcion: 'Renovar tu cédula de identidad',
    icono: CreditCard,
    color: 'bg-blue-500',
  },
  {
    id: 'obtener_pasaporte',
    nombre: 'Obtener Pasaporte',
    descripcion: 'Tramitar tu pasaporte ecuatoriano',
    icono: BookOpen,
    color: 'bg-red-500',
  },
  {
    id: 'licencia_conducir',
    nombre: 'Licencia de Conducir',
    descripcion: 'Obtener o renovar tu licencia',
    icono: Car,
    color: 'bg-green-500',
  },
  {
    id: 'visa_americana',
    nombre: 'Visa Americana',
    descripcion: 'Aplicar para visa de EE.UU.',
    icono: Building2,
    color: 'bg-purple-500',
  },
];

export function SelectorTramiteMapa({ onSelectTramite, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeInUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Ver ubicaciones</h2>
                <p className="text-blue-100 text-sm">¿Para qué trámite necesitas ver la ruta?</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Lista de trámites */}
        <div className="p-6">
          <p className="text-gray-600 text-sm mb-4">
            Selecciona el trámite para mostrarte los lugares más cercanos a tu ubicación:
          </p>
          
          <div className="space-y-3">
            {TRAMITES_DISPONIBLES.map((tramite) => {
              const Icono = tramite.icono;
              return (
                <button
                  key={tramite.id}
                  onClick={() => onSelectTramite(tramite.id, tramite.nombre)}
                  className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-blue-300 rounded-xl transition-all text-left group"
                >
                  <div className={`p-3 ${tramite.color} rounded-xl`}>
                    <Icono className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {tramite.nombre}
                    </h3>
                    <p className="text-sm text-gray-500">{tramite.descripcion}</p>
                  </div>
                  <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                    →
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <p className="text-xs text-gray-500 text-center">
            💡 Los lugares se mostrarán según tu ubicación actual
          </p>
        </div>
      </div>
    </div>
  );
}
