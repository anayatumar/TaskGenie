import React, { useState } from 'react';
import { UserProfile, CompanyDetails } from '../types';
import { X, Mail, Phone, Lock, User, Building, ArrowRight, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile, company?: CompanyDetails) => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'signup',
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  // Form Fields (Mandatory Email & Mobile Phone Number)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+92 300 ');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Strict Validation: Mandatory Email and Mobile Phone Number
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('A valid email address is mandatory for registration.');
      return;
    }

    if (!phone.trim() || phone.replace(/\D/g, '').length < 8) {
      setErrorMsg('A valid mobile phone number is mandatory for registration.');
      return;
    }

    if (mode === 'signup' && !name.trim()) {
      setErrorMsg('Full name is mandatory.');
      return;
    }

    if (mode === 'signup' && !companyName.trim()) {
      setErrorMsg('Company name is mandatory.');
      return;
    }

    const registeredUser: UserProfile = {
      id: `usr_${Date.now()}`,
      name: name || 'Company Admin',
      email: email.trim(),
      phone: phone.trim(),
      title: 'Company Executive',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      bio: `Executive Admin at ${companyName || 'Company'}.`,
    };

    const registeredCompany: CompanyDetails = {
      id: `cmp_${Date.now()}`,
      companyName: companyName || 'Executive Corp',
      industry: 'Enterprise Operations',
      location: 'Pakistan',
      taxId: 'NTN-89210',
      logo: '',
      size: '10-50',
    };

    onLoginSuccess(registeredUser, registeredCompany);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn select-none">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative border border-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#10B981] flex items-center justify-center">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 font-heading">
                {mode === 'signup' ? 'Create TaskGenie Account' : 'Sign In to Account'}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Mandatory Email & Mobile Phone verification
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-fadeIn">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Tariq Mehmood"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-[#10B981]"
                />
              </div>
            </div>
          )}

          {/* MANDATORY EMAIL ADDRESS */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Email Address * <span className="text-[10px] text-[#10B981] font-extrabold">(Mandatory)</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#10B981]"
              />
            </div>
          </div>

          {/* MANDATORY MOBILE PHONE NUMBER */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Mobile Phone Number * <span className="text-[10px] text-[#10B981] font-extrabold">(Mandatory)</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                required
                placeholder="+92 300 1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#10B981]"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Company Name *</label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Traders Ltd"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#10B981]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#10B981]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs shadow-md shadow-[#10B981]/25 active:scale-95 transition-all flex items-center justify-center gap-1.5 pt-3"
          >
            <span>{mode === 'signup' ? 'Create Mandatory Account' : 'Sign In Now'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Sign In / Sign Up */}
        <div className="text-center pt-1 border-t border-slate-100">
          <button
            onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
            className="text-xs font-bold text-slate-600 hover:text-[#10B981] underline"
          >
            {mode === 'signup' ? 'Already have an account? Sign In' : "Don't have an account? Register Now"}
          </button>
        </div>
      </div>
    </div>
  );
};
