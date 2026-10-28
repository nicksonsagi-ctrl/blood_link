import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Heart, Shield, Lock, Mail, Phone, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { BLOOD_GROUPS, SRI_LANKA_PROVINCES, SRI_LANKA_DISTRICTS } from '../data/sriLankaData.js';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
  initialRole?: 'DONOR' | 'REQUESTER';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login',
  initialRole = 'DONOR'
}) => {
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  // Login state with remembered credentials support
  const [loginEmail, setLoginEmail] = useState(() => {
    return localStorage.getItem('lifelink_remembered_email') || '';
  });
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem('lifelink_remember_me') !== 'false';
  });

  // Register state
  const [fullName, setFullName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [phone, setPhone] = useState('+94 ');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'DONOR' | 'REQUESTER'>(initialRole);
  const [privacyConsent, setPrivacyConsent] = useState(false);

  // Donor specific fields
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [dob, setDob] = useState('1998-05-15');
  const [province, setProvince] = useState('Northern Province');
  const [district, setDistrict] = useState('Jaffna');
  const [city, setCity] = useState('Jaffna Town');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState<number | undefined>();
  const [lng, setLng] = useState<number | undefined>();
  const [isCapturingGPS, setIsCapturingGPS] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  // Status state
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await login(loginEmail, loginPassword);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Login failed. Please verify your credentials.');
    } else {
      // Auto-save remembered email in localStorage
      if (rememberMe) {
        localStorage.setItem('lifelink_remembered_email', loginEmail);
        localStorage.setItem('lifelink_remember_me', 'true');
      } else {
        localStorage.removeItem('lifelink_remembered_email');
        localStorage.setItem('lifelink_remember_me', 'false');
      }

      // Explicitly trigger browser Credential Manager to prompt "Save password?"
      if (typeof window !== 'undefined' && 'PasswordCredential' in window && navigator.credentials) {
        try {
          const cred = new (window as any).PasswordCredential({
            id: loginEmail,
            password: loginPassword,
            name: loginEmail
          });
          await navigator.credentials.store(cred);
        } catch {
          // Continue if browser blocks in sandboxed environments
        }
      }

      onClose();
      if (result.role === 'ADMIN') navigate('/admin/dashboard');
      else if (result.role === 'DONOR') navigate('/donor/dashboard');
      else navigate('/requester/dashboard');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    if (!privacyConsent) {
      setError('You must consent to the privacy and verification policy to proceed.');
      return;
    }

    setIsSubmitting(true);
    const payload = {
      fullName,
      email: registerEmail,
      phone: phone.replace(/\s+/g, ''),
      password,
      role,
      privacyConsent,
      bloodGroup: role === 'DONOR' ? bloodGroup : undefined,
      dob: role === 'DONOR' ? dob : undefined,
      province,
      district,
      city,
      address: role === 'DONOR' ? (address || `${city}, ${district}`) : undefined,
      lat: role === 'DONOR' ? lat : undefined,
      lng: role === 'DONOR' ? lng : undefined,
      isAvailable: role === 'DONOR' ? isAvailable : undefined
    };

    const result = await register(payload);

    if (!result.success) {
      setIsSubmitting(false);
      setError(result.error || 'Registration failed.');
      return;
    }

    // Auto-login newly registered user immediately so they land directly in their dashboard
    // and the browser prompts to save their credentials!
    const loginResult = await login(registerEmail, password);
    setIsSubmitting(false);

    if (rememberMe) {
      localStorage.setItem('lifelink_remembered_email', registerEmail);
      localStorage.setItem('lifelink_remember_me', 'true');
    }

    // Trigger browser native password saving dialog
    if (typeof window !== 'undefined' && 'PasswordCredential' in window && navigator.credentials) {
      try {
        const cred = new (window as any).PasswordCredential({
          id: registerEmail,
          password: password,
          name: fullName || registerEmail
        });
        await navigator.credentials.store(cred);
      } catch {
        // Continue safely
      }
    }

    onClose();
    if (role === 'DONOR') navigate('/donor/dashboard');
    else navigate('/requester/dashboard');
  };

  const currentDistrictCities = SRI_LANKA_DISTRICTS[district]?.cities || ['Town'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-[#FFF0F2]/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#DC0A20] flex items-center justify-center text-white">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">LifeLink Sri Lanka</h3>
              <p className="text-xs text-neutral-500">Every Drop Saves a Life</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-neutral-200 bg-neutral-50 px-6 pt-2">
          <button
            type="button"
            onClick={() => { setTab('login'); setError(null); }}
            className={`py-3 px-6 text-sm font-semibold border-b-2 transition-colors ${
              tab === 'login'
                ? 'border-[#DC0A20] text-[#DC0A20]'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setError(null); }}
            className={`py-3 px-6 text-sm font-semibold border-b-2 transition-colors ${
              tab === 'register'
                ? 'border-[#DC0A20] text-[#DC0A20]'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto px-6 py-6 flex-1">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-800">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#DC0A20]" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-800">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          {tab === 'login' ? (
            <form id="login-form" method="POST" onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label htmlFor="login-username" className="block text-xs font-semibold text-neutral-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    id="login-username"
                    name="username"
                    type="email"
                    required
                    autoComplete="username"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. donor@lifelink.lk"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#DC0A20]/20 focus:border-[#DC0A20]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="block text-xs font-semibold text-neutral-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    id="login-password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#DC0A20]/20 focus:border-[#DC0A20]"
                  />
                </div>
              </div>

              {/* Auto-Save & Remember Credentials Checkbox */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 text-neutral-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded border-neutral-300 focus:ring-red-500 cursor-pointer"
                  />
                  <span className="font-semibold text-neutral-800">
                    Auto-Save & Remember on this device (தானியங்கி சேமிப்பு)
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-[#DC0A20] hover:bg-[#B80020] text-white rounded-lg font-semibold text-sm transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Verifying Credentials...' : 'Sign In to Dashboard'}
              </button>
            </form>
          ) : (
            <form id="register-form" method="POST" onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Role selection: Donor or Requester */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Register As
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('DONOR')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border text-center transition-all ${
                      role === 'DONOR'
                        ? 'border-[#DC0A20] bg-[#FFF0F2] text-[#DC0A20]'
                        : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    Voluntary Blood Donor
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('REQUESTER')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border text-center transition-all ${
                      role === 'REQUESTER'
                        ? 'border-[#DC0A20] bg-[#FFF0F2] text-[#DC0A20]'
                        : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    Blood Requester / Patient
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="reg-fullname" className="block text-xs font-semibold text-neutral-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    id="reg-fullname"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Sivanathan Arun"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#DC0A20]/20 focus:border-[#DC0A20]"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="reg-email" className="block text-xs font-semibold text-neutral-700 mb-1">
                  Email Address (Unique)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    id="reg-email"
                    name="username"
                    type="email"
                    required
                    autoComplete="username"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="e.g. arun.s@example.lk"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#DC0A20]/20 focus:border-[#DC0A20]"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="reg-phone" className="block text-xs font-semibold text-neutral-700 mb-1">
                  Sri Lankan Contact Phone
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    id="reg-phone"
                    name="tel"
                    type="tel"
                    required
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+94 77 123 4567"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#DC0A20]/20 focus:border-[#DC0A20]"
                  />
                </div>
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="reg-password" className="block text-xs font-semibold text-neutral-700 mb-1">
                    Password
                  </label>
                  <input
                    id="reg-password"
                    name="password"
                    type="password"
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#DC0A20]/20 focus:border-[#DC0A20]"
                  />
                </div>
                <div>
                  <label htmlFor="reg-confirm-password" className="block text-xs font-semibold text-neutral-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="reg-confirm-password"
                    name="confirm-password"
                    type="password"
                    required
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#DC0A20]/20 focus:border-[#DC0A20]"
                  />
                </div>
              </div>

              {/* Donor specific fields */}
              {role === 'DONOR' && (
                <div className="p-3 bg-neutral-50 rounded-xl space-y-3 border border-neutral-200">
                  <p className="text-xs font-bold text-neutral-800">Donor Information</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-neutral-600 mb-1">Blood Group</label>
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-neutral-300 rounded-lg bg-white"
                      >
                        {BLOOD_GROUPS.map(bg => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-600 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-neutral-300 rounded-lg bg-white"
                      >
                      </input>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-neutral-600 mb-1">District</label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-neutral-300 rounded-lg bg-white"
                      >
                        {Object.keys(SRI_LANKA_DISTRICTS).map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-600 mb-1">City / Town</label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs border border-neutral-300 rounded-lg bg-white"
                      >
                        {currentDistrictCities.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Donor Full Address / Area */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-medium text-neutral-700">
                        Street Address / Area (வீட்டு முகவரி / பகுதி)
                      </label>
                      {lat && lng ? (
                        <span className="text-[10px] text-emerald-700 font-semibold font-mono">
                          📍 GPS Pin Saved
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            if (navigator.geolocation) {
                              setIsCapturingGPS(true);
                              navigator.geolocation.getCurrentPosition(
                                (pos) => {
                                  setLat(pos.coords.latitude);
                                  setLng(pos.coords.longitude);
                                  setIsCapturingGPS(false);
                                },
                                () => setIsCapturingGPS(false)
                              );
                            }
                          }}
                          className="text-[10px] text-[#DC0A20] font-semibold hover:underline flex items-center gap-0.5"
                        >
                          <span>{isCapturingGPS ? 'Locating...' : '📍 Auto-detect GPS Pin'}</span>
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. No. 45, Temple Road, Nallur (Near Kovil)"
                      className="w-full px-2.5 py-1.5 text-xs border border-neutral-300 rounded-lg bg-white focus:outline-hidden focus:ring-1 focus:ring-[#DC0A20]"
                    />
                    <span className="text-[10px] text-neutral-500 mt-0.5 block">
                      Requesters on the map will see your real location area when looking for donors.
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="availToggle"
                      checked={isAvailable}
                      onChange={(e) => setIsAvailable(e.target.checked)}
                      className="rounded border-neutral-300 text-[#DC0A20] focus:ring-[#DC0A20]"
                    />
                    <label htmlFor="availToggle" className="text-xs text-neutral-700">
                      Currently available for voluntary blood donation requests
                    </label>
                  </div>
                </div>
              )}

              {/* Privacy Consent */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="consentCheckbox"
                  required
                  checked={privacyConsent}
                  onChange={(e) => setPrivacyConsent(e.target.checked)}
                  className="mt-0.5 rounded border-neutral-300 text-[#DC0A20] focus:ring-[#DC0A20]"
                />
                <label htmlFor="consentCheckbox" className="text-xs text-neutral-600 leading-tight">
                  I agree to the LifeLink Privacy Terms. I understand my phone number and email will remain confidential and private until I explicitly accept a contact request.
                </label>
              </div>

              {/* Auto-Save & Remember Credentials on Registration */}
              <div className="flex items-center justify-between text-xs pt-1 p-2.5 bg-neutral-50 rounded-lg border border-neutral-200">
                <label className="flex items-center gap-2 text-neutral-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded border-neutral-300 focus:ring-red-500 cursor-pointer"
                  />
                  <div>
                    <span className="font-semibold text-neutral-800 block">
                      Auto-Save & Remember Credentials (தானியங்கி சேமிப்பு)
                    </span>
                    <span className="text-[10px] text-neutral-500 block">
                      Browser will prompt to save your login password for easy 1-click access.
                    </span>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-[#DC0A20] hover:bg-[#B80020] text-white rounded-lg font-semibold text-sm transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Creating Account & Signing In...' : 'Complete Registration & Sign In'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
