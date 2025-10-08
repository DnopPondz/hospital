import nodemailer from 'nodemailer';

const requiredEnvVars = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'CONTACT_EMAIL_TO'
];

function assertEnvVars() {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
}

function createTransporter() {
  assertEnvVars();

  const secure = process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465';

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

let cachedTransporter;

function getTransporter() {
  if (!cachedTransporter) {
    cachedTransporter = createTransporter();
  }

  return cachedTransporter;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };

    return entities[char] || char;
  });
}

export async function sendContactEmail({ fullname, email, message }) {
  assertEnvVars();

  if (!fullname || !email || !message) {
    throw new Error('Missing contact form data.');
  }

  const transporter = getTransporter();

  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from: {
      name: process.env.SMTP_FROM_NAME || 'ThaiGov Portal',
      address: fromAddress
    },
    to: process.env.CONTACT_EMAIL_TO,
    replyTo: email,
    subject: `ข้อความใหม่จาก ${fullname}`,
    text: `ชื่อ: ${fullname}\nอีเมล: ${email}\n\n${message}`,
    html: `
      <p><strong>ชื่อ:</strong> ${escapeHtml(fullname)}</p>
      <p><strong>อีเมล:</strong> ${escapeHtml(email)}</p>
      <p><strong>ข้อความ:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>
    `
  });
}
