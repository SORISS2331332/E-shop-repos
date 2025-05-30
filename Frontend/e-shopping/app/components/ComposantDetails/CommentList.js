"use client";

import { useState, useEffect, useRef } from 'react';
import Comment from './Comment';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function CommentsList(props) {
  const [comments, setComments] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [voirPlus, setVoirPlus] = useState(false);
  const topRef = useRef(null);
  

  const afficherComments = voirPlus ? comments : comments.slice(0, 4);

  const AffichageOptions = () => {
    if (voirPlus && topRef.current) {
        topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    setVoirPlus(!voirPlus);
    console.log(voirPlus);
};
const fetchComments = async () => {
  try {
    const response = await fetch(`https://eshop-api-web.up.railway.app/api/Avis/article/${props.articleId}`);
    if(response.ok){
      const data = await response.json();
      setComments(data);
    }
  } catch (error) {
    console.error("Erreur lors du chargement des avis:", error);
  }
};


  useEffect(() => {
    if (props.articleId) {
      fetchComments();
    }
  }, [ props.articleId, props.refreshTrigger]);

  return (
    <div className="my-5">
      {/* Liste des commentaires */}
      {afficherComments.map((comment) => (
        <Comment key={comment.id} 
          nom={comment.utilisateurDto.nom +" "+comment.utilisateurDto.prenom}
          date={new Date(comment.date)}
          rating={comment.note}
          text={comment.commentaire}
        />
      ))}

      {/* Bouton "Voir plus" */}

      {comments.length > 4 && (
          <div className='d-flex justify-content-center'>
              <button className="btn btn-outline-secondary" onClick={AffichageOptions}>
                  {voirPlus ? (
                      <>
                          Voir moins <FaChevronUp style={{ marginLeft: '8px' }} />
                      </>
                  ) : (
                      <>
                          Voir tous <FaChevronDown style={{ marginLeft: '8px' }} />
                      </>
                  )}
              </button>
          </div>
          )
      }
    </div>
  );
}
