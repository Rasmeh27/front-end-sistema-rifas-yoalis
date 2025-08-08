import { Trash2, Package } from 'lucide-react';
import Swal from "sweetalert2";
import { showSuccess, showError } from "../utils/alerts";

type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string | null; // base64
};

export default function ProductoAdminCard({
  producto,
  onDelete,
}: {
  producto: Producto;
  onDelete: () => void;
}) {
  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: "¿Eliminar producto?",
      text: `¿Deseas eliminar "${producto.nombre}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      background: "#ffffff",
      color: "#1f2937",
    });

    if (!confirm.isConfirmed) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        `https://yaolisbackend.vercel.app/admin/productos/${producto.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Error al eliminar producto");

      showSuccess("Producto eliminado correctamente");
      onDelete();
    } catch (err) {
      console.error(err);
      showError("No se pudo eliminar");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Header de la card con gradiente rojo */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-white">
            <Package className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Producto #{producto.id}</span>
          </div>
          <button
            onClick={handleDelete}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors group-hover:scale-110 transform duration-200"
            title="Eliminar producto"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Contenido de la card */}
      <div className="p-4">
        {/* Imagen del producto */}
        <div className="flex justify-center mb-4">
          {producto.imagen ? (
            <div className="relative">
              <img
                src={`data:image/png;base64,${producto.imagen}`}
                alt={producto.nombre}
                className="w-24 h-24 object-cover rounded-full border-4 border-red-100 shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 bg-red-500 text-white rounded-full p-1">
                <Package className="w-3 h-3" />
              </div>
            </div>
          ) : (
            <div className="w-24 h-24 bg-gray-100 rounded-full border-4 border-red-100 flex items-center justify-center">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
            {producto.nombre}
          </h3>
          
          {producto.descripcion && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-3">
              {producto.descripcion}
            </p>
          )}

          {/* Badge de estado */}
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            Activo
          </div>
        </div>
      </div>

      {/* Footer con información adicional */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>ID: {producto.id}</span>
          <span className="flex items-center">
            <div className="w-2 h-2 bg-red-400 rounded-full mr-1"></div>
            En rifa
          </span>
        </div>
      </div>
    </div>
  );
}
