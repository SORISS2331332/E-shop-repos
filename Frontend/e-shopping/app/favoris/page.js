"use client";
import ListeFavoris from "../components/ComposantFavoris/ListeFavoris";
import AuthGuard from "../context/AuthGard";

export default function FavorisPage() {
    return (
        <AuthGuard allowedRoles={['Client']}>
            <div style={{ paddingTop: "120px", flexGrow: 1 }}>
                <ListeFavoris />
            </div>
        </AuthGuard>
    );
}
