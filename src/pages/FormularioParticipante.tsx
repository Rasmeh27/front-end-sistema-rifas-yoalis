"use client";
import type React from "react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Upload, Phone, User, CreditCard, Trophy, FileText, Hash, MapPin, BadgeIcon as IdCard, Sparkles, Check, Star, Gift } from 'lucide-react';

const crearParticipante = async (data: any) => {
  const formData = new FormData();
  formData.append("nombre", data.nombre);
  formData.append("apellido", data.apellido);
  formData.append("cedula", data.cedula);
  formData.append("numero_telefono", data.telefono);
  formData.append("direccion", data.direccion);
  formData.append("producto_id", data.producto_id.toString());
  formData.append("comprobante", data.comprobante);
  formData.append("cantidad_numeros", String(data.cantidad_numeros));

  const response = await fetch("http://localhost:8000/participantes", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("No se pudo registrar el participante");
  }

  return await response.json();
};

const showError = (message: string) => {
  return Swal.fire({
    title: 'Error',
    text: message,
    icon: 'error',
    confirmButtonText: 'Entendido',
    confirmButtonColor: '#ef4444',
    background: '#ffffff',
    color: '#1f2937',
    showClass: {
      popup: 'animate__animated animate__shakeX'
    }
  });
};

const showLoading = (message: string) => {
  return Swal.fire({
    title: 'Procesando...',
    text: message,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    background: '#ffffff',
    color: '#1f2937',
    didOpen: () => {
      Swal.showLoading(null);
    }
  });
};

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
  const [cantidad, setCantidad] = useState(1);
  const [productos, setProductos] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Obtener productos del backend
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const res = await fetch("http://localhost:8000/productos/disponibles");
        const data = await res.json();
        setProductos(data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };
    obtenerProductos();
  }, []);

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

  const handleProductSelect = (producto: any) => {
    setSelectedProduct(producto);
    setFormData((prev) => ({
      ...prev,
      producto: producto.id.toString(),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.comprobante) {
      showError("Debes subir el comprobante de pago para participar en la rifa.");
      return;
    }

    if (!selectedProduct) {
      showError("Debes seleccionar un producto para participar en la rifa.");
      return;
    }

    try {
      showLoading("Registrando tu participación en la rifa...");
      
      const participante = await crearParticipante({
        nombre: formData.nombre,
        apellido: formData.apellido,
        cedula: formData.cedula,
        telefono: formData.telefono,
        direccion: formData.direccion,
        producto_id: parseInt(formData.producto),
        comprobante: formData.comprobante,
        cantidad_numeros: cantidad,
      });

      Swal.close();

      if (!participante || !participante.id) {
        showError("No se pudo completar tu registro. Por favor, intenta nuevamente.");
        return;
      }

      await Swal.fire({
        title: '¡Felicitaciones!',
        html: `
          <div class="text-center">
            <div class="text-6xl mb-4">🎉</div>
            <p class="text-lg mb-4">¡Te has inscrito exitosamente en la rifa!</p>
            <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p class="text-red-700 font-semibold">Producto seleccionado:</p>
              <p class="text-red-600">${selectedProduct.nombre}</p>
            </div>
            <p class="text-sm text-gray-600">
              Recibirás una confirmación y tus números de la rifa pronto.
            </p>
          </div>
        `,
        icon: 'success',
        confirmButtonText: '¡Genial!',
        confirmButtonColor: '#ef4444',
        background: '#ffffff',
        color: '#1f2937',
        showClass: {
          popup: 'animate__animated animate__bounceIn'
        },
        customClass: {
          popup: 'rounded-2xl'
        }
      });

      // Limpiar formulario
      setFormData({
        nombre: "",
        apellido: "",
        cedula: "",
        telefono: "",
        direccion: "",
        producto: "",
        comprobante: null,
      });
      setCantidad(1);
      setSelectedProduct(null);

    } catch (error) {
      Swal.close();
      console.error("Error:", error);
      showError("Ocurrió un error inesperado al registrar tu participación. Por favor, verifica tus datos e intenta nuevamente.");
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated background patterns con colores del logo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-red-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Header con colores del logo */}
      <div className="relative z-10 bg-black shadow-lg shadow-red-500/20">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-4">
                <Sparkles className="h-8 w-8 text-red-500 mr-2 animate-pulse" />
                <span className="text-3xl font-bold bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
                  JUEGA TU SUERTE
                </span>
                <Sparkles className="h-8 w-8 text-red-500 ml-2 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Trophy className="h-16 w-16 text-red-500 mr-4 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]" />
              <div className="absolute inset-0 h-16 w-16 mr-4 bg-red-500 rounded-full blur-md opacity-30 animate-ping"></div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold">
              <span className="bg-gradient-to-r from-black via-gray-800 to-black bg-clip-text text-transparent">
                GRAN{" "}
              </span>
              <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]">
                RIFA
              </span>
            </h1>
            <div className="relative ml-4">
              <Gift className="h-16 w-16 text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]" />
              <div className="absolute inset-0 h-16 w-16 bg-red-500 rounded-full blur-md opacity-30 animate-ping delay-500"></div>
            </div>
          </div>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            ¡Participa en nuestra{" "}
            <span className="text-red-600 font-semibold">rifa exclusiva</span> y
            gana increíbles productos!
          </p>
        </div>

        {/* Card de Productos en Rifa */}
        <div className="bg-white rounded-3xl border-2 border-red-500/20 shadow-2xl shadow-red-500/10 overflow-hidden mb-8 hover:shadow-red-500/20 transition-all duration-300">
          <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/80 to-red-700/80"></div>
            <h2 className="relative text-2xl font-bold text-white flex items-center">
              <div className="relative mr-3">
                <Gift className="h-6 w-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
              </div>
              Productos en Rifa
            </h2>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {productos.map((producto) => (
                <div
                  key={producto.id}
                  onClick={() => handleProductSelect(producto)}
                  className={`relative cursor-pointer group transition-all duration-300 transform hover:scale-105 ${
                    selectedProduct?.id === producto.id
                      ? "ring-4 ring-red-500 shadow-lg shadow-red-500/30"
                      : "hover:shadow-lg hover:shadow-red-500/20"
                  }`}
                >
                  <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden relative">
                    {selectedProduct?.id === producto.id && (
                      <div className="absolute top-3 right-3 z-10 bg-red-500 text-white rounded-full p-1">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                    <div className="aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={`data:image/png;base64,${producto.imagen}`}
                        alt={producto.nombre}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2">
                        {producto.nombre}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-red-600 font-bold text-lg">
                          {producto.precio}
                        </span>
                        <div className="flex items-center text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <Star className="h-4 w-4 fill-current" />
                          <Star className="h-4 w-4 fill-current" />
                          <Star className="h-4 w-4 fill-current" />
                          <Star className="h-4 w-4 fill-current" />
                        </div>
                      </div>
                    </div>
                    <div
                      className={`absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                        selectedProduct?.id === producto.id ? "opacity-20" : ""
                      }`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            {selectedProduct && (
              <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                <div className="flex items-center text-red-700">
                  <Check className="h-5 w-5 mr-2" />
                  <span className="font-semibold">
                    Producto seleccionado: {selectedProduct.nombre}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Condiciones de la Rifa */}
        <div className="bg-white rounded-3xl border-2 border-red-500/20 shadow-2xl shadow-red-500/10 overflow-hidden mb-8 hover:shadow-red-500/20 transition-all duration-300">
          <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/80 to-red-700/80"></div>
            <h2 className="relative text-2xl font-bold text-white flex items-center">
              <div className="relative mr-3">
                <FileText className="h-6 w-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
              </div>
              Instrucciones de la rifa
            </h2>
          </div>
          <div className="p-8 text-gray-700 text-sm leading-relaxed space-y-2">
            <p className="text-red-600 font-semibold">Instrucciones</p>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-3xl border-2 border-red-500/20 shadow-2xl shadow-red-500/10 overflow-hidden hover:shadow-red-500/20 transition-all duration-300">
          <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/80 to-red-700/80"></div>
            <h2 className="relative text-2xl font-bold text-white flex items-center">
              <div className="relative mr-3">
                <User className="h-6 w-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
              </div>
              Formulario de Participación
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2 group">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2 group-hover:text-red-600 transition-colors">
                  <User className="h-4 w-4 mr-2 text-red-500 group-hover:drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]" />
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all duration-300"
                  placeholder="Ingresa tu nombre"
                />
              </div>
              <div className="space-y-2 group">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2 group-hover:text-red-600 transition-colors">
                  <User className="h-4 w-4 mr-2 text-red-500 group-hover:drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]" />
                  Apellido
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all duration-300"
                  placeholder="Ingresa tu apellido"
                />
              </div>
            </div>
            <div className="space-y-2 group">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2 group-hover:text-red-600 transition-colors">
                <IdCard className="h-4 w-4 mr-2 text-red-500 group-hover:drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]" />
                Cédula
              </label>
              <input
                type="text"
                name="cedula"
                value={formData.cedula}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all duration-300"
                placeholder="Ingresa tu cédula"
              />
            </div>
            <div className="space-y-2 group">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2 group-hover:text-red-600 transition-colors">
                <Phone className="h-4 w-4 mr-2 text-red-500 group-hover:drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]" />
                Número de Teléfono
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all duration-300"
                placeholder="+1 (829) 123-4567"
              />
            </div>
            <div className="space-y-2 group">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2 group-hover:text-red-600 transition-colors">
                <MapPin className="h-4 w-4 mr-2 text-red-500 group-hover:drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]" />
                Dirección
              </label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all duration-300"
                placeholder="Ingresa tu dirección"
              />
            </div>
            <div className="space-y-2 group">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2 group-hover:text-red-600 transition-colors">
                <Hash className="h-4 w-4 mr-2 text-red-500 group-hover:drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]" />
                Cantidad de números
              </label>
              <input
                type="number"
                min={1}
                max={2}
                value={cantidad}
                onChange={(e) => setCantidad(parseInt(e.target.value))}
                required
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all duration-300"
              />
            </div>
            <div className="space-y-2 group">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2 group-hover:text-red-600 transition-colors">
                <Upload className="h-4 w-4 mr-2 text-red-500 group-hover:drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]" />
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
                <div className="w-full px-4 py-8 bg-gray-50 border-2 border-dashed border-red-300 rounded-xl text-center hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.1)] transition-all duration-300 group-hover:bg-red-50">
                  <div className="relative">
                    <Upload className="h-12 w-12 text-red-500 mx-auto mb-4 group-hover:drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                    <div className="absolute inset-0 h-12 w-12 mx-auto bg-red-500 rounded-full blur-md opacity-20 animate-pulse"></div>
                  </div>
                  <p className="text-gray-700 font-medium">
                    {formData.comprobante
                      ? `Archivo seleccionado: ${formData.comprobante.name}`
                      : "Haz clic para subir tu comprobante"}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Formatos aceptados: JPG, PNG, PDF (máx. 5MB)
                  </p>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-red-600/20 animate-pulse"></div>
              <span className="relative flex items-center justify-center">
                <Trophy className="h-5 w-5 mr-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                PARTICIPAR EN LA RIFA
                <Sparkles className="h-5 w-5 ml-2 animate-pulse" />
              </span>
            </button>
          </form>
        </div>

        {/* Instrucciones de Pago */}
        <div className="bg-white rounded-3xl border-2 border-red-500/20 shadow-2xl shadow-red-500/10 overflow-hidden mb-8 mt-8 hover:shadow-red-500/20 transition-all duration-300">
          <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/80 to-red-700/80"></div>
            <h2 className="relative text-2xl font-bold text-white flex items-center">
              <div className="relative mr-3">
                <CreditCard className="h-6 w-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
              </div>
              Formas de Pago
            </h2>
          </div>
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cuenta */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-red-600 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 animate-pulse" />
                  Datos de la Cuenta
                </h3>
                <div className="space-y-3 text-gray-700 text-sm bg-gray-50 p-4 rounded-xl border-2 border-red-100">
                  <div className="flex justify-between flex-wrap gap-y-1">
                    <span className="font-medium text-red-600">Titular:</span>
                    <span className="text-right text-gray-900">Yoaylis</span>
                  </div>
                  <h3 className="text-lg font-semibold text-red-600 mt-6 flex items-center">
                    <Sparkles className="h-5 w-5 mr-2 animate-pulse" />
                    Banco Nacional de Crédito
                  </h3>
                  <div className="flex justify-between flex-wrap gap-y-1">
                    <span className="font-medium text-red-600">No:</span>
                    <span className="text-right text-gray-900 font-mono">
                      0191
                    </span>
                  </div>
                  <div className="flex justify-between flex-wrap gap-y-1">
                    <span className="font-medium text-red-600">Cedula:</span>
                    <span className="text-right text-gray-900 font-mono">
                      24.635.189
                    </span>
                  </div>
                  <div className="flex justify-between flex-wrap gap-y-1">
                    <span className="font-medium text-red-600">Telefono:</span>
                    <span className="text-right text-gray-900 font-mono">
                      0424.296.23.98
                    </span>
                  </div>
                </div>
              </div>
              {/* Detalles */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-red-600 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 animate-pulse" />
                  Detalles del Pago
                </h3>
                <div className="bg-gradient-to-br from-red-50 via-red-100 to-red-50 border-2 border-red-200 rounded-xl p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-100/50 to-red-200/50"></div>
                  <div className="relative text-center">
                    <p className="text-3xl font-bold bg-gradient-to-r from-red-600 via-red-700 to-red-800 bg-clip-text text-transparent mb-2 drop-shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                      USD $999
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-700 space-y-2 bg-gray-50 p-4 rounded-xl border-2 border-red-100">
                  <p>
                    <strong className="text-red-600">Concepto:</strong>{" "}
                    <span className="text-gray-900">Rifas Yoaylis</span>
                  </p>
                  <p>
                    <strong className="text-red-600">Referencia:</strong>{" "}
                    <span className="text-gray-900">Tu nombre completo</span>
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
