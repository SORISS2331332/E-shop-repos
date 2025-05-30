import { useState } from "react";


const categories = [
        {id: 1, name: 'Smartphones' },
        {id: 2, name: 'Ordinateurs'},
        {id: 3, name: 'Tablettes'},
        {id: 4, name: 'Casques'},
        
        {id: 5, name: 'Télévisions'},
        {id: 6, name: 'Ecrans' },
        {id: 7, name: 'Montres'},
        {id: 8, name: 'Cameras' },
        {id: 9, name: 'Consoles'},
        {id: 10, name: 'Accessoires'}
    ];
export default function Sidebar({ onSearch, onCategoryChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) onSearch(value);
  };

  const toggleCategory = (category) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    setSelectedCategories(updated);
    if (onCategoryChange) onCategoryChange(updated);
  };

  return (
    <aside className="bg-white border-end p-4 shadow-sm min-vh-100 rounded-end">
      {/* Champ de recherche */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Rechercher un article..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Liste des catégories */}
      <h5 className="mb-3 fw-bold">🗂️ Catégories</h5>
      <div className="d-flex flex-column gap-2">
        {categories.map((category) => (
          <div key={category.id} className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id={`check-${category.name}`}
              checked={selectedCategories.includes(category.id)}
              onChange={() => toggleCategory(category.id)}
              style={{
                backgroundColor: selectedCategories.includes(category.id) ? "#000" : "",
                borderColor: "#000",
              }}
            />
            <label
              className="form-check-label ms-2"
              htmlFor={`check-${category.name}`}
            >
              {category.name}
            </label>
          </div>
        ))}
      </div>
    </aside>
  );
}
