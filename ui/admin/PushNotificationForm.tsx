"use client";
import React from "react";
import { WebPushPayload } from "@/types/WebPushPayload";
import { sendWebPush } from "@/app/api/web-push/push";

interface Props {
  pushData: WebPushPayload;
  setPushData: (v: WebPushPayload) => void;
  enviandoPush: boolean;
  setEnviandoPush: (v: boolean) => void;
  pushStatus: string;
  setPushStatus: (v: string) => void;
  showPushForm: boolean;
  setShowPushForm: (v: boolean) => void;
  showPushFormVisible: boolean;
}

export default function PushNotificationForm({
  pushData, setPushData,
  enviandoPush, setEnviandoPush,
  pushStatus, setPushStatus,
  showPushForm, setShowPushForm, showPushFormVisible
}: Props) {
  return (
    <div className="bg-white/80 rounded-2xl shadow-xl p-6 flex flex-col items-center">
      <button
        type="button"
        onClick={() => setShowPushForm(!showPushForm)}
        className="mb-4 bg-fuchsia-100 hover:bg-fuchsia-200 text-fuchsia-700 rounded py-2 px-4 font-semibold border border-fuchsia-300 transition w-full"
      >
        {showPushForm ? "Ocultar formulario de notificación" : "Enviar notificación push"}
      </button>
      {showPushFormVisible && (
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showPushForm ? 'opacity-100 translate-y-0 max-h-[500px]' : 'opacity-0 -translate-y-4 max-h-0 pointer-events-none'}`}>
          {showPushForm && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setPushStatus("");
                setEnviandoPush(true);
                try {
                  await sendWebPush(pushData);
                  setPushStatus("Notificación enviada correctamente");
                  setPushData({ title: "", body: "", image: "", icon: "", url: "" });
                } catch (err) {
                  setPushStatus("Error al enviar notificación");
                }
                setEnviandoPush(false);
              }}
              className="w-full flex flex-col gap-3"
            >
              <input type="text" placeholder="Título" value={pushData.title} onChange={e => setPushData({ ...pushData, title: e.target.value })} className="border rounded px-3 py-2" />
              <textarea placeholder="Mensaje de la notificación" value={pushData.body} onChange={e => setPushData({ ...pushData, body: e.target.value })} required className="border rounded px-3 py-2 min-h-[60px]" />
              <input type="text" placeholder="URL de la imagen (opcional)" value={pushData.image} onChange={e => setPushData({ ...pushData, image: e.target.value })} className="border rounded px-3 py-2" />
              <input type="text" placeholder="URL del ícono (opcional)" value={pushData.icon} onChange={e => setPushData({ ...pushData, icon: e.target.value })} className="border rounded px-3 py-2" />
              <input type="text" placeholder="URL de redireccionamiento (opcional)" value={pushData.url} onChange={e => setPushData({ ...pushData, url: e.target.value })} className="border rounded px-3 py-2" />
              <button type="submit" className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded py-2 font-semibold flex items-center justify-center gap-2" disabled={enviandoPush}>
                {enviandoPush && <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>}
                {enviandoPush ? 'Enviando...' : 'Enviar notificación'}
              </button>
              {pushStatus && (<div className="text-center text-fuchsia-700">{pushStatus}</div>)}
            </form>
          )}
        </div>
      )}
    </div>
  );
}