"use client";

import { useState, useEffect } from 'react';
import {
  FaStar,
} from 'react-icons/fa';

export default function ReviewsSummary(props) {
  const [notes, setNotes] = useState([]);

  const fetchAvis = async () => {
    try {
      const response = await fetch('https://eshop-api-web.up.railway.app/api/Avis/article/' + props.articleId);
      if(response.ok){
        const data = await response.json();
        setNotes(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des avis:', error);
    }
  }
  useEffect(() => {
    if (props.articleId) {
      fetchAvis();
    }
  }, [props.articleId, props.refreshTrigger]);

  const nbNote = notes.length;

  const nbNote5 = notes.filter(note => note.note === 5).length;
  const nbNote4 = notes.filter(note => note.note === 4).length;
  const nbNote3 = notes.filter(note => note.note === 3).length;
  const nbNote2 = notes.filter(note => note.note === 2).length;
  const nbNote1 = notes.filter(note => note.note <= 1).length;

  const pourcentageNote5 = (nbNote5 / nbNote) * 100;
  const pourcentageNote4 = (nbNote4 / nbNote) * 100;
  const pourcentageNote3 = (nbNote3 / nbNote) * 100;
  const pourcentageNote2 = (nbNote2 / nbNote) * 100;
  const pourcentageNote1 = (nbNote1 / nbNote) * 100;

  const tabPourcentageNote = [pourcentageNote5, pourcentageNote4, pourcentageNote3, pourcentageNote2, pourcentageNote1];

  const moyenne = notes.reduce((total, note) => total + note.note, 0) / notes.length;


  return (
    <div className="my-5">
      <h4>Notes</h4>
      <div className="d-flex align-items-center">
        <div className="text-center me-4">
          <h2>{moyenne ? moyenne.toFixed(1) : '5.0'}</h2>
          {[1, 2, 3, 4, 5].map((i) => (
              <FaStar key={i} color={i <= Math.round(moyenne) ? '#FFAD33' : 'gray'} size={12} />
          ))}
          < br />
          <small className="text-muted">de {nbNote} notes</small>
        </div>
        <div className="flex-grow-1">
          {['Excellent', 'Bon', 'Moyen', 'Assez moyen', 'Mauvais'].map((label, idx) => (
            <div key={idx} className="d-flex align-items-center mb-2">
              <div className="w-25" style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>{label}</div>
              <div className="progress w-75" style={{ height: '4px' }}>
                <div className="progress-bar bg-warning" style={{ width: `${tabPourcentageNote[idx]}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
