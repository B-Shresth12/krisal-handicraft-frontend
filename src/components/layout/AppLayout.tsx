import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';

export default function AppLayout() {
  return (
    <div className="app-container">
      <Header />
      <main className="site-content">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
