'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function OAuthSyncer() {
    const { data: session, status } = useSession();
    const { login } = useAuth(); 
    const [syncDone, setSyncDone] = useState(false);

    useEffect(() => {
        const syncUser = async () => {
            try {
                

                const [prenom, ...nomParts] = (session.user.name ?? '').trim().split(' ');
                const nom = nomParts.join(' ');
                const userDto = {
                    Nom: nom,
                    Prenom: prenom,
                    Email: session.user.email,
                    Password: 'OAuthPlaceholderPassword123!', //google ne donne pas les passwords
                    Phone: '+1 (123) 456-7890'
                };

                const registerRes = await fetch('https://eshop-api-web.up.railway.app/api/Accounts/register-client', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userDto)
                });
                if (!registerRes.ok) {
                    console.error("Erreur lors de l'inscription :", await registerRes.text());
                }

                const restoken = await fetch('https://eshop-api-web.up.railway.app/api/Accounts/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: session.user.email })
                });
                const data = await restoken.json();

                if (!data.token || !data.userId) {
                    console.log("Token ou userId manquant ");
                    return;
                }
                const userData = {
                    id: data.userId,
                    nom: nom,
                    prenom: prenom,
                    email: session.user.email,
                    adresseId: null,
                    role: "Client"
                };

                login(userData, data.token);
                setSyncDone(true);
            } catch (error) {
                console.error("Erreur lors de la synchronisation OAuth:", error);
            }
        };

        if (status === "authenticated" && session?.user && !syncDone) {
            syncUser();
        }

    }, [status, session, login, syncDone]);

    return null;
}
