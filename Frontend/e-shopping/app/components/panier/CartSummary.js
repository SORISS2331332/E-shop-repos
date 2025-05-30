"use client";
import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import styles from "../../styles/styles.module.css";
import Loading from "../Loading";
const CartSummary =  () => {
    const router = useRouter();
    const { panier } = useCart();
    const [articles, setArticles] = useState([]);
    const { user } = useAuth();
    const fetchArticles = async () => {
        try {
            const response = await fetch(`https://eshop-api-web.up.railway.app/api/Paniers/articles/${user.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
            });
            if(response.ok) {
                const data = await response.json();
                setArticles(data);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des articles:', error);
        }
    };
    useEffect(() => {
        if(user.id) fetchArticles();
    }, [user.id]);
    
    const getTotal = () => {
        const totalPrix=  panier.reduce((acc, item) => {
        const article = articles.find(a => a.articleId == item.articleId);
         return acc + (article?.prix || 0) * item.quantite;
        }, 0);
        return totalPrix;
    };

    const sousTotal = getTotal();
    const taxes = +(sousTotal * 0.15).toFixed(2);
    const livraison = 0;
    const total = (sousTotal + taxes + livraison);
    
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

    return (
        <>
        {
            articles ? (
                <div className={styles.cartSummary + " card p-4"}>
                    <h5 className="fw-bold mb-3">Commande</h5>
                    <div className="d-flex justify-content-between mb-2"><span>Sous-total</span><span>{sousTotalAffiche}</span></div>
                    <div className="d-flex justify-content-between mb-2 text-muted"><span>Taxes</span><span>{taxesAffiche}</span></div>
                    <div className="d-flex justify-content-between mb-3 text-muted"><span>Livraison</span><span>{livraison}</span></div>
                    <div className="d-flex justify-content-between fw-bold fs-5"><span>Total</span><span>{totalAffiche}</span></div>
                    <button 
                        onClick={() => router.push('/checkout/adresse')} 
                        className="btn btn-dark w-100 mt-4">
                        Valider
                    </button>
                </div>
            ):
            (
                <Loading />
            )
        }
        </>
    );
};

export default CartSummary;
