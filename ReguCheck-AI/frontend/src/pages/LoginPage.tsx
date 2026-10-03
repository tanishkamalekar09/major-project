import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('tanishka.qa@regucheck.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 400);
  };

  const handleDemoLogin = () => {
    setEmail('tanishka.qa@regucheck.ai');
    setPassword('DemoPass2026!');
    setLoading(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background Decorative Accent */}
      <div className="absolute top-0 inset-x-0 h-80 bg-navy-950 -z-0"></div>

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-2xl text-white tracking-tight">ReguCheck AI</span>
          </Link>
          <p className="text-xs text-slate-300">
            AI-Powered Packaged Product Compliance Verification
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">Sign in to your account</h2>
            <p className="text-xs text-slate-500 mt-1">Access product inspections, rule engine, and audit reports</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="analyst@fmcg-brand.com"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-[11px] text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-800 transition"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                defaultChecked
                className="w-3.5 h-3.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="remember" className="ml-2 text-xs text-slate-600">
                Remember this device for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login Option for Beginner/Evaluation */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-medium rounded-xl flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Instant Demo Login (QA Lead)</span>
            </button>
            <p className="text-[11px] text-center text-slate-400 mt-2">
              Bypasses authentication using simulated mock credentials
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-slate-500 hover:text-slate-800 transition">
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};
