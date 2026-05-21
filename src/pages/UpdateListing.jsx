import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import LoadingSpinner from '../components/LoadingSpinner';

const SUGGESTED_LIFESTYLE_TAGS = [
  "Non-smoker", "Pet-friendly", "Student", "Professional", 
  "Night Owl", "Early Bird", "Vegetarian", "Clean & Tidy", 
  "Gym Lover", "WFH"
];

const UpdateListing = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [rent, setRent] = useState('');
  const [roomType, setRoomType] = useState('Single');
  const [description, setDescription] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [availability, setAvailability] = useState('Available');
  const [selectedTags, setSelectedTags] = useState([]);
  const [customTag, setCustomTag] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const token = await currentUser.getIdToken();
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${apiUrl}/listings/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.data.success) {
          const item = res.data.data;
          
          // Verify ownership
          if (item.userEmail !== currentUser.email) {
            Swal.fire({
              title: 'Access Denied',
              text: 'You do not have permission to edit this listing.',
              icon: 'error',
              background: isDark ? '#1e293b' : '#ffffff',
              color: isDark ? '#f8fafc' : '#0f172a',
            });
            navigate('/my-listings');
            return;
          }

          setTitle(item.title || '');
          setLocation(item.location || '');
          setRent(item.rent || '');
          setRoomType(item.roomType || 'Single');
          setDescription(item.description || '');
          setContactInfo(item.contactInfo || '');
          setAvailability(item.availability || 'Available');
          setSelectedTags(item.lifestyle || []);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
        Swal.fire({
          title: 'Error',
          text: err.response?.data?.message || 'Failed to retrieve listing details.',
          icon: 'error',
          background: isDark ? '#1e293b' : '#ffffff',
          color: isDark ? '#f8fafc' : '#0f172a',
        });
        navigate('/my-listings');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id, currentUser, navigate, isDark]);

  // Toggle suggested tags
  const handleTagToggle = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Add custom tags
  const handleAddCustomTag = (e) => {
    e.preventDefault();
    const tag = customTag.trim();
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      setCustomTag('');
    }
  };

  const handleRemoveTag = (tag) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !location || !rent || !roomType || !description || !contactInfo || !availability) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please fill in all required fields.',
        icon: 'warning',
        background: isDark ? '#1e293b' : '#ffffff',
        color: isDark ? '#f8fafc' : '#0f172a',
      });
      return;
    }

    const parsedRent = Number(rent);
    if (isNaN(parsedRent) || parsedRent <= 0) {
      Swal.fire({
        title: 'Rent Input Error',
        text: 'Rent must be a positive number.',
        icon: 'error',
        background: isDark ? '#1e293b' : '#ffffff',
        color: isDark ? '#f8fafc' : '#0f172a',
      });
      return;
    }

    setSubmitting(true);
    try {
      const token = await currentUser.getIdToken();
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      const payload = {
        title,
        location,
        rent: parsedRent,
        roomType,
        lifestyle: selectedTags,
        description,
        contactInfo,
        availability
      };

      const res = await axios.put(`${apiUrl}/listings/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.data.success) {
        Swal.fire({
          title: 'Listing Updated!',
          text: 'Your room listing details have been updated.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          background: isDark ? '#1e293b' : '#ffffff',
          color: isDark ? '#f8fafc' : '#0f172a',
        });
        navigate('/my-listings');
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: 'Update Failed',
        text: err.response?.data?.message || err.message,
        icon: 'error',
        background: isDark ? '#1e293b' : '#ffffff',
        color: isDark ? '#f8fafc' : '#0f172a',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="card bg-base-100 border border-base-200 shadow-xl">
        <div className="card-body p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight font-display">Update Room Listing</h1>
            <p className="text-sm text-base-content/65">
              Modify the property features, monthly rental rate, lifestyle habits, or availability of your listing.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title & Room Type */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="form-control sm:col-span-2">
                <label className="label py-1">
                  <span className="label-text font-semibold">Listing Title *</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Spacious Master Bed in Downtown"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input input-bordered focus:input-primary rounded-xl"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-semibold">Room Type *</span>
                </label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="select select-bordered focus:select-primary rounded-xl font-medium"
                  required
                >
                  <option value="Single">Single</option>
                  <option value="Shared">Shared</option>
                  <option value="Studio">Studio</option>
                  <option value="Master Bedroom">Master Bedroom</option>
                </select>
              </div>
            </div>

            {/* Location & Rent */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="form-control sm:col-span-2">
                <label className="label py-1">
                  <span className="label-text font-semibold">Location Address *</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 123 Market St, San Francisco, CA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="input input-bordered focus:input-primary rounded-xl"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-semibold">Monthly Rent ($) *</span>
                </label>
                <input
                  type="number"
                  placeholder="e.g. 950"
                  value={rent}
                  onChange={(e) => setRent(e.target.value)}
                  className="input input-bordered focus:input-primary rounded-xl"
                  required
                />
              </div>
            </div>

            {/* Lifestyle Tags */}
            <div className="form-control space-y-3">
              <label className="label py-1">
                <span className="label-text font-semibold">Lifestyle Attributes / Tags</span>
              </label>
              <div className="flex flex-wrap gap-2 p-3 bg-base-200/30 rounded-xl border border-base-200">
                {SUGGESTED_LIFESTYLE_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`btn btn-xs rounded-full font-medium ${isSelected ? 'btn-primary' : 'btn-outline btn-neutral'}`}
                    >
                      {isSelected ? '✓ ' : ''}{tag}
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add custom tag (e.g. Introvert)"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  className="input input-bordered input-sm rounded-lg flex-grow max-w-xs focus:input-primary"
                />
                <button
                  type="button"
                  onClick={handleAddCustomTag}
                  className="btn btn-neutral btn-sm rounded-lg font-semibold"
                >
                  Add Tag
                </button>
              </div>

              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedTags.map((tag) => (
                    <div key={tag} className="badge badge-secondary gap-1.5 font-medium py-2 rounded-lg">
                      #{tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="text-xs hover:scale-125 transition-transform font-bold">
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description & Contact */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-semibold">Room Description *</span>
              </label>
              <textarea
                placeholder="Describe the room, house amenities, roommate expectations, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="textarea textarea-bordered focus:textarea-primary rounded-xl h-28"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="form-control sm:col-span-2">
                <label className="label py-1">
                  <span className="label-text font-semibold">Contact Details (Hidden until like) *</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Phone: +1 555-0199 or Telegram: @johndoe"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  className="input input-bordered focus:input-primary rounded-xl"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text font-semibold">Availability Status *</span>
                </label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="select select-bordered focus:select-primary rounded-xl font-medium"
                  required
                >
                  <option value="Available">Available</option>
                  <option value="Not Available">Not Available</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary rounded-xl px-8 font-semibold flex-grow sm:flex-none"
              >
                {submitting ? <span className="loading loading-spinner"></span> : 'Update Listing'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/my-listings')}
                className="btn btn-outline btn-neutral rounded-xl px-8 font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateListing;
