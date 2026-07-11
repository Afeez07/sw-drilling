export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { name, email, phone, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Length enforcement
    if (name.length > 100 || email.length > 100 || (phone && phone.length > 50) || message.length > 2000) {
        return res.status(400).json({ message: 'Input exceeds maximum allowed length' });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
        return res.status(500).json({ message: 'Server configuration error. API key missing.' });
    }

    // Basic HTML sanitizer to prevent injection in the email body
    const sanitizeHTML = (str) => {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'SW Drilling Website <onboarding@resend.dev>',
                to: 'swborehole@gmail.com',
                subject: `New Quote Request from ${sanitizeHTML(name)}`,
                html: `
                    <h2>New Quote Request from SW Drilling Website</h2>
                    <p><strong>Name:</strong> ${sanitizeHTML(name)}</p>
                    <p><strong>Email:</strong> ${sanitizeHTML(email)}</p>
                    <p><strong>Phone:</strong> ${phone ? sanitizeHTML(phone) : 'Not provided'}</p>
                    <p><strong>Message:</strong></p>
                    <p>${sanitizeHTML(message).replace(/\n/g, '<br>')}</p>
                `
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to send email via Resend');
        }

        return res.status(200).json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Resend API Error:', error);
        return res.status(500).json({ message: error.message || 'Internal server error' });
    }
}
