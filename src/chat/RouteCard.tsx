import React from 'react';
import { MapPin, Clock } from 'lucide-react';

interface Destination {
  id: number;
  name: string;
  time: string;
}

interface RouteCardProps {
  title?: string;
  destinations?: Destination[];
  accentColor?: string;
  onGenerateRoute?: () => void;
  buttonText?: string;
}

const RouteCard: React.FC<RouteCardProps> = ({
  title = 'Ruta de destinos',
  destinations = [
    { id: 1, name: 'Centro Comercial', time: '15 min' },
    { id: 2, name: 'Parque Central', time: '25 min' },
    { id: 3, name: 'Museo de Arte', time: '40 min' },
  ],
  accentColor = '#FFD41D',
  onGenerateRoute,
  buttonText = 'Generar ruta',
}) => {
  return (
    <div className="max-w-md mx-auto mt-8 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Destinations List */}
        <div className="space-y-4 mb-6">
          {destinations.map((destination, index) => (
            <div 
              key={destination.id}
              className="flex items-start gap-3"
            >
              {/* Bullet with number */}
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm"
                style={{ backgroundColor: accentColor }}
              >
                {index + 1}
              </div>
              
              {/* Destination info */}
              <div className="flex-1 pt-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-900 font-medium">
                      {destination.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 text-sm flex-shrink-0">
                    <Clock size={14} />
                    <span>{destination.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Generate Route Button */}
        <button
          onClick={onGenerateRoute}
          className="w-full py-3 px-4 rounded-lg font-semibold text-gray-900 transition-all hover:opacity-90 hover:shadow-md"
          style={{ backgroundColor: accentColor }}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default RouteCard;