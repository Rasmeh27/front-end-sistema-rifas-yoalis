import emailjs from "@emailjs/browser";

export async function enviarCorreoAprobacion(params: {
  to_email: string;
  participant_name: string;
  numeros: (string | number)[];
  producto?: string;
}) {
  const serviceId  = import.meta.env.VITE_EMAILJS_SERVICE_ID!;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID!;
  const publicKey  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY!;

  const numerosTexto = params.numeros.map(String).join(", ");

  return emailjs.send(
    serviceId,
    templateId,
    {
      to_email: params.to_email,
      participant_name: params.participant_name,
      numeros: numerosTexto,
      producto: params.producto ?? "",
    },
    { publicKey }
  );
}
