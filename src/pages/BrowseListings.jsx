import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const BrowseListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter States
  const [searchLocation, setSearchLocation] = useState('');
  const [filterRoomType, setFilterRoomType] = useState('');
  const [filterAvailability, setFilterAvailability] = useState('');
  // Initial parameters from URL
  const tagParam = searchParams.get('tag');
  const typeParam = searchParams.get('type');

  const [filterListingType, setFilterListingType] = useState(() => {
    if (typeParam === 'Room' || typeParam === 'Roommate') return typeParam;
    return 'All';
  });

  useEffect(() => {
    if (typeParam === 'Room' || typeParam === 'Roommate') {
      setFilterListingType(typeParam);
    } else if (!typeParam) {
      setFilterListingType('All');
    }
  }, [typeParam]);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        const res = await axios.get(`${apiUrl}/listings`);
        if (res.data.success) {
          setListings(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching listings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  // Filter listings client-side
  const filteredListings = listings.filter((item) => {
    // Listing Type Filter
    if (filterListingType !== 'All' && item.listingType !== filterListingType) {
      return false;
    }
    // Location Search
    if (searchLocation && !item.location.toLowerCase().includes(searchLocation.toLowerCase())) {
      return false;
    }
    // Room Type Filter
    if (filterRoomType && item.roomType !== filterRoomType) {
      return false;
    }
    // Availability Filter
    if (filterAvailability && item.availability !== filterAvailability) {
      return false;
    }
    // Home tag parameter filter
    if (tagParam && (!item.lifestyle || !item.lifestyle.some(t => t.toLowerCase() === tagParam.toLowerCase()))) {
      return false;
    }
    return true;
  });

  const clearFilters = () => {
    setSearchLocation('');
    setFilterRoomType('');
    setFilterAvailability('');
    setFilterListingType('All');
    if (tagParam || typeParam) {
      setSearchParams({});
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Browse Co-Living Listings</h1>
        <p className="text-base-content/75 text-sm">
          Discover roommate pairings and available rental rooms. Review details and connect.
        </p>
      </div>

      {/* Listing Type Tabs */}
      <div className="flex justify-center sm:justify-start">
        <div className="tabs tabs-boxed bg-base-200/60 p-1.5 rounded-2xl border border-base-200/50 gap-1">
          <button
            onClick={() => setFilterListingType('All')}
            className={`tab tab-sm rounded-xl font-bold px-5 transition-all ${
              filterListingType === 'All'
                ? 'tab-active bg-primary text-white shadow-sm'
                : 'text-base-content/70 hover:bg-base-300/40'
            }`}
          >
            All Listings
          </button>
          <button
            onClick={() => setFilterListingType('Room')}
            className={`tab tab-sm rounded-xl font-bold px-5 transition-all ${
              filterListingType === 'Room'
                ? 'tab-active bg-accent text-white shadow-sm'
                : 'text-base-content/70 hover:bg-base-300/40'
            }`}
          >
            Rooms Offering
          </button>
          <button
            onClick={() => setFilterListingType('Roommate')}
            className={`tab tab-sm rounded-xl font-bold px-5 transition-all ${
              filterListingType === 'Roommate'
                ? 'tab-active bg-secondary text-white shadow-sm'
                : 'text-base-content/70 hover:bg-base-300/40'
            }`}
          >
            Roommates Wanted
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-base-200/50 p-6 rounded-2xl border border-base-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Search Location */}
        <div className="form-control w-full">
          <label className="label py-1">
            <span className="label-text text-xs font-semibold">Search by Location</span>
          </label>
          <input
            type="text"
            placeholder="e.g. San Francisco, CA"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="input input-bordered input-sm focus:input-primary rounded-lg"
          />
        </div>

        {/* Room Type */}
        <div className="form-control w-full">
          <label className="label py-1">
            <span className="label-text text-xs font-semibold">Room Type</span>
          </label>
          <select
            value={filterRoomType}
            onChange={(e) => setFilterRoomType(e.target.value)}
            className="select select-bordered select-sm focus:select-primary rounded-lg font-medium"
          >
            <option value="">All Types</option>
            <option value="Single">Single</option>
            <option value="Shared">Shared</option>
            <option value="Studio">Studio</option>
            <option value="Master Bedroom">Master Bedroom</option>
          </select>
        </div>

        {/* Availability */}
        <div className="form-control w-full">
          <label className="label py-1">
            <span className="label-text text-xs font-semibold">Status</span>
          </label>
          <select
            value={filterAvailability}
            onChange={(e) => setFilterAvailability(e.target.value)}
            className="select select-bordered select-sm focus:select-primary rounded-lg font-medium"
          >
            <option value="">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Not Available">Not Available</option>
          </select>
        </div>

        {/* Clear Filters */}
        <button
          onClick={clearFilters}
          className="btn btn-neutral btn-sm rounded-lg font-medium w-full"
        >
          Reset Filters
        </button>
      </div>

      {/* Tag indicator from Home */}
      {tagParam && (
        <div className="flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-semibold max-w-fit">
          <span>Filtering by Lifestyle tag: #{tagParam}</span>
          <button onClick={() => setSearchParams({})} className="hover:scale-110 transition-transform">
            ✕
          </button>
        </div>
      )}

      {/* Main Table Content */}
      {loading ? (
        <LoadingSpinner />
      ) : filteredListings.length === 0 ? (
        <div className="text-center py-16 bg-base-200/20 rounded-2xl border border-dashed border-base-300">
          <p className="text-base-content/60">No listings match your search criteria.</p>
          <button onClick={clearFilters} className="btn btn-primary btn-sm mt-4 rounded-lg">Clear Search</button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-2xl border border-base-200 shadow-md">
          <table className="table w-full">
            {/* Table Head */}
            <thead>
              <tr className="bg-base-200/50 text-base-content/85">
                <th className="rounded-tl-2xl">Preview</th>
                <th>Posted By</th>
                <th>Title & Room/Listing Type</th>
                <th>Location</th>
                <th>Rent</th>
                <th>Status</th>
                <th className="rounded-tr-2xl text-right">Action</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody>
              {filteredListings.map((item) => {
                const fallbackImage = item.listingType === 'Roommate'
                  ? 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=200&q=80'
                  : 'https://images.unsplash.com/photo-1594498653385-d5172b53adc7?auto=format&fit=crop&w=200&q=80';

                return (
                  <tr key={item._id} className="hover:bg-base-200/30 transition-colors">
                    {/* Listing Preview Thumbnail */}
                    <td>
                      <div className="w-16 h-12 rounded-lg overflow-hidden border border-base-200 bg-base-200">
                        <img
                          src={item.imageUrl || fallbackImage}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = fallbackImage;
                          }}
                        />
                      </div>
                    </td>
                    {/* User details */}
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar placeholder">
                          <div className="bg-primary/10 text-primary font-bold rounded-full w-10 h-10 flex items-center justify-center">
                            {item.userName?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{item.userName || 'Anonymous'}</div>
                          <div className="text-xs text-base-content/50">{item.userEmail}</div>
                        </div>
                      </div>
                    </td>
                    {/* Title and Listing/Room Type */}
                    <td>
                      <div className="font-semibold text-sm line-clamp-1 max-w-[220px]">{item.title}</div>
                      <div className="flex gap-1.5 mt-1">
                        {item.listingType === 'Roommate' ? (
                          <span className="badge badge-secondary badge-xs text-[9px] font-bold px-1.5 py-1">
                            Roommate
                          </span>
                        ) : (
                          <span className="badge badge-accent badge-xs text-[9px] font-bold px-1.5 py-1 text-white">
                            Room
                          </span>
                        )}
                        <span className="badge badge-neutral badge-xs text-[9px] font-bold px-1.5 py-1">
                          {item.roomType}
                        </span>
                      </div>
                    </td>
                    {/* Location */}
                    <td className="text-sm text-base-content/80 max-w-[180px] truncate">
                      {item.location}
                    </td>
                    {/* Rent */}
                    <td className="font-bold text-primary">
                      ${item.rent}<span className="text-xs text-base-content/50 font-normal">/mo</span>
                    </td>
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
                    {/* View details */}
                    <td className="text-right">
                      <Link 
                        to={`/listings/${item._id}`} 
                        className="btn btn-primary btn-sm rounded-lg font-semibold text-xs px-4"
                      >
                        See Details
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BrowseListings;
