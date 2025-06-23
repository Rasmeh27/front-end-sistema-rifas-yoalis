const API_URL = "http://localhost:8000";

export async function crearParticipante(data: any) {
  const formData = new FormData();
  formData.append("nombre", data.nombre);
  formData.append("apellido", data.apellido);
  formData.append("numero_telefono", data.telefono);
  formData.append("producto_id", data.producto_id.toString());
  formData.append("cedula", data.cedula);
  formData.append("direccion", data.direccion);
  formData.append("comprobante", data.comprobante); // archivo incluido aquí

  const response = await fetch(`${API_URL}/participantes`, {
    method: "POST",
    body: formData
  });

  return response.json();
}

export async function subirComprobante(id: number, archivo: File) {
  const formData = new FormData();
  formData.append("file", archivo);

  const response = await fetch(`${API_URL}/comprobante/${id}`, {
    method: "POST",
    body: formData
  });

  return response.json();
}

export async function getParticipantes() {
  const response = await fetch(`${API_URL}/participantes`);
  return response.json();
}

export async function actualizarEstado(id: number, nuevoEstado: string) {
    const response = await fetch(`http://localhost:8000/admin/participantes/${id}/estado`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ estado: nuevoEstado })
    });
    return response.json();
}