'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import PasswordInput from '@/components/PasswordInput';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs: typeof errors = {};
    if (!email) errs.email = 'Email is required';
    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await login(email, password);
    } catch {
      setErrors({ general: 'Invalid email or password.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-beige flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <img src="/cactus-login.png" alt="Cactus" className="mx-auto mb-4 h-36" />
          <h1 className="text-[48px] font-bold text-[#88642A] leading-none">Yay, You&apos;re Back!</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <p className="text-red-500 text-sm text-center">{errors.general}</p>
          )}

          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className={`auth-input w-full px-4 py-3 border border-[#957139] rounded-[6px] text-primary bg-beige focus:outline-none ${errors.email ? 'border-red-400' : ''}`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          <div className="pt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 border border-[#957139] rounded-full font-['Inter'] font-bold text-[16px] leading-none text-[#957139] hover:bg-[#95713933] transition-colors disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>

        <p className="text-center mt-2">
          <Link href="/signup" className="font-['Inter'] font-normal text-[12px] leading-none text-[#957139] underline">
            Oops! I’ve never been here before
          </Link>
        </p>
      </div>
    </div>
  );
}
