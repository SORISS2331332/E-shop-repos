
import styles from '../../styles/styles.module.css';
import Image from 'next/image';
import { Button } from 'react-bootstrap';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function FooterArticleCard({ product}) {

    const router = useRouter();
    const { user } = useAuth();
    const { AddToCart } = useCart();
    const [image, setImage] = useState('');
    
    const getImage = async () => {
        try {
            const res = await fetch(`https://eshop-api-web.up.railway.app/api/Images/${product.id}`);
            if(res.ok){
                const data = await res.json();
                setImage(data[0].lien);
            }
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
            alert("Une erreur est survenue.");
        }
    };

    // Fonction pour ajouter un article au panier
    const handleAddToCart = () => {
        if (!user) {
            alert("Veuillez vous connecter pour ajouter un article au panier.");
            router.push('/connexion');
        }else{
            AddToCart(user.id, product, 1);
        }
        
    };

    useEffect(() => {
        getImage();
    }, []);
    return (
            <>
            {
                image && (
                    <div className={`${styles.cardFooter} text-center p-4`}>
                        <Link href={`/details/${product.id}`} className={styles.linkArticle} >
                            <Image src={image} alt={product.nom} width={160} height={160} className="mx-auto mb-3" />
                            <h5 className="fw-semibold">{product.nom}</h5>
                            <p className=" small">{product.description}</p>
                        </Link>
                        <Button onClick={handleAddToCart} variant="outline-dark" className="mt-2">Ajouter au Panier</Button>
                    </div>
                )
            }
            </>
    );
}
