"use client";
import AddressSelection from "../../components/checkout/AdresseSelection";
import AuthGuard from "@/app/context/AuthGard";

export default function Addresse() {
    return (
        <AuthGuard allowedRoles={['Client']}>
            <AddressSelection />
        </AuthGuard>
    );
}