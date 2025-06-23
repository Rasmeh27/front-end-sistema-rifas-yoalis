import { useEffect, useState } from "react";
import { getParticipantes } from "../service/api";
import { showLoading, showError } from "../utils/alerts";
import Swal from "sweetalert2";
import ParticipanteRow from "../components/ParticipantesRow";

type Producto = {
  id: number;
  nombre: string;
};

type Participante = {
  id: number;
  nombre: string;
  apellido: string;
  numero_telefono: string;
  producto: Producto;
  estado: string;
  comprobante: string;
  numero_ticket?: string | null;
};

export default function AdminPanel() {
  const [participantes, setParticipantes] = useState<Participante[]>([]);

  useEffect(() => {
    cargarParticipantes();
  }, []);

  const cargarParticipantes = async () => {
    try {
      showLoading("Cargando participantes...");
      const data = await getParticipantes();
      setParticipantes(data);
    } catch (err) {
      console.error(err);
      showError("Error al cargar participantes");
    } finally {
      Swal.close();
    }
  };

  // ✅ Eliminar participante desde el estado
  const handleDelete = (id: number) => {
    setParticipantes((prev) => prev.filter((p) => p.id !== id));
  };

  // ✅ Actualizar (refrescar) participantes si es necesario
  const handleUpdate = () => {
    cargarParticipantes(); // o puedes hacer cambios más específicos si lo prefieres
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Panel Administrativo</h1>

      <table className="w-full text-left border border-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Nombre</th>
            <th className="p-3">Teléfono</th>
            <th className="p-3">Producto</th>
            <th className="p-3">Estado</th>
            <th className="p-3">Comprobante</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {participantes.map((p) => (
            <ParticipanteRow
              key={p.id}
              participante={p}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
