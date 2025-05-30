'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from '../styles/styles.module.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
    const router = useRouter();
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [confirm, setConfirm] = useState('');
const [nom, setNom] = useState('');
const [prenom, setPrenom] = useState('');
const [phone, setPhone] = useState('');
const [error, setError] = useState('');




const handleSubmit = async(e) => {
    e.preventDefault();
     // Vérification des mots de passe
    if (password !== confirm) {
        setError("Les mots de passe ne correspondent pas.");
        return; 
    }
    const registerDto = {
        Nom: nom,
        Prenom: prenom,
        Email: email,
        Password: password,
        Phone: phone
    };
    await fetch('https://eshop-api-web.up.railway.app/api/Accounts/register-client', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(registerDto)
    })
    .then(async (response) => {
        if (response.ok) {
            const text = await response.text();  
            return text ? JSON.parse(text) : {}; 
        } else {
            throw new Error('inscription échouée'); 
        }
    })
    .then(() => {
        router.push('/connexion');
    })
    .catch((error) => {
        console.error(error);
        setError(error.message, error.status || 500);
    });

};

return (
    <div className="container-fluid min-vh-100 d-flex align-items-center ">
        <div className="row flex-grow-1 ">
            {/* Colonne gauche : image */}
            <div className="col-lg-6 d-flex align-items-center justify-content-center ">
            <Image
                src="/images/log.png"
                alt="Cart with Phone"
                width={400}
                height={400}
                className="img-fluid"
            />
            </div>

            {/* Colonne droite : formulaire */}
            <div className="col-lg-6 d-flex align-items-center justify-content-center mb-4">
            <form onSubmit={handleSubmit}  className="">
                <h1 className="fw-bold mb-3 mt-3">Créer un compte</h1>

                {
                    error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )
                }
                <label className="form-label fw-bold">Nom</label>
                <input
                type="text"
                className="form-control mb-3"
                placeholder="Nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
                />

                <label className="form-label fw-bold">Prénom</label>
                <input
                type="text"
                className="form-control mb-3"
                placeholder="Prenom"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                required
                />


                <label className="form-label fw-bold">Email</label>
                <input
                type="text"
                className="form-control mb-3"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
                
                <label className="form-label fw-bold">Numéro de téléphone</label>
                <input
                type="text"
                className="form-control mb-3"
                placeholder="06 00 00 00 00"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                />

                <label className="form-label fw-bold">Mot de passe</label>
                <input
                type="password"
                className="form-control mb-3"
                placeholder="Au moins 8 caractères"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />

                <label className="form-label fw-bold">Confirmer le mot de passe</label>
                <input
                type="password"
                className="form-control mb-3"
                placeholder=""
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                />

                <div className="d-flex flex-column gap-3">
                    <button type="submit" className="btn btn-dark px-4">
                        Inscription
                    </button>
                    <div className={"d-flex flex-row align-items-center gap-2 " + styles.haveAccount}>
                        <span className="fw-bold">Déjà un compte ?</span>
                        <Link href="/connexion" className={"btn btn-outline-dark px-4" + styles.redLink}>
                            Se connecter
                        </Link>
                    </div>
                </div>
            </form>
            </div>
        </div>
    </div>
);
}

