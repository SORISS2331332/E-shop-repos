'use client'
import { useState } from 'react';
import styles from '../../styles/styles.module.css';
import LivraisonOption from '../../components/checkout/LivraisonOption';
import { Button, Container } from 'react-bootstrap'
import { useRouter } from 'next/navigation';
import StepIndicator from '@/app/components/checkout/StepIndicator';
import AuthGuard from '@/app/context/AuthGard';


const LivraisonPage = () => {
    const router = useRouter();
    const [selected, setSelected] = useState('standard')

    const options = [
        { id: 'standard', label: 'Gratuite', description: 'Livraison régulière', date: '29 Mai 2025' },
        { id: 'express', label: '$8.50', description: 'Livraison rapide', date: '26 Mai 2025' },
        { id: 'pickup', label: 'Programmée', description: 'Ramassage', date: 'Choisir une Date' },
    ]
    const handleClick = () => {  
        router.push('/checkout/paiement');
    };

    
    return (
        <AuthGuard allowedRoles={['Client']}>
            <main>
                <Container className={styles.DeliveryContainer}>
                    <StepIndicator currentStep={2} />

                    <h5 className="mt-5 fw-bold">Méthode de livraison</h5>

                    <div className="mt-3">
                        {options.map(opt => (
                        <LivraisonOption key={opt.id} option={opt} selected={selected} setSelected={setSelected} />
                        ))}
                    </div>

                    <div className="d-flex justify-content-end mt-5 gap-3">
                        <Button onClick={() => router.back()} variant="outline-dark">Retour</Button>
                        <Button onClick={handleClick} variant="dark">Suivant</Button>
                    </div>
                </Container>
            </main>
        </AuthGuard>
    )
}

export default LivraisonPage
