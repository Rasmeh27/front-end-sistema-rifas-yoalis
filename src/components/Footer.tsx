import { Instagram, Linkedin, Globe, Calendar, Shield, Gift, Trophy } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-white border-t border-gray-200 overflow-hidden">
      {/* Fondo decorativo sutil */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Contenido principal del footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Información de la empresa */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Trophy className="h-6 w-6 text-red-500 mr-2" />
              <h3 className="text-xl font-bold text-gray-900">
                GRAN RIFA
              </h3>
            </div>
            <div className="h-px bg-gradient-to-r from-red-500/50 to-transparent"></div>
            <p className="text-gray-600 text-sm">
              Participa en nuestra rifa exclusiva y gana increíbles productos.
            </p>
          </div>

          {/* Información del sorteo */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 group">
              <Calendar className="w-5 h-5 text-red-500 transition-all duration-300" />
              <span className="text-sm font-medium text-gray-700">
                Información del Sorteo
              </span>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 hover:shadow-md transition-all duration-300">
              <p className="text-gray-700 text-sm">
                Fecha del sorteo: <span className="text-red-600 font-semibold">Lunes, 4 de agosto de 2025</span>
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-red-500" />
              <span className="text-xs text-gray-500">
                Términos y condiciones aplican
              </span>
            </div>
          </div>

          {/* Enlaces sociales - Desarrollador */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Gift className="h-5 w-5 text-red-500 mr-2" />
              <h4 className="text-sm font-medium text-gray-700">Desarrollador</h4>
            </div>
            <p className="text-sm text-red-600 font-semibold">
              Luis Herasme
            </p>
            <div className="flex space-x-3">
              <a
                href="https://www.instagram.com/luishr.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-10 h-10 bg-white border-2 border-gray-200 rounded-full hover:border-red-500 hover:shadow-lg transition-all duration-300"
              >
                <Instagram className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors duration-300" />
              </a>
              <a
                href="https://www.linkedin.com/in/luis-herasme-9a60bb318/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-10 h-10 bg-white border-2 border-gray-200 rounded-full hover:border-red-500 hover:shadow-lg transition-all duration-300"
              >
                <Linkedin className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors duration-300" />
              </a>
              <a
                href="https://portfolio-luishr.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-10 h-10 bg-white border-2 border-gray-200 rounded-full hover:border-red-500 hover:shadow-lg transition-all duration-300"
              >
                <Globe className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors duration-300" />
              </a>
            </div>
          </div>
        </div>

        {/* Divisor */}
        <div className="my-8">
          <div className="h-px bg-gradient-to-r from-transparent via-red-300 to-transparent"></div>
        </div>

        {/* Footer inferior */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600">
              © 2025 <span className="text-red-600 font-semibold">GRAN RIFA</span>. Todos los derechos reservados.
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-xs text-gray-500">
              Desarrollado por <span className="text-red-600 font-semibold">Luis Herasme</span> © 2025
            </p>
          </div>
        </div>
      </div>

      {/* Línea decorativa inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-400 to-transparent"></div>
    </footer>
  );
}
