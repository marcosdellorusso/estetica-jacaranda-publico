"use client"

import React, { useState } from 'react';
import Link from 'next/link';

export default function RegistroPage() {
  const [dni, setDni] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Valida que el DNI tenga exactamente 8 dígitos numéricos
  const validarDni = (valor: string) => /^\d{8}$/.test(valor); // ^\d{8}$ => exactamente 8 dígitos
  // Valida que el nombre o apellido contengan solo letras (mayúsculas, minúsculas, tildes, ñ y espacios)
  const validarSoloLetras = (valor: string) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(valor); // permite letras y espacios
  // Valida que la contraseña tenga al menos 8 caracteres
  const validarPassword = (valor: string) => valor.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    // Validación de DNI
    if (!validarDni(dni)) {
      setError('El DNI debe ser numérico y tener 8 dígitos.');
      return;
    }
    // Validación de nombre
    if (!validarSoloLetras(nombre)) {
      setError('El nombre solo puede contener letras.');
      return;
    }
    // Validación de apellido
    if (!validarSoloLetras(apellido)) {
      setError('El apellido solo puede contener letras.');
      return;
    }
    // Validación de contraseña
    if (!validarPassword(password)) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    // Lógica para enviar los datos al backend
    const res = await fetch('/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dni, nombre, apellido, password }),
    });
    if (res.ok) {
      setSuccess('Usuario registrado correctamente.');
      setDni('');
      setNombre('');
      setApellido('');
      setPassword('');
    } else {
      const data = await res.json();
      setError(data.error || 'Error al registrar usuario.');
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-fuchsia-100 to-white">
      <div className="bg-white/90 shadow-xl rounded-xl px-8 py-10 w-full max-w-md border border-fuchsia-200">
        <h1 className="text-3xl font-bold mb-6 text-fuchsia-700 text-center drop-shadow">Registro de Usuario</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <input
            type="text"
            inputMode="numeric"
            maxLength={8}
            placeholder="DNI"
            value={dni}
            onChange={e => {
              // Solo permitir números: elimina cualquier carácter que no sea dígito
              // [^\d] => cualquier cosa que NO sea un dígito
              const val = e.target.value.replace(/[^\d]/g, '');
              setDni(val);
            }}
            required
            className="border border-fuchsia-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-fuchsia-400 bg-white text-fuchsia-900 placeholder-fuchsia-400 shadow"
          />
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={e => {
              // Solo permitir letras, tildes, ñ y espacios
              const val = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ ]/g, '');
              setNombre(val);
            }}
            required
            className="border border-fuchsia-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-fuchsia-400 bg-white text-fuchsia-900 placeholder-fuchsia-400 shadow"
          />
          <input
            type="text"
            placeholder="Apellido"
            value={apellido}
            onChange={e => {
              // Solo permitir letras, tildes, ñ y espacios
              const val = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ ]/g, '');
              setApellido(val);
            }}
            required
            className="border border-fuchsia-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-fuchsia-400 bg-white text-fuchsia-900 placeholder-fuchsia-400 shadow"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="border border-fuchsia-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-fuchsia-400 bg-white text-fuchsia-900 placeholder-fuchsia-400 shadow"
          />
          <button type="submit" className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold p-3 rounded shadow transition-colors">Registrarse</button>
          {error && <div className="text-red-600 text-center font-medium">{error}</div>}
          {success && <div className="text-green-600 text-center font-medium">{success}</div>}
        </form>
        <Link href="/login" className="block mt-6 text-fuchsia-600 underline text-center hover:text-fuchsia-800 transition-colors">¿Ya tienes cuenta? Inicia sesión</Link>
      </div>
    </div>
  );
}
