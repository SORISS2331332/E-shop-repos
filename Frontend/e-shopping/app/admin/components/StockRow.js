import { useRouter } from "next/navigation";
import $ from "jquery";
import { useEffect, useState } from "react";
export default function StockRow({ article, monImage, onDelete }) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/admin/modifier/${article.id}`);
  };
  const categories = [
          {id: 1, name: 'Smartphones' },
          {id: 2, name: 'Ordinateurs' },
          {id: 3, name: 'Tablettes'},
          {id: 4, name: 'Casques' },
          
          {id: 5, name: 'Télévisions'},
          {id: 6, name: 'Ecrans'},
          {id: 7, name: 'Montres'},
          {id: 8, name: 'Cameras'},
          {id: 9, name: 'Consoles' },
          {id: 10, name: 'Accessoires' }
      ];  

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("jquery-ui-dist/jquery-ui.css"); 
      import("jquery-ui-dist/jquery-ui.js");
    }

  }, []);

  const handleDeleteClick = () => {
        const $dialog = $('<div>Êtes-vous sûr de vouloir supprimer cet article ?</div>').dialog({
            modal: true,
            title: "Confirmation de suppression",
            buttons: {
                "Oui": function () {
                    onDelete(article.id);
                    $dialog.dialog("close");
                },
                "Non": function () {
                    $dialog.dialog("close");
                }
            },
            close: function () {
                $dialog.remove();
            }
        });
    };

  return (
    <tr>
      <td><img src={monImage} className="rounded" width="50" height="50" /></td>
      <td>{article.nom}</td>
      <td>{categories.find(cat => cat.id === article.categorieId)?.name}</td>
      <td>${parseFloat(article.prix).toFixed(2)}</td>
      <td>{article.quantite}</td>
      <td>
        <button
          className="btn btn-sm btn-outline-secondary me-2"
          onClick={handleEdit}
          title="Modifier"
        >
          <i className="bi bi-pencil-square"></i>
        </button>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={() => handleDeleteClick()}
          title="Supprimer"
        >
          <i className="bi bi-trash"></i>
        </button>
      </td>
    </tr>
  );
}
