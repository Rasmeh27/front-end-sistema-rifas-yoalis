import { useEffect, useState } from "react";
import { getParticipantes } from "../service/api";
import { showLoading, showError } from "../utils/alerts";
import Swal from "sweetalert2";
import ParticipanteRow from "../components/ParticipantesRow";
import { Download, LogOut } from "lucide-react";

type Producto = {
  id: number;
  nombre: string;
};

type Participante = {
  id: number;
  nombre: string;
  apellido: string;
  cedula: string; // Asegúrate de que tu backend lo envía
  numero_telefono: string;
  producto: Producto;
  estado: string;
  comprobante: string;
  numero_ticket?: string | null;
};

export default function AdminPanel() {
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [filtroProducto, setFiltroProducto] = useState("todos");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  useEffect(() => {
    cargarParticipantes();
    // eslint-disable-next-line
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
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
      background: "#1f2937",
      color: "#ffffff",
      customClass: {
        popup: "fast-racing-popup",
        title: "fast-racing-title",
        htmlContainer: "fast-racing-text",
        confirmButton: "fast-racing-confirm-btn",
        cancelButton: "fast-racing-cancel-btn",
      },
      didOpen: () => {
        const style = document.createElement("style");
        style.textContent = `
          .fast-racing-popup { border: 2px solid #dc2626 !important; border-radius: 12px !important; }
          .fast-racing-title { color: #dc2626 !important; font-weight: 700 !important; font-size: 1.5rem !important; }
          .fast-racing-text { color: #e5e7eb !important; font-size: 1rem !important; }
          .fast-racing-confirm-btn { background: linear-gradient(135deg, #dc2626, #b91c1c) !important; border-radius: 8px !important; }
          .fast-racing-cancel-btn { background: linear-gradient(135deg, #6b7280, #4b5563) !important; border-radius: 8px !important; color: #fff !important; }
          .swal2-icon.swal2-warning { border-color: #dc2626 !important; color: #dc2626 !important; }
        `;
        document.head.appendChild(style);
      },
    });

    if (result.isConfirmed) {
      localStorage.removeItem("token");
      Swal.fire({
        title: "Sesión cerrada",
        text: "Has cerrado sesión correctamente.",
        icon: "success",
        background: "#1f2937",
        color: "#ffffff",
        confirmButtonColor: "#10b981",
        confirmButtonText: "Continuar",
        customClass: {
          popup: "fast-racing-success-popup",
          title: "fast-racing-success-title",
          htmlContainer: "fast-racing-success-text",
          confirmButton: "fast-racing-success-btn",
        },
        didOpen: () => {
          const style = document.createElement("style");
          style.textContent = `
            .fast-racing-success-popup { border: 2px solid #10b981 !important; border-radius: 12px !important; }
            .fast-racing-success-title { color: #10b981 !important; font-weight: 700 !important; font-size: 1.5rem !important; }
            .fast-racing-success-text { color: #e5e7eb !important; font-size: 1rem !important; }
            .fast-racing-success-btn { background: linear-gradient(135deg, #10b981, #059669) !important; border-radius: 8px !important; color: #fff !important; }
          `;
          document.head.appendChild(style);
        },
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

      if (!response.ok) {
        throw new Error("Error al descargar Excel");
      }

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

  // Productos únicos para filtro
  const productosUnicos = Array.from(
    new Set(participantes.map((p) => p.producto?.nombre || ""))
  ).filter((v) => v);

  // Estados únicos para filtro
  const estadosUnicos = Array.from(
    new Set(participantes.map((p) => p.estado || ""))
  ).filter((v) => v);

  // Filtrado
  const participantesFiltrados = participantes.filter((p) => {
    const coincideProducto =
      filtroProducto === "todos" || p.producto?.nombre === filtroProducto;
    const coincideEstado =
      filtroEstado === "todos" || p.estado === filtroEstado;
    return coincideProducto && coincideEstado;
  });

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">
          Panel Administrativo
        </h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDescargarExcel}
            className="group relative inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <Download className="h-5 w-5 mr-2 group-hover:animate-bounce" />
            <span>Descargar Excel</span>
            <div className="absolute inset-0 bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </button>
          <button
            onClick={handleLogout}
            className="group relative inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            <LogOut className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-200" />
            <span>Cerrar Sesión</span>
            <div className="absolute inset-0 bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div>
          <label className="block text-sm mb-1">Filtrar por producto:</label>
          <select
            value={filtroProducto}
            onChange={(e) => setFiltroProducto(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
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
          <label className="block text-sm mb-1">Filtrar por estado:</label>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
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

      <table className="w-full text-left border border-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Nombre</th>
            <th className="p-3">Cedula</th>
            <th className="p-3">Teléfono</th>
            <th className="p-3">Producto</th>
            <th className="p-3">Estado</th>
            <th className="p-3">Comprobante</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {participantesFiltrados.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-8 text-gray-400">
                No hay participantes para mostrar.
              </td>
            </tr>
          ) : (
            participantesFiltrados.map((p) => (
              <ParticipanteRow
                key={p.id}
                participante={p}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}