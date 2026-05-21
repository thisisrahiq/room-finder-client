import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import Swal from 'sweetalert2';

const SUGGESTED_LIFESTYLE_TAGS = [
  "Non-smoker", "Pet-friendly", "Student", "Professional", 
  "Night Owl", "Early Bird", "Vegetarian", "Clean & Tidy", 
  "Gym Lover", "WFH"
];

const AddListing = () => {
  const { currentUser, isDark } = useAuth();
  const { isDark: themeIsDark } = useTheme();
  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [rent, setRent] = useState('');
  const [roomType, setRoomType] = useState('Single');
  const [listingType, setListingType] = useState('Room');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [availability, setAvailability] = useState('Available');
  const [selectedTags, setSelectedTags] = useState([]);
  const [customTag, setCustomTag] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle local image file upload converting to base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        Swal.fire({
          title: 'File Too Large',
          text: 'Please select an image smaller than 2MB.',
          icon: 'warning',
          background: themeIsDark ? '#1e293b' : '#ffffff',
          color: themeIsDark ? '#f8fafc' : '#0f172a',
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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

    if (!title || !location || !rent || !roomType || !listingType || !description || !contactInfo || !availability) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please fill in all required fields.',
        icon: 'warning',
        background: themeIsDark ? '#1e293b' : '#ffffff',
        color: themeIsDark ? '#f8fafc' : '#0f172a',
      });
      return;
    }

    const parsedRent = Number(rent);
    if (isNaN(parsedRent) || parsedRent <= 0) {
      Swal.fire({
        title: 'Rent Input Error',
        text: 'Rent must be a positive number.',
        icon: 'error',
        background: themeIsDark ? '#1e293b' : '#ffffff',
        color: themeIsDark ? '#f8fafc' : '#0f172a',
      });
      return;
    }

    setLoading(true);
    try {
      const token = await currentUser.getIdToken();
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';

      const payload = {
        title,
        location,
        rent: parsedRent,
        roomType,
        lifestyle: selectedTags,
        description,
        contactInfo,
        availability,
        listingType,
        imageUrl
      };

      const res = await axios.post(`${apiUrl}/listings`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.data.success) {
        Swal.fire({
          title: 'Listing Created!',
          text: 'Your roommate listing has been posted successfully.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          background: themeIsDark ? '#1e293b' : '#ffffff',
          color: themeIsDark ? '#f8fafc' : '#0f172a',
        });
        navigate('/my-listings');
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: 'Submission Failed',
        text: err.response?.data?.message || err.message,
        icon: 'error',
        background: themeIsDark ? '#1e293b' : '#ffffff',
        color: themeIsDark ? '#f8fafc' : '#0f172a',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="card bg-base-100 border border-base-200 shadow-xl">
        <div className="card-body p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight font-display">Create Room / Roommate Listing</h1>
            <p className="text-sm text-base-content/65">
              Fill in the property details and preferred lifestyle traits of your next co-living roommate.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Read Only User Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-base-200/50 p-4 rounded-xl border border-base-200">
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs font-semibold text-base-content/65">Your Name</span>
                </label>
                <input
                  type="text"
                  value={currentUser?.displayName || currentUser?.email.split('@')[0]}
                  readOnly
                  className="input input-sm input-bordered rounded-lg bg-base-300/40 cursor-not-allowed font-medium"
                />
              </div>
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs font-semibold text-base-content/65">Your Email</span>
                </label>
                <input
                  type="email"
                  value={currentUser?.email}
                  readOnly
                  className="input input-sm input-bordered rounded-lg bg-base-300/40 cursor-not-allowed font-medium"
                />
              </div>
            </div>

            {/* Title & Room Type & Listing Type */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
                  <span className="label-text font-semibold">Listing Type *</span>
                </label>
                <select
                  value={listingType}
                  onChange={(e) => setListingType(e.target.value)}
                  className="select select-bordered focus:select-primary rounded-xl font-medium"
                  required
                >
                  <option value="Room">Offering a Room</option>
                  <option value="Roommate">Looking for Roommate</option>
                </select>
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

            {/* Image Upload Option */}
            <div className="form-control space-y-3">
              <label className="label py-1">
                <span className="label-text font-semibold">Listing Image</span>
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Uploader */}
                <div className="flex flex-col space-y-2 p-4 bg-base-200/40 rounded-2xl border border-base-200">
                  <span className="text-xs font-semibold text-base-content/75">Upload Local Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file-input file-input-bordered file-input-primary file-input-sm w-full rounded-lg"
                  />
                  <div className="text-[10px] text-base-content/50">
                    Max size 2MB (converts to base64 format)
                  </div>
                  
                  <div className="divider text-xs text-base-content/40 my-1">OR</div>
                  
                  <span className="text-xs font-semibold text-base-content/75">Paste Image URL</span>
                  <input
                    type="url"
                    placeholder="e.g. https://images.unsplash.com/..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="input input-bordered input-sm focus:input-primary rounded-lg w-full"
                  />
                </div>

                {/* Preview */}
                <div className="flex flex-col items-center justify-center p-4 bg-base-200/20 rounded-2xl border border-dashed border-base-300 min-h-[160px]">
                  {imageUrl ? (
                    <div className="relative group w-full h-full max-h-[160px] rounded-xl overflow-hidden shadow-md">
                      <img
                        src={imageUrl}
                        alt="Listing Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1594498653385-d5172b53adc7?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white font-bold p-1 rounded-full text-xs shadow-md transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="text-center text-base-content/40 space-y-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs font-semibold block">No image selected</span>
                      <span className="text-[10px] block">Upload a file or enter an URL</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Lifestyle Tags selection */}
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

              {/* Custom Tag input */}
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

              {/* Selected Tags list */}
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

            {/* Description & Contact info */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-semibold">Room Description *</span>
              </label>
              <textarea
                placeholder="Describe the room, house amenities, roommate expectations, shared utilities, etc."
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

            {/* Submit Button */}
            <div className="pt-4 flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary rounded-xl px-8 font-semibold flex-grow sm:flex-none"
              >
                {loading ? <span className="loading loading-spinner"></span> : 'Post Listing'}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
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

export default AddListing;
