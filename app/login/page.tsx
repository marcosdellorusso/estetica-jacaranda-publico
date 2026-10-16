'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'     // función client-side de NextAuth

export default function LoginScreen() {
  /* ---------- estados de animación ---------- */
  const [showLogoImage, setShowLogoImage] = useState(false)
  const [showForm,      setShowForm]      = useState(false)
  const [fadingOut,     setFadingOut]     = useState(false)
  const [webpKey,       setWebpKey]       = useState(0)

  /* ---------- estados de formulario ---------- */
  const [dni,       setDni]       = useState('')
  const [password,  setPassword]  = useState('')
  const [loading,   setLoading]   = useState(false)
  const [errorMsg,  setErrorMsg]  = useState<string | null>(null)

  const router = useRouter()
  const { data: session, status } = useSession()

  // Redirección si ya hay sesión iniciada
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/inicio')
    }
  }, [router, status])

  /* ---------- animaciones iniciales ---------- */
  useEffect(() => {
    setWebpKey(Date.now())                       // recarga el WebP

    const timerLogo = setTimeout(() => setShowLogoImage(true), 2000)
    const timerForm = setTimeout(() => setShowForm(true),      500)

    return () => {
      clearTimeout(timerLogo)
      clearTimeout(timerForm)
    }
  }, [])

  /* ---------- submit ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setLoading(true)

    const res = await signIn('credentials', {
      redirect     : false,      // controlamos la redirección manualmente
      dni,
      password,
    })

    if (res?.ok) {
      // Espera a que la sesión esté disponible y luego redirige según el rol
      const checkSessionAndRedirect = async () => {
        let tries = 0;
        let userRole = null;
        let sessionData = null;
        while (tries < 5) {
          sessionData = await fetch('/api/auth/session').then(r => r.json());
          userRole = sessionData?.user?.role;
          if (userRole) break;
          await new Promise(res => setTimeout(res, 200));
          tries++;
        }
        if (!userRole) {
          setErrorMsg('El DNI o la contraseña son incorrectos. Por favor, intente nuevamente.');
          setLoading(false);
          return;
        }
        setFadingOut(true);
        setTimeout(() => {
          if (userRole.toLowerCase() === 'admin') {
            router.push('/admin');
          } else {
            router.push('/inicio');
          }
        }, 700);
      };
      checkSessionAndRedirect();
    } else {
      if (status === "authenticated") router.push("/inicio"); // o /dashboard
      setErrorMsg('DNI o contraseña incorrectos');
      setLoading(false);
    }
  }

  /* ---------- UI ---------- */
  return (
    <div
      className={`relative min-h-screen w-full flex flex-col items-center justify-start px-4 pt-20
                  transition-opacity duration-700 ${fadingOut ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Fondo */}
      <Image
        src="/images/fondologin.png"
        alt="Fondo"
        fill
        priority
        className="object-cover -z-10"
      />

      {/* Logo animado */}
      <div className="w-[300px] aspect-[1080/450] relative">
        <img
          key={webpKey}
          src={`/videos/logo-frames.webp?v=${webpKey}`}
          alt="Logo animado"
          className="absolute inset-0 w-full h-full object-contain"
        />

        {showLogoImage && (
          <Image
            src="/images/Logo.png"
            alt="Logo"
            fill
            priority
            className="object-contain absolute inset-0 transition-opacity duration-500"
          />
        )}
      </div>

      {/* Formulario */}
      <div className="mt-10 w-full max-w-sm">
        <div className="rounded-xl p-6">
          <div
            className={`transition-opacity duration-1000
                        ${showForm ? 'opacity-100' : 'opacity-0'}`}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="dni"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                placeholder="DNI"
                required
                disabled={loading}
                className="w-full px-4 py-2 border border-white/30 rounded-lg
                           bg-white/10 text-white placeholder-white/60
                           focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              />

              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                autoComplete="current-password"
                required
                disabled={loading}
                className="w-full px-4 py-2 border border-white/30 rounded-lg
                           bg-white/10 text-white placeholder-white/60
                           focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#E636D4]/90 text-white py-2 rounded-lg
                           hover:bg-[#E636D4] transition-all
                           shadow-md shadow-[#E636D4]/30 disabled:opacity-50"
              >
                {loading ? 'Ingresando…' : 'Entrar'}
              </button>

              {errorMsg && (
                <p className="text-center text-sm text-red-400 mt-2">{errorMsg}</p>
              )}
            </form>
            <div className="text-center mt-4">
              <a href="/registro" className="text-fuchsia-400 underline hover:text-fuchsia-300 transition-colors">
                ¿No tienes cuenta? Regístrate aquí
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}