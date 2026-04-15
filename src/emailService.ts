import emailjs from '@emailjs/browser';

const SERVICE_ID       = import.meta.env.VITE_EMAILJS_SERVICE_ID       || '';
const PUBLIC_KEY       = import.meta.env.VITE_EMAILJS_PUBLIC_KEY       || '';
const TEMPLATE_NOTIFY  = import.meta.env.VITE_EMAILJS_TEMPLATE_NOTIFY  || '';
const TEMPLATE_CONFIRM = import.meta.env.VITE_EMAILJS_TEMPLATE_CONFIRM || '';

export interface ContactFormData {
  name: string;
  email: string;
  services: string;
  budget: string;
  requirements: string;
}

export async function sendContactEmails(data: ContactFormData): Promise<{ success: boolean; error?: string }> {
  if (!SERVICE_ID || !PUBLIC_KEY) return { success: true };
  try {
    await Promise.all([
      emailjs.send(SERVICE_ID, TEMPLATE_NOTIFY, {
        from_name: data.name, from_email: data.email,
        services: data.services, budget: data.budget,
        requirements: data.requirements, reply_to: data.email,
      }, PUBLIC_KEY),
      emailjs.send(SERVICE_ID, TEMPLATE_CONFIRM, {
        to_name: data.name, to_email: data.email,
        services: data.services, budget: data.budget,
      }, PUBLIC_KEY),
    ]);
    return { success: true };
  } catch (err: unknown) {
    console.error('EmailJS error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Email failed' };
  }
}
