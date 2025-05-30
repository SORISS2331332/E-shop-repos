'use client';

import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { useAuth } from '@/app/context/AuthContext';

export default function CommentForm({ articleId, utilisateurId, onCommentAdded }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [commentaire, setCommentaire] = useState('');
  const { user } = useAuth();

  const   handleComment = async function(e) {
    e.preventDefault();
    const note = rating;
  
    const newComment = {
      utilisateurId,
      articleId,
      date: new Date().toISOString(),
      note,
      commentaire,
    };
  
    try {
      const response = await fetch('https://eshop-api-web.up.railway.app/api/Avis/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newComment),
      });
  
      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout de l\'avis');
        console.error('Erreur lors de l\'ajout de l\'avis');
      }
      else{
        console.log('Avis ajouté avec succès');
        onCommentAdded();
      }
      
    } catch (error) {
      console.error('Erreur réseau :', error);
    }
  
    setRating(0);
    setHover(0);
    setCommentaire('');
  }

  return (
    <form onSubmit={handleComment} className="my-4">
      <textarea
        className="form-control mb-3"
        placeholder="Laissez un commentaire"
        rows="2"
        name="commentaire"
        required
        value={commentaire}
        onChange={(e) => setCommentaire(e.target.value)}
      ></textarea>

      <input type="hidden" name="articleId" value={articleId} />
      <input type="hidden" name="utilisateurId" value={utilisateurId} />
      <input type="hidden" name="note" value={rating} />

      {/* Système d'étoiles */}
      <div className="d-flex align-items-center mb-3">
        {[...Array(5)].map((_, index) => {
          const starValue = index + 1;
          return (
            <label key={index} style={{ cursor: 'pointer' }}>
              <input
                type="radio"
                name="rating"
                value={starValue}
                onClick={() => setRating(starValue)}
                style={{ display: 'none' }}
              />
              <FaStar
                size={28}
                color={starValue <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
                onMouseEnter={() => setHover(starValue)}
                onMouseLeave={() => setHover(0)}
              />
            </label>
          );
        })}
        <span className="ms-2">{rating} / 5</span>
      </div>

      <div className="d-flex justify-content-end">
        <button type="submit" className="btn btn-dark">Envoyer</button>
      </div>
    </form>
  );
}
