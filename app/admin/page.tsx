"use client";

import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";
import UserForm from "@/ui/admin/UserForm";
import PushNotificationForm from "@/ui/admin/PushNotificationForm";
import TurnosList from "@/ui/admin/TurnosList";
import BloqueoHorariosForm from "@/ui/admin/BloqueoHorariosForm";
import { WebPushPayload } from "@/types/WebPushPayload";
import { sendWebPush } from "../api/web-push/push";
import ServiciosEditor from "@/ui/admin/ServiciosEditor";


export default function AdminPage() {
  const { data: session, status } = useSession();

  //Estados UserForm
  const [dni, setDni] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rol, setRol] = React.useState("user");
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");
  const [nombre, setNombre] = React.useState("");
  const [apellido, setApellido] = React.useState("");
  const [creandoUsuario, setCreandoUsuario] = React.useState(false);
  const [showUserForm, setShowUserForm] = React.useState(false);
  const [showUserFormVisible, setShowUserFormVisible] = React.useState(false);

  // Estados PushNotificationForm
  const [pushData, setPushData] = React.useState<WebPushPayload>({
    title: "",
    body: "",
    image: "",
    icon: "",
    url: "",
  });
  const [pushStatus, setPushStatus] = React.useState("");
  const [enviandoPush, setEnviandoPush] = React.useState(false);
  const [showPushForm, setShowPushForm] = React.useState(false);
  const [showPushFormVisible, setShowPushFormVisible] = React.useState(false);

  // Estados TurnosList
  const [showTurnos, setShowTurnos] = React.useState(false);
  const [showTurnosVisible, setShowTurnosVisible] = React.useState(false);
  const [turnos, setTurnos] = React.useState<any[]>([]);
  const [turnosTotal, setTurnosTotal] = React.useState(0);
  const [turnosPage, setTurnosPage] = React.useState(1);
  const turnosPerPage = 2; // Cambiá este valor según necesidad
  const [loadingTurnos, setLoadingTurnos] = React.useState(false);
  const [filtroDniInput, setFiltroDniInput] = React.useState("");
  const [filtroDni, setFiltroDni] = React.useState("");
  const [filtroFecha, setFiltroFecha] = React.useState("");

  // Estados BloqueoHorariosForm
  const [showBloqueoForm, setShowBloqueoForm] = React.useState(false);
  const [showBloqueoFormVisible, setShowBloqueoFormVisible] = React.useState(false);
  const [bloqueoFechaInicio, setBloqueoFechaInicio] = React.useState("");
  const [bloqueoHoraInicio, setBloqueoHoraInicio] = React.useState("");
  const [bloqueoHoraFin, setBloqueoHoraFin] = React.useState("");
  const [bloqueoFechaFin, setBloqueoFechaFin] = React.useState("");
  const [bloqueoTipoServicio, setBloqueoTipoServicio] = React.useState("");
  const [bloqueoMensaje, setBloqueoMensaje] = React.useState("");
  const [bloqueoError, setBloqueoError] = React.useState("");
  const [bloqueando, setBloqueando] = React.useState(false);
  const [tiposServicio, setTiposServicio] = React.useState<string[]>([]);

  // Animación de visibilidad
  React.useEffect(() => {
    if (showUserForm) setShowUserFormVisible(true);
    else setTimeout(() => setShowUserFormVisible(false), 300);
  }, [showUserForm]);
  React.useEffect(() => {
    if (showPushForm) setShowPushFormVisible(true);
    else setTimeout(() => setShowPushFormVisible(false), 300);
  }, [showPushForm]);
  React.useEffect(() => {
    if (showTurnos) setShowTurnosVisible(true);
    else setTimeout(() => setShowTurnosVisible(false), 300);
  }, [showTurnos]);
  React.useEffect(() => {
    if (showBloqueoForm) setShowBloqueoFormVisible(true);
    else setTimeout(() => setShowBloqueoFormVisible(false), 300);
  }, [showBloqueoForm]);

  // Debounce filtro DNI
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setFiltroDni(filtroDniInput);
      setTurnosPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [filtroDniInput]);

  // Cargar tipos de servicio
  React.useEffect(() => {
    async function fetchTipos() {
      try {
        const res = await fetch("/api/servicios/tipos");
        const data = await res.json();
        if (data.ok && Array.isArray(data.tipos)) setTiposServicio(data.tipos);
      } catch (err) {
        console.error("Error al cargar tipos de servicio:", err);
      }
    }
    fetchTipos();
  }, []);

  // Cargar turnos
  React.useEffect(() => {
    async function fetchTurnos() {
      setLoadingTurnos(true);
      const params = new URLSearchParams({
        page: String(turnosPage),
        limit: String(turnosPerPage),
      });
      if (filtroDni) params.append('dni', filtroDni);
      if (filtroFecha) params.append('fecha', filtroFecha);
      const res = await fetch(`/api/turnos?${params.toString()}`);
      const data = await res.json();
      setTurnos(data.turnos);
      setTurnosTotal(data.total);
      setLoadingTurnos(false);
    }
    if (showTurnos) fetchTurnos();
  }, [turnosPage, showTurnos, filtroDni, filtroFecha]);

  if (status === "loading") return <div>Cargando...</div>;
  if (!session || session.user?.role?.toLowerCase() !== "admin") redirect("/inicio");

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-200 via-fuchsia-100 to-white text-gray-900 py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-fuchsia-700 text-center drop-shadow">
          Panel de Administración
        </h1>
        <h2 className="text-lg md:text-2xl font-semibold mb-8 text-fuchsia-600 text-center">
          Bienvenido, {session.user?.name ?? "Admin"}
        </h2>
        <div className="flex flex-col gap-10">
          {/* Sección de formularios y herramientas */}
          <UserForm
            dni={dni}
            setDni={setDni}
            nombre={nombre}
            setNombre={setNombre}
            apellido={apellido}
            setApellido={setApellido}
            password={password}
            setPassword={setPassword}
            rol={rol}
            setRol={setRol}
            creandoUsuario={creandoUsuario}
            setCreandoUsuario={setCreandoUsuario}
            setMessage={setMessage}
            setError={setError}
            showUserForm={showUserForm}
            setShowUserForm={setShowUserForm}
            showUserFormVisible={showUserFormVisible}
            message={message}
            error={error}
          />
          <PushNotificationForm
            pushData={pushData}
            setPushData={setPushData}
            enviandoPush={enviandoPush}
            setEnviandoPush={setEnviandoPush}
            pushStatus={pushStatus}
            setPushStatus={setPushStatus}
            showPushForm={showPushForm}
            setShowPushForm={setShowPushForm}
            showPushFormVisible={showPushFormVisible}
          />
          <TurnosList
            showTurnos={showTurnos}
            setShowTurnos={setShowTurnos}
            showTurnosVisible={showTurnosVisible}
            turnos={turnos}
            turnosPage={turnosPage}
            setTurnosPage={setTurnosPage}
            loadingTurnos={loadingTurnos}
            filtroDniInput={filtroDniInput}
            setFiltroDniInput={setFiltroDniInput}
            filtroFecha={filtroFecha}
            setFiltroFecha={setFiltroFecha}
          />
          <BloqueoHorariosForm
            showBloqueoForm={showBloqueoForm}
            setShowBloqueoForm={setShowBloqueoForm}
            showBloqueoFormVisible={showBloqueoFormVisible}
            bloqueoFechaInicio={bloqueoFechaInicio}
            setBloqueoFechaInicio={setBloqueoFechaInicio}
            bloqueoHoraInicio={bloqueoHoraInicio}
            setBloqueoHoraInicio={setBloqueoHoraInicio}
            bloqueoHoraFin={bloqueoHoraFin}
            setBloqueoHoraFin={setBloqueoHoraFin}
            bloqueoFechaFin={bloqueoFechaFin}
            setBloqueoFechaFin={setBloqueoFechaFin}
            bloqueoTipoServicio={bloqueoTipoServicio}
            setBloqueoTipoServicio={setBloqueoTipoServicio}
            tiposServicio={tiposServicio}
            bloqueando={bloqueando}
            setBloqueando={setBloqueando}
            bloqueoMensaje={bloqueoMensaje}
            setBloqueoMensaje={setBloqueoMensaje}
            bloqueoError={bloqueoError}
            setBloqueoError={setBloqueoError}
          />
          <ServiciosEditor />
        </div>
      </div>
    </div>
  );
}