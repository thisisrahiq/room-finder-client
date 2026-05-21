import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Tooltip } from 'react-tooltip';
import Swal from 'sweetalert2';

const Navbar = () => {
  const { currentUser, logoutUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      Swal.fire({
        title: 'Logged Out',
        text: 'You have been logged out successfully.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        background: isDark ? '#1e293b' : '#ffffff',
        color: isDark ? '#f8fafc' : '#0f172a',
      });
      navigate('/');
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: err.message,
        icon: 'error',
        background: isDark ? '#1e293b' : '#ffffff',
        color: isDark ? '#f8fafc' : '#0f172a',
      });
    }
  };

  const navLinks = (
    <>
      <li>
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `px-4 py-2 font-medium rounded-lg transition-colors ${isActive ? 'text-primary bg-primary/10' : 'hover:text-primary'}`
          }
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink 
          to="/listings" 
          className={({ isActive }) => 
            `px-4 py-2 font-medium rounded-lg transition-colors ${isActive ? 'text-primary bg-primary/10' : 'hover:text-primary'}`
          }
        >
          Browse Listings
        </NavLink>
      </li>
      {currentUser && (
        <>
          <li>
            <NavLink 
              to="/add-listing" 
              className={({ isActive }) => 
                `px-4 py-2 font-medium rounded-lg transition-colors ${isActive ? 'text-primary bg-primary/10' : 'hover:text-primary'}`
              }
            >
              Add Listing
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/my-listings" 
              className={({ isActive }) => 
                `px-4 py-2 font-medium rounded-lg transition-colors ${isActive ? 'text-primary bg-primary/10' : 'hover:text-primary'}`
              }
            >
              My Listings
            </NavLink>
          </li>
        </>
      )}
    </>
  );

  return (
    <div className="sticky top-0 z-50 w-full bg-base-100/85 backdrop-blur-md border-b border-base-200 shadow-sm transition-all duration-300">
      <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="navbar-start">
          {/* Mobile menu trigger */}
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden mr-2 p-1" aria-label="Open menu">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-xl bg-base-100 rounded-box w-52 space-y-1">
              {navLinks}
            </ul>
          </div>
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent sm:text-2xl font-display">
              Co-Living Finder
            </span>
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 space-x-2">
            {navLinks}
          </ul>
        </div>

        <div className="navbar-end space-x-3">
          {/* Light/Dark Toggle */}
          <button 
            onClick={toggleTheme} 
            className="btn btn-ghost btn-circle"
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* User Auth Info */}
          {currentUser ? (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border border-primary/20" id="user-avatar-tooltip">
                <div className="w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt={currentUser.displayName || 'User'} />
                  ) : (
                    <span className="text-lg font-semibold text-primary">
                      {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : currentUser.email.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <Tooltip anchorSelect="#user-avatar-tooltip" place="left">
                {currentUser.displayName || currentUser.email}
              </Tooltip>
              <ul tabIndex={0} className="mt-3 z-[1] p-3 shadow-2xl menu menu-sm dropdown-content bg-base-100 rounded-box w-64 border border-base-200">
                <div className="px-2 py-1.5 mb-2 border-b border-base-200">
                  <p className="font-semibold text-base truncate">{currentUser.displayName || 'Room Finder User'}</p>
                  <p className="text-xs text-base-content/60 truncate">{currentUser.email}</p>
                </div>
                <li>
                  <Link to="/my-listings" className="justify-between py-2">
                    My Dashboard
                    <span className="badge badge-sm badge-primary">Listings</span>
                  </Link>
                </li>
                <li>
                  <Link to="/add-listing" className="py-2">Add New Listing</Link>
                </li>
                <li className="mt-2 border-t border-base-200 pt-2">
                  <button onClick={handleLogout} className="text-error font-medium hover:bg-error/10 py-2">
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login" className="btn btn-ghost btn-sm font-medium">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm rounded-lg font-medium px-4">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
