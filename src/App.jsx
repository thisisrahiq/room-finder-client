import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './routes/PrivateRoute';

// Import Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BrowseListings from './pages/BrowseListings';
import AddListing from './pages/AddListing';
import ListingDetails from './pages/ListingDetails';
import MyListings from './pages/MyListings';
import UpdateListing from './pages/UpdateListing';
import NotFound from './pages/NotFound';

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-base-100 transition-colors duration-300">
      <Navbar />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* Standard Pages with Navbar & Footer */}
      <Route path="/" element={<MainLayout><Home /></MainLayout>} />
      <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
      <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
      <Route path="/listings" element={<MainLayout><BrowseListings /></MainLayout>} />
      
      {/* Private Pages */}
      <Route path="/add-listing" element={
        <PrivateRoute>
          <MainLayout>
            <AddListing />
          </MainLayout>
        </PrivateRoute>
      } />
      <Route path="/listings/:id" element={
        <PrivateRoute>
          <MainLayout>
            <ListingDetails />
          </MainLayout>
        </PrivateRoute>
      } />
      <Route path="/my-listings" element={
        <PrivateRoute>
          <MainLayout>
            <MyListings />
          </MainLayout>
        </PrivateRoute>
      } />
      <Route path="/listings/update/:id" element={
        <PrivateRoute>
          <MainLayout>
            <UpdateListing />
          </MainLayout>
        </PrivateRoute>
      } />

      {/* 404 Page (Custom, without Navbar/Footer) */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
