import { useState } from "react";
import { showError, showLoading, showSuccess } from "../utils/alerts";
import Swal from "sweetalert2";
import { Plus, Upload } from 'lucide-react';

export default function CrearProductoForm({ onProductoCreado }: { onProductoCreado: () => void }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImagen(file);
    
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre || !imagen) {
      showError("El nombre y la imagen son obligatorios");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    formData.append("imagen", imagen);

    try {
      showLoading("Creando producto...");
      const response = await fetch("https://yaolisbackend.vercel.app/admin/productos", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Error al crear producto");

      showSuccess("Producto creado correctamente");
      setNombre("");
      setDescripcion("");
      setImagen(null);
      setPreviewUrl(null);
      onProductoCreado();
    } catch (err: any) {
      console.error(err);
      showError(err.message || "Error inesperado");
    } finally {
      Swal.close();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header rojo */}
      <div className="bg-red-500 text-white p-4">
        <div className="flex items-center">
          <Plus className="h-6 w-6 mr-2" />
          <h2 className="text-xl font-bold">Crear Nuevo Producto</h2>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna izquierda - Campos del formulario */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del producto <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-white border border-gray-300 text-gray-900 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="Ingresa el nombre del producto"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={4}
                className="w-full bg-white border border-gray-300 text-gray-900 p-3 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
                placeholder="Describe el producto (opcional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen del producto <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="imagen-input"
                  required
                />
                <label
                  htmlFor="imagen-input"
                  className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-red-500 hover:bg-red-50 transition-colors"
                >
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {imagen ? imagen.name : "Haz clic para seleccionar una imagen"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG, GIF hasta 10MB
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Columna derecha - Vista previa */}
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vista previa
            </label>
            <div className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center bg-gray-50">
              {previewUrl ? (
                <div className="text-center">
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="Vista previa"
                    className="max-w-full max-h-48 object-contain rounded-lg shadow-md"
                  />
                  <p className="text-sm text-gray-600 mt-2">Vista previa del producto</p>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <div className="text-4xl mb-2">🖼️</div>
                  <p className="text-sm">La imagen aparecerá aquí</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botón de envío */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-lg transition-colors focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <Plus className="h-5 w-5 mr-2" />
            Crear Producto
          </button>
        </div>
      </form>
    </div>
  );
}
