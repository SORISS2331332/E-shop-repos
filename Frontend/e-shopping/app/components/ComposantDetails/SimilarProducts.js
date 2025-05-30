import ArticleCard from '../home/ArticleCard';
import { useEffect, useState } from 'react';

export default function SimilarProducts(props) {
  const [products, setProducts] = useState([]);
  const[product, setProduct] = useState({});

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://eshop-api-web.up.railway.app/api/Articles/' + props.id);
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }

    try {
      const response = await fetch('https://eshop-api-web.up.railway.app/api/Articles/Categorie/' + product.categorieId);
      if(!response.ok){
        return;
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

 



  useEffect(() => {
    if (props.id) {
      fetchProducts();
    }
  }, [product]);




  return (
    <>
    {
      
      (products.length > 0) ? (
        <div className="my-5">
          <h4>Articles similaires</h4>
          <div className='row'>
                    {products.filter(product => product.id !== props.id).map((product, index) => (
                        
                        <ArticleCard
                                key={index}
                                product={product}
                                estDisponible={true}

                        />
                    ))}
                </div>
        </div>
      ) : (
        <div className="my-5">
          <p>Aucun article disponible.</p>
        </div>
      )
        
    }
    </>
  );
}
