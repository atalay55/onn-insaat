import emailjs from 'emailjs-com';

export interface EmailConfig {
  publicKey: string;
  serviceId: string;
  templateId: string;
  contactEmail: string;
}

export function getEmailConfig(): EmailConfig {
  return {
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "",
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "",
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "",
    contactEmail: import.meta.env.VITE_CONTACT_EMAIL || "",
  };
}

export function isEmailConfigured(): boolean {
  const config = getEmailConfig();
  return !!(
    config.publicKey &&
    config.serviceId &&
    config.templateId &&
    config.contactEmail &&
    !config.publicKey.includes('YOUR_') &&
    !config.serviceId.includes('YOUR_') &&
    !config.templateId.includes('YOUR_')
  );
}

export interface EmailData extends Record<string, unknown> {
  to_email: string;
  from_name: string;
  from_email: string;
  phone: string;
  message: string;
  reply_to: string;
}

export async function sendEmail(emailData: EmailData): Promise<void> {
  const config = getEmailConfig();

  if (!isEmailConfigured()) {
    console.warn(
      "EmailJS konfigürasyonu eksik veya geçersiz. Email gönderilemedi. Lütfen EMAILJS_SETUP.md dosyasındaki adımları takip ederek .env.local dosyasını güncelleyin."
    );
    return;
  }

  try {
    emailjs.init(config.publicKey);

    await emailjs.send(
      config.serviceId,
      config.templateId,
      emailData
    );

    console.log("Email başarıyla gönderildi");
  } catch (error) {
    console.error("Email gönderilemedi:", error);
    throw error;
  }
}
