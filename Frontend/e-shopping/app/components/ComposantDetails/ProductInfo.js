"use client"

import { useState, useEffect } from "react";
import { CiDeliveryTruck } from "react-icons/ci";
import { IoShieldCheckmarkOutline, IoStorefrontOutline  } from "react-icons/io5";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from '@/app/context/AuthContext';
import Loading from "../Loading";

export default function ProductInfo(props) {
  const [article, setArticle] = useState({});
  const { AddToCart } = useCart();
  const { AddToWishlist } = useCart();
  const { user } = useAuth();


  useEffect(() => {
    fetch("https://eshop-api-web.up.railway.app/api/Articles/" + props.id) 
      .then((response) => response.json())
      .then((data) => setArticle(data))
      .catch((error) => {
        console.error("Erreur lors du chargement des blogs:", error);
        });
  }, []);

    return (
      <>
      
        {(article.id) ?
        <div>
        <h1 className="fw-bold">{article.nom}</h1>
        <h2 className="text-black">${article.prix}<small className="text-muted text-decoration-line-through px-4" style={{ textDecoration: 'line-through', opacity: 0.5 }}>${article.prix+100}</small></h2>
        <p className="mt-3 text-muted" style={{ textAlign: "justify" }}>
          {article.description}
        </p>
        <br /><br />
        <div className="d-flex gap-2 my-3">
          <button className="btn btn-outline-dark w-100" onClick={() => {if(user){AddToWishlist(user.id, article)} else{alert("Veuillez vous connecter pour ajouter un article au panier.")}}}>Ajouter à la liste de souhait</button>
          <button className="btn btn-dark w-100" onClick={() => {if(user){AddToCart(user.id, article, 1)} else{alert("Veuillez vous connecter pour ajouter un article au panier.")}}}>Ajouter au panier</button>
        </div>
        <div className="d-flex gap-3 text-muted mt-2">
          {/* Livraison */}
          <div className="d-flex align-items-center w-100">
            <div className="bg-light p-2 rounded-1">
              <CiDeliveryTruck size={24} />
            </div>
            <div className="d-flex flex-column">
              <div className="ms-2">
                <small>Livraison</small>
              </div>
              <div className="ms-2"><strong>1-2 jours</strong></div>
            </div>
          </div>

          {/* En Stock */}
          <div className="d-flex align-items-center w-100">
            <div className="bg-light p-2 rounded-1">
              <IoStorefrontOutline size={24} />
            </div>
            <div className="ms-2">
              <small>{article.quantite}  En stock</small>
            </div>
          </div>

          {/* Garantie */}
          <div className="d-flex align-items-center w-100">
            <div className="bg-light p-2 rounded-1">
              <IoShieldCheckmarkOutline size={24} />
            </div>
            <div className="d-flex flex-column">
              <div className="ms-2">
                <small>Garantie</small>
              </div>
              <div className="ms-2"><strong>1 an</strong></div>
            </div>
          </div>
        </div>
      </div>
      :
  
      <Loading/>
      }
      </>
    );
  }
  