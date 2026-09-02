const { Resend } = require('resend');

module.exports = async (req, res) => {
  // Allow only POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, businessName, industry, phone, serviceInterest, message } = req.body;

    // Server-side validation
    if (!name || !businessName || !industry || !phone || !serviceInterest || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const cleanedPhone = phone.trim();
    if (!/^\+?[0-9\s\-()]{10,20}$/.test(cleanedPhone)) {
      return res.status(400).json({ error: 'Invalid phone number format. Please provide a valid WhatsApp number.' });
    }

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey || apiKey === "re_123456789" || apiKey.includes("your_")) {
      // Development mode log fallback
      console.log("=== [NAWABI CODER CONTACT FORM SUBMISSION] ===");
      console.log(`Name: ${name}`);
      console.log(`Business Name: ${businessName}`);
      console.log(`Industry: ${industry}`);
      console.log(`Phone (WhatsApp): ${cleanedPhone}`);
      console.log(`Service Interest: ${serviceInterest}`);
      console.log(`Message: ${message}`);
      console.log("=========================================");

      return res.status(200).json({
        success: true,
        message: 'Request received successfully! (Development Mode: Resend API key missing, logged to console)'
      });
    }

    const resend = new Resend(apiKey);

    const emailData = await resend.emails.send({
      from: 'Nawabi Coder Web <onboarding@resend.dev>',
      to: 'moidsufiyan489@gmail.com',
      subject: `New Strategy Call Request: ${businessName} (${name})`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #1a1a2e; border-bottom: 2px solid #e94560; padding-bottom: 10px;">New Strategy Call Request</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 150px; color: #555;">Name:</td>
              <td style="padding: 8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Business Name:</td>
              <td style="padding: 8px 0;">${businessName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Industry:</td>
              <td style="padding: 8px 0;">${industry}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Phone / WhatsApp:</td>
              <td style="padding: 8px 0;"><a href="https://wa.me/${cleanedPhone.replace(/[^0-9]/g, '')}">${cleanedPhone}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #555;">Interest:</td>
              <td style="padding: 8px 0;">${serviceInterest}</td>
            </tr>
          </table>
          <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px; border-left: 4px solid #e94560;">
            <strong style="display: block; margin-bottom: 5px; color: #1a1a2e;">Message:</strong>
            <p style="margin: 0; color: #333; line-height: 1.5; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `
    });

    if (emailData.error) {
      console.error("Resend API Error:", emailData.error);
      return res.status(500).json({ error: `Resend error: ${emailData.error.message}` });
    }

    return res.status(200).json({
      success: true,
      message: 'Form submitted successfully! We will get back to you shortly.'
    });
  } catch (error) {
    console.error("Serverless Function Error:", error);
    return res.status(500).json({ error: 'An unexpected server error occurred. Please try again.' });
  }
};
