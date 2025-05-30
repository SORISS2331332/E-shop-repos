'use client';

import styles from '../../styles/styles.module.css';
import { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import ArticleCard from './ArticleCard';
import Loading from '../Loading';
    

export default function ArticlesList({ articles, categorieId }) {
    const [voirPlus, setVoirPlus] = useState(false);
    const [filtreActif, setFiltreActif] = useState(''); 
    const [articlesFiltresVentes, setArticlesFiltresVentes] = useState([]);
    const [articlesFiltresNouveautes, setArticlesFiltresNouveautes] = useState([]);
    const [categorie, setCategorie] = useState(null);
    const topRef = useRef(null);

    const handleVoirPlus = () => {
        if (voirPlus && topRef.current) {
            topRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        setVoirPlus(!voirPlus);
    };

    const getcategorie = async () => {
        try {
            if(categorieId !== 0) {
                const response = await fetch('https://eshop-api-web.up.railway.app/api/Categories/' + categorieId);
                const data = await response.json();
                setCategorie(data);
            }
            else{
                setCategorie('');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    const fetchArticlesNouveautes = async () => {
        try {
            const response = await fetch('https://eshop-api-web.up.railway.app/api/Articles/nouveautes');
            const data = await response.json();
            setArticlesFiltresNouveautes(data);
        } catch (error) {
            console.error('Error fetching articles:', error);
        }
    };
    const fetchArticlesVentes = async () => {
        try {
            const response = await fetch('https://eshop-api-web.up.railway.app/api/Articles/les-plus-vendus');
            const data = await response.json();
            setArticlesFiltresVentes(data);
        } catch (error) {
            console.error('Error fetching articles:', error);
        }
    };

    useEffect(() => {
        fetchArticlesNouveautes();
        fetchArticlesVentes();
        getcategorie();
        

    }, [categorieId]);
    const handleFiltre = (filtre) => {
        setFiltreActif(filtre);
        setVoirPlus(false); 
    };

    let articlesAffiches;
    if (filtreActif === '') {
        articlesAffiches = voirPlus ? articles : articles.slice(0, 12);
    } else if (filtreActif === 'ventes') {
        articlesAffiches = articlesFiltresVentes;
    } else if (filtreActif === 'nouveautes') {
        articlesAffiches = articlesFiltresNouveautes;
    }

    return (

        <>
        {
            articles ? (
                articlesAffiches.length > 0 ? (
                    <section className={styles.section } ref={topRef}>
                        <div className={styles.options}>
                            <div
                                className={filtreActif === '' ? styles.active : ''}
                                onClick={() => handleFiltre('')}
                                style={{ cursor: 'pointer' }}
                            >
                                <h6>{categorie ? `${categorie.nom}` : 'Tous nos produits'} </h6>
                            </div>
                            <div
                                className={filtreActif === 'ventes' ? styles.active : ''}
                                onClick={() => handleFiltre('ventes')}
                                style={{ cursor: 'pointer' }}
                            >
                                <h6>Meilleures ventes </h6>
                            </div>
                            <div
                                className={filtreActif === 'nouveautes' ? styles.active : ''}
                                onClick={() => handleFiltre('nouveautes')}
                                style={{ cursor: 'pointer' }}
                            >
                                <h6>Nouvel arrivage</h6>
                            </div>
                        </div>

                        <div className='row'>
                            {articlesAffiches.map((product, index) => (

                                <ArticleCard key={index} product={product} estDisponible={product.statut === 'Disponible' && product.quantite > 0 } />
                            ))}

                            {((articlesAffiches.length > 12 && (filtreActif === 'ventes' || filtreActif === 'nouveautes')) || (filtreActif === '' &&  articles.length > 12) ) && (
                                <div className='d-flex justify-content-end'>
                                    <button className={styles.boutonVoirPlus} onClick={handleVoirPlus}>
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
                            )}
                        </div>
                    </section>
                ) : (
                    <section className={styles.section}>
                        <div className='row'>
                            <div className='col-12 text-center'>
                                <h3>Aucun produit disponible</h3>
                            </div>
                        </div>
                    </section>
                )
            ): (
                <Loading />
            )
        }
        </>
    );
}
