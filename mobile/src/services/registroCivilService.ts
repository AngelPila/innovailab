// Servicios stub para demo de turnos y orden de pago

export type Turno = {
  id: string;
  fechaISO: string;
  agencia: string;
};

class RegistroCivilService {
  async consultarTurnos(tramiteId: string): Promise<Turno[]> {
    // Simulación: próximos turnos en 3, 5 y 7 días
    const now = new Date();
    const mk = (days: number): string => {
      const d = new Date(now);
      d.setDate(d.getDate() + days);
      return d.toISOString();
    };
    return [
      { id: 't1', fechaISO: mk(3), agencia: 'Registro Civil - Norte' },
      { id: 't2', fechaISO: mk(5), agencia: 'Registro Civil - Centro' },
      { id: 't3', fechaISO: mk(7), agencia: 'Registro Civil - Sur' },
    ];
  }

  async generarOrdenPago(tramiteId: string): Promise<{ codigo: string; qrDataUrl: string }> {
    // Genera un QR SVG simple como placeholder
    const codigo = `ORD-${tramiteId}-${Date.now()}`;
    const svg = encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>
        <rect width='100%' height='100%' fill='white'/>
        <rect x='10' y='10' width='30' height='30' fill='black'/>
        <rect x='60' y='10' width='30' height='30' fill='black'/>
        <rect x='110' y='10' width='30' height='30' fill='black'/>
        <rect x='10' y='60' width='30' height='30' fill='black'/>
        <rect x='60' y='60' width='30' height='30' fill='black'/>
        <rect x='110' y='60' width='30' height='30' fill='black'/>
        <rect x='10' y='110' width='30' height='30' fill='black'/>
        <rect x='60' y='110' width='30' height='30' fill='black'/>
        <rect x='110' y='110' width='30' height='30' fill='black'/>
      </svg>`
    );
    const qrDataUrl = `data:image/svg+xml;charset=utf-8,${svg}`;
    return { codigo, qrDataUrl };
  }
}

export const registroCivilService = new RegistroCivilService();
