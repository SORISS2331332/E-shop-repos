export default function Loading() {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 text-primary">
        <div className="spinner-border" role="status" style={{ width: '4rem', height: '4rem' }}>
            <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-3 fs-5">Chargement en cours...</p>
        </div>
    );
}
