'use client';
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
export default function SidebarAdmin({ activeMenu, onSelect }) {
  const { logout } = useAuth();
  const router = useRouter();
  const menus = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2', link: '/admin' },
    { id: 'articles', label: 'Articles', icon: 'bi-box-seam', link: '/admin/articles' },
    { id: 'ajouter', label: 'Ajouter', icon: 'bi-plus-circle', link: '/admin/ajout' },
  ];

  return (
    <div className="d-flex flex-column bg-light vh-100 p-3" style={{ width: '250px' }}>
      <ul className="nav flex-column gap-2">
        {menus.map(menu => (
          <li key={menu.id}>
            <button
              className={`nav-link text-start w-100 d-flex align-items-center gap-2 ${
                activeMenu === menu.id ? 'bg-black text-white' : 'text-black'
              }`}
              onClick={() => {
                onSelect(menu.id);
                router.push(`${menu.link}`);
              }}
            >
              <i className={`bi ${menu.icon}`}></i> {menu.label}
            </button>
          </li>
        ))}
        <li>
          <a onClick={() => {
              logout();
              router.push('/');
            }} className="nav-link text-danger d-flex align-items-center gap-2" href="#">
            <i  className="bi bi-box-arrow-right"></i> Déconnexion
          </a>
        </li>
      </ul>
    </div>
  );
}
