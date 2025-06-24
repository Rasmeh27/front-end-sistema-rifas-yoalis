import { Instagram, Linkedin, Globe, Calendar, Shield } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#0e1629] to-[#1a2332] text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Company Info */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-red-400">Fast Racing Tuning</h3>
          </div>

          {/* Raffle Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-red-400" />
              <span className="text-sm font-medium">Información del Sorteo</span>
            </div>
            <p className="text-gray-300 text-sm">
              Fecha del sorteo: <span className="text-white font-medium">Domingo, 3 de agosto de 2025</span>
            </p>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-red-400" />
              <span className="text-xs text-gray-400">Términos y condiciones aplican</span>
            </div>
          </div>

          {/* Social Links - Developer */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Desarrollador</h4>
            <p className="text-xs text-gray-400 mb-3">Luis Herasme</p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/luishr.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-10 h-10 bg-gray-800 rounded-full hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
              >
                <Instagram className="w-5 h-5 group-hover:text-white transition-colors" />
              </a>
              <a
                href="https://www.linkedin.com/in/luis-herasme-9a60bb318/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-10 h-10 bg-gray-800 rounded-full hover:bg-blue-600 transition-all duration-300"
              >
                <Linkedin className="w-5 h-5 group-hover:text-white transition-colors" />
              </a>
              <a
                href="https://portfolio-luishr.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-10 h-10 bg-gray-800 rounded-full hover:bg-green-600 transition-all duration-300"
              >
                <Globe className="w-5 h-5 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-6"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-400">© 2025 Fast Racing Tuning. Todos los derechos reservados.</p>
          </div>

          <div className="text-center md:text-right">
            <p className="text-xs text-gray-500">
              Desarrollado por <span className="text-red-400 font-medium">Luis Herasme</span> © 2025
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
