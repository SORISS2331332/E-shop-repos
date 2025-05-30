import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { amount, items } = await request.json();

    if (!amount || !items) {
        return NextResponse.json(
            { error: 'Amount and items are required' },
            { status: 400 }
        );
    }
    const panierSimplifie = items.map(item => ({
        id: item.id,
        quantite: item.quantite,
        total: item.total
    }));
    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'eur',
        metadata: {
            panier: JSON.stringify(panierSimplifie),
        },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
        console.error('Erreur Stripe:', err.message);
        return NextResponse.json(
            { error: 'Erreur de création du paiement' },
            { status: 500 }
        );
    }
}