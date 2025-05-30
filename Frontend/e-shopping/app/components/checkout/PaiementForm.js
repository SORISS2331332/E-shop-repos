"use client";
import { useRouter } from 'next/navigation'; // 'next/router' si tu es en pages router
import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Form, Button, Alert } from 'react-bootstrap';
import {useAuth} from "../../context/AuthContext";
import {useCart} from "../../context/CartContext";

const PaiementForm = ({ panierComplet }) => {
    const {clearCart, updateArticleQuantityInDB} = useCart();
    const {user} = useAuth();
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState('');
    const router = useRouter();



    const sousTotal = panierComplet.reduce((sum, a) => sum + (a.total || 0), 0)
    const taxes = +(sousTotal * 0.15).toFixed(2)
    const total = Math.round((sousTotal + taxes) * 100);
    let clientSecret = '';
    const PaymentCheckout = async () => {
        try {
            const response = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: total, items: panierComplet })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.error || 'Erreur API Stripe');
            }

            const data = await response.json();
            clientSecret = (data.clientSecret); 
        } catch (error) {
            setError('Erreur lors de l\'initialisation du paiement');
            console.error(error);
            return;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        await PaymentCheckout();
        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
            }
        });

        if (result.error) {
            setError(result.error.message);
        } 
        else if (result.paymentIntent.status === 'succeeded') 
        {
            try {
                const response = await fetch('https://eshop-api-web.up.railway.app/api/Commandes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        utilisateurId: user.id, 
                        date: new Date().toISOString(),
                        statut: 'En cours',
                        montant: total / 100, 
                        adresseLivraison: `${user.adresse.codeCivique} ${user.adresse.rue} ${user.adresse.ville} ${user.adresse.pays} ${user.adresse.codePostal}`, 
                        modeLivraison: 'Standard', 
                        tempsLivraison: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString() 
                    })
                });
    
                if (!response.ok) {
                    throw new Error('Erreur lors de l\'enregistrement de la commande');
                }
                
    
                const commande = await response.json();
                // Ajouter les articles de la commande
                for (let item of panierComplet) {
                    try{
                        await fetch('https://eshop-api-web.up.railway.app/api/CommandeArticles', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${user?.token}`
                        },
                        body: JSON.stringify({
                            idCommande: commande.id,
                            idArticle: item.articleId,
                            quantite: item.quantite
                        })
                    });
                    }
                    catch(err){
                        setError('Erreur lors de l\'enregistrement de la commande');
                        console.error(err);
                    }
                }
            } catch (err) {
                setError('Erreur lors de l\'enregistrement de la commande');
                console.error(err);
            }

            // Vider le panier
            await clearCart();

            // Rediriger vers la page de paiement réussi
            router.push('/checkout/successPayment');
        }
    };

    return (
        <Form  onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form.Group className="mb-3">
                <CardElement />
            </Form.Group>
            <button 
            className='btn btn-outline-dark me-3' 
            onClick={() => router.back()}
            >Retour</button>
            <Button type="submit" disabled={!stripe}>Payer</Button>
            
        </Form>
    );
};

export default PaiementForm;
