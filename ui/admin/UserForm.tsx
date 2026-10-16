"use client";
import React from "react";

interface Props {
  dni: string;
  setDni: (v: string) => void;
  nombre: string;
  setNombre: (v: string) => void;
  apellido: string;
  setApellido: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  rol: string;
  setRol: (v: string) => void;
  creandoUsuario: boolean;
  setCreandoUsuario: (v: boolean) => void;
  setMessage: (v: string) => void;
  setError: (v: string) => void;
  showUserForm: boolean;
  setShowUserForm: (v: boolean) => void;
  showUserFormVisible: boolean;
  message: string;
  error: string;
}

export default function UserForm(props: Props) {
  const {
    dni, setDni, nombre, setNombre, apellido, setApellido,
    password, setPassword, rol, setRol,
    creandoUsuario, setCreandoUsuario, setMessage, setError,
    showUserForm, setShowUserForm, showUserFormVisible, message, error
  } = props;

  return (
    <div className="bg-white/80 rounded-2xl shadow-xl p-6 flex flex-col items-center">
      <button
        type="button"
        onClick={() => setShowUserForm(!showUserForm)}
        className="mb-4 bg-fuchsia-100 hover:bg-fuchsia-200 text-fuchsia-700 rounded py-2 px-4 font-semibold border border-fuchsia-300 transition w-full"
      >
        {showUserForm ? "Ocultar formulario de usuario" : "Crear nuevo usuario"}
      </button>
      {showUserFormVisible && (
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showUserForm ? 'opacity-100 translate-y-0 max-h-[500px]' : 'opacity-0 -translate-y-4 max-h-0 pointer-events-none'}`}>
          {showUserForm && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setMessage("");
                setError("");
                setCreandoUsuario(true);
                const dniRegex = /^\d{8}$/;
                const nombreApellidoRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;
                const dniTrim = dni.trim();
                const nombreTrim = nombre.trim();
                const apellidoTrim = apellido.trim();
                if (!dniRegex.test(dniTrim)) {
                  setError("El DNI debe ser un número de 8 dígitos.");
                  setCreandoUsuario(false);
                  return;
                }
                if (!nombreApellidoRegex.test(nombreTrim)) {
                  setError("El nombre solo puede contener letras y espacios.");
                  setCreandoUsuario(false);
                  return;
                }
                if (!nombreApellidoRegex.test(apellidoTrim)) {
                  setError("El apellido solo puede contener letras y espacios.");
                  setCreandoUsuario(false);
                  return;
                }
                const res = await fetch("/api/usuarios", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ dni: dniTrim, nombre: nombreTrim, apellido: apellidoTrim, password, rol }),
                });
                const data = await res.json();
                setCreandoUsuario(false);
                if (data.success) {
                  setMessage("Usuario creado correctamente");
                  setDni("");
                  setNombre("");
                  setApellido("");
                  setPassword("");
                  setRol("user");
                } else {
                  setError(data.error || "Error al crear usuario");
                }
              }}
              className="w-full flex flex-col gap-3 mb-2"
            >
              <input type="text" placeholder="DNI" value={dni} onChange={e => setDni(e.target.value.replace(/[^0-9]/g, '').slice(0, 8))} required className="border rounded px-3 py-2" inputMode="numeric" pattern="\d{8}" maxLength={8} />
              <input type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ ]/g, ""))} required className="border rounded px-3 py-2" />
              <input type="text" placeholder="Apellido" value={apellido} onChange={e => setApellido(e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ ]/g, ""))} required className="border rounded px-3 py-2" />
              <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required className="border rounded px-3 py-2" />
              <select value={rol} onChange={e => setRol(e.target.value)} className="border rounded px-3 py-2">
                <option value="user">Usuario común</option>
                <option value="admin">Administrador</option>
              </select>
              <button type="submit" className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded py-2 font-semibold flex items-center justify-center gap-2" disabled={creandoUsuario}>
                {creandoUsuario && <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>}
                {creandoUsuario ? 'Creando usuario...' : 'Crear usuario'}
              </button>
              {message && (<div className="text-green-600 text-center">{message}</div>)}
              {error && <div className="text-red-500 text-center">{error}</div>}
            </form>
          )}
        </div>
      )}
    </div>
  );
}