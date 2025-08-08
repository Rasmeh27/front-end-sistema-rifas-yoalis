import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, AlertTriangle, LogIn, Loader2, Shield } from 'lucide-react';

export default function LoginAdmin() {
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("https://yaolisbackend.vercel.app/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: usuario,
          password: clave,
        }),
      });

      const data = await response.json();
      if (response.ok && data.access_token) {
        localStorage.setItem("token", data.access_token);
        navigate("/admin");
      } else {
        setError(data.detail || "Credenciales inválidas");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Fondo decorativo sutil */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="bg-red-500 rounded-full p-4 shadow-lg">
              <Shield className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Panel Administrativo
          </h1>
          <p className="text-gray-600">Ingresa tus credenciales para continuar</p>
        </div>

        {/* Formulario de login */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header del formulario */}
          <div className="bg-red-500 px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center justify-center">
              <LogIn className="h-5 w-5 mr-2" />
              Iniciar Sesión
            </h2>
          </div>

          {/* Contenido del formulario */}
          <div className="p-6 space-y-6">
            {/* Campo Usuario */}
            <div className="space-y-2">
              <label 
                htmlFor="usuario" 
                className="flex items-center text-sm font-medium text-gray-700"
              >
                <User className="h-4 w-4 mr-2 text-red-500" />
                Usuario
              </label>
              <input
                id="usuario"
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Ingresa tu usuario"
                autoComplete="username"
                disabled={isLoading}
              />
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-2">
              <label 
                htmlFor="clave" 
                className="flex items-center text-sm font-medium text-gray-700"
              >
                <Lock className="h-4 w-4 mr-2 text-red-500" />
                Contraseña
              </label>
              <input
                id="clave"
                type="password"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={isLoading}
              />
            </div>

            {/* Mensaje de error */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Botón de login */}
            <button
              onClick={handleLogin}
              disabled={isLoading || !usuario || !clave}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed flex items-center justify-center"
              type="button"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Iniciar Sesión
                </>
              )}
            </button>
          </div>
        </div>

        {/* Información de seguridad */}
        <div className="text-center mt-6">
          <div className="flex items-center justify-center text-xs text-gray-500">
            <Shield className="h-3 w-3 mr-1 text-red-500" />
            Conexión segura y encriptada
          </div>
        </div>
      </div>
    </div>
  );
}
