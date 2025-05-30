"use client";
import { useState } from 'react';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch(`https://eshop-api-web.up.railway.app/api/Users/email/${email}`);
        const users = await res.json();

        if (users.length === 0) {
            setMessage("Email non trouvé.");
            return;
        }

        const send = await fetch('/api/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: users.email, id: users.id }),
        });

        if (send.ok) {
            setMessage("Lien de réinitialisation envoyé à votre email !");
        } else {
            setMessage("Erreur lors de l'envoi de l'email.");
        }
    };

    return (
        <div className='container' style={{ marginTop: '150px', flexGrow: 1 }}>
            <h1>Mot de passe oublié</h1>
            <form onSubmit={handleSubmit} className='mb-5'>
                <label className="form-label fw-bold">Email</label>
                <input
                    type="email"
                    placeholder="Votre email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-control border-bottom rounded-1 mb-5 w-50"
                />
                <button className='btn btn-outline-dark' type="submit">Envoyer</button>
            </form>
            {
                message &&
                <div className=" alert alert-warning mt-3 w-50" role="alert">
                    {message}
                </div>
            }
        </div>
    );
}
