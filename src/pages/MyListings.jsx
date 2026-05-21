import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import LoadingSpinner from '../components/LoadingSpinner';

const MyListings = () => {
  const { currentUser } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyListings = async () => {
    try {
      const token = await currentUser.getIdToken();
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const res = await axios.get(`${apiUrl}/listings?userEmail=${currentUser.email}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.data.success) {
        setMyListings(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching user listings:", err);
      Swal.fire({
        title: 'Error',
        text: 'Failed to retrieve your listings.',
        icon: 'error',
        background: isDark ? '#1e293b' : '#ffffff',
        color: isDark ? '#f8fafc' : '#0f172a',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchMyListings();
    }
  }, [currentUser]);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!',
      background: isDark ? '#1e293b' : '#ffffff',
      color: isDark ? '#f8fafc' : '#0f172a',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = await currentUser.getIdToken();
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
          const res = await axios.delete(`${apiUrl}/listings/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (res.data.success) {
            Swal.fire({
              title: 'Deleted!',
              text: 'Your listing has been deleted.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
              background: isDark ? '#1e293b' : '#ffffff',
              color: isDark ? '#f8fafc' : '#0f172a',
            });
            // Update local state
            setMyListings(prev => prev.filter(item => item._id !== id));
          }
        } catch (err) {
          console.error("Delete failed:", err);
          Swal.fire({
            title: 'Delete Failed',
            text: err.response?.data?.message || err.message,
            icon: 'error',
            background: isDark ? '#1e293b' : '#ffffff',
            color: isDark ? '#f8fafc' : '#0f172a',
          });
        }
      }
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight font-display">My Room Listings</h1>
          <p className="text-sm text-base-content/65">
            Manage your room and roommate postings, monitor statuses, and update details.
          </p>
        </div>
        <Link to="/add-listing" className="btn btn-primary rounded-xl font-semibold">
          + Create New Listing
        </Link>
      </div>

      {/* Main Table */}
      {loading ? (
        <LoadingSpinner />
      ) : myListings.length === 0 ? (
        <div className="text-center py-16 bg-base-200/20 rounded-2xl border border-dashed border-base-300">
          <p className="text-base-content/60">You haven't posted any roommate listings yet.</p>
          <Link to="/add-listing" className="btn btn-primary btn-sm mt-4 rounded-lg">Create Your First Post</Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-2xl border border-base-200 shadow-md">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200/50 text-base-content/85">
                <th className="rounded-tl-2xl">Title</th>
                <th>Room Type</th>
                <th>Rent</th>
                <th>Status</th>
                <th className="rounded-tr-2xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {myListings.map((item) => (
                <tr key={item._id} className="hover:bg-base-200/30 transition-colors">
                  {/* Title & location */}
                  <td>
                    <div className="font-semibold text-sm line-clamp-1">{item.title}</div>
                    <div className="text-xs text-base-content/50 truncate max-w-[280px]">{item.location}</div>
                  </td>
                  {/* Room type */}
                  <td className="text-sm font-medium">{item.roomType}</td>
                  {/* Rent */}
                  <td className="font-bold text-primary">${item.rent}/mo</td>
                  {/* Status */}
                  <td>
                    <span className={`badge badge-sm font-semibold rounded-lg ${
                      item.availability === 'Available' 
                        ? 'badge-success text-white' 
                        : 'badge-error text-white'
                    }`}>
                      {item.availability}
                    </span>
                  </td>
                  {/* Actions */}
                  <td className="text-right space-x-2">
                    <Link 
                      to={`/listings/${item._id}`} 
                      className="btn btn-ghost btn-xs text-primary font-bold hover:bg-primary/10 rounded-md"
                    >
                      View
                    </Link>
                    <Link 
                      to={`/listings/update/${item._id}`} 
                      className="btn btn-secondary btn-xs text-white font-bold rounded-md px-3"
                    >
                      Update
                    </Link>
                    <button 
                      onClick={() => handleDelete(item._id)} 
                      className="btn btn-error btn-outline btn-xs font-bold rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyListings;
