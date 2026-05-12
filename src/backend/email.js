const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function enviarBilhete({ para, nome, evento, data, local, codigoQR, preco }) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(codigoQR)}`;
  await transporter.sendMail({
    from: `"QuickPass" <${process.env.EMAIL_USER}>`,
    to: para,
    subject: `O teu bilhete para ${evento} ✓`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:#1e1b4b;padding:32px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:24px;">QuickPass</h1>
          <p style="color:#a5b4fc;margin:8px 0 0;">O teu bilhete está pronto!</p>
        </div>
        <div style="padding:32px;">
          <p style="color:#374151;font-size:16px;">Olá <strong>${nome}</strong>,</p>
          <p style="color:#6b7280;font-size:14px;">A tua compra foi confirmada. Apresenta o QR Code abaixo na entrada do evento.</p>
          <div style="background:#f9fafb;border-radius:12px;padding:24px;margin:24px 0;text-align:center;">
            <p style="margin:0 0 4px;font-weight:700;font-size:18px;color:#111827;">${evento}</p>
            ${data ? `<p style="margin:4px 0;color:#6b7280;font-size:14px;">📅 ${data}</p>` : ""}
            ${local ? `<p style="margin:4px 0;color:#6b7280;font-size:14px;">📍 ${local}</p>` : ""}
            ${preco ? `<p style="margin:8px 0 0;font-weight:700;color:#4f46e5;font-size:16px;">${preco}€</p>` : ""}
          </div>
          <div style="text-align:center;margin:24px 0;">
            <img src="${qrUrl}" alt="QR Code" style="border-radius:12px;border:4px solid #e5e7eb;" width="200" height="200"/>
            <p style="font-size:11px;color:#9ca3af;font-family:monospace;margin-top:8px;">${codigoQR}</p>
          </div>
          <p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:32px;">© ${new Date().getFullYear()} QuickPass Portugal</p>
        </div>
      </div>
    `,
  });
}

async function enviarRecuperacaoPassword({ para, nome, token }) {
  const link = `https://192.168.232.76:5173/reset-password/${token}`;
  await transporter.sendMail({
    from: `"QuickPass" <${process.env.EMAIL_USER}>`,
    to: para,
    subject: "Recuperação de Palavra-passe — QuickPass",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:#1e1b4b;padding:32px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:24px;">QuickPass</h1>
          <p style="color:#a5b4fc;margin:8px 0 0;">Recuperação de Palavra-passe</p>
        </div>
        <div style="padding:32px;">
          <p style="color:#374151;font-size:16px;">Olá <strong>${nome}</strong>,</p>
          <p style="color:#6b7280;font-size:14px;">Recebemos um pedido para redefinir a tua palavra-passe. Clica no botão abaixo — o link expira em <strong>1 hora</strong>.</p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${link}" style="background:#1e1b4b;color:#fff;padding:14px 32px;border-radius:999px;text-decoration:none;font-weight:700;font-size:15px;">Redefinir Palavra-passe</a>
          </div>
          <p style="color:#9ca3af;font-size:12px;">Se não pediste isto, ignora este email.</p>
          <p style="color:#9ca3af;font-size:12px;text-align:center;margin-top:32px;">© ${new Date().getFullYear()} QuickPass Portugal</p>
        </div>
      </div>
    `,
  });
}

module.exports = { enviarBilhete, enviarRecuperacaoPassword };
