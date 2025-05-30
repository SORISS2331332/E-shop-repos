
import nodemailer from 'nodemailer';

export async function POST(req) {
    const body = await req.json();
    const { email, id } = body;

    if (!email || !id) {
        return new Response(JSON.stringify({ message: 'Email ou ID manquant' }), {
        status: 400,
        });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: 'sorghoissouf226@gmail.com',
        pass: 'xihs gmra smro fmme',
        },
    });

    const resetLink = `https://eshop-web.up.railway.app/reset-password/${id}`;

    const mailOptions = {
        from: '"Support E-Shop" <sorghoissouf226@gmail.com>',
        to: email,
        subject: 'Réinitialisation de mot de passe',
        html: `<p>Bonjour,</p>
            <p>Clique sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
            <a href="${resetLink}">${resetLink}</a>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        return new Response(JSON.stringify({ message: 'Email envoyé' }), {
        status: 200,
        });
    } catch (error) {
        console.error('Erreur email :', error);
        return new Response(JSON.stringify({ message: "Erreur d'envoi de l'email" }), {
        status: 500,
        });
    }
}
