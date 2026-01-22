import { DollarSign, ExternalLink, MapPin, Phone, Globe, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useTramiteStore } from '../../store/tramiteStore';
import { tramitesService } from '../../services/tramitesService';
import type { Tramite } from '../../types/tramite.types';
import { OrganizeTramite, FreeSuggestionsBanner } from '../Calendar';

interface Props {
  tramite: Tramite;
  onCompletar: () => void;
  tabsIds?: string[];
}

export function FasePago({ tramite, onCompletar, tabsIds = [] }: Props) {
  const { progresoActual } = useTramiteStore();
  const [showOrganize, setShowOrganize] = useState(false);

  // Calcular costo total (tramite principal + trámites secundarios abiertos)
  const costoBase = tramite.costo || 0;

  // Identificar los trámites secundarios abiertos basados en tabsIds
  const tramitesSecundarios = tramite.prerequisitos
    ?.filter(p => {
      if (!p.tramiteRelacionado) return false;
      const tramiteRel = tramitesService.getPorId(p.tramiteRelacionado);
      if (!tramiteRel) return false;

      return tabsIds.some(tabId => {
        const tabNormalizado = tabId.toLowerCase().replace('↳', '').trim();
        const tramiteNormalizado = tramiteRel.nombre.toLowerCase().trim();
        return tabNormalizado.includes(tramiteNormalizado) || tramiteNormalizado.includes(tabNormalizado);
      });
    })
    .map(p => {
      const tramiteRel = tramitesService.getPorId(p.tramiteRelacionado!);
      return {
        nombre: tramiteRel?.nombre || 'Trámite desconocido',
        costo: tramiteRel?.costo || 0,
        id: p.tramiteRelacionado!,
      };
    }) || [];

  const costoSecundario = tramitesSecundarios.reduce((total, t) => total + t.costo, 0);
  const costoTotal = costoBase + costoSecundario;

  // URLs y información de pago según el trámite
  const obtenerInfoPago = (tramiteId: string) => {
    const infoMap: Record<string, any> = {
      'obtener_pasaporte': {
        title: 'Pago de Pasaporte',
        cost: costoTotal,
        locations: [
          {
            name: 'Registro Civil - Sede Principal',
            address: 'Av. 10 de Agosto y Esmeraldas, Quito',
            phone: '1-800-11-2929',
            hours: 'Lun-Vie: 8:00 AM - 4:30 PM'
          },
          {
            name: 'Banco del Pacífico - Sucursales autorizadas',
            address: 'Múltiples sucursales a nivel nacional',
            phone: '1-800-222-000',
            hours: 'Lun-Vie: 9:00 AM - 5:00 PM'
          },
          {
            name: 'Banco Pichincha - Sucursales autorizadas',
            address: 'Múltiples sucursales a nivel nacional',
            phone: '1-800-744-000',
            hours: 'Lun-Vie: 9:00 AM - 5:00 PM'
          }
        ],
        onlineUrl: 'https://www.registrocivil.gob.ec/',
        instructions: [
          'El pago se realiza en efectivo o transferencia bancaria',
          'Debes presentar el comprobante de pago al momento de retirar tu pasaporte',
          'El costo incluye la emisión y los trámites administrativos',
          'Los datos de pago se especifican en la boleta de trámite'
        ]
      },
      'renovacion_cedula': {
        title: 'Pago de Renovación de Cédula',
        cost: costoTotal,
        locations: [
          {
            name: 'Registro Civil - Sede Principal',
            address: 'Av. 10 de Agosto y Esmeraldas, Quito',
            phone: '1-800-11-2929',
            hours: 'Lun-Vie: 8:00 AM - 4:30 PM'
          },
          {
            name: 'Bancos autorizados',
            address: 'Múltiples sucursales a nivel nacional',
            phone: 'Comunícate con tu banco',
            hours: 'Lun-Vie: 9:00 AM - 5:00 PM'
          }
        ],
        onlineUrl: 'https://www.registrocivil.gob.ec/',
        instructions: [
          'El pago es gratuito para la primera emisión',
          'Las renovaciones tienen un costo administrativo',
          'Puedes pagar en cualquier banco autorizado',
          'Guarda el comprobante de pago para tu trámite'
        ]
      },
      'visa_americana': {
        title: 'Pago de Solicitud de Visa Americana',
        cost: costoTotal,
        locations: [
          {
            name: 'Embajada de Estados Unidos',
            address: 'Av. Avenida Amazonas N-2943, Quito',
            phone: '1-800-226-6000',
            hours: 'Lun-Vie: 8:00 AM - 12:00 PM (Recepción)'
          },
          {
            name: 'Centro de Solicitud de Visas Ecuavisa',
            address: 'Calle Amazonas y Páez, Quito',
            phone: '1-800-837-2837',
            hours: 'Lun-Vie: 7:30 AM - 5:30 PM'
          }
        ],
        onlineUrl: 'https://www.ustraveldocs.com/ec/',
        instructions: [
          'El pago de la visa se realiza a través del portal oficial de USTRAVELDOCS',
          'Tienes que crear una cuenta y programar una cita previa',
          'El pago es en dólares americanos',
          'Después de pagar, podrás agendar tu cita en la embajada'
        ]
      }
    };

    return infoMap[tramiteId] || {
      title: 'Información de Pago',
      cost: costoTotal,
      locations: [],
      onlineUrl: 'https://www.registrocivil.gob.ec/',
      instructions: ['Comunícate con la institución competente para obtener información de pago']
    };
  };

  const infoPago = obtenerInfoPago(tramite.id);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <DollarSign className="w-8 h-8 text-blue-600" />
          Información de Pago
        </h2>
        <p className="text-gray-600 mb-6">
          Aquí encontrarás toda la información necesaria para realizar el pago de tu {tramite.nombre.toLowerCase()}
        </p>

        {/* Costo estimado */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 mb-6 border-2 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 mb-1">Costo Total a Pagar:</p>
              <h3 className="text-4xl font-bold text-blue-900">${costoTotal.toFixed(2)}</h3>
            </div>
            <div className="text-right">
              <CheckCircle2 className="w-12 h-12 text-green-600 mb-2" />
              <p className="text-sm text-blue-700 font-medium">Costo Oficial</p>
            </div>
          </div>
          {tramitesSecundarios.length > 0 && (
            <p className="text-sm text-blue-700 mt-3 border-t border-blue-200 pt-3">
              ✓ Incluye {tramitesSecundarios.length} trámite{tramitesSecundarios.length !== 1 ? 's' : ''} adicional{tramitesSecundarios.length !== 1 ? 'es' : ''}
            </p>
          )}
        </div>

        {/* Instrucciones de pago */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-yellow-600" />
            Instrucciones Importantes
          </h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
            <ul className="space-y-2">
              {infoPago.instructions.map((instruction: string, idx: number) => (
                <li key={idx} className="flex gap-3 text-sm text-gray-700">
                  <span className="text-yellow-600 font-bold flex-shrink-0">•</span>
                  <span>{instruction}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Lugares de pago */}
        {infoPago.locations.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-red-600" />
              Lugares Autorizados para Pago
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {infoPago.locations.map((location: any, idx: number) => (
                <div key={idx} className="border-2 border-gray-200 rounded-lg p-5 hover:border-blue-400 hover:bg-blue-50 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-3">{location.name}</h4>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{location.address}</span>
                        </div>

                        <div className="flex items-start gap-2">
                          <Phone className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{location.phone}</span>
                        </div>

                        <div className="flex items-start gap-2">
                          <Globe className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{location.hours}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Portal oficial */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="w-6 h-6 text-green-600" />
            Portal Oficial
          </h3>
          <a
            href={infoPago.onlineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 rounded-lg p-5 hover:shadow-lg transition-all group"
          >
            <div>
              <p className="font-bold text-green-900 mb-1">Ir al portal oficial del Registro Civil</p>
              <p className="text-sm text-green-700">Obtén más información y realiza trámites complementarios</p>
            </div>
            <ExternalLink className="w-6 h-6 text-green-600 group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </a>
        </div>

        {/* Información de contacto */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-6">
          <p className="text-sm text-gray-700">
            <span className="font-bold text-gray-900">¿Preguntas?</span> Si necesitas más información sobre los pasos de pago,
            contáctate directamente con la institución competente. Ten a mano tu número de cédula y los datos del trámite.
          </p>
        </div>

        {/* Banner de sugerencias de horarios libres */}
        <FreeSuggestionsBanner
          tramiteId={tramite.id}
          officialUrl={infoPago.onlineUrl}
        />

        {/* Sección de organización de trámite */}
        <div className="mb-6">
          <OrganizeTramite
            tramiteId={tramite.id}
            tramiteName={tramite.nombre}
            location={infoPago.locations[0]?.address}
            requirements={tramite.prerequisitos?.map(p => p.nombre)}
            officialUrl={infoPago.onlineUrl}
          />
        </div>

        {/* Botón de confirmación */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={onCompletar}
            className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg text-white transition-all shadow-lg hover:shadow-xl"
          >
            Continuar a Seguimiento →
          </button>
          <p className="text-xs text-gray-500 text-center mt-3">
            Puedes organizar tu trámite ahora o más tarde desde el sidebar
          </p>
        </div>
      </div>
    </div>
  );
}
