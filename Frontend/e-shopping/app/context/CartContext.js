"use client"
import React, { useContext, createContext, useState, useEffect, useMemo, use } from 'react';
import { useAuth } from './AuthContext';
export const CartContext = createContext();
export const useCart = () => useContext(CartContext);
export function CartProvider({ children }) {
    const [panier, setPanier] = useState([]);
    const { user } = useAuth();
    const [favoris, setFavoris] = useState([]); 

    const refreshPanier = async () => {
        if (!user) return;

        try {
            const res = await fetch(`https://eshop-api-web.up.railway.app/api/Paniers/utilisateur/${user.id}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
            });
            if (!res.ok) {
                if (res.status === 404) {
                    setPanier([]); 
                    return;
                }
                throw new Error("Erreur serveur lors de la récupération du panier");
            }

            const data = await res.json();
            setPanier(data);
        } catch (error) {
            console.error("Erreur lors du fetch du panier :", error.message);
        }
    };
    const refreshFovoris = async () => {
            if (!user) return;
            if (user) {
                const res = await fetch(`https://eshop-api-web.up.railway.app/api/Favoris/utilisateur/${user.id}`,{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user?.token}`
                    },
                });
                const data = await res.json();
                setFavoris(data);
            }
    };
    useEffect(() => {
        
        if(user && user.role !== "Admin"){
            refreshPanier();
            refreshFovoris();
        }
    }, [user]);

    // Fonctions pour mettre à jour la quantité d'un article
    const updateQuantity = async (id, quantite) => {
        try {
            const updatedPanier = panier.map(item =>
                item.id === id ? { ...item, quantite } : { ...item }
            );
            setPanier([...updatedPanier]);
            const itemToUpdate = updatedPanier.find(item => item.id === id);
            const res = await fetch(`https://eshop-api-web.up.railway.app/api/Paniers/${id}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify(itemToUpdate),
            });
    
            if (!res.ok) {
                throw new Error("Échec de la mise à jour sur le serveur");
            }
            await refreshPanier();
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la quantité :", error);
            await refreshPanier();
        }
    };

    // Fonction pour supprimer un article
    const removeItem = async id => {
        const updatedPanier = panier.filter(item => item.id !== id);
        setPanier(updatedPanier);
        await fetch(`https://eshop-api-web.up.railway.app/api/Paniers/${id}`, { 
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user?.token}`
            }
        });
    };

    // Fonction pour supprimer un article du favoris
    const removeItemFavoris = async id => {
        const updatedFavoris = favoris.filter(item => item.id !== id);
        setFavoris(updatedFavoris);
        await fetch(`https://eshop-api-web.up.railway.app/api/Favoris/${id}`, { 
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user?.token}`
            }
        });
    };

    // Calcul du nombre total d'articles (en additionnant les quantités)
    const totalItems = useMemo(() => {
        if (!panier) return 0;
        return panier.reduce((acc, item) => acc + item.quantite, 0);
    }, [panier]);

    const totalItemsFavoris = useMemo(() => {
        if (!favoris) return 0;
        return favoris.length;
    }, [favoris]);
    
    // Fonction pour vider le panier
    const clearCart = async () => {
        setPanier([]);
        const res = await fetch(`https://eshop-api-web.up.railway.app/api/Paniers/vider/${user.id}`, { 
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user?.token}`
            } 
        });	
        if (!res.ok) {
            throw new Error("Échec de la mise à jour sur le serveur");
        }
    };

    // Fonction pour ajouter un article au panier
    const AddToCart = async (userId, product, quantite) => {
        try {
            const articleData = {
                articleId: product.id,
                quantite: quantite
            };

            // Appel à l'API pour ajouter ou mettre à jour le produit dans le panier
            const res = await fetch(`https://eshop-api-web.up.railway.app/api/Paniers/utilisateur/${userId}/ajouter-panier`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user?.token}`
                },
                body: JSON.stringify(articleData),
            });

            const contentType = res.headers.get("content-type");

            let errorMessage = "Une erreur est survenue.";

            if (!res.ok) {
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await res.json();
                    errorMessage = errorData.message || JSON.stringify(errorData);
                } else {
                    const errorText = await res.text();
                    errorMessage = errorText;
                }
                alert(errorMessage);
                return;
            }
            refreshPanier();
        } catch (error) {
            console.error("Erreur ajout panier :", error);
        }
    };



    const AddToWishlist = async (userId, product) => {
    try {
        const response = await fetch("https://eshop-api-web.up.railway.app/api/Favoris", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user?.token}`
            },
            body: JSON.stringify({ utilisateurId: userId, articleId: product.id })
        });

        if (response.status === 409) {
            alert("Cet article est déjà dans vos favoris");
            return;
        }

        if (!response.ok) {
            throw new Error("Erreur lors de l'ajout aux favoris");
        }

        refreshFovoris();
    } catch (error) {
        console.error("Erreur ajout favoris :", error);
    }
};



    return (
        <CartContext.Provider value={{ panier, 
        updateQuantity, removeItem, totalItems, 
        clearCart, AddToCart,  
        favoris, AddToWishlist, removeItemFavoris, totalItemsFavoris}}>
            {children}
        </CartContext.Provider>
    );
}

