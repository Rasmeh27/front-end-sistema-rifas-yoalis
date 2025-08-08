import { useEffect, useState } from "react";
import { getParticipantes } from "../service/api";
import { showLoading, showError } from "../utils/alerts";
import Swal from "sweetalert2";
import ParticipanteRow from "../components/ParticipantesRow";
import { Download, LogOut } from 'lucide-react';
import CrearProductoForm from "../components/CrearProductoForm";
import ProductoAdminCard from "../components/ProductoAdminCard";

type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string | null;
};

type Ticket = {
  id: number;
  numero: string;
};

type Participante = {
  id: number;
  nombre: string;
  apellido: string;
  cedula: string;
  numero_telefono: string;
  producto: Producto;
  cantidad_numeros: number;
  estado: string;
  comprobante: string;
  numero_ticket?: string | null;
  tickets: Ticket[];
};

export default function AdminPanel() {
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filtroProducto, setFiltroProducto] = useState("todos");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  useEffect(() => {
    cargarParticipantes();
    cargarProductos();
  }, []);

  const cargarParticipantes = async () => {
    try {
      showLoading("Cargando participantes...");
      const data = await getParticipantes();
      setParticipantes(data || []);
    } catch (err) {
      console.error(err);
      showError("Error al cargar participantes");
    } finally {
      Swal.close();
    }
  };

  const cargarProductos = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/admin/productos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error("Error al cargar productos", err);
    }
  };

  const handleDelete = (id: number) => {
    setParticipantes((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdate = () => {
    cargarParticipantes();
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "¿Cerrar sesión?",
      text: "¿Estás seguro de que deseas cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
      background: "#ffffff",
      color: "#1f2937",
    });

    if (result.isConfirmed) {
      localStorage.removeItem("token");
      Swal.fire({
        title: "Sesión cerrada",
        text: "Has cerrado sesión correctamente.",
        icon: "success",
        background: "#ffffff",
        color: "#1f2937",
        confirmButtonColor: "#ef4444",
      }).then(() => {
        window.location.href = "/admin/login";
      });
    }
  };

  const handleDescargarExcel = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        "http://localhost:8000/participantes/exportar_excel",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Error al descargar Excel");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "participantes.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("❌", error);
      Swal.fire("Error", "No se pudo descargar el archivo Excel", "error");
    }
  };

  const productosUnicos = Array.from(
    new Set(participantes.map((p) => p.producto?.nombre || ""))
  ).filter((v) => v);

  const estadosUnicos = Array.from(
    new Set(participantes.map((p) => p.estado || ""))
  ).filter((v) => v);

  const participantesFiltrados = participantes.filter((p) => {
    const coincideProducto =
      filtroProducto === "todos" || p.producto?.nombre === filtroProducto;
    const coincideEstado =
      filtroEstado === "todos" || p.estado === filtroEstado;
    return coincideProducto && coincideEstado;
  });

  return (
    <div className="p-6 bg-gray-50 text-gray-900 min-h-screen">
      {/* Header con fondo rojo */}
      <div className="bg-red-500 text-white p-6 rounded-lg mb-8 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold mb-4 sm:mb-0">Panel Administrativo</h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDescargarExcel}
              className="group relative inline-flex items-center justify-center px-6 py-3 bg-white text-red-500 hover:bg-gray-100 font-semibold rounded-lg shadow-lg transition-colors"
            >
              <Download className="h-5 w-5 mr-2" />
              <span>Descargar Excel</span>
            </button>
            <button
              onClick={handleLogout}
              className="group relative inline-flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg transition-colors"
            >
              <LogOut className="h-5 w-5 mr-2" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Crear producto con fondo blanco y borde rojo */}
      <div className="bg-white rounded-lg shadow-lg border-l-4 border-red-500 mb-8">
        <CrearProductoForm onProductoCreado={() => {
          cargarParticipantes();
          cargarProductos();
        }} />
      </div>

      {/* Lista visual de productos */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="bg-red-500 text-white p-4 rounded-t-lg -m-6 mb-6">
          <h2 className="text-2xl font-bold">Productos Disponibles</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productos.map((producto) => (
            <ProductoAdminCard
              key={producto.id}
              producto={producto}
              onDelete={cargarProductos}
            />
          ))}
        </div>
      </div>

      {/* Filtros con fondo blanco */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="bg-red-500 text-white p-4 rounded-t-lg -m-6 mb-6">
          <h3 className="text-xl font-bold">Filtros</h3>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por producto:
            </label>
            <select
              value={filtroProducto}
              onChange={(e) => setFiltroProducto(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            >
              <option value="todos">Todos</option>
              {productosUnicos.map((nombre) => (
                <option key={nombre} value={nombre}>
                  {nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filtrar por estado:
            </label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            >
              <option value="todos">Todos</option>
              {estadosUnicos.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de participantes con fondo blanco */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-red-500 text-white p-4">
          <h3 className="text-xl font-bold">Lista de Participantes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-red-50 border-b border-red-200">
              <tr>
                <th className="p-4 font-semibold text-gray-900">ID</th>
                <th className="p-4 font-semibold text-gray-900">Nombre</th>
                <th className="p-4 font-semibold text-gray-900">Cédula</th>
                <th className="p-4 font-semibold text-gray-900">Teléfono</th>
                <th className="p-4 font-semibold text-gray-900">Producto</th>
                <th className="p-4 font-semibold text-gray-900">Tickets</th>
                <th className="p-4 font-semibold text-gray-900">Estado</th>
                <th className="p-4 font-semibold text-gray-900">Comprobante</th>
                <th className="p-4 font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {participantesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-500">
                    <div className="flex flex-col items-center">
                      <div className="text-4xl mb-2">📋</div>
                      <p className="text-lg">No hay participantes para mostrar.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                participantesFiltrados.map((p, index) => (
                  <tr 
                    key={p.id} 
                    className={`hover:bg-red-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <ParticipanteRow
                      participante={p}
                      onDelete={handleDelete}
                      onUpdate={handleUpdate}
                    />
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
