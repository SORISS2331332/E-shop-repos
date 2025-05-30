"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function ResetPassword() {
    const { id } = useParams();

    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleReset = async (e) => {
        e.preventDefault();

        if (!id) {
            setMessage("ID utilisateur non trouvé.");
            return;
        }
        if (!newPassword || !confirmNewPassword) {
            alert("Veuillez remplir tous les champs.");
            return;
        }
    
        if (newPassword !== confirmNewPassword) {
            alert("Les nouveaux mots de passe ne correspondent pas.");
            return;
        }

        const updatedPass = {
            userId: id,
            currentPassword: newPassword, //on a pas besoin
            newPassword: newPassword,
            confirmNewPassword: confirmNewPassword
        };
    
        const response = await fetch(`https://eshop-api-web.up.railway.app/api/Users/reset-password`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedPass),
        });
    
        if (!response.ok) {
            setMessage("Erreur lors de la mise à jour.");
            console.error("Erreur serveur :", await response.text());
            return;
        }
        setMessage("Mot de passe mis à jour avec succès !");
    };

    return (
        <div className='container mb-5' style={{ marginTop: '150px', flexGrow: 1 }}>
            <h1>Réinitialiser le mot de passe</h1>
            <form onSubmit={handleReset}>
                <label className="form-label fw-bold">Mot de passe</label>
                <input
                    type="password"
                    placeholder="Nouveau mot de passe"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="form-control border-bottom rounded-1 mb-5 w-50"
                />
                <label className="form-label fw-bold">Confirmer le mot de passe</label>
                <input
                    type="password"
                    placeholder="Confirmer le nouveau mot de passe"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                    className="form-control border-bottom rounded-1 mb-5 w-50"
                />
                <button className='btn btn-outline-dark' type="submit">Réinitialiser</button>
            </form>
            {
                message &&
                <div className="alert alert-warning mt-3 w-50" role="alert">
                    {message}
                </div>
            }
        </div>
    );
}
