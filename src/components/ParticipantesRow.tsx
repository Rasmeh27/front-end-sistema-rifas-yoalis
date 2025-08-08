import { useState } from "react";
import Swal from "sweetalert2";
import { Ticket, Trash2, Check, X, Clock, Loader2 } from 'lucide-react';

// Tipos de props
type Producto = {
  id: number;
  nombre: string;
};

type TicketType = {
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
  tickets: TicketType[];
};

type Props = {
  participante: Participante;
  onUpdate: () => void;
  onDelete: (id: number) => void;
};

export default function ParticipanteRow({
  participante,
  onUpdate,
  onDelete,
}: Props) {
  const [tickets, setTickets] = useState<TicketType[]>(participante.tickets || []);
  const [estadoActual, setEstadoActual] = useState(participante.estado);
  const [isLoadingTicket, setIsLoadingTicket] = useState(false);
  const [isLoadingEstado, setIsLoadingEstado] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const showNotification = (message: string, type: "success" | "error") => {
    if (type === "success") {
      Swal.fire({
        title: '¡Éxito!',
        text: message,
        icon: 'success',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
        background: '#ffffff',
        color: '#1f2937',
        customClass: {
          popup: 'colored-toast'
        }
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: message,
        icon: 'error',
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
        background: '#ffffff',
        color: '#1f2937',
        customClass: {
          popup: 'colored-toast'
        }
      });
    }
  };

  const asignarTicket = async () => {
    setIsLoadingTicket(true);
    try {
      const response = await fetch(
        `http://localhost:8000/admin/participantes/${participante.id}/asignar_ticket`,
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
        `http://localhost:8000/admin/participantes/${participante.id}/estado`,
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
    const result = await Swal.fire({
      title: '¿Eliminar participante?',
      html: `
        <div class="text-center">
          <div class="text-4xl mb-4">⚠️</div>
          <p class="text-gray-700 mb-4">
            ¿Estás seguro de que deseas eliminar a 
            <strong class="text-red-600">${participante.nombre} ${participante.apellido}</strong>?
          </p>
          <div class="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p class="text-red-700 text-sm">
              <strong>⚠️ Esta acción no se puede deshacer</strong>
            </p>
            <p class="text-red-600 text-xs mt-1">
              Se eliminarán todos los datos y tickets asociados
            </p>
          </div>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      background: '#ffffff',
      color: '#1f2937',
      reverseButtons: true,
      focusCancel: true,
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      }
    });

    if (!result.isConfirmed) return;

    setIsDeleting(true);
    
    // Mostrar loading
    Swal.fire({
      title: 'Eliminando...',
      text: 'Por favor espera mientras eliminamos el participante',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      background: '#ffffff',
      color: '#1f2937',
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const response = await fetch(
        `http://localhost:8000/admin/participantes/${participante.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        await Swal.fire({
          title: '¡Eliminado!',
          html: `
            <div class="text-center">
              <div class="text-4xl mb-4">✅</div>
              <p class="text-gray-700">
                El participante <strong class="text-red-600">${participante.nombre} ${participante.apellido}</strong> 
                ha sido eliminado correctamente.
              </p>
            </div>
          `,
          icon: 'success',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#ef4444',
          background: '#ffffff',
          color: '#1f2937',
          timer: 3000,
          timerProgressBar: true,
          showClass: {
            popup: 'animate__animated animate__bounceIn'
          }
        });
        onDelete(participante.id);
      } else {
        Swal.fire({
          title: 'Error al eliminar',
          text: 'No se pudo eliminar el participante. Por favor, intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#ef4444',
          background: '#ffffff',
          color: '#1f2937'
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        title: 'Error de conexión',
        text: 'No se pudo conectar con el servidor. Verifica tu conexión e intenta nuevamente.',
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#ef4444',
        background: '#ffffff',
        color: '#1f2937'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getEstadoLabel = (estado: string) => {
    const base = "inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full";
    switch (estado.toLowerCase()) {
      case "aprobado":
        return (
          <span className={`${base} bg-green-100 text-green-800 border border-green-200`}>
            <Check className="h-3 w-3" /> Aprobado
          </span>
        );
      case "rechazado":
        return (
          <span className={`${base} bg-red-100 text-red-800 border border-red-200`}>
            <X className="h-3 w-3" /> Rechazado
          </span>
        );
      default:
        return (
          <span className={`${base} bg-yellow-100 text-yellow-800 border border-yellow-200`}>
            <Clock className="h-3 w-3" /> Pendiente
          </span>
        );
    }
  };

  const isImage = (base64: string) => {
    return base64.startsWith("/") || base64.startsWith("iVBOR") || base64.startsWith("/9j/");
  };

  return (
    <>
      <td className="p-4 text-gray-600 font-mono text-sm border-b border-gray-200">
        #{participante.id}
      </td>
      <td className="p-4 text-gray-900 font-medium border-b border-gray-200">
        {participante.nombre} {participante.apellido}
      </td>
      <td className="p-4 text-gray-600 font-mono text-sm border-b border-gray-200">
        {participante.cedula}
      </td>
      <td className="p-4 text-gray-600 font-mono text-sm border-b border-gray-200">
        {participante.numero_telefono}
      </td>
      <td className="p-4 border-b border-gray-200">
        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
          {participante.producto?.nombre || "Sin producto"}
        </span>
      </td>
      
      {/* TICKETS */}
      <td className="p-4 border-b border-gray-200">
        {tickets.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tickets.map((t) => (
              <div 
                key={t.id} 
                className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 border border-red-200 rounded-lg"
              >
                <Ticket className="h-4 w-4 text-red-600" />
                <span className="text-red-800 font-mono font-semibold">#{t.numero}</span>
              </div>
            ))}
          </div>
        ) : (
          <button
            onClick={asignarTicket}
            disabled={isLoadingTicket}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoadingTicket ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> 
                Asignando...
              </>
            ) : (
              <>
                <Ticket className="h-4 w-4" /> 
                Asignar Tickets
              </>
            )}
          </button>
        )}
      </td>

      {/* ESTADO */}
      <td className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {getEstadoLabel(estadoActual)}
          <select
            className="bg-white border border-gray-300 text-gray-900 px-3 py-1 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
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

      {/* COMPROBANTE */}
      <td className="p-4 border-b border-gray-200">
        {participante.comprobante ? (
          isImage(participante.comprobante) ? (
            <div className="relative group">
              <img
                src={`data:image/png;base64,${participante.comprobante}`}
                alt="Comprobante"
                className="h-12 w-12 object-cover rounded-lg border-2 border-gray-200 cursor-pointer hover:border-red-300 hover:scale-110 transition-all duration-200 shadow-sm"
                onClick={() => {
                  const newWindow = window.open();
                  if (newWindow) {
                    newWindow.document.write(
                      `<img src="data:image/png;base64,${participante.comprobante}" style="max-width:100%;height:auto;">`
                    );
                  }
                }}
              />
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                Click para ampliar
              </div>
            </div>
          ) : (
            <a
              href={`data:application/pdf;base64,${participante.comprobante}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-800 underline font-medium"
            >
              Ver PDF
            </a>
          )
        ) : (
          <span className="text-gray-400 text-sm italic">Sin comprobante</span>
        )}
      </td>

      {/* ACCIONES */}
      <td className="p-4 border-b border-gray-200">
        <button
          onClick={eliminarParticipante}
          disabled={isDeleting}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-500 border border-red-200 hover:border-red-500 text-red-600 hover:text-white rounded-lg transition-all duration-200 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isDeleting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> 
              Eliminando...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" /> 
              Eliminar
            </>
          )}
        </button>
      </td>
    </>
  );
}
