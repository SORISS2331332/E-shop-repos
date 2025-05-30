"use client";
import { useCart } from '@/app/context/CartContext';
import ArticleFavoris from '../ComposantFavoris/ArticleFavoris';
import styles from '../../styles/styles.module.css';

export default function ListeFavoris() {
  const { favoris } = useCart();


  return (
    <>
      {favoris && favoris.length > 0 ? (
        <div className={styles.Container + " container"}>
          <div className="row">
            {favoris.map((favori) => (
              <ArticleFavoris
                key={favori.id}
                productId={favori.articleId}
                favoriId={favori.id}
              />
            ))}
          </div>
        </div>
      ) : (
            <div className={styles.Container + " container"} >
                <h2 className="text-center">Vous n'avez aucun article dans vos favoris.</h2>
            </div>
      )}
    </>
  );
}
