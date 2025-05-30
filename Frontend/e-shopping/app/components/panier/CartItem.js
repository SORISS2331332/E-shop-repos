"use client";
import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { FaTrash } from "react-icons/fa";
import styles from   "../../styles/styles.module.css";
import $ from "jquery";
const CartItem = ({ item }) => {
    const [article, setArticle] = useState(null);
    const { updateQuantity, removeItem } = useCart();
    const [image, setImage] = useState('');

    const sousTotal = (article?.prix || 0) * item.quantite;
    const sousTotalAffiche = sousTotal.toLocaleString('fr-FR', {
        style: 'currency',
        currency: 'CAD',
    });

    const getImage = async () => {
        try {
            const res = await fetch(`https://eshop-api-web.up.railway.app/api/Images/${item.articleId}`);
            if (res.ok) {
                const data = await res.json();
                setImage(data[0].lien);
            }
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
            alert("Une erreur est survenue.");
        }
    }

    const getArticle = async () => {
        try {
            const res = await fetch(`https://eshop-api-web.up.railway.app/api/Articles/${item.articleId}`);
            if (res.ok) {
                const data = await res.json();
                setArticle(data);
            }
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
            alert("Une erreur est survenue.");
        }
    }
    useEffect(() => {
        if (typeof window !== "undefined") {
            import("jquery-ui-dist/jquery-ui.css");
            import("jquery-ui-dist/jquery-ui.js");
        }

        if (item.articleId) {
            getImage();
            getArticle();
        }

    }, [item.articleId]);

    const handleDeleteClick = () => {
        const $dialog = $('<div>Êtes-vous sûr de vouloir supprimer cet article ?</div>').dialog({
            modal: true,
            title: "Confirmation de suppression",
            buttons: {
                "Oui": function () {
                    removeItem(item.id);
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

    if (!article) return null;

    return (
        <div className={styles.cartItem + " d-flex align-items-center justify-content-between "}>
        <div className="d-flex align-items-center">
            <img src={image} className={styles.cartImg + " img-thumbnail"} alt={article.nom} />
            <div className="ms-3">
            <div className="fw-bold">{article.nom}</div>
            <div className="text-muted">#{item.articleId}</div>
            </div>
        </div>
        <div className="d-flex align-items-center">
            <button className="btn btn-light" onClick={() => updateQuantity(item.id, item.quantite - 1)} disabled={item.quantite <= 1}>−</button>
            <span className="mx-2">{item.quantite}</span>
            <button className="btn btn-light" onClick={() => updateQuantity(item.id, item.quantite + 1)} disabled={item.quantite >= article.quantite}>+</button>
        </div>
        
        <div className="fw-bold">${sousTotalAffiche}</div>
        <button className="btn btn-outline-light text-danger" onClick={() => handleDeleteClick()}><FaTrash /></button>
        </div>
    );
};

export default CartItem;
