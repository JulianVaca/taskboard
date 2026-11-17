const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_FROM = "TaskBoard <notificaciones@skillware.online>";

const outbox = [];

function getOutbox() {
  return [...outbox];
}

function clearOutbox() {
  outbox.length = 0;
}

function escapeHtml(raw) {
  return String(raw)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildLayout(heading, bodyHtml, footerNote) {
  return `<!doctype html>
<html lang="es">
  <body style="margin:0;padding:24px;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#18181b;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;border:1px solid #e4e4e7;overflow:hidden;">
      <tr>
        <td style="padding:20px 24px;background:linear-gradient(135deg,#8b5cf6,#4f46e5);color:#ffffff;font-weight:700;font-size:18px;">
          TaskBoard
        </td>
      </tr>
      <tr>
        <td style="padding:24px;">
          <h1 style="margin:0 0 12px;font-size:20px;line-height:1.3;color:#18181b;">${heading}</h1>
          <div style="font-size:15px;line-height:1.6;color:#3f3f46;">
            ${bodyHtml}
          </div>
          <p style="margin:24px 0 0;padding-top:16px;border-top:1px solid #e4e4e7;font-size:12px;color:#71717a;">
            ${footerNote}
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/**
 * Envía un correo usando Resend cuando hay RESEND_API_KEY fuera de pruebas,
 * y siempre registra el mensaje en outbox para inspección en tests.
 */
async function sendEmail({ to, subject, html, text }) {
  const entry = { to, subject, html, text, sentAt: new Date().toISOString() };
  outbox.push(entry);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || process.env.NODE_ENV === "test") return entry;

  const from = process.env.EMAIL_FROM || DEFAULT_FROM;
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [to], subject, html, text }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(`[mail] Resend respondió ${res.status}: ${detail}`);
    }
  } catch (err) {
    console.error("[mail] Error enviando correo con Resend:", err);
  }
  return entry;
}

/** Envía correo de bienvenida cuando un usuario crea su cuenta. */
function sendWelcomeEmail({ name, email }) {
  const safeName = escapeHtml(name);
  const subject = "¡Te damos la bienvenida a TaskBoard!";
  const html = buildLayout(
    `¡Hola, ${safeName}!`,
    `<p style="margin:0 0 12px;">Tu cuenta en <strong>TaskBoard</strong> ya está lista.</p>
     <p style="margin:0;">Organiza tus tareas del día, cambia de estilo visual cuando quieras y recibe avisos de tu progreso.</p>`,
    "Enviado desde TaskBoard · https://skillware.online"
  );
  const text = `¡Hola, ${name}!\n\nTu cuenta en TaskBoard ya está lista. Entra cuando quieras en https://skillware.online`;
  return sendEmail({ to: email, subject, html, text });
}

/** Envía notificación cuando el usuario agrega una tarea nueva. */
function sendTaskCreatedEmail({ name, email, title }) {
  const safeName = escapeHtml(name);
  const safeTitle = escapeHtml(title);
  const subject = `Nueva tarea: ${title}`;
  const html = buildLayout(
    "Agregaste una nueva tarea",
    `<p style="margin:0 0 12px;">Hola ${safeName}, guardamos tu nueva tarea en el tablero:</p>
     <p style="margin:0;padding:12px 16px;background:#f4f4f5;border-radius:10px;font-weight:600;color:#18181b;">${safeTitle}</p>`,
    "TaskBoard · https://skillware.online"
  );
  const text = `Hola ${name}, agregaste una nueva tarea en TaskBoard: "${title}".`;
  return sendEmail({ to: email, subject, html, text });
}

/** Envía felicitación cuando el usuario completa una tarea. */
function sendTaskCompletedEmail({ name, email, title }) {
  const safeName = escapeHtml(name);
  const safeTitle = escapeHtml(title);
  const subject = `¡Completaste "${title}"!`;
  const html = buildLayout(
    "¡Tarea completada!",
    `<p style="margin:0 0 12px;">Bien hecho, ${safeName}. Marcaste como completada la tarea:</p>
     <p style="margin:0;padding:12px 16px;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:10px;font-weight:600;color:#065f46;">✓ ${safeTitle}</p>`,
    "TaskBoard · https://skillware.online"
  );
  const text = `¡Bien hecho, ${name}! Completaste la tarea "${title}" en TaskBoard.`;
  return sendEmail({ to: email, subject, html, text });
}

/** Envía el código de 6 dígitos (válido 15 minutos) para restablecer la contraseña. */
function sendPasswordResetEmail({ name, email, code }) {
  const safeName = escapeHtml(name);
  const safeCode = escapeHtml(code);
  const subject = "Tu código para restablecer la contraseña en TaskBoard";
  const html = buildLayout(
    "Restablece tu contraseña",
    `<p style="margin:0 0 12px;">Hola ${safeName}, usa este código de 6 dígitos para elegir una nueva contraseña:</p>
     <p style="margin:16px 0;padding:14px 20px;background:#f5f3ff;border:1px solid #ddd6fe;border-radius:12px;font-size:28px;font-weight:700;letter-spacing:6px;text-align:center;color:#4f46e5;">${safeCode}</p>
     <p style="margin:0;font-size:13px;color:#71717a;">Este código vence en 15 minutos. Si no solicitaste el cambio, ignora este mensaje.</p>`,
    "TaskBoard · https://skillware.online"
  );
  const text = `Hola ${name},\n\nTu código de recuperación de TaskBoard es: ${code}\nVence en 15 minutos.`;
  return sendEmail({ to: email, subject, html, text });
}

module.exports = {
  getOutbox,
  clearOutbox,
  sendEmail,
  sendWelcomeEmail,
  sendTaskCreatedEmail,
  sendTaskCompletedEmail,
  sendPasswordResetEmail,
};
