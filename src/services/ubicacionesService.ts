// Servicio de ubicaciones de instituciones en Ecuador
export interface Ubicacion {
  id: string;
  nombre: string;
  tipo: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  lat: number;
  lng: number;
  horario?: string;
  telefono?: string;
}

export interface LugarTramite {
  tipo: string;
  nombre: string;
  descripcion: string;
  ubicacionMasCercana?: Ubicacion;
  distancia?: number; // en km
  orden: number;
}

// Base de datos de ubicaciones de instituciones en Ecuador
const UBICACIONES: Ubicacion[] = [
  // Registro Civil - Quito
  {
    id: 'rc-quito-centro',
    nombre: 'Registro Civil - Quito Centro',
    tipo: 'registro_civil',
    direccion: 'Av. Gran Colombia y Sodiro',
    ciudad: 'Quito',
    provincia: 'Pichincha',
    lat: -0.2167,
    lng: -78.5000,
    horario: 'Lun-Vie 8:00-17:00',
    telefono: '(02) 299-2300'
  },
  {
    id: 'rc-quito-norte',
    nombre: 'Registro Civil - Quito Norte (Carcelén)',
    tipo: 'registro_civil',
    direccion: 'Centro Comercial Carcelén',
    ciudad: 'Quito',
    provincia: 'Pichincha',
    lat: -0.0833,
    lng: -78.4500,
    horario: 'Lun-Vie 8:00-17:00',
    telefono: '(02) 299-2301'
  },
  {
    id: 'rc-quito-sur',
    nombre: 'Registro Civil - Quito Sur (Quitumbe)',
    tipo: 'registro_civil',
    direccion: 'Centro Comercial Quicentro Sur',
    ciudad: 'Quito',
    provincia: 'Pichincha',
    lat: -0.2833,
    lng: -78.5500,
    horario: 'Lun-Vie 8:00-17:00',
    telefono: '(02) 299-2302'
  },
  // Registro Civil - Guayaquil
  {
    id: 'rc-guayaquil-centro',
    nombre: 'Registro Civil - Guayaquil Centro',
    tipo: 'registro_civil',
    direccion: 'Av. 9 de Octubre y Malecón',
    ciudad: 'Guayaquil',
    provincia: 'Guayas',
    lat: -2.1894,
    lng: -79.8891,
    horario: 'Lun-Vie 8:00-17:00',
    telefono: '(04) 259-4000'
  },
  {
    id: 'rc-guayaquil-norte',
    nombre: 'Registro Civil - Guayaquil Norte',
    tipo: 'registro_civil',
    direccion: 'Mall del Sol',
    ciudad: 'Guayaquil',
    provincia: 'Guayas',
    lat: -2.1500,
    lng: -79.9000,
    horario: 'Lun-Vie 8:00-17:00',
    telefono: '(04) 259-4001'
  },
  // Registro Civil - Cuenca
  {
    id: 'rc-cuenca-centro',
    nombre: 'Registro Civil - Cuenca Centro',
    tipo: 'registro_civil',
    direccion: 'Calle Sucre y Benigno Malo',
    ciudad: 'Cuenca',
    provincia: 'Azuay',
    lat: -2.8974,
    lng: -79.0045,
    horario: 'Lun-Vie 8:00-17:00',
    telefono: '(07) 283-5000'
  },
  
  // Bancos (para pagos)
  {
    id: 'banco-pichincha-quito',
    nombre: 'Banco Pichincha - Matriz Quito',
    tipo: 'banco',
    direccion: 'Av. Amazonas y Pereira',
    ciudad: 'Quito',
    provincia: 'Pichincha',
    lat: -0.2000,
    lng: -78.4900,
    horario: 'Lun-Vie 9:00-16:00',
    telefono: '(02) 299-9999'
  },
  {
    id: 'banco-guayaquil-quito',
    nombre: 'Banco de Guayaquil - Quito',
    tipo: 'banco',
    direccion: 'Av. República y Amazonas',
    ciudad: 'Quito',
    provincia: 'Pichincha',
    lat: -0.1800,
    lng: -78.4800,
    horario: 'Lun-Vie 9:00-16:00',
    telefono: '(02) 372-0100'
  },
  {
    id: 'banco-pichincha-guayaquil',
    nombre: 'Banco Pichincha - Guayaquil Centro',
    tipo: 'banco',
    direccion: 'Av. 9 de Octubre y Pichincha',
    ciudad: 'Guayaquil',
    provincia: 'Guayas',
    lat: -2.1900,
    lng: -79.8850,
    horario: 'Lun-Vie 9:00-16:00',
    telefono: '(04) 259-9999'
  },
  
  // ANT (Licencias)
  {
    id: 'ant-quito-norte',
    nombre: 'ANT - Quito Norte',
    tipo: 'ant',
    direccion: 'Av. Eloy Alfaro y 6 de Diciembre',
    ciudad: 'Quito',
    provincia: 'Pichincha',
    lat: -0.1700,
    lng: -78.4700,
    horario: 'Lun-Vie 8:00-17:00',
    telefono: '(02) 398-4000'
  },
  {
    id: 'ant-quito-sur',
    nombre: 'ANT - Quito Sur',
    tipo: 'ant',
    direccion: 'Av. Mariscal Sucre',
    ciudad: 'Quito',
    provincia: 'Pichincha',
    lat: -0.2500,
    lng: -78.5200,
    horario: 'Lun-Vie 8:00-17:00',
    telefono: '(02) 398-4001'
  },
  {
    id: 'ant-guayaquil',
    nombre: 'ANT - Guayaquil',
    tipo: 'ant',
    direccion: 'Av. de las Américas',
    ciudad: 'Guayaquil',
    provincia: 'Guayas',
    lat: -2.1700,
    lng: -79.9200,
    horario: 'Lun-Vie 8:00-17:00',
    telefono: '(04) 398-4000'
  },
  {
    id: 'ant-cuenca',
    nombre: 'ANT - Cuenca',
    tipo: 'ant',
    direccion: 'Av. Huayna Cápac',
    ciudad: 'Cuenca',
    provincia: 'Azuay',
    lat: -2.9000,
    lng: -79.0100,
    horario: 'Lun-Vie 8:00-17:00',
    telefono: '(07) 398-4000'
  },
  
  // SRI
  {
    id: 'sri-quito-norte',
    nombre: 'SRI - Quito Norte',
    tipo: 'sri',
    direccion: 'Av. Naciones Unidas y Shyris',
    ciudad: 'Quito',
    provincia: 'Pichincha',
    lat: -0.1750,
    lng: -78.4850,
    horario: 'Lun-Vie 8:00-17:00',
    telefono: '(02) 398-7000'
  },
  {
    id: 'sri-guayaquil',
    nombre: 'SRI - Guayaquil',
    tipo: 'sri',
    direccion: 'Av. Francisco de Orellana',
    ciudad: 'Guayaquil',
    provincia: 'Guayas',
    lat: -2.1600,
    lng: -79.9100,
    horario: 'Lun-Vie 8:00-17:00',
    telefono: '(04) 398-7000'
  },
  
  // Ministerio de Relaciones Exteriores (Pasaportes)
  {
    id: 'mre-quito',
    nombre: 'Ministerio de Relaciones Exteriores - Quito',
    tipo: 'mre_pasaportes',
    direccion: 'Av. República y Diego de Almagro',
    ciudad: 'Quito',
    provincia: 'Pichincha',
    lat: -0.2050,
    lng: -78.4900,
    horario: 'Lun-Vie 8:30-16:30',
    telefono: '(02) 299-3200'
  },
  {
    id: 'mre-guayaquil',
    nombre: 'Oficina de Pasaportes - Guayaquil',
    tipo: 'mre_pasaportes',
    direccion: 'Av. 9 de Octubre y García Moreno',
    ciudad: 'Guayaquil',
    provincia: 'Guayas',
    lat: -2.1880,
    lng: -79.8820,
    horario: 'Lun-Vie 8:30-16:30',
    telefono: '(04) 259-3200'
  },
  
  // Embajada USA (Visa)
  {
    id: 'embajada-usa-quito',
    nombre: 'Embajada de Estados Unidos - Quito',
    tipo: 'embajada_usa',
    direccion: 'Av. Avigiras E12-170 y Eloy Alfaro',
    ciudad: 'Quito',
    provincia: 'Pichincha',
    lat: -0.1780,
    lng: -78.4750,
    horario: 'Lun-Vie 8:00-12:00 (citas)',
    telefono: '(02) 398-5000'
  },
  {
    id: 'consulado-usa-guayaquil',
    nombre: 'Consulado de Estados Unidos - Guayaquil',
    tipo: 'embajada_usa',
    direccion: 'Santa Ana y José Rodríguez Bonín',
    ciudad: 'Guayaquil',
    provincia: 'Guayas',
    lat: -2.1950,
    lng: -79.8900,
    horario: 'Lun-Vie 8:00-12:00 (citas)',
    telefono: '(04) 232-3570'
  },
];

// Mapeo de tipos de trámite a tipos de ubicación
const TRAMITE_UBICACIONES: Record<string, string[]> = {
  'renovacion_cedula': ['registro_civil'],
  'obtener_pasaporte': ['registro_civil', 'mre_pasaportes', 'banco'],
  'visa_americana': ['embajada_usa', 'banco'],
  'licencia_conducir': ['ant', 'banco'],
  'ruc': ['sri'],
};

// Calcular distancia entre dos puntos (fórmula Haversine)
function calcularDistancia(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export const ubicacionesService = {
  // Obtener ubicación actual del usuario
  obtenerUbicacionActual(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        // Fallback a Quito centro si no hay geolocalización
        resolve({ lat: -0.2167, lng: -78.5000 });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn('Error obteniendo ubicación, usando Quito por defecto:', error);
          // Fallback a Quito centro
          resolve({ lat: -0.2167, lng: -78.5000 });
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  },

  // Buscar ubicaciones más cercanas por tipo
  buscarMasCercana(tipo: string, ubicacionUsuario: { lat: number; lng: number }): Ubicacion | null {
    const ubicacionesTipo = UBICACIONES.filter(u => u.tipo === tipo);
    
    if (ubicacionesTipo.length === 0) return null;

    let masCercana = ubicacionesTipo[0];
    let menorDistancia = calcularDistancia(
      ubicacionUsuario.lat, ubicacionUsuario.lng,
      masCercana.lat, masCercana.lng
    );

    for (const ubicacion of ubicacionesTipo) {
      const distancia = calcularDistancia(
        ubicacionUsuario.lat, ubicacionUsuario.lng,
        ubicacion.lat, ubicacion.lng
      );
      if (distancia < menorDistancia) {
        menorDistancia = distancia;
        masCercana = ubicacion;
      }
    }

    return masCercana;
  },

  // Obtener lugares necesarios para un trámite con ubicaciones más cercanas
  async obtenerLugaresTramite(tramiteId: string): Promise<LugarTramite[]> {
    const tiposUbicacion = TRAMITE_UBICACIONES[tramiteId] || [];
    const ubicacionUsuario = await this.obtenerUbicacionActual();
    
    const lugares: LugarTramite[] = [];
    
    const NOMBRES_LUGARES: Record<string, { nombre: string; descripcion: string }> = {
      registro_civil: {
        nombre: 'Registro Civil',
        descripcion: 'Para trámites de identificación y documentos personales'
      },
      mre_pasaportes: {
        nombre: 'Oficina de Pasaportes',
        descripcion: 'Para obtener o renovar tu pasaporte'
      },
      banco: {
        nombre: 'Banco autorizado',
        descripcion: 'Para realizar el pago de tasas'
      },
      ant: {
        nombre: 'Agencia Nacional de Tránsito',
        descripcion: 'Para trámites de licencia de conducir'
      },
      sri: {
        nombre: 'Servicio de Rentas Internas',
        descripcion: 'Para trámites tributarios y RUC'
      },
      embajada_usa: {
        nombre: 'Embajada/Consulado de EE.UU.',
        descripcion: 'Para entrevista y trámite de visa'
      },
    };

    for (let i = 0; i < tiposUbicacion.length; i++) {
      const tipo = tiposUbicacion[i];
      const ubicacionCercana = this.buscarMasCercana(tipo, ubicacionUsuario);
      const info = NOMBRES_LUGARES[tipo] || { nombre: tipo, descripcion: '' };
      
      let distancia = 0;
      if (ubicacionCercana) {
        distancia = calcularDistancia(
          ubicacionUsuario.lat, ubicacionUsuario.lng,
          ubicacionCercana.lat, ubicacionCercana.lng
        );
      }

      lugares.push({
        tipo,
        nombre: info.nombre,
        descripcion: info.descripcion,
        ubicacionMasCercana: ubicacionCercana || undefined,
        distancia: Math.round(distancia * 10) / 10,
        orden: i + 1,
      });
    }

    return lugares;
  },

  // Obtener todas las ubicaciones de un tipo
  obtenerUbicacionesPorTipo(tipo: string): Ubicacion[] {
    return UBICACIONES.filter(u => u.tipo === tipo);
  },

  // Calcular ruta óptima visitando todos los lugares
  calcularRutaOptima(
    lugares: LugarTramite[],
    ubicacionUsuario: { lat: number; lng: number }
  ): LugarTramite[] {
    // Ordenar por distancia desde la ubicación actual
    // (Algoritmo simple: nearest neighbor)
    const ordenados: LugarTramite[] = [];
    const pendientes = [...lugares];
    let ubicacionActual = ubicacionUsuario;

    while (pendientes.length > 0) {
      let indiceMasCercano = 0;
      let menorDistancia = Infinity;

      for (let i = 0; i < pendientes.length; i++) {
        const lugar = pendientes[i];
        if (lugar.ubicacionMasCercana) {
          const distancia = calcularDistancia(
            ubicacionActual.lat, ubicacionActual.lng,
            lugar.ubicacionMasCercana.lat, lugar.ubicacionMasCercana.lng
          );
          if (distancia < menorDistancia) {
            menorDistancia = distancia;
            indiceMasCercano = i;
          }
        }
      }

      const siguiente = pendientes.splice(indiceMasCercano, 1)[0];
      siguiente.orden = ordenados.length + 1;
      siguiente.distancia = Math.round(menorDistancia * 10) / 10;
      ordenados.push(siguiente);

      if (siguiente.ubicacionMasCercana) {
        ubicacionActual = {
          lat: siguiente.ubicacionMasCercana.lat,
          lng: siguiente.ubicacionMasCercana.lng,
        };
      }
    }

    return ordenados;
  },

  // Calcular distancia total de la ruta
  calcularDistanciaTotal(lugares: LugarTramite[]): number {
    return lugares.reduce((total, lugar) => total + (lugar.distancia || 0), 0);
  },
};
