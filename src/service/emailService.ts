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

  const numerosTexto = params.numeros.map(String).join(", ");

  // 👇 clave 'email' para que EmailJS rellene el "To Email"
  return emailjs.send(
    serviceId,
    templateId,
    {
      email: params.email,                 // <- CAMBIO CLAVE
      participant_name: params.participant_name,
      orders: params.numeros,              // para chips (array)
      numeros: numerosTexto,               // fallback texto
      producto: params.producto ?? "",
      order_id: params.order_id ?? "",
    },
    { publicKey }
  );
}
