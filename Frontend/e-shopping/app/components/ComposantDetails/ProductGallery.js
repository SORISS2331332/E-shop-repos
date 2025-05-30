"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Loading from '../Loading';

export default function ProductGallery(props) {

  
  const [image, setImage] = useState({});
  const [mainImage, setMainImage] = useState("");

  const fetchimages = async () => {
    try {
      const res = await fetch(`https://eshop-api-web.up.railway.app/api/Images/${props.id}`);
      if (res.ok) {
        const data = await res.json();
        setImage(data);
        setMainImage(data[0].lien);
      }
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
    }
  };

  useEffect(() => {
    if (props.id) {
      fetchimages();
    }
  }, [props.id]);

  

  const handleThumbnailClick = (src) => {
    setMainImage(src);
  };

  // Fonction pour déterminer l'opacité des miniatures
  const getOpacity = (src) => {
    return src !== mainImage ? 0.5 : 1; 
  };

  return (
    <>
    {(image && mainImage) &&
      (
    <div className="d-flex">

      <div className="d-flex flex-column me-3">
        <a href="#" onClick={() => handleThumbnailClick(image[0].lien)}>
          <Image
            src={image[0].lien}
            alt="Miniature 1"
            width={60}
            height={60}
            className="mb-2"
            style={{ opacity: getOpacity(image[0].lien) }}
          />
        </a>
        <a href="#" onClick={() => handleThumbnailClick(image[1].lien)}>
          <Image
            src={image[1].lien}
            alt="Miniature 2"
            width={60}
            height={60}
            className="mb-2"
            style={{ opacity: getOpacity(image[1].lien) }}
          />
        </a>
        <a href="#" onClick={() => handleThumbnailClick(image[2].lien)}>
          <Image
            src={image[2].lien}
            alt="Miniature 3"
            width={60}
            height={60}
            className="mb-2"
            style={{ opacity: getOpacity(image[2].lien) }}
          />
        </a>
        <a href="#" onClick={() => handleThumbnailClick(image[3].lien)}>
          <Image
            src={image[3].lien}
            alt="Miniature 4"
            width={60}
            height={60}
            className="mb-2"
            style={{ opacity: getOpacity(image[3].lien) }}
          />
        </a>
      </div>
      
      <div style={{ position: 'relative', width: '100%', height: 'auto', aspectRatio: '1/1' }}>
        <img
          src={mainImage}
          alt="Image principale"
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'contain',
            maxWidth: '400px', 
            display: 'block'
          }}
        />
      </div>
    </div>) }
    </> 
  );
}
