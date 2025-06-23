import { useState } from "react";

// Iconos SVG simples
const TicketIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
    />
  </svg>
);

const TrashIcon = () => (
  <svg
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    className="h-3 w-3"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const XIcon = () => (
  <svg
    className="h-3 w-3"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const ClockIcon = () => (
  <svg
    className="h-3 w-3"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
);

// Tipos de props
type Producto = {
  id: number;
  nombre: string;
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
  estado: string;
  comprobante: string;
  tickets: Ticket[]; // ✅ nuevo
};

type Props = {
  participante: Participante;
  onUpdate: () => void;
  onDelete: (id: number) => void;
};

// ...importaciones e íconos igual que antes (sin cambios)...

export default function ParticipanteRow({
  participante,
  onUpdate,
  onDelete,
}: Props) {
  const [tickets, setTickets] = useState<Ticket[]>(participante.tickets || []);
  const [estadoActual, setEstadoActual] = useState(participante.estado);
  const [isLoadingTicket, setIsLoadingTicket] = useState(false);
  const [isLoadingEstado, setIsLoadingEstado] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const asignarTicket = async () => {
    setIsLoadingTicket(true);
    try {
      const response = await fetch(
        `https://sistema-de-rifas-fastapi.onrender.com/admin/participantes/${participante.id}/asignar_ticket`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        if (Array.isArray(data.numeros_asignados)) {
          const nuevosTickets = data.numeros_asignados.map((num: string, i: number) => ({
            id: Date.now() + i,
            numero: num,
          }));
          setTickets(nuevosTickets);
          showNotification("Tickets asignados correctamente", "success");
        } else {
          showNotification("Respuesta inesperada del servidor", "error");
        }
      } else {
        showNotification(data.detail || "Error al asignar tickets", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showNotification("Error de conexión con el servidor", "error");
    } finally {
      setIsLoadingTicket(false);
    }
  };

  const cambiarEstado = async (nuevoEstado: string) => {
    setIsLoadingEstado(true);
    try {
      const response = await fetch(
        `https://sistema-de-rifas-fastapi.onrender.com/admin/participantes/${participante.id}/estado`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ nuevo_estado: nuevoEstado }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setEstadoActual(nuevoEstado);
        showNotification("Estado actualizado correctamente", "success");
        onUpdate();
      } else {
        showNotification(data.detail || "Error al cambiar estado", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showNotification("Error de conexión", "error");
    } finally {
      setIsLoadingEstado(false);
    }
  };

  const eliminarParticipante = async () => {
    if (!window.confirm("¿Estás seguro de eliminar este participante?")) return;
    setIsDeleting(true);
    try {
      const response = await fetch(
        `https://sistema-de-rifas-fastapi.onrender.com/admin/participantes/${participante.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        showNotification("Participante eliminado correctamente", "success");
        onDelete(participante.id);
      } else {
        showNotification("Error al eliminar participante", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showNotification("Error de conexión", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const showNotification = (message: string, type: "success" | "error") => {
    const notification = document.createElement("div");
    notification.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 ${
      type === "success" ? "bg-green-600" : "bg-red-600"
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  const getEstadoLabel = (estado: string) => {
    const base = "inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full";
    switch (estado.toLowerCase()) {
      case "aprobado":
        return <span className={`${base} bg-green-600/20 text-green-400 border border-green-600/30`}><CheckIcon /> Aprobado</span>;
      case "rechazado":
        return <span className={`${base} bg-red-600/20 text-red-400 border border-red-600/30`}><XIcon /> Rechazado</span>;
      default:
        return <span className={`${base} bg-yellow-600/20 text-yellow-400 border border-yellow-600/30`}><ClockIcon /> Pendiente</span>;
    }
  };

  const isImage = (base64: string) => {
    return base64.startsWith("/") || base64.startsWith("iVBOR") || base64.startsWith("/9j/");
  };

  return (
    <tr className="border-t border-gray-700/50 hover:bg-gray-800/30 transition-colors duration-200">
      <td className="p-4 text-gray-300 font-mono text-sm">#{participante.id}</td>
      <td className="p-4 text-white font-medium">{participante.nombre} {participante.apellido}</td>
      <td className="p-4 text-gray-300 font-mono text-sm">{participante.cedula}</td>
      <td className="p-4 text-gray-300 font-mono text-sm">{participante.numero_telefono}</td>
      <td className="p-4">
        <span className="inline-block px-2 py-1 bg-gray-700 text-gray-300 rounded text-sm">
          {participante.producto?.nombre || "Sin producto"}
        </span>
      </td>

      {/* ✅ TICKETS */}
      <td className="p-4">
        {tickets.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tickets.map((t) => (
              <div key={t.id} className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/20 border border-red-600/30 rounded-lg">
                <TicketIcon />
                <span className="text-red-400 font-mono font-semibold">#{t.numero}</span>
              </div>
            ))}
          </div>
        ) : (
          <button
            onClick={asignarTicket}
            disabled={isLoadingTicket}
            className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium disabled:cursor-not-allowed"
          >
            {isLoadingTicket ? <><LoadingSpinner /> Asignando...</> : <><TicketIcon /> Asignar Tickets</>}
          </button>
        )}
      </td>

      {/* ✅ ESTADO */}
      <td className="p-4">
        <div className="flex items-center gap-2">
          {getEstadoLabel(estadoActual)}
          <select
            className="bg-gray-700 border border-gray-600 text-white px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            value={estadoActual}
            onChange={(e) => cambiarEstado(e.target.value)}
            disabled={isLoadingEstado}
          >
            <option value="pendiente">Pendiente</option>
            <option value="aprobado">Aprobado</option>
            <option value="rechazado">Rechazado</option>
          </select>
        </div>
      </td>

      {/* ✅ COMPROBANTE */}
      <td className="p-4">
        {participante.comprobante ? (
          isImage(participante.comprobante) ? (
            <div className="relative group">
              <img
                src={`data:image/png;base64,${participante.comprobante}`}
                alt="Comprobante"
                className="h-12 w-12 object-cover rounded-lg border border-gray-600 cursor-pointer hover:scale-110 transition-transform duration-200"
                onClick={() => {
                  const newWindow = window.open();
                  if (newWindow) {
                    newWindow.document.write(
                      `<img src="data:image/png;base64,${participante.comprobante}" style="max-width:100%;height:auto;">`
                    );
                  }
                }}
              />
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Click para ampliar
              </div>
            </div>
          ) : (
            <a
              href={`data:application/pdf;base64,${participante.comprobante}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline"
            >
              Ver PDF
            </a>
          )
        ) : (
          <span className="text-gray-500 text-sm italic">Sin comprobante</span>
        )}
      </td>

      {/* ✅ ACCIONES */}
      <td className="p-4">
        <button
          onClick={eliminarParticipante}
          disabled={isDeleting}
          className="inline-flex items-center gap-2 px-3 py-2 bg-red-600/20 hover:bg-red-600 border border-red-600/30 hover:border-red-600 text-red-400 hover:text-white rounded-lg transition-all duration-200 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isDeleting ? <><LoadingSpinner /> Eliminando...</> : <><TrashIcon /> Eliminar</>}
        </button>
      </td>
    </tr>
  );
}
