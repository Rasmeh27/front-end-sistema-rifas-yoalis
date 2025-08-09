import emailjs from "@emailjs/browser";

export async function enviarCorreoAprobacion(params: {
  email: string;
  participant_name: string;
  numeros: (string | number)[];
  producto?: string;
  order_id?: string | number;
}) {
  const serviceId  = import.meta.env.VITE_EMAILJS_SERVICE_ID!;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID!;
  const publicKey  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY!;

  // Convertir los números a string separados por coma
  const numerosTexto = params.numeros.map(String).join(", ");

  // Enviar usando EmailJS
  return emailjs.send(
    serviceId,
    templateId,
    {
      // Variables que usará el template
      to_email: params.email,
      participant_name: params.participant_name,
      numeros: numerosTexto,             // para el fallback de texto
      orders: params.numeros,             // para los "chips" si quieres array
      producto: params.producto ?? "",
      order_id: params.order_id ?? "",    // opcional
    },
    { publicKey }
  );
}
