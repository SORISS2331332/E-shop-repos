import styles from '../../styles/styles.module.css';
import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';

const Resume = ({panierComplet}) => {
    const { user } = useAuth();
    const [adresse, setAdresse] = useState(null);

    const sousTotal = panierComplet.reduce((sum, a) => sum + (a.total || 0), 0)
    const taxes = +(sousTotal * 0.15).toFixed(2)
    const total = sousTotal + taxes
    

    const totalAffiche = total.toLocaleString('fr-FR', {
        style: 'currency',
        currency: 'CAD',
    });
    const sousTotalAffiche = sousTotal.toLocaleString('fr-FR', {
        style: 'currency',
        currency: 'CAD',
    });

    const taxesAffiche = taxes.toLocaleString('fr-FR', {
        style: 'currency',
        currency: 'CAD',
    });

    // Récupération de l'adresse
    useEffect(() => {
        if(user){

            setAdresse(user.adresse);

        }
    }, []);


    return (
        <div className={styles.resume}>
            <h5>Résumé</h5>
            {panierComplet.map((a, i) => (
                <div key={i} className={styles.item}>
                    <img src={a.image} alt={a.nom} />
                    <span>{a.nom} x {a.quantite}</span>
                    <strong>{a.total} $CA</strong>
                </div>
            ))}
            <hr />
            <div className="text-muted mt-3">Adresse</div>
            {
                adresse &&
                <div>
                    {adresse.codeCivique} {adresse.rue}, {adresse.ville}, {adresse.codePostal}, {adresse.pays}
                </div>
            }
            <div className="text-muted mt-3">Méthode de livraison</div>
            <div>Gratuite</div>
            <hr />
            <div>Sous-total <span className="float-end">{sousTotalAffiche}</span></div>
            <div>Taxes <span className="float-end">{taxesAffiche}</span></div>
            <div className="fw-bold">Total <span className="float-end">{totalAffiche}</span></div>
        </div>
    )
}

export default Resume
