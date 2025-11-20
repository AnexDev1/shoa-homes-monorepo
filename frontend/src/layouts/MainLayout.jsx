import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
// Inquiry modal removed — contact via phone/email

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      {/* Inquiry modal removed — use contact info in property pages */}
    </div>
  );
};

export default MainLayout;
