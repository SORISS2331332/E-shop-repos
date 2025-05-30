"use client"

import { useParams } from 'next/navigation';
import CommentsList from "@/app/components/ComposantDetails/CommentList";
import ProductGallery from "@/app/components/ComposantDetails/ProductGallery";
import ProductInfo from "@/app/components/ComposantDetails/ProductInfo";
import ReviewsSummary from "@/app/components/ComposantDetails/ReviewSummary";
import SimilarProducts from "@/app/components/ComposantDetails/SimilarProducts";
import CommentForm from '@/app/components/ComposantDetails/CommentForm';
import { useAuth } from '@/app/context/AuthContext';
import { useState } from 'react';

export default function Details() {
  const [refreshCommentaires, setRefreshCommentaires] = useState(false);
  const params = useParams();
  const idArticle = params?.id;
  const { user } = useAuth();

  const handleCommentAdded = () => {
    setRefreshCommentaires(prev => !prev);
  };
    return (
        <>
        <div className="container-fluid px-5" style={{ paddingTop: '100px' }}>
    
          <div className="row my-5">
            <div className="col-md-6">
              <ProductGallery id={idArticle}/>
            </div>
            <div className="col-md-6">
              <ProductInfo id={idArticle} />
            </div>
          </div>
    
          <ReviewsSummary articleId={idArticle}  refreshTrigger={refreshCommentaires}/>

          {user && <CommentForm articleId={idArticle} utilisateurId={user.id}  onCommentAdded={handleCommentAdded}/>}

          <CommentsList articleId={idArticle}  refreshTrigger={refreshCommentaires}/>
          <SimilarProducts id={idArticle}/>
        </div>
        </>
      );
}