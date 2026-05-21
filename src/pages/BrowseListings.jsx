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

  // Initial tag parameter from URL (e.g., from home lifestyle section)
  const tagParam = searchParams.get('tag');

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
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
    if (tagParam) {
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
                <th className="rounded-tl-2xl">Posted By</th>
                <th>Title / Type</th>
                <th>Location</th>
                <th>Rent</th>
                <th>Status</th>
                <th className="rounded-tr-2xl text-right">Action</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody>
              {filteredListings.map((item) => (
                <tr key={item._id} className="hover:bg-base-200/30 transition-colors">
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
                  {/* Title and Room Type */}
                  <td>
                    <div className="font-semibold text-sm line-clamp-1">{item.title}</div>
                    <span className="badge badge-secondary badge-sm text-[10px] font-semibold mt-1">
                      {item.roomType}
                    </span>
                  </td>
                  {/* Location */}
                  <td className="text-sm text-base-content/80 max-w-[200px] truncate">
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BrowseListings;
