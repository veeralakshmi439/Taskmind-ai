import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import Breadcrumbs from '../common/Breadcrumbs';
import CommandPalette from '../common/CommandPalette';

const Layout = () => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <Breadcrumbs />
          <Outlet />
        </main>
        <Footer />
      </div>
      <CommandPalette />
    </div>
  );
};

export default Layout;