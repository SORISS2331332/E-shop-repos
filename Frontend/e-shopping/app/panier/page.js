"use client";
import CartItem from "../components/panier/CartItem";
import CartSummary from "../components/panier/CartSummary";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "../context/AuthGard";
const Panier = () => {
    const { panier, removeItem, updateQuantity } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    useEffect(() => {
        if(!user){
            router.push('/');
        }
    })
    return (
        <AuthGuard allowedRoles={['Client']}>
            <main>
                <div className="container py-5">
                    <h3 className="fw-bold mb-4">Panier</h3>
                    <div className="row">
                        <div className="col-lg-8">
                        {panier.map(item => (
                            <CartItem key={item.id} item={item} 
                            removeItem={removeItem} updateQuantity={updateQuantity}/>
                        ))}
                        </div>
                        <div className="col-lg-4 mt-5 mt-lg-0">
                        <CartSummary />
                        </div>
                    </div>
                </div>
            </main>
        </AuthGuard>
    );
};

export default Panier;
