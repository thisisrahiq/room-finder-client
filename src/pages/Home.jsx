import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Typewriter } from 'react-simple-typewriter';
import { Fade, Slide } from 'react-awesome-reveal';
import ListingCard from '../components/ListingCard';
import LoadingSpinner from '../components/LoadingSpinner';

const CAROUSEL_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80",
    title: "Premium Shared Spaces",
    desc: "Discover beautiful, clean co-living houses in prime locations."
  },
  {
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80",
    title: "Find Your Perfect Match",
    desc: "Connect with roommates who match your routine and lifestyle."
  },
  {
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    title: "Flexible and Affordable",
    desc: "Browse single rooms, master bedrooms, and studio apartments."
  }
];

const LIFESTYLE_TAGS = [
  "Non-smoker", "Pet-friendly", "Student", "Professional",
  "Night Owl", "Early Bird", "Vegetarian", "Clean & Tidy",
  "Gym Lover", "WFH"
];

const Home = () => {
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [selectedTag, setSelectedTag] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://room-finder-server-tan.vercel.app';
        const res = await axios.get(`${apiUrl}/listings?status=available&limit=6`);
        if (res.data.success) {
          setFeaturedListings(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching featured listings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  // Auto slide carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-16 pb-12">
      {/* ── SECTION 1: HERO & CAROUSEL ────────────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
        {/* Hero Text */}
        <div className="lg:col-span-5 space-y-6">
          <Fade triggerOnce>
            <span className="badge badge-primary font-semibold py-1 px-3">
              Roommate Matching Made Easy
            </span>
          </Fade>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Find the Perfect <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              <Typewriter
                words={['Single Room', 'Shared Space', 'Co-Living Partner', 'Studio Flat']}
                loop={true}
                cursor
                cursorStyle='_'
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1500}
              />
            </span>
          </h1>

          <p className="text-base-content/75 text-base sm:text-lg max-w-md">
            Skip the hassle. Browse rooms with verified tenants, align lifestyle choices, and unlock stress-free living arrangements today.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link to="/listings?type=Room" className="btn btn-primary rounded-xl px-6 font-medium">
              Browse Rooms
            </Link>
            <Link to="/listings?type=Roommate" className="btn btn-outline btn-secondary rounded-xl px-6 font-medium text-secondary hover:text-white">
              Browse Roommates
            </Link>
          </div>
        </div>

        {/* Hero Carousel */}
        <div className="lg:col-span-7 relative h-[300px] sm:h-[400px] w-full overflow-hidden rounded-2xl shadow-xl group border border-base-200">
          {CAROUSEL_SLIDES.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === carouselIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              {idx === carouselIndex && (
                <>
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover brightness-[0.7] transform scale-105 transition-transform duration-[5000ms]"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white space-y-2">
                    <Slide direction="up" duration={600} triggerOnce>
                      <h2 className="text-xl sm:text-2xl font-bold font-display">{slide.title}</h2>
                      <p className="text-xs sm:text-sm text-gray-200 max-w-lg">{slide.desc}</p>
                    </Slide>
                  </div>
                </>
              )}
            </div>
          ))}

          {/* Carousel Controls */}
          <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 z-20 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => setCarouselIndex((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length)}
              className="btn btn-circle btn-sm btn-glass text-white border-none"
            >
              ❮
            </button>
            <button
              onClick={() => setCarouselIndex((prev) => (prev + 1) % CAROUSEL_SLIDES.length)}
              className="btn btn-circle btn-sm btn-glass text-white border-none"
            >
              ❯
            </button>
          </div>

          {/* Carousel Dots */}
          <div className="absolute bottom-4 right-6 z-20 flex space-x-2">
            {CAROUSEL_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCarouselIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === carouselIndex ? 'bg-primary w-6' : 'bg-white/50'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 2: HOW IT WORKS ───────────────────────────────────────────── */}
      <section className="bg-base-200/50 rounded-3xl p-8 sm:p-12 border border-base-200/60">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-10">
          <h2 className="text-3xl font-bold tracking-tight">How Co-Living Finder Works</h2>
          <p className="text-base-content/75 text-sm">Getting started takes only a few minutes. Find a place to live or locate your next roommate.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card bg-base-100 border border-base-200 p-6 space-y-4">
            <div className="bg-primary/10 text-primary w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg">1</div>
            <h3 className="text-lg font-bold">Create Profile</h3>
            <p className="text-sm text-base-content/70">Register and link your Google Account. Fill in your lifestyle habits to build trust.</p>
          </div>
          <div className="card bg-base-100 border border-base-200 p-6 space-y-4">
            <div className="bg-secondary/10 text-secondary w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg">2</div>
            <h3 className="text-lg font-bold">List or Search</h3>
            <p className="text-sm text-base-content/70">Post a free roommate/room listing or search our database with rooms matching your criteria.</p>
          </div>
          <div className="card bg-base-100 border border-base-200 p-6 space-y-4">
            <div className="bg-accent/10 text-accent w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg">3</div>
            <h3 className="text-lg font-bold">Connect & Meet</h3>
            <p className="text-sm text-base-content/70">Like room posts to unlock owner details. Message them directly and schedule a meeting.</p>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: FEATURED ROOMMATES ──────────────────────────────────────── */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Featured Roommates & Spaces</h2>
            <p className="text-base-content/75 text-sm">Check out these highly rated active spaces looking for a flatmate.</p>
          </div>
          <Link to="/listings" className="btn btn-outline btn-primary rounded-xl font-medium sm:self-end">
            View All Listings
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : featuredListings.length === 0 ? (
          <div className="text-center py-12 bg-base-200/30 rounded-2xl border border-dashed border-base-300">
            <p className="text-base-content/60">No listings available at the moment.</p>
            <Link to="/add-listing" className="btn btn-primary btn-sm mt-4">Create First Listing</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      {/* ── SECTION 4: LIFESTYLE TAGS EXPLORER ─────────────────────────────────── */}
      <section className="bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent rounded-3xl p-8 sm:p-12 border border-base-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">Explore by Lifestyle</h2>
            <p className="text-base-content/75 text-sm">
              We value compatibility. Filter listings instantly by roommate lifestyle preference. Select a tag to narrow down your preferences.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {LIFESTYLE_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`btn btn-xs rounded-full font-medium ${selectedTag === tag ? 'btn-primary' : 'btn-outline btn-neutral'}`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {selectedTag && (
              <div className="pt-2">
                <Link to={`/listings?tag=${selectedTag}`} className="btn btn-secondary btn-sm font-medium rounded-lg">
                  Search for "{selectedTag}" listings
                </Link>
              </div>
            )}
          </div>

          <div className="lg:col-span-7 bg-base-100 rounded-2xl p-6 shadow-md border border-base-200">
            <h3 className="font-bold text-lg mb-4">Why Matching Lifestyle Matters?</h3>
            <div className="space-y-4 text-sm text-base-content/80">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-emerald-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <p><strong>Sleep Sync:</strong> Avoid late-night noise clashes by aligning Early Birds and Night Owls.</p>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-emerald-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <p><strong>Cleanliness Agreement:</strong> Ensure house hygiene standards align before signing a lease.</p>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-emerald-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <p><strong>Pet Tolerance:</strong> Instantly discover pet-friendly environments or allergen-free spaces.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
