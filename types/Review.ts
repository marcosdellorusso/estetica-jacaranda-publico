export type Review = {
  id: number;
  user: { nombre: string; apellido: string };
  stars: number;
  comentario?: string;
  foto: string;
};