"use client"

import type React from "react"
import { useState } from "react"
import { Upload, Car, Phone, User, Package, CreditCard, Trophy } from "lucide-react"
import { crearParticipante } from "../service/api"
import { showSuccess, showError, showLoading } from "../utils/alerts"
import Swal from "sweetalert2"

export default function FormularioParticipante() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    producto: "",
    comprobante: null as File | null,
  })

  const productos = ["MAGIC MOTORSPORT FLEX Full HW Kit", "Alientech Kess3"]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({
      ...prev,
      comprobante: file,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.comprobante) {
      showError("Debes subir el comprobante")
      return
    }

    try {
      showLoading("Registrando participación...")

      const participante = await crearParticipante({
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        producto_id: formData.producto === "MAGIC MOTORSPORT FLEX Full HW Kit" ? 1 : 2,
        comprobante: formData.comprobante,
      })

      Swal.close() // cerrar loading

      if (!participante || !participante.id) {
        showError("Participación no registrada")
        return
      }

      showSuccess("¡Te has inscrito exitosamente en la rifa!")

      setFormData({
        nombre: "",
        apellido: "",
        telefono: "",
        producto: "",
        comprobante: null,
      })
    } catch (error) {
      Swal.close()
      console.error("Error:", error)
      showError("Ocurrió un error al registrar tu participación.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header con logo */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-red-500/20">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-center">
            <img
              src="/logo.jpg"
              alt="Fast Racing Tuning"
              className="h-24 md:h-40 w-auto max-w-xs object-contain mx-auto"
            />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Trophy className="h-12 w-12 text-red-500 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              GRAN <span className="text-red-500">RIFA</span>
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Participa en nuestra rifa exclusiva y gana increíbles productos de tuning para tu vehículo
          </p>
        </div>

        {/* Instrucciones de Pago */}
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-red-600 to-red-500 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <CreditCard className="h-6 w-6 mr-3" />
              Información de Pago
            </h2>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-red-400 mb-4">Datos Bancarios</h3>
                <div className="space-y-3 text-gray-300">
                  <div className="flex justify-between">
                    <span className="font-medium">Banco:</span>
                    <span>Banco Popular Dominicano</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Cuenta:</span>
                    <span className="font-mono">1234-5678-9012-3456</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Titular:</span>
                    <span>Fast Racing Tuning S.R.L.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Tipo:</span>
                    <span>Cuenta Corriente</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-red-400 mb-4">Detalles del Pago</h3>
                <div className="bg-red-600/10 border border-red-600/30 rounded-lg p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-400 mb-2">RD$ 500</p>
                    <p className="text-sm text-gray-300">Costo por participación</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>
                    <strong>Concepto:</strong> Rifa Fast Racing Tuning
                  </p>
                  <p>
                    <strong>Referencia:</strong> Tu nombre completo
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-600/10 border border-yellow-600/30 rounded-lg">
              <h4 className="text-yellow-400 font-semibold mb-2">📋 Instrucciones Importantes:</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Realiza la transferencia por el monto exacto de RD$ 500</li>
                <li>• Usa tu nombre completo como referencia en la transferencia</li>
                <li>• Toma una foto clara del comprobante de pago</li>
                <li>• Completa el formulario y sube el comprobante</li>
                <li>• Tu participación será confirmada una vez verificado el pago</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-red-500 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Car className="h-6 w-6 mr-3" />
              Formulario de Participación
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                  <User className="h-4 w-4 mr-2 text-red-500" />
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Ingresa tu nombre"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                  <User className="h-4 w-4 mr-2 text-red-500" />
                  Apellido
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Ingresa tu apellido"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                <Phone className="h-4 w-4 mr-2 text-red-500" />
                Número de Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="+1 (829) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                <Package className="h-4 w-4 mr-2 text-red-500" />
                Producto a Elegir
              </label>
              <select
                name="producto"
                value={formData.producto}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Selecciona un producto</option>
                {productos.map((producto, index) => (
                  <option key={index} value={producto} className="bg-gray-700">
                    {producto}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-300 mb-2">
                <Upload className="h-4 w-4 mr-2 text-red-500" />
                Subir Comprobante de Pago
              </label>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  required
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-full px-4 py-6 bg-gray-700/50 border-2 border-dashed border-gray-600 rounded-lg text-center hover:border-red-500">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400">
                    {formData.comprobante
                      ? `Archivo seleccionado: ${formData.comprobante.name}`
                      : "Haz clic para subir tu comprobante"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Formatos aceptados: JPG, PNG, PDF (máx. 5MB)</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
            >
              <span className="flex items-center justify-center">
                <Trophy className="h-5 w-5 mr-2" />
                PARTICIPAR EN LA RIFA
              </span>
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-400">
          <p className="text-sm">© 2025 Fast Racing Tuning. Todos los derechos reservados.</p>
          <p className="text-xs mt-2">El sorteo se realizará el 27 de julio de 2025. Términos y condiciones aplican.</p>
        </div>
      </div>
    </div>
  )
}
