'use client';
import { useState, useEffect } from 'react';
import styles from '../../styles/styles.module.css';
import Link from 'next/link';
import { Col } from 'react-bootstrap';
import { useAuth } from "@/app/context/AuthContext"
import { useCart } from '@/app/context/CartContext';
import { useRouter } from 'next/navigation';
import {
  FaShoppingCart,
  FaTrash,
  FaStar
} from 'react-icons/fa';
import $ from 'jquery';

export default function ArticleFavoris({ productId, favoriId }) {
  const router = useRouter();
  const { user } = useAuth();
  const { AddToCart } = useCart();
  const { removeItemFavoris } = useCart();
  const [image, setImage] = useState('');
  const [product, setProduct] = useState(null);

  const getProduct = async () => {
    try {
      const res = await fetch(`https://eshop-api-web.up.railway.app/api/Articles/${productId}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du produit :", error);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      alert("Veuillez vous connecter pour ajouter un article au panier.");
      router.push('/connexion');
    } else {
      AddToCart(user.id, product, 1);
    }
  };


  const getImage = async () => {
    try {
      const res = await fetch(`https://eshop-api-web.up.railway.app/api/Images/${productId}`);
      if (res.ok) {
        const data = await res.json();
        setImage(data[0].lien);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'image :", error);
    }
  };

  const handleDeleteClick = () => {
        const $dialog = $('<div>Êtes-vous sûr de vouloir supprimer cet article ?</div>').dialog({
            modal: true,
            title: "Confirmation de suppression",
            buttons: {
                "Oui": function () {
                    removeItemFavoris(favoriId);
                    $dialog.dialog("close");
                },
                "Non": function () {
                    $dialog.dialog("close");
                }
            },
            close: function () {
                $dialog.remove();
            }
        });
    };

  useEffect(() => {

    if (typeof window !== "undefined") {
      import("jquery-ui-dist/jquery-ui.css"); // pour le style
      import("jquery-ui-dist/jquery-ui.js");
    }
    
    if (productId) {
      getProduct();
      getImage();
    }
  }, [productId]);

  return (
    <>
      {(product && image) ? (
        <Col xs={6} sm={6} md={4} lg={3} className="mb-4">
          <div className={styles.card + ' bg-light'}>
            <div className='d-flex justify-content-end'>
              <button className={styles.iconButton} onClick={() => handleDeleteClick()}>
                <FaTrash color="gray" />
              </button>
            </div>

            <Link href={`/details/${product.id}`} className={styles.linkArticle}>
              <div className={styles.imageContainer}>
                {product.badge && (
                  <div className={`${styles.badge} ${product.badge === 'NEW' ? styles.new : styles.discount}`}>
                    {product.badge}
                  </div>
                )}
                <img src={image} alt={product.nom} className={styles.image} />
              </div>
              <div className={styles.details}>
                <h5 className={styles.name}>{product.nom}</h5>
                <div className={styles.priceRow}>
                  <span className={styles.price}>${product.prix}</span>
                </div>
                <div className={styles.rating}>
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} color="#FFAD33" size={12} />
                  ))}
                  <span className={styles.reviews}>
                    (En stock)
                  </span>
                </div>
              </div>
            </Link>

            <button className={styles.cartBtn} onClick={handleAddToCart}>
              <FaShoppingCart style={{ marginRight: '8px' }} /> Ajouter au panier
            </button>
          </div>
        </Col>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}
