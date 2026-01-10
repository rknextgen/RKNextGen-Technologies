import nodemailer from 'nodemailer';

const isMailConfigured = () => {
    return process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
};

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendContactEmail = async (data: { name: string; email: string; phone?: string; company?: string; message: string }) => {
    if (!isMailConfigured()) {
        console.log('Mail not configured. Mocking email send:', data);
        return { success: true, mocked: true };
    }

    const mailOptions = {
        from: process.env.SMTP_FROM || '"RK NextGen Technologies" <noreply@rknextgen.com>',
        to: process.env.CONTACT_EMAIL || 'info.rknextgen@gmail.com',
        subject: `New Contact Message from ${data.name}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #00C2D9;">New Contact Message</h2>
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
                <p><strong>Company:</strong> ${data.company || 'N/A'}</p>
                <hr style="border: 1px solid #eee;" />
                <p><strong>Message:</strong></p>
                <p style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${data.message}</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Error sending contact email:', error);
        // Don't fail the request if email fails
        return { success: false, error };
    }
};

export const sendNewsletterSubscriptionEmail = async (email: string) => {
    if (!isMailConfigured()) {
        console.log('Mail not configured. Mocking newsletter email for:', email);
        return { success: true, mocked: true };
    }

    const mailOptions = {
        from: process.env.SMTP_FROM || '"RK NextGen Technologies" <noreply@rknextgen.com>',
        to: process.env.CONTACT_EMAIL || 'info.rknextgen@gmail.com',
        subject: 'New Newsletter Subscription',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #00C2D9;">New Newsletter Subscription</h2>
                <p>A new user has subscribed to the newsletter.</p>
                <p><strong>Email:</strong> ${email}</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Error sending newsletter email:', error);
        return { success: false, error };
    }
};

export const sendAutoReplyEmail = async (data: { name: string; email: string }) => {
    if (!isMailConfigured()) {
        console.log('Mail not configured. Mocking auto-reply email for:', data.email);
        return { success: true, mocked: true };
    }

    const mailOptions = {
        from: process.env.SMTP_FROM || '"RK NextGen Technologies" <noreply@rknextgen.com>',
        to: data.email,
        subject: 'Thank you for contacting RK NextGen Technologies',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #00C2D9;">Thank You for Reaching Out!</h2>
                <p>Dear ${data.name},</p>
                <p>Thank you for contacting RK NextGen Technologies. We have received your message and our team will get back to you shortly.</p>
                <p>If you have any urgent queries, please feel free to reply to this email.</p>
                <br />
                <p>Best Regards,</p>
                <p><strong>RK NextGen Technologies Team</strong></p>
                <p><a href="https://rknextgen.com" style="color: #00C2D9;">www.rknextgen.com</a></p>
                <p><a href="tel:+918823857525" style="color: #00C2D9;">+91 8823857525</a></p>
                <p><a href="mailto:info@rknextgen.com" style="color: #00C2D9;">info@rknextgen.com</a></p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Error sending auto-reply email:', error);
        return { success: false, error };
    }
};
