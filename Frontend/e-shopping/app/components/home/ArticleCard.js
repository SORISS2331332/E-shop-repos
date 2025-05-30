'use client';
import {  useState, useEffect, use } from 'react';
import styles from '../../styles/styles.module.css';
import Link from 'next/link';
import {Col} from 'react-bootstrap';
import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';
import { useRouter } from 'next/navigation';
import {
    FaShoppingCart,
    FaHeart,
    FaRegHeart,
    FaStar,
    FaBan 
} from 'react-icons/fa';
import Loading from '../Loading';

export default function ArticleCard({ product, estDisponible }) {
    const router = useRouter();
    const { user } = useAuth();
    const { AddToCart } = useCart();
    const { AddToWishlist } = useCart();
    const { removeItemFavoris } = useCart();
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [image, setImage] = useState('');
    const [notes, setNotes] = useState([]);

    // Fonction pour ajouter un article au panier
    const handleAddToCart = () => {
        if (!user) {
            alert("Veuillez vous connecter pour ajouter un article au panier.");
            router.push('/connexion');
        }else{
            AddToCart(user.id, product, 1);
        }
        
    };

  
    const getImage = async () => {
        try {
            const res = await fetch(`https://eshop-api-web.up.railway.app/api/Images/${product.id}`);
            if(res.ok){
                const data = await res.json();
                setImage(data[0].lien);
            }
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
        }
    };

    const checkIfInWishlist = async () => {
        if (!user || !product) return;
        try {
            const res = await fetch(`https://eshop-api-web.up.railway.app/api/Favoris/utilisateur/${user.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${user?.token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                const exists = data.some(f => parseInt(f.articleId) === parseInt(product.id));
                setIsInWishlist(exists);
            }
        } catch (err) {
            console.error("Erreur lors de la vérification du favori :", err);
        }
    };
    

    const getFavoriteId = async (userId, articleId) => {
    try {
        const res = await fetch(`https://eshop-api-web.up.railway.app/api/Favoris/utilisateur/${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${user?.token}`
            }
        });
        if (!res.ok) {
            console.error("Erreur HTTP :", res.status);
            return null;
        }
        const data = await res.json();
        const favori = data.find(f => parseInt(f.articleId) === parseInt(articleId));
        return favori?.id;
    } catch (err) {
        console.error("Erreur récupération ID favori :", err);
        return null;
    }
};

    
    

    // Fonction pour ajouter un article aux favoris
    const changeColor = async () => {
        if (!user) {
            alert("Veuillez vous connecter pour gérer vos favoris.");
            router.push('/connexion');
            return;
        }
    
        try {
            if (isInWishlist) {
                const favoriteId = await  getFavoriteId(user.id, product.id);
                await removeItemFavoris(favoriteId);  
                setIsInWishlist(false);
            } else {
                await AddToWishlist(user.id, product);
                setIsInWishlist(true);
            }
        } catch (err) {
            console.error("Erreur lors de la gestion des favoris :", err);
        }
    };
    const getNotes = async () => {
        try {
            const res = await fetch(`https://eshop-api-web.up.railway.app/api/Avis/article/${product.id}`);
            if (res.ok) {
                const data = await res.json();
                setNotes(data);
            }
        } catch (err) {
            console.error("Erreur lors de la récupération des notes :", err);
        }
    };

    useEffect(() => {
        if (product) {
            getImage();
            getNotes();
        }
        if (product?.id && user?.id) {
            checkIfInWishlist();
        }
    }, [product?.id, user?.id]);

    const moyenne = parseInt(
        notes.reduce((acc, note) => acc + note.note, 0) / notes.length, 10
    );
    return (
            <>
            {
                (product && image ) ? (
                    <Col xs={6} sm={6} md={4} lg={3} className="mb-4">
                        <div className={styles.card + ' bg-light'} >
                            <div className='d-flex'>
                                <button className={styles.iconButton} onClick={changeColor}>
                                    { isInWishlist ? <FaHeart  color="#db4444" /> : <FaRegHeart />}
                                </button>
                            </div>
                            <Link prefetch={true} href={`/details/${product.id}`} className={styles.linkArticle} >
                                <div className={styles.imageContainer}>
                                    {product.badge && (
                                    <div className={`${styles.badge} ${product.badge === 'Nouveau' ? styles.new : styles.discount}`}>
                                        {product.badge}
                                    </div>
                                    )}
                                    <img src={image} alt={product.nom} className={styles.image} />
                                    
                                    
                                </div>
                                <div className={styles.details}>
                                    <h4 className={styles.name}>{product.nom}</h4>
                                    <h6 className={styles.categorie}>{product.categorie?.nom}</h6>
                                    <div className={styles.priceRow}>
                                        <span className={styles.price}>${product.prix}</span>
                                    </div>
                                    <div className={styles.rating}>
                                        {moyenne ? (
                                            <>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <FaStar
                                                        key={star}
                                                        color={star <= moyenne ? '#FFAD33' : '#ccc'}
                                                    />
                                                ))}
                                            </>
                                        ) : (
                                            <>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <FaStar key={star} color="#FFAD33" />
                                                ))}
                                            </>
                                        )}
                                        <span className={styles.reviews}>
                                            {estDisponible ? (
                                                '(En stock)'
                                            ) : (
                                                <><s>(En stock)</s></>
                                            )}
                                        </span>
                                    </div>
                                </div>
                                </Link>
                                {
                                    !estDisponible ? (
                                        <button className={styles.cartBtn} disabled>
                                            <FaBan style={{ marginRight: '8px' }} /> Rupture de stock
                                        </button>
                                    ):(
                                        <button className={styles.cartBtn} onClick={handleAddToCart}>
                                            <FaShoppingCart style={{ marginRight: '8px' }} /> Ajouter au panier
                                        </button>
                                    )
                                }
                                
                            
                        </div>
                    </Col>
                ):(
                    <Loading />
                )
            }
            </>
    );
}