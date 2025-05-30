export default function Unauthorized() {
    return (
        <div className="text-center p-5" style={{ height: '100vh', flexGrow: 1, marginTop: '120px' }}>
            <h1>❌ Accès refusé</h1>
            <p>Vous n’avez pas les autorisations nécessaires pour accéder à cette page.</p>
        </div>
    );
}
