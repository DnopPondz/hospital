import net from 'node:net';
import tls from 'node:tls';
import { once } from 'node:events';

class MissingEnvError extends Error {
  constructor(missingKeys) {
    super(`Missing environment variables: ${missingKeys.join(', ')}`);
    this.name = 'MissingEnvError';
    this.code = 'MISSING_ENV';
    this.missing = missingKeys;
  }
}

class SmtpError extends Error {
  constructor(message, response) {
    super(message);
    this.name = 'SmtpError';
    this.code = 'SMTP_ERROR';
    this.response = response;
  }
}

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
    throw new MissingEnvError(missing);
  }
}

function escapeHeaderValue(value) {
  return String(value).replace(/[\r\n]/g, ' ').trim();
}

function escapeText(value) {
  return String(value).replace(/\r?\n/g, '\n');
}

function encodeBase64(value) {
  return Buffer.from(String(value), 'utf8').toString('base64');
}

async function getLine(socket, state) {
  if (state.buffer.length > 0) {
    const index = state.buffer.indexOf('\n');

    if (index !== -1) {
      let line = state.buffer.slice(0, index);
      state.buffer = state.buffer.slice(index + 1);

      if (line.endsWith('\r')) {
        line = line.slice(0, -1);
      }

      return line;
    }
  }

  const [chunk] = await once(socket, 'data');

  state.buffer += chunk.toString('utf8');

  return getLine(socket, state);
}

async function readResponse(socket, state) {
  const lines = [];

  while (true) {
    const line = await getLine(socket, state);

    if (line === undefined) {
      throw new SmtpError('Connection closed unexpectedly.', { code: 451, lines });
    }

    lines.push(line);

    const match = line.match(/^(\d{3})([\s-])(.*)$/);

    if (match && match[2] === ' ') {
      return { code: Number(match[1]), lines };
    }
  }
}

async function sendCommand(socket, state, command, expectedCodes) {
  if (command) {
    socket.write(`${command}\r\n`);
  }

  const response = await readResponse(socket, state);

  if (!expectedCodes.includes(response.code)) {
    throw new SmtpError(
      `SMTP command failed: ${command || '<implicit>'} (${response.code})`,
      response
    );
  }

  return response;
}

function createConnection({ host, port, secure, timeout }) {
  return new Promise((resolve, reject) => {
    const connectionOptions = { host, port, timeout };

    if (secure) {
      connectionOptions.servername = host;
    }

    const socket = secure
      ? tls.connect(connectionOptions)
      : net.createConnection(connectionOptions);

    socket.setEncoding('utf8');
    socket.setTimeout(timeout, () => {
      socket.destroy(new Error('SMTP connection timed out.'));
    });

    const cleanup = () => {
      socket.removeAllListeners('error');
      socket.removeAllListeners('secureConnect');
      socket.removeAllListeners('connect');
    };

    const onError = (error) => {
      cleanup();
      reject(error);
    };

    socket.once('error', onError);

    const onReady = () => {
      cleanup();
      resolve(socket);
    };

    if (secure) {
      socket.once('secureConnect', onReady);
    } else {
      socket.once('connect', onReady);
    }
  });
}

function upgradeToTls(socket, { host, timeout }) {
  return new Promise((resolve, reject) => {
    const tlsSocket = tls.connect({
      socket,
      servername: host,
      timeout
    });

    const cleanup = () => {
      tlsSocket.removeAllListeners('secureConnect');
      tlsSocket.removeAllListeners('error');
    };

    const onError = (error) => {
      cleanup();
      reject(error);
    };

    const onSecureConnect = () => {
      cleanup();
      tlsSocket.setEncoding('utf8');
      tlsSocket.setTimeout(timeout, () => {
        tlsSocket.destroy(new Error('SMTP connection timed out.'));
      });
      resolve(tlsSocket);
    };

    tlsSocket.once('error', onError);
    tlsSocket.once('secureConnect', onSecureConnect);
  });
}

async function sendMail({
  host,
  port,
  secure,
  starttls,
  username,
  password,
  from,
  fromName,
  to,
  replyTo,
  subject,
  body
}) {
  let socket = await createConnection({ host, port, secure, timeout: 15000 });
  let state = { buffer: '' };

  try {
    await sendCommand(socket, state, null, [220]);
    const clientName = escapeHeaderValue(process.env.SMTP_CLIENT_NAME || 'localhost');
    let ehloResponse = await sendCommand(socket, state, `EHLO ${clientName}`, [250]);

    if (starttls) {
      const supportsStartTls = ehloResponse.lines.some((line) =>
        line.toUpperCase().includes('STARTTLS')
      );

      if (!supportsStartTls) {
        throw new SmtpError('SMTP server does not advertise STARTTLS support.', ehloResponse);
      }

      await sendCommand(socket, state, 'STARTTLS', [220]);
      socket = await upgradeToTls(socket, { host, timeout: 15000 });
      state = { buffer: '' };
      await sendCommand(socket, state, `EHLO ${clientName}`, [250]);
    }

    await sendCommand(socket, state, 'AUTH LOGIN', [334]);
    await sendCommand(socket, state, encodeBase64(username), [334]);
    await sendCommand(socket, state, encodeBase64(password), [235]);

    await sendCommand(socket, state, `MAIL FROM:<${from}>`, [250]);
    await sendCommand(socket, state, `RCPT TO:<${to}>`, [250, 251]);
    await sendCommand(socket, state, 'DATA', [354]);

    const headers = [
      `From: "${escapeHeaderValue(fromName)}" <${from}>`,
      `To: ${to}`,
      `Reply-To: ${replyTo}`,
      `Subject: ${escapeHeaderValue(subject)}`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=UTF-8',
      '',
      escapeText(body)
    ];

    const payload = headers
      .join('\r\n')
      .replace(/\n\./g, '\n..');

    socket.write(`${payload}\r\n.\r\n`);

    await sendCommand(socket, state, null, [250]);
    await sendCommand(socket, state, 'QUIT', [221]);
  } finally {
    socket.end();
  }
}

export async function sendContactEmail({ fullname, email, message }) {
  assertEnvVars();

  if (!fullname || !email || !message) {
    throw new Error('Missing contact form data.');
  }

  const secure = process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465';
  const starttls = process.env.SMTP_STARTTLS !== 'false' && !secure;
  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER;
  const fromName = process.env.SMTP_FROM_NAME || 'ThaiGov Portal';

  const lines = [
    `ชื่อ: ${fullname}`,
    `อีเมล: ${email}`,
    '',
    message
  ];

  await sendMail({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure,
    starttls,
    username: process.env.SMTP_USER,
    password: process.env.SMTP_PASS,
    from: fromAddress,
    fromName,
    to: process.env.CONTACT_EMAIL_TO,
    replyTo: email,
    subject: `ข้อความใหม่จาก ${fullname}`,
    body: lines.join('\n')
  });
}

export { MissingEnvError, SmtpError };
