import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Swal from 'sweetalert2';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const { loginUser, loginWithGoogle } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please fill in all fields.',
        icon: 'warning',
        background: isDark ? '#1e293b' : '#ffffff',
        color: isDark ? '#f8fafc' : '#0f172a',
      });
      return;
    }

    setAuthLoading(true);
    try {
      await loginUser(email, password);
      Swal.fire({
        title: 'Logged In Successfully!',
        text: 'Welcome back!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        background: isDark ? '#1e293b' : '#ffffff',
        color: isDark ? '#f8fafc' : '#0f172a',
      });
      navigate(redirectPath, { replace: true });
    } catch (err) {
      let errorMessage = err.message;
      if (err.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = 'No user found with this email.';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      }
      Swal.fire({
        title: 'Authentication Failed',
        text: errorMessage,
        icon: 'error',
        background: isDark ? '#1e293b' : '#ffffff',
        color: isDark ? '#f8fafc' : '#0f172a',
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    try {
      await loginWithGoogle();
      Swal.fire({
        title: 'Signed in with Google!',
        text: 'Welcome back!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        background: isDark ? '#1e293b' : '#ffffff',
        color: isDark ? '#f8fafc' : '#0f172a',
      });
      navigate(redirectPath, { replace: true });
    } catch (err) {
      Swal.fire({
        title: 'Google Login Failed',
        text: err.message,
        icon: 'error',
        background: isDark ? '#1e293b' : '#ffffff',
        color: isDark ? '#f8fafc' : '#0f172a',
      });
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-200">
        <div className="card-body p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight font-display">Welcome Back</h2>
            <p className="text-sm text-base-content/65">Log in to view matches and details</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-semibold">Email Address</span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered focus:input-primary rounded-xl"
                required
              />
            </div>

            {/* Password Field */}
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-semibold">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered focus:input-primary rounded-xl"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={authLoading}
              className="btn btn-primary w-full rounded-xl mt-2 font-semibold"
            >
              {authLoading ? <span className="loading loading-spinner"></span> : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="divider text-xs text-base-content/40 uppercase">Or continue with</div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={authLoading}
            className="btn btn-outline btn-neutral w-full rounded-xl font-semibold flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
            <span>Google</span>
          </button>

          {/* Register Link */}
          <p className="text-center text-sm text-base-content/65">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-bold hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
