'use client';
import ArticleCard from '../home/ArticleCard';
import styles from '../../styles/styles.module.css';
import { useState, useRef } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Loading from '../Loading';

export default function ListArticles({ articles }) {
    const [voirPlus, setVoirPlus] = useState(false);
    const topRef = useRef(null);

    const handleVoirPlus = () => {
        if (voirPlus && topRef.current) {
            topRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        setVoirPlus(!voirPlus);
    };


    let articlesAffiches = voirPlus ? articles : articles.slice(0, 12);


    return (
        <>

        {
            articles ?(
                <section className={styles.section} ref={topRef}>
                    <div className='row'>
                        {
                            
                            articlesAffiches.length > 0 ? (
                                articlesAffiches.map((product, index) => (
                                    <ArticleCard key={index} product={product} estDisponible={product.quantite > 0 } />
                                ))
                            ) : (
                                <Loading />
                            )
                        
                        }

                        {(articles.length > 12 ) && (
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
            ):(
                <Loading />
            )
        }
        </>
    );
}
