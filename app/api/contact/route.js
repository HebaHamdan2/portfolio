import nodemailer from 'nodemailer';

export async function POST(request) {
    const { email, subject, message } = await request.json();

    if (!email || !subject || !message) {
        return new Response(JSON.stringify({ success: false, error: 'Missing required fields' }), { status: 400 });
    }

    // Create a transporter object using SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,  
        auth: {
            user: process.env.EMAIL, 
            pass: process.env.EMAIL_PASS, 
        },
    });

    try {
        let info = await transporter.sendMail({
            from: `"Contact Form" <${process.env.EMAIL}>`,  
            to: process.env.Email_USER,
            subject: subject,
            html: `  
                <h1>${subject}</h1>
                <p>New message submitted from ${email} says:</p>
                <p>${message}</p>
            `,
        });

        console.log('Message sent: ', info.messageId);
        return new Response(JSON.stringify({ success: true }), { status: 200 });

    } catch (error) {
        console.error('Error sending email:', error);
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
    }
}
