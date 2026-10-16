// Tipo de payload para enviar notificaciones push
export type WebPushPayload = {
  title: string;
  body: string;
  image?: string;
  icon?: string;
  url?: string;
};