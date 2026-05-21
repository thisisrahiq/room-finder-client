import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Typewriter } from 'react-simple-typewriter';
import axios from 'axios';
import Swal from 'sweetalert2';
import LoadingSpinner from '../components/LoadingSpinner';

const ListingDetails = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasLiked, setHasLiked] = useState(() => {
    return localStorage.getItem(`liked_${id}`) === 'true';
  });
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const token = await currentUser.getIdToken();
        const apiUrl = import.meta.env.VITE_API_URL || 'https://room-finder-server-tan.vercel.app';
        const res = await axios.get(`${apiUrl}/listings/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.data.success) {
          const item = res.data.data;
          setListing(item);
          setLikesCount(item.likeCount || 0);
          const initiallyLiked = item.likedBy && Array.isArray(item.likedBy) && item.likedBy.includes(currentUser?.email);
          setHasLiked(initiallyLiked);
        }
      } catch (err) {
        console.error(err);
        Swal.fire({
          title: 'Error',
          text: err.response?.data?.message || 'Failed to load listing details.',
          icon: 'error',
          background: isDark ? '#1e293b' : '#ffffff',
          color: isDark ? '#f8fafc' : '#0f172a',
        });
        navigate('/listings');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id, currentUser, navigate, isDark]);

  const handleLike = async () => {
    if (currentUser.email === listing?.userEmail) {
      Swal.fire({
        title: 'Action Denied',
        text: 'You cannot like your own listing.',
        icon: 'info',
        background: isDark ? '#1e293b' : '#ffffff',
        color: isDark ? '#f8fafc' : '#0f172a',
      });
      return;
    }

    try {
      const token = await currentUser.getIdToken();
      const apiUrl = import.meta.env.VITE_API_URL || 'https://room-finder-server-tan.vercel.app';
      const res = await axios.patch(`${apiUrl}/listings/${id}/like`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.data.success) {
        const { liked, likeCount } = res.data.data;
        setHasLiked(liked);
        setLikesCount(likeCount);

        if (liked) {
          localStorage.setItem(`liked_${id}`, 'true');
          Swal.fire({
            title: 'Liked Listing!',
            text: 'Contact details have been unlocked successfully.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            background: isDark ? '#1e293b' : '#ffffff',
            color: isDark ? '#f8fafc' : '#0f172a',
          });
        } else {
          localStorage.removeItem(`liked_${id}`);
          Swal.fire({
            title: 'Unliked Listing',
            text: 'Listing unliked. Contact details are now locked.',
            icon: 'info',
            timer: 1500,
            showConfirmButton: false,
            background: isDark ? '#1e293b' : '#ffffff',
            color: isDark ? '#f8fafc' : '#0f172a',
          });
        }
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: 'Error',
        text: err.response?.data?.message || 'Failed to update like. Try again.',
        icon: 'error',
        background: isDark ? '#1e293b' : '#ffffff',
        color: isDark ? '#f8fafc' : '#0f172a',
      });
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!listing) return null;

  const isOwner = currentUser.email === listing.userEmail;
  const isUnlocked = hasLiked || isOwner;

  const fallbackImage = listing.listingType === 'Roommate'
    ? 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80'
    : 'https://images.unsplash.com/photo-1594498653385-d5172b53adc7?auto=format&fit=crop&w=1200&q=80';

  // Words for typewriter likes text
  const typewriterWords = [
    `This listing has received ${likesCount} likes.`,
    isUnlocked
      ? "Contact details are now visible below!"
      : `Like this ${listing.listingType?.toLowerCase() || 'room'} listing to unlock owner contact details!`
  ];

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-8">
      {/* Back link */}
      <div>
        <Link to="/listings" className="btn btn-ghost btn-sm gap-2 font-semibold">
          ← Back to listings
        </Link>
      </div>

      {/* Main card */}
      <div className="card bg-base-100 border border-base-200 shadow-xl overflow-hidden">
        {/* Listing Hero Image */}
        <div className="h-64 sm:h-96 w-full relative overflow-hidden bg-base-200">
          <img
            src={listing.imageUrl || fallbackImage}
            alt={listing.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = fallbackImage;
            }}
          />
          <div className="absolute top-4 left-4 flex gap-2">
            {listing.listingType === 'Roommate' ? (
              <span className="badge badge-secondary text-white font-bold px-3 py-2 text-xs shadow-md">
                Roommate Wanted
              </span>
            ) : (
              <span className="badge badge-accent text-white font-bold px-3 py-2 text-xs shadow-md">
                Room Offering
              </span>
            )}
            <span className="badge badge-neutral text-white font-bold px-3 py-2 text-xs shadow-md">
              {listing.roomType}
            </span>
          </div>

          <div className="absolute bottom-4 right-4">
            <span className="badge badge-primary text-white font-bold px-3 py-2 text-xs shadow-md uppercase tracking-wider">
              {listing.availability || 'Available'}
            </span>
          </div>
        </div>

        {/* Banner with typewriter */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 border-b border-base-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-primary font-bold">Dynamic Info Panel</span>
            <div className="h-6 text-sm font-semibold text-base-content/85">
              <Typewriter
                words={typewriterWords}
                loop={true}
                cursor
                cursorStyle='|'
                typeSpeed={50}
                deleteSpeed={40}
                delaySpeed={2000}
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleLike}
              disabled={isOwner}
              className={`btn btn-sm rounded-xl font-bold gap-2 transition-all ${hasLiked
                  ? 'btn-success text-white hover:btn-error'
                  : isOwner
                    ? 'btn-neutral cursor-not-allowed opacity-60'
                    : 'btn-primary'
                }`}
            >
              {hasLiked ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
              {hasLiked ? `Liked (${likesCount})` : `Like (${likesCount})`}
            </button>
          </div>
        </div>

        {/* Details Content */}
        <div className="card-body p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {listing.listingType === 'Roommate' ? (
                  <span className="badge badge-secondary font-bold px-3 py-1 text-xs">
                    Roommate Listing
                  </span>
                ) : (
                  <span className="badge badge-accent text-white font-bold px-3 py-1 text-xs">
                    Room Listing
                  </span>
                )}
                <span className="badge badge-primary badge-outline font-bold px-3 py-1 text-xs">
                  {listing.roomType}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">{listing.title}</h1>
              <div className="flex items-center text-sm text-base-content/70">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{listing.location}</span>
              </div>
            </div>

            <div className="text-left sm:text-right bg-primary/5 p-4 rounded-xl border border-primary/10">
              <span className="text-xs font-semibold text-primary uppercase block">Monthly Rent</span>
              <span className="text-3xl font-extrabold text-primary">${listing.rent}</span>
              <span className="text-xs text-base-content/65 font-medium block">Utilities not included</span>
            </div>
          </div>

          <div className="divider"></div>

          {/* Description Section */}
          <div className="space-y-3">
            <h3 className="font-bold text-lg font-display">About the Space & Roommate</h3>
            <p className="text-base-content/85 text-sm leading-relaxed whitespace-pre-line bg-base-200/30 p-5 rounded-2xl border border-base-200/50">
              {listing.description}
            </p>
          </div>

          {/* Lifestyle Preferences */}
          {listing.lifestyle && listing.lifestyle.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-lg font-display">Lifestyle Preferences</h3>
              <div className="flex flex-wrap gap-2">
                {listing.lifestyle.map((tag, idx) => (
                  <span key={idx} className="badge badge-primary badge-outline font-semibold px-3 py-2.5 rounded-lg text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Owner details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
            <div className="bg-base-200/40 p-5 rounded-2xl border border-base-200 flex items-center space-x-4">
              <div className="avatar placeholder">
                <div className="bg-secondary/15 text-secondary font-extrabold rounded-full w-12 h-12 flex items-center justify-center text-lg">
                  {listing.userName?.charAt(0).toUpperCase()}
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold text-base-content/55 uppercase block">Listed By</span>
                <span className="font-bold text-base">{listing.userName || 'Anonymous'}</span>
                <span className="text-xs text-base-content/60 block">{listing.userEmail}</span>
              </div>
            </div>

            {/* Locked/Unlocked Contact info */}
            <div className={`p-5 rounded-2xl border transition-all duration-500 relative overflow-hidden flex flex-col justify-center ${isUnlocked
                ? 'bg-success/5 border-success/20 text-success-content'
                : 'bg-base-300/30 border-base-300 text-base-content/50 backdrop-blur-sm'
              }`}>
              {isUnlocked ? (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                    ✓ Contact Information Unlocked
                  </span>
                  <p className="font-bold text-base text-base-content">{listing.contactInfo}</p>
                  <p className="text-xs text-base-content/60">Say hello! Mention Co-Living Finder when contacting.</p>
                </div>
              ) : (
                <div className="space-y-2 text-center py-2">
                  <div className="mx-auto bg-base-300 w-9 h-9 rounded-full flex items-center justify-center text-base-content">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider block text-base-content/70">
                    Contact Info Locked
                  </span>
                  <button
                    onClick={handleLike}
                    className="btn btn-link btn-xs text-primary font-bold no-underline hover:underline p-0"
                  >
                    Click Like to Unlock
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
