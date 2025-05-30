"use client";
import { useState, useEffect } from "react";
import Loading from "../Loading";

export default function MyCommande() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const resCommandes = await fetch(`https://eshop-api-web.up.railway.app/api/Commandes/utilisateur/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${user?.token}`
          },
        });
        const commandesData = await resCommandes.json();
        if(!commandesData || commandesData.length === 0) {
          return
        }

        // Pour chaque commande, aller chercher les articles
        const commandesAvecArticles = await Promise.all(
          commandesData.map(async (commande) => {
            const resCommandeArticles = await fetch(`https://eshop-api-web.up.railway.app/api/CommandeArticles/${commande.id}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${user?.token}`
              },
            });
            if(!resCommandeArticles.ok) {
              return
            }
            const commandeArticles = await resCommandeArticles.json();
            

            // Récupérer les détails des articles
            const articles = await Promise.all(
              commandeArticles.map(async (ca) => {
                const resArticle = await fetch(`https://eshop-api-web.up.railway.app/api/Articles/${ca.idArticle}`);
                return await resArticle.json();
              })
            );

            return {
              ...commande,
              articles,
            };
          })
        );

        setCommandes(commandesAvecArticles);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des commandes :", error);
      }
    };

    if (userId) {
      fetchCommandes();
    }
  }, [userId]);

  if (loading) {
    return <Loading />
  }

  return (
    <div id="myCommande">
      <h4 className="mb-3 text-center">Mes Commandes</h4>
      {commandes.length === 0 ? (
        <p>Aucune commande trouvée.</p>
      ) : (
        commandes.map((commande) => (
          <div key={commande.id} className="mb-4 border rounded p-3">
            <h5>Commande #{commande.id} - {new Date(commande.date).toLocaleDateString()}</h5>
            <ul className="list-group">
              {commande.articles.map((article) => (
                <li key={`${commande.id}-${article.id}`} className="list-group-item d-flex justify-content-between">
                  <span>{article.nom}</span>
                  <span>$ {article.prix} CAD</span>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
