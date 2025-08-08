
export async function crearParticipante(data: any) {
  const formData = new FormData();

  formData.append("nombre", data.nombre);
  formData.append("apellido", data.apellido);
  formData.append("numero_telefono", data.telefono);
  formData.append("producto_id", data.producto_id.toString());
  formData.append("cedula", data.cedula);
  formData.append("direccion", data.direccion);
  formData.append("comprobante", data.comprobante); // archivo

  // ✅ Campo faltante que causa el 422 o errores
  formData.append("cantidad_numeros", String(data.cantidad_numeros));

  const response = await fetch(`http://127.0.0.1:8000/participantes`, {
    method: "POST",
    body: formData,
    redirect: "follow", // ✅ importante para evitar error 307
  });

  return response.json();
}


export async function subirComprobante(id: number, archivo: File) {
  const formData = new FormData();
  formData.append("file", archivo);

  const response = await fetch(`http://127.0.0.1:8000/comprobante/${id}`, {
    method: "POST",
    body: formData
  });

  return response.json();
}

export async function getParticipantes() {
  const response = await fetch(`http://127.0.0.1:8000/participantes`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, // necesario si ruta está protegida
    },
    redirect: "follow", // evita errores 307
  });

  return response.json();
}


export async function actualizarEstado(id: number, nuevoEstado: string) {
    const response = await fetch(`http://127.0.0.1:8000/admin/participantes/${id}/estado`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ estado: nuevoEstado })
    });
    return response.json();
}