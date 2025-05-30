'use client';
import { useEffect, useState } from 'react';
import styles from '../../styles/styles.module.css';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import AuthGuard from '@/app/context/AuthGard';
import Loading from '@/app/components/Loading';


export default function SuccessPage() {
    const { user } = useAuth(); 
    const [paymentDetails, setPaymentDetails] = useState({});
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState([]);
    // Fonction pour formater le montant
    const separateurMilliers = (nombre) => {
        return nombre.toLocaleString('fr-FR', {
            style: 'currency',
            currency: 'CAD',
        });
    }

    // Fonction pour formater la date
    const formatDate = (dateInput) => {
        const date = new Date(dateInput);
        return date.toISOString().split('T')[0];
    };

    const getArticlesParCommande = async (idCommande) => {
        try {
            // 1. Récupérer les entrées de la table commandeArticle liées à cette commande
            const res1 = await fetch(`https://eshop-api-web.up.railway.app/api/CommandeArticles/${idCommande}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
            });
            const responseJson = await res1.json();

            // Vérifier si la réponse est un tableau ou un objet
            const itemsCommande = Array.isArray(responseJson) ? responseJson : [responseJson]; 

            if (!Array.isArray(itemsCommande)) {
                throw new Error("la réponse n'est pas une liste d'articles.");
            }
    
            // 2. Récupérer les infos détaillées dans articles
            const articlesPromises = itemsCommande.map(item => 
                fetch(`https://eshop-api-web.up.railway.app/api/Articles/${item.idArticle}`)
                    .then(res => res.json())
                    .then(article => ({
                        ...article,
                        quantite: item.quantite,
                        total:  article.prix * item.quantite
                    }))
            );
    
            const articlesAvecQuantite = await Promise.all(articlesPromises);
            setArticles(articlesAvecQuantite); 
        } catch (err) {
            console.error('Erreur récupération des articles de commande:', err);
            return [];
        }
    };
    


    // Fonction pour récupérer les informations de paiement
    const fetchPaymentDetails = async () => {
        
        try {
            const paymentResponse = await fetch(`https://eshop-api-web.up.railway.app/api/Commandes/utilisateur/${user?.id}/derniere`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
            });
            const data = await paymentResponse.json();
            if (paymentResponse.ok) {
                setPaymentDetails(data);
                getArticlesParCommande(data.id);
            } else {
                console.error('Erreur lors de la récupération des détails de paiement');
            }
        } catch (error) {
            console.error('Erreur de récupération:', error);
        }

        setLoading(false);
    };

    //Fonction pour télécharger le récu de paiement
    const handleDownloadReceipt = async () => {
        const res = await fetch('/api/generate-receipt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: user,
                commande: paymentDetails,     
                articles: articles,     
            }),
        });
        if (!res.ok) {
            const err = await res.json();
            console.error('Erreur lors de la génération du reçu :', err);
            alert('Erreur : ' + err.error);
            return;
        }
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
    
        const a = document.createElement('a');
        a.href = url;
        a.download = 'recu-paiement.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
    };
    
    
    useEffect(() => {
        if (user?.id) {
            fetchPaymentDetails();
        }
    }, [user]);

    if (loading) return <Loading />

    return (
        <AuthGuard allowedRoles={['Client']}>
            {
            (!paymentDetails || Object.keys(paymentDetails).length === 0) ? (
                <div className={styles.successPage}>
                    <h1 className="text-danger">⚠️ Aucun paiement trouvé</h1>
                    <p>Nous n'avons pas pu récupérer les détails de votre dernière commande.</p>
                    <button className="btn btn-outline-dark" onClick={() => router.push('/account')}>
                        Voir mes commandes
                    </button>
                </div>
            ):
            (
                <div className={styles.successPage}>
                    <h1 className="text-success">✅ Paiement réussi</h1>
                    <p>Merci pour votre achat {user?.nom + ' ' + user?.prenom + ' !'}</p>
                    <p>Montant total payé : <span className='fw-bold'>{separateurMilliers(paymentDetails.montant)} </span> </p>
                    <p>Livraison prévue : {formatDate(paymentDetails.tempsLivraison)}</p>
                    
                    <div className=" d-flex gap-2 ">
                        <button 
                            className="btn btn-outline-dark"
                            onClick={() => router.push('/user')}
                        >
                            Voir mes commandes
                        </button>
                        <button 
                            className="btn btn-outline-success"
                            onClick={handleDownloadReceipt}
                        >
                            Télécharger le reçu
                        </button>
                    </div>
                </div>
            ) 
            }
        </AuthGuard>
    );
}
