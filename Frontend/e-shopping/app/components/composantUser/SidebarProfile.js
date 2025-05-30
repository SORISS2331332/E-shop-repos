export default function SidebarProfile({ onSelect, activeSection }) {
  const getButtonClass = (section) =>
    `list-group-item list-group-item-action ${activeSection === section ? 'active text-white bg-dark border-dark' : ''}`;

  return (
    <div className="list-group mb-4">
      <div className="fw-bold mb-2">Mon Compte</div>
      <button onClick={() => onSelect("profil")} className={getButtonClass("profil")}>
        Mon Profil
      </button>
      <button onClick={() => onSelect("adresse")} className={getButtonClass("adresse")}>
        Mon Adresse
      </button>

      <div className="fw-bold mt-4 mb-2">Mes Articles</div>
      <button onClick={() => onSelect("commandes")} className={getButtonClass("commandes")}>
        Mes Commandes
      </button>
      <button onClick={() => onSelect("favoris")} className={getButtonClass("favoris")}>
        Mes Favoris
      </button>
    </div>
  );
}
