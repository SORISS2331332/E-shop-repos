'use client'
import { useEffect, useState } from 'react';
import StockRow from './StockRow';

export default function StockTable({searchTerm}) {
  const [articles, setArticles] = useState([]);
  const [images, setImages] = useState({}); 

  const getImage = async (id) => {
    try {
      const res = await fetch(`https://eshop-api-web.up.railway.app/api/Images/${id}`);
      if (res.ok) {
        const data = await res.json();
        const imageUrl = data.length > 0 ? data[0].lien : null;

        // Met à jour l'image correspondante
        setImages(prev => ({
          ...prev,
          [id]: imageUrl
        }));
      }
    } catch (error) {
      console.error("Erreur lors de la récupération d'image :", error);
    }
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('https://eshop-api-web.up.railway.app/api/Articles');
        const data = await response.json();
        setArticles(data);
        data.forEach(article => getImage(article.id));
      } catch (error) {
        console.error("Erreur lors de la récupération des articles :", error);
      }
    };

    fetchArticles();
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`https://eshop-api-web.up.railway.app/api/Articles/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statut: 'indisponible' }),
      });
  
      // Met à jour localement les articles (optionnel mais conseillé pour UI immédiate)
      setArticles(prev =>
        prev.map(article =>
          article.id === id ? { ...article, statut: 'indisponible' } : article
        )
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut :', error);
    }
  };
  

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h3 className="card-title mb-4">Stock</h3>
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>Image</th>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Prix</th>
              <th>Quantité</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {articles
              .filter(article =>
                article.statut !== 'indisponible' &&
                article.nom.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(article => (
                <StockRow
                  key={article.id}
                  article={article}
                  monImage={images[article.id] || null}
                  onDelete={handleDelete}
                />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
