'use client'
import Resume from '../../components/checkout/Resume';
import PaiementForm from '../../components/checkout/PaiementForm'
import styles from '../../styles/styles.module.css'
import { Container, Row, Col } from 'react-bootstrap'
import StepIndicator from '@/app/components/checkout/StepIndicator';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useCart } from '@/app/context/CartContext';
import { useState, useEffect, useMemo } from 'react';
import AuthGuard from '@/app/context/AuthGard';
import { useAuth } from '@/app/context/AuthContext';
import Loading from '@/app/components/Loading';



const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
const PaiementPage = () => {
    const { panier } = useCart();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState([]);

    const fetchArticles = async () => {
        try {
            const response = await fetch(`https://eshop-api-web.up.railway.app/api/Paniers/articles/${user.id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
                }
            );
            const data = await response.json();
            setArticles(data);
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (user) {
            fetchArticles();
        }
    }, [user]);

    const panierComplet = useMemo(() => {

        return panier
            .map(p => {
                const article = articles.find(a => a.articleId === p.articleId);
                if (!article) return null;
                return {
                    ...article,
                    quantite: p.quantite,
                    total: article.prix * p.quantite
                };
            })
            .filter(item => item !== null);
    }, [panier, articles]);

    return (

        <AuthGuard allowedRoles={['Client']}>
            <>
                {
                    panierComplet.length > 0 ? (
                        <main>
                            <Container className={styles.PayContainer }>
                                <StepIndicator currentStep={3} />
                                <hr />
                                <Elements stripe={stripePromise}>
                                    <Row>
                                        <Col md={5}>
                                            <Resume panierComplet={panierComplet} />
                                        </Col>
                                        <Col md={7}>
                                            <h5 className="m-4">Informations de paiement</h5>
                                            <PaiementForm panierComplet={panierComplet} />
                                            
                                        </Col>
                                    </Row>
                                </Elements>
                                
                            </Container>
                        </main>
                    ) : (
                        <main>
                            <Container className={styles.PayContainer}>
                                <StepIndicator currentStep={3} />
                                <Loading />
                            </Container>
                        </main>
                    )
                }
            </>
        </AuthGuard>
    )
}

export default PaiementPage
