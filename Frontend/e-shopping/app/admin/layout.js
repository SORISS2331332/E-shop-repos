"use client";
import { useState, useEffect, act, use } from 'react';
import { usePathname } from 'next/navigation';
import HeaderAdmin from './components/HeaderAdmin';
import SidebarAdmin from './components/SidebarAdmin';
import AuthGuard from '../context/AuthGard';

export default function AdminLayout({ children }) {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const pathname = usePathname();
  const [isArticlePage, setIsArticlePage] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/articles') {
      setIsArticlePage(true);
    } else {
      setIsArticlePage(false);
    }
  }, [pathname]);

  return (
    <AuthGuard allowedRoles={['Admin']}>
      <div className="d-flex">
        <SidebarAdmin activeMenu={activeMenu} onSelect={setActiveMenu} />
        <div className="flex-grow-1">
          {
            (!isArticlePage) &&
            <HeaderAdmin searchTerm={searchTerm} setSearchTerm={setSearchTerm}  isVisibleSearch={false}/>
          }
          <div className="container py-4">
            {children}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
