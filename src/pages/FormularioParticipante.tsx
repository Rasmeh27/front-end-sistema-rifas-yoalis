"use client";

import type React from "react";
import { useState } from "react";
import {
  Upload,
  Car,
  Phone,
  User,
  Package,
  CreditCard,
  Trophy,
  FileText,
  Hash,
  MapPin,
  IdCard,
} from "lucide-react";
import { crearParticipante } from "../service/api";
import { showSuccess, showError, showLoading } from "../utils/alerts";
import Swal from "sweetalert2";

export default function FormularioParticipante() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    cedula: "",
    telefono: "",
    direccion: "",
    producto: "",
    comprobante: null as File | null,
  });

  const productos = ["MAGIC MOTORSPORT HW Kit", "Alientech Kess3"];

  const [cantidad, setCantidad] = useState(1);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      comprobante: file,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.comprobante) {
      showError("Debes subir el comprobante");
      return;
    }

    try {
      showLoading("Registrando participación...");

      const participante = await crearParticipante({
        nombre: formData.nombre,
        apellido: formData.apellido,
        cedula: formData.cedula,
        telefono: formData.telefono,
        direccion: formData.direccion,
        producto_id: formData.producto === "MAGIC MOTORSPORT HW Kit" ? 1 : 2,
        comprobante: formData.comprobante,
        cantidad_numeros: cantidad,
      });

      Swal.close(); // cerrar loading

      if (!participante || !participante.id) {
        showError("Participación no registrada");
        return;
      }

      showSuccess("¡Te has inscrito exitosamente en la rifa!");

      setFormData({
        nombre: "",
        apellido: "",
        cedula: "",
        telefono: "",
        direccion: "",
        producto: "",
        comprobante: null,
      });
    } catch (error) {
      Swal.close();
      console.error("Error:", error);
      showError("Ocurrió un error al registrar tu participación.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header con logo */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-red-500/20">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-center">
            {/* <img
              src="/logo.jpg"
              alt="Fast Racing Tuning"
              className="h-24 md:h-40 w-auto max-w-xs object-contain mx-auto"
            /> */}
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
            ¡Participa en nuestra rifa exclusiva y gana increíbles productos de
            tuning para tu Taller!
          </p>
        </div>

        {/* Condiciones de la Rifa */}
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-red-600 to-red-500 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <FileText className="h-6 w-6 mr-3" />
              Instrucciones de la rifa
            </h2>
          </div>

          <div className="p-8 text-gray-300 text-sm leading-relaxed space-y-2">
            <p>
              1. Solo se rifará el <strong>hardware</strong>.
            </p>
            <p>
              2. Todas las herramientas serán{" "}
              <strong>activadas únicamente por el distribuidor</strong>, en este
              caso nosotros.
            </p>
            <p>
              3. Para los agraciados{" "}
              <strong>fuera de Santo Domingo o en el extranjero</strong>,{" "}
              <strong>no se incluyen los gastos de envío</strong>.
            </p>
            <p>
              4. El FLEX se entrega en su <strong>Kit Básico</strong>, sin
              maletín.
            </p>
            <p>
              5. <strong>No se puede cambiar el producto</strong> después de ser
              elegido.
            </p>
            <p>
              6. La rifa se realizará en <strong>vivo mediante tómbola</strong>.
            </p>
            <p>
              7. Todos los pagos vía <strong>PayPal</strong> deben considerar
              los <strong>cargos adicionales</strong> de la plataforma.
            </p>
            <p>
              8. Solo <strong>100</strong> boletos
              <strong> único </strong> ganador.
            </p>
            <p>9. Tu participación será validada tras confirmar el pago</p>
            <p>10. Puedes repetir el proceso para adquirir más tickets</p>
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
                <IdCard className="h-4 w-4 mr-2 text-red-500" />
                Cédula
              </label>
              <input
                type="text"
                name="cedula"
                value={formData.cedula}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Ingresa tu cédula"
              />
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
                <MapPin className="h-4 w-4 mr-2 text-red-500" />
                Dirección
              </label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Ingresa tu dirección"
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
                <Hash className="h-4 w-4 mr-2 text-red-500" />
                Cantidad de números
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={cantidad}
                onChange={(e) => setCantidad(parseInt(e.target.value))}
                required
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-required
              />
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
                  <p className="text-xs text-gray-500 mt-1">
                    Formatos aceptados: JPG, PNG, PDF (máx. 5MB)
                  </p>
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

        {/* Instrucciones de Pago */}
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden mb-8 mt-8">
          <div className="bg-gradient-to-r from-red-600 to-red-500 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <CreditCard className="h-6 w-6 mr-3" />
              Pago vía PayPal
            </h2>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cuenta */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-red-400">
                  Datos de la Cuenta
                </h3>
                <div className="space-y-2 text-gray-300 text-sm">
                  <div className="flex justify-between flex-wrap gap-y-1">
                    <span className="font-medium">Cuenta PayPal:</span>
                    <span className="font-mono break-all text-right">
                      faberimport@outlook.com
                    </span>
                  </div>
                  <div className="flex justify-between flex-wrap gap-y-1">
                    <span className="font-medium">Titular:</span>
                    <span className="text-right">FABER IMPORT S.R.L</span>
                  </div>
                  <div className="flex justify-between flex-wrap gap-y-1">
                    <span className="font-medium">Empresa:</span>
                    <span className="text-right">FABER IMPORT SRL</span>
                  </div>
                  <a
                    href="https://www.paypal.com/paypalme/faberimportsrl?utm_source=unp&utm_medium=email&utm_campaign=PPC000654&utm_unptid=aae5deb6-a052-11ea-8c08-b875c0fb0ead&ppid=PPC000654&cnac=DO&rsta=es_AG&cust=MT5UDNJ82V73Q&unptid=aae5deb6-a052-11ea-8c08-b875c0fb0ead&calc=3cbaa17ae8d4b&unp_tpcid=ppme-social-business-profile-created&page=main:email:PPC000654:::&pgrp=main:email&e=cl&mchn=em&s=ci&mail=sys&xt=104038"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-sm text-red-400 underline hover:text-red-300"
                  >
                    Ir al enlace directo de PayPal
                  </a>
                  <h3 className="text-lg font-semibold text-red-400 mt-4">
                  Cuenta Banreservas
                </h3>
                <div className="flex justify-between flex-wrap gap-y-1">
                    <span className="font-medium">No:</span>
                    <span className="text-right">015-0019467</span>
                  </div>

                </div>
              </div>

              {/* Detalles */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-red-400">
                  Detalles del Pago
                </h3>
                <div className="bg-red-600/10 border border-red-600/30 rounded-lg p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-400 mb-2">
                      USD $35 + comisión PayPal
                    </p>
                    {/* <p className="text-sm text-gray-300">
                      Costo por participación (incluye cargos adicionales)
                    </p> */}
                  </div>
                </div>
                <div className="text-sm text-gray-300 space-y-1">
                  <p>
                    <strong>Concepto:</strong> Rifa Fast Racing Tuning
                  </p>
                  <p>
                    <strong>Referencia:</strong> Tu nombre completo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
