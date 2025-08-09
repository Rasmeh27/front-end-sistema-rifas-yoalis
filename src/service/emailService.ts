import emailjs from "@emailjs/browser";

export async function enviarCorreoAprobacion(params: {
  email: string;                 // destinatario
  participant_name: string;      // {{participant_name}} en template
  numeros: (string | number)[];  // {{numeros}} en template
  producto?: string;
}) {
  const serviceId  = import.meta.env.VITE_EMAILJS_SERVICE_ID!;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID!;
  const publicKey  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY!;

  return emailjs.send(
    serviceId,
    templateId,
    {
      email: params.email,                               // 👈 clave que resuelve el "To Email"
      participant_name: params.participant_name,
      numeros: params.numeros.map(String).join(", "),
      producto: params.producto ?? "",
    },
    { publicKey }
  );
}
