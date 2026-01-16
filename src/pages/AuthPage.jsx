// src/pages/AuthPage.jsx
import React, { useState } from 'react';
import { auth, db } from '../services/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNotification } from '../contexts/NotificationContext';

// Icons as SVG components
const DumbbellIcon = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h3v12H4zM17 6h3v12h-3zM7 10h10v4H7z" />
  </svg>
);

const EyeIcon = ({ open }) => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {open ? (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </>
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    )}
  </svg>
);

const MailIcon = () => (
  <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const AuthPage = () => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { notifyError, notifySuccess } = useNotification();

  const handleAuthAction = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (isRegisterMode) {
      if (!name.trim()) {
        notifyError("Please enter your name.");
        setIsLoading(false);
        return;
      }
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const profileData = {
          name: name.trim(),
          age: 0,
          height: 0,
          weight: 0,
          createdAt: new Date(),
          subscription: { status: 'free' }
        };
        await setDoc(doc(db, `users/${userCredential.user.uid}/profile`, "data"), profileData);
        await setDoc(doc(db, "publicProfiles", userCredential.user.uid), {
          name: name.trim(),
          userId: userCredential.user.uid
        });
        notifySuccess && notifySuccess("Account created successfully!");
      } catch (err) {
        notifyError(getErrorMessage(err.code));
      }
    } else {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        notifySuccess && notifySuccess("Welcome back!");
      } catch (err) {
        notifyError(getErrorMessage(err.code));
      }
    }
    setIsLoading(false);
  };

  const getErrorMessage = (code) => {
    const messages = {
      'auth/email-already-in-use': 'This email is already registered',
      'auth/invalid-email': 'Please enter a valid email',
      'auth/weak-password': 'Password should be at least 6 characters',
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/too-many-requests': 'Too many attempts. Please try again later',
      'auth/invalid-credential': 'Invalid email or password',
      'auth/network-request-failed': 'Network error. Check your connection.',
    };
    console.error('Firebase auth error:', code);
    return messages[code] || `Error: ${code || 'Unknown error'}`;
  };

  const features = [
    { icon: '🏋️', title: 'Custom Workouts', desc: 'AI-powered training plans' },
    { icon: '🥗', title: 'Nutrition Tracking', desc: 'Monitor your daily intake' },
    { icon: '📊', title: 'Progress Analytics', desc: 'Visualize your journey' },
    { icon: '👥', title: 'Community', desc: 'Connect with others' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Features (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-hero-pattern opacity-30"></div>

        {/* Gradient Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-secondary-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2 mb-6">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary-600">
                <DumbbellIcon />
              </div>
              <span className="text-white font-bold text-xl">Aynergy Fitness</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
              Transform Your Body,<br />
              <span className="text-secondary-300">Transform Your Life</span>
            </h1>
            <p className="text-primary-100 text-lg max-w-md">
              Join thousands of users who have achieved their fitness goals with our comprehensive platform.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10
                         hover:bg-white/15 transition-all duration-300 group"
              >
                <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">
                  {feature.icon}
                </span>
                <h3 className="text-white font-semibold">{feature.title}</h3>
                <p className="text-primary-200 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-12 pt-8 border-t border-white/10">
            <div>
              <p className="text-3xl font-bold text-white">10K+</p>
              <p className="text-primary-200 text-sm">Active Users</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-primary-200 text-sm">Workout Plans</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">98%</p>
              <p className="text-primary-200 text-sm">Satisfaction</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 bg-neutral-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
              <DumbbellIcon />
            </div>
            <span className="text-2xl font-bold text-neutral-900">Aynergy</span>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-soft-lg p-8 sm:p-10 border border-neutral-100">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
                {isRegisterMode ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-neutral-500">
                {isRegisterMode
                  ? 'Start your fitness journey today'
                  : 'Sign in to continue your journey'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleAuthAction} className="space-y-5">
              {/* Name Field (Register only) */}
              {isRegisterMode && (
                <div className="animate-fade-in">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <UserIcon />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border-2 border-neutral-200 rounded-xl
                               focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white
                               transition-all duration-200 text-neutral-900 placeholder-neutral-400"
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MailIcon />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border-2 border-neutral-200 rounded-xl
                             focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white
                             transition-all duration-200 text-neutral-900 placeholder-neutral-400"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LockIcon />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3.5 bg-neutral-50 border-2 border-neutral-200 rounded-xl
                             focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white
                             transition-all duration-200 text-neutral-900 placeholder-neutral-400"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400
                             hover:text-neutral-600 transition-colors"
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
                {isRegisterMode && (
                  <p className="mt-2 text-xs text-neutral-500">
                    Must be at least 6 characters
                  </p>
                )}
              </div>

              {/* Remember Me / Forgot Password */}
              {!isRegisterMode && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-neutral-300 text-primary-600
                               focus:ring-primary-500 cursor-pointer"
                    />
                    <span className="text-neutral-600 group-hover:text-neutral-900 transition-colors">
                      Remember me
                    </span>
                  </label>
                  <button
                    type="button"
                    className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 bg-gradient-to-r from-primary-600 to-primary-500 text-white
                         font-semibold rounded-xl shadow-lg shadow-primary-500/30
                         hover:from-primary-700 hover:to-primary-600 hover:shadow-xl hover:shadow-primary-500/40
                         focus:ring-4 focus:ring-primary-200
                         active:scale-[0.98] transition-all duration-200
                         disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100
                         flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Please wait...</span>
                  </>
                ) : (
                  <>
                    <span>{isRegisterMode ? 'Create Account' : 'Sign In'}</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-neutral-500">
                  {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}
                </span>
              </div>
            </div>

            {/* Switch Mode Button */}
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setName('');
                setEmail('');
                setPassword('');
              }}
              className="w-full py-3.5 px-6 bg-white text-primary-600 font-semibold rounded-xl
                       border-2 border-primary-200 hover:bg-primary-50 hover:border-primary-300
                       active:scale-[0.98] transition-all duration-200"
            >
              {isRegisterMode ? 'Sign In Instead' : 'Create New Account'}
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-neutral-400 text-sm mt-8">
            By continuing, you agree to our{' '}
            <a href="#" className="text-primary-600 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
