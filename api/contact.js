const COMPANY_NAME = process.env.COMPANY_NAME || 'C-Enterprise Services';
const COMPANY_PHONE = process.env.COMPANY_PHONE || '(615) 717-7557';

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildEmailTemplate({ name, email, message }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${COMPANY_NAME} Contact Request</title>
      </head>
      <body style="margin:0;padding:24px;background:#c0c0c0;font-family:Segoe UI,Arial,sans-serif;color:#111111;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid rgba(0,0,0,.12);">
          <tr>
            <td style="padding:24px 28px;background:linear-gradient(180deg,#39ff14,#fff300);color:#111111;">
              <p style="margin:0 0 8px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;">Website Inquiry</p>
              <h1 style="margin:0;font-size:28px;line-height:1.15;">New contact form submission</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;">
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">A new message was submitted through the ${COMPANY_NAME} landing page.</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-bottom:20px;">
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #d1d5db;font-weight:700;width:120px;vertical-align:top;">Name</td>
                  <td style="padding:12px 0;border-bottom:1px solid #d1d5db;">${safeName}</td>
                </tr>
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #d1d5db;font-weight:700;width:120px;vertical-align:top;">Email</td>
                  <td style="padding:12px 0;border-bottom:1px solid #d1d5db;">${safeEmail}</td>
                </tr>
                <tr>
                  <td style="padding:12px 0;font-weight:700;width:120px;vertical-align:top;">Message</td>
                  <td style="padding:12px 0;line-height:1.7;">${safeMessage || 'No message provided.'}</td>
                </tr>
              </table>
              <p style="margin:0;font-size:14px;color:#374151;">Reply directly to this email or contact the lead at <a href="mailto:${safeEmail}" style="color:#111111;font-weight:700;">${safeEmail}</a>.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 28px;background:#f3f4f6;border-top:1px solid #d1d5db;font-size:13px;color:#4b5563;">
              ${COMPANY_NAME} | ${COMPANY_PHONE}
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

function buildTextTemplate({ name, email, message }) {
  return [
    'New contact form submission',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    '',
    'Message:',
    message || 'No message provided.',
  ].join('\n');
}

async function sendSendGridRequest(url, apiKey, payload) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`SendGrid request failed: ${response.status} ${errorText}`);
  }
}

async function logToGoogleScript(webhookUrl, secret, payload) {
  if (!webhookUrl) {
    return;
  }

  const requestUrl = secret
    ? `${webhookUrl}${webhookUrl.includes('?') ? '&' : '?'}secret=${encodeURIComponent(secret)}`
    : webhookUrl;

  const response = await fetch(requestUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google script logging failed: ${response.status} ${errorText}`);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL;
  const toEmail = process.env.SENDGRID_TO_EMAIL;
  const listId = process.env.SENDGRID_LIST_ID;
  const googleScriptUrl = process.env.GOOGLE_SCRIPT_WEB_APP_URL;
  const googleScriptSecret = process.env.GOOGLE_SCRIPT_WEBHOOK_SECRET;
  const replyToEmail = process.env.SENDGRID_REPLY_TO_EMAIL || fromEmail;
  const fromName = process.env.SENDGRID_FROM_NAME || COMPANY_NAME;

  if (!apiKey || !fromEmail || !toEmail || !listId) {
    return res.status(500).json({ error: 'Missing SendGrid configuration' });
  }

  const { name = '', email = '', message = '' } = req.body || {};
  const trimmedName = String(name).trim();
  const trimmedEmail = String(email).trim();
  const trimmedMessage = String(message).trim();

  if (!trimmedName || !trimmedEmail) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const emailPayload = {
    personalizations: [
      {
        to: [{ email: toEmail }],
        subject: `Landing page inquiry - ${trimmedName}`,
      },
    ],
    from: {
      email: fromEmail,
      name: fromName,
    },
    reply_to: {
      email: replyToEmail,
      name: fromName,
    },
    content: [
      {
        type: 'text/plain',
        value: buildTextTemplate({ name: trimmedName, email: trimmedEmail, message: trimmedMessage }),
      },
      {
        type: 'text/html',
        value: buildEmailTemplate({ name: trimmedName, email: trimmedEmail, message: trimmedMessage }),
      },
    ],
  };

  const marketingPayload = {
    list_ids: [listId],
    contacts: [
      {
        email: trimmedEmail,
        first_name: trimmedName,
        custom_fields: process.env.SENDGRID_CONTACT_SOURCE_FIELD_ID
          ? {
              [process.env.SENDGRID_CONTACT_SOURCE_FIELD_ID]: 'Landing Page Form',
            }
          : undefined,
      },
    ],
  };

  try {
    await Promise.all([
      sendSendGridRequest('https://api.sendgrid.com/v3/mail/send', apiKey, emailPayload),
      sendSendGridRequest('https://api.sendgrid.com/v3/marketing/contacts', apiKey, marketingPayload),
    ]);

    logToGoogleScript(googleScriptUrl, googleScriptSecret, {
      name: trimmedName,
      email: trimmedEmail,
      message: trimmedMessage,
      source: 'Landing Page Form',
      submittedAt: new Date().toISOString(),
    }).catch(() => null);

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: 'Unable to send message right now' });
  }
}