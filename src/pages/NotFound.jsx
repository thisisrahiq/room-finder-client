import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';

const NotFound = () => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    // Fetch a reliable Lottie 404 animation from a CDN
    fetch('https://lottie.host/8bd0885e-63f5-46aa-836e-ea7892305a41/H4o7dPl3h9.json')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Failed to fetch Lottie');
      })
      .then((data) => setAnimationData(data))
      .catch((err) => {
        console.warn('Lottie loading failed, using premium SVG fallback:', err);
      });
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-base-100 px-6 py-12 transition-colors duration-300">
      <div className="max-w-md w-full text-center space-y-8 flex flex-col items-center">
        {/* Lottie Animation or Fallback SVG */}
        <div className="w-64 h-64 flex items-center justify-center">
          {animationData ? (
            <Lottie animationData={animationData} loop={true} className="w-full h-full" />
          ) : (
            // Premium Animated SVG Fallback
            <div className="relative w-48 h-48 animate-bounce">
              <svg className="w-full h-full text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-extrabold text-3xl text-neutral font-display select-none">
                404
              </div>
            </div>
          )}
        </div>

        {/* Text */}
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold tracking-tight font-display bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Page Not Found
          </h1>
          <p className="text-sm text-base-content/75 max-w-sm mx-auto">
            The room you are looking for might have been rented out, removed, or the link is incorrect.
          </p>
        </div>

        {/* Action */}
        <div>
          <Link to="/" className="btn btn-primary rounded-xl px-8 font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all">
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
