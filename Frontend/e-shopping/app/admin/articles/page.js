'use client';
import { useState } from 'react';
import HeaderAdmin from '../components/HeaderAdmin';
import StockTable from '../components/StockTable';

export default function AdminPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <>
      <HeaderAdmin  searchTerm={searchTerm} setSearchTerm={setSearchTerm} isVisibleSearch={true} />
      <StockTable searchTerm={searchTerm} />
    </>
  );
}
