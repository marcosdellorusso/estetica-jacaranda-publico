export type Turno = {
  turno_id: number;
  dni_usuario: string;
  fecha: string | Date;
  hora: string | Date;
  estado: string;
  servicio: string;
  tipo_servicio: string;
  precio: string | number;
}