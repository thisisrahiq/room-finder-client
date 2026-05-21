import React from 'react';
import { Link } from 'react-router-dom';

const ListingCard = ({ listing }) => {
  const { _id, title, rent, roomType, location, lifestyle, userName, listingType, imageUrl } = listing;

  const fallbackImage = listingType === 'Roommate'
    ? 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=600&q=80'
    : 'https://images.unsplash.com/photo-1594498653385-d5172b53adc7?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-200 hover:-translate-y-1 group overflow-hidden">
      <figure className="relative h-48 w-full overflow-hidden bg-base-200">
        <img
          src={imageUrl || fallbackImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = fallbackImage;
          }}
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {listingType === 'Roommate' ? (
            <span className="badge badge-secondary text-white text-[10px] font-bold px-2 py-1 shadow-sm">
              Roommate
            </span>
          ) : (
            <span className="badge badge-accent text-white text-[10px] font-bold px-2 py-1 shadow-sm">
              Room
            </span>
          )}
          <span className="badge badge-neutral text-white text-[10px] font-bold px-2 py-1 shadow-sm">
            {roomType}
          </span>
        </div>
      </figure>

      <div className="card-body p-5 flex flex-col justify-between">
        <div>
          {/* Header info */}
          <div className="flex justify-between items-center mb-2">
            <span className="text-xl font-black text-primary">
              ${rent}<span className="text-xs text-base-content/60 font-medium">/mo</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="card-title text-base font-bold line-clamp-1 mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Location */}
          <div className="flex items-center text-xs text-base-content/65 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{location}</span>
          </div>

          {/* Lifestyle tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {lifestyle && lifestyle.slice(0, 3).map((tag, index) => (
              <span key={index} className="text-[10px] bg-secondary/10 text-secondary font-semibold px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
            {lifestyle && lifestyle.length > 3 && (
              <span className="text-[10px] bg-base-200 text-base-content/60 px-2 py-0.5 rounded-full">
                +{lifestyle.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Footer info & action */}
        <div className="pt-4 border-t border-base-200 flex items-center justify-between mt-auto">
          <div className="flex items-center space-x-2">
            <div className="avatar placeholder">
              <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center">
                <span className="text-xs font-bold uppercase">{userName?.charAt(0)}</span>
              </div>
            </div>
            <span className="text-xs font-medium text-base-content/75 truncate max-w-[90px]">
              {userName}
            </span>
          </div>

          <Link 
            to={`/listings/${_id}`} 
            className="btn btn-secondary btn-xs rounded-md font-medium text-white px-3"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
