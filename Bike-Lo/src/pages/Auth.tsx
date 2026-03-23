import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import logoLight from '@/assets/logo-light.png';

export default function Auth() {
  const location = useLocation();
  const [isSignUp, setIsSignUp] = useState(location.pathname === '/signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [k: string]: string }>({});
  const { login, signup } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsSignUp(location.pathname === '/signup');
  }, [location.pathname]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const errors: { [k: string]: string } = {};
    if (!validateEmail(email)) errors.email = 'Enter a valid email';
    if (!password) errors.password = 'Enter your password';
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const errors: { [k: string]: string } = {};
    if (!name.trim()) errors.name = 'Full name is required';
    if (!validateEmail(email)) errors.email = 'Enter a valid email';
    if (phone && !validatePhone(phone)) errors.phone = 'Enter a valid phone number';
    if (password.length < 8) errors.password = 'Password must be at least 8 characters';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';

    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);
    setIsLoading(true);
    try {
      await signup(name, email, password, phone);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  const switchMode = () => {
    const newMode = !isSignUp;
    setIsSignUp(newMode);
    setError('');
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
    setPhone('');
    navigate(newMode ? '/signup' : '/login', { replace: true });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
    },
  };

  // When isSignUp=false (Sign In page): overlay sits on the RIGHT side covering the Sign Up form
  // When isSignUp=true  (Sign Up page): overlay slides to the LEFT side covering the Sign In form
  const overlayVariants = {
    signin: { x: '100%' }, // RIGHT — reveals sign-in form on the left
    signup: { x: '0%' },   // LEFT  — reveals sign-up form on the right
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07, delayChildren: 0.15 },
    },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  function validateEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validatePhone(value: string) {
    if (!value) return true;
    return /^\+?\d{7,15}$/.test(value.replace(/\s+/g, ''));
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-8">
      <motion.div
        className="w-full max-w-[900px]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="overflow-hidden border-border/50 shadow-2xl">
          <div className="grid md:grid-cols-2 min-h-[580px] relative">
            {/* ── Sliding Overlay Panel ── */}
            <motion.div
              className="hidden md:flex absolute top-0 bottom-0 w-1/2 z-10 bg-[#f7931e] flex-col items-center justify-center p-10 text-white"
              animate={isSignUp ? 'signup' : 'signin'}
              variants={overlayVariants}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
              style={{ borderRadius: '0.75rem' }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isSignUp ? 'overlay-signup' : 'overlay-signin'}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.35 }}
                >
                  <Link
                    to="/"
                    className="inline-block mb-6"
                  >
                    <img
                      src={logoLight}
                      alt="Bike-Lo"
                      className="h-25 w-auto object-contain brightness-0 invert"
                    />
                  </Link>

                  <h2
                    className="text-3xl md:text-4xl font-bold mb-3 text-white"
                    style={{ fontFamily: "'Noto Serif', serif" }}
                  >
                    {isSignUp ? 'Welcome Back!' : 'Hello, Friend!'}
                  </h2>
                  <p className="text-white/80 mb-8 text-base leading-relaxed max-w-xs mx-auto">
                    {isSignUp
                      ? 'Already have an account? Sign in and find your dream bike.'
                      : 'Register with your details to start your bike journey with us.'}
                  </p>

                  <Button
                    onClick={switchMode}
                    variant="outline"
                    className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-[var(--primary)] font-bold px-10 py-5 text-base rounded-full transition-all duration-300"
                    style={{ fontFamily: "'Noto Serif', serif" }}
                  >
                    {isSignUp ? 'SIGN IN' : 'SIGN UP'}
                  </Button>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* ── Left Column: Sign In Form ── */}
            <CardContent className="flex flex-col justify-center p-8 md:p-10 bg-[var(--card)]">
              <motion.div
                key="signin-form"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.h1
                  className="text-3xl font-bold mb-1 text-black dark:text-white"
                  style={{ fontFamily: "'Noto Serif', serif" }}
                  variants={itemVariants}
                >
                  Sign In
                </motion.h1>

                <form onSubmit={handleLogin} className="space-y-4">
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="login-email" className="text-black dark:text-white">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-11"
                    />
                  {fieldErrors.email && (
                    <p className="text-sm text-destructive mt-1">{fieldErrors.email}</p>
                  )}
                  </motion.div>

                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="login-password" className="text-black dark:text-white">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      className="h-11"
                    />
                  {fieldErrors.password && (
                    <p className="text-sm text-destructive mt-1">{fieldErrors.password}</p>
                  )}
                  </motion.div>

                  <motion.div className="text-right" variants={itemVariants}>
                    <button
                      type="button"
                      className="text-sm text-muted-foreground hover:text-[#f7931e] transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </motion.div>

                  <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      className="w-full h-11 text-base font-bold bg-[var(--primary)] hover:bg-[var(--primary)] text-white rounded-lg"
                      disabled={isLoading || isSubmitting}
                      style={{ fontFamily: "'Noto Serif', serif" }}
                    >
                      {isLoading ? 'Signing in...' : 'SIGN IN'}
                    </Button>
                  </motion.div>
                </form>

                {/* Mobile toggle */}
                <motion.div className="mt-6 text-center md:hidden" variants={itemVariants}>
                  <span className="text-sm text-black dark:text-white/70">
                    Don't have an account?{' '}
                  </span>
                  <button
                    onClick={switchMode}
                    className="text-sm font-bold text-[#f7931e] hover:text-[#e6851a]"
                    style={{ fontFamily: "'Noto Serif', serif" }}
                  >
                    Sign up
                  </button>
                </motion.div>
              </motion.div>
            </CardContent>

            {/* ── Right Column: Sign Up Form (desktop only) ── */}
            <CardContent className="hidden md:flex flex-col justify-center p-8 md:p-10 bg-[var(--card)]">
              <motion.div
                key="signup-form-right"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <SignUpForm
                  name={name}
                  setName={setName}
                  email={email}
                  setEmail={setEmail}
                  phone={phone}
                  setPhone={setPhone}
                  password={password}
                  setPassword={setPassword}
                  confirmPassword={confirmPassword}
                  setConfirmPassword={setConfirmPassword}
                  error={error}
                  isLoading={isLoading}
                  handleSignup={handleSignup}
                  itemVariants={itemVariants}
                  switchMode={switchMode}
                  showMobileToggle={false}
                  fieldErrors={fieldErrors}
                />
              </motion.div>
            </CardContent>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

/* ── Extracted Sign Up Form ── */
interface SignUpFormProps {
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone?: string;
  setPhone?: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  error: string;
  isLoading: boolean;
  handleSignup: (e: React.FormEvent) => void;
  itemVariants: any;
  switchMode: () => void;
  showMobileToggle: boolean;
  fieldErrors: { [k: string]: string };
}

function SignUpForm({
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  error,
  isLoading,
  handleSignup,
  itemVariants,
  switchMode,
  showMobileToggle,
  fieldErrors,
}: SignUpFormProps) {
  return (
    <>
      <motion.h1
        className="text-3xl font-bold mb-1 text-black dark:text-white"
        style={{ fontFamily: "'Noto Serif', serif" }}
        variants={itemVariants}
      >
        Create Account
      </motion.h1>

      <form onSubmit={handleSignup} className="space-y-3">
        <AnimatePresence>
          {error && (
            <motion.div
              className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div className="space-y-1.5" variants={itemVariants}>
          <Label htmlFor="signup-name" className="text-black dark:text-white">Full Name</Label>
          <Input
            id="signup-name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
            className="h-10"
          />
        </motion.div>

        <motion.div className="space-y-1.5" variants={itemVariants}>
          <Label htmlFor="signup-email" className="text-black dark:text-white">Email</Label>
          <Input
            id="signup-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="h-10"
          />
          {fieldErrors.email && (
            <p className="text-sm text-destructive mt-1">{fieldErrors.email}</p>
          )}
        </motion.div>

        <motion.div className="space-y-1.5" variants={itemVariants}>
          <Label htmlFor="signup-phone" className="text-black dark:text-white">Phone Number</Label>
          <Input
            id="signup-phone"
            type="tel"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone && setPhone(e.target.value)}
            required={false}
            disabled={isLoading}
            className="h-10"
          />
          {fieldErrors.phone && (
            <p className="text-sm text-destructive mt-1">{fieldErrors.phone}</p>
          )}
        </motion.div>

        <motion.div className="space-y-1.5" variants={itemVariants}>
          <Label htmlFor="signup-password" className="text-black dark:text-white">Password</Label>
          <Input
            id="signup-password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="h-10"
          />
        </motion.div>

        <motion.div className="space-y-1.5" variants={itemVariants}>
          <Label htmlFor="signup-confirm" className="text-black dark:text-white">Confirm Password</Label>
          <Input
            id="signup-confirm"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
            className="h-10"
          />
        </motion.div>

        {fieldErrors.password && (
          <p className="text-sm text-destructive mt-1">{fieldErrors.password}</p>
        )}
        {fieldErrors.confirmPassword && (
          <p className="text-sm text-destructive mt-1">{fieldErrors.confirmPassword}</p>
        )}

        <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            className="w-full h-11 text-base font-bold bg-[var(--primary)] hover:bg-[var(--primary)] text-white rounded-lg mt-1"
            disabled={isLoading}
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            {isLoading ? 'Creating account...' : 'SIGN UP'}
          </Button>
        </motion.div>
      </form>

      {showMobileToggle && (
        <motion.div className="mt-5 text-center" variants={itemVariants}>
          <span className="text-sm text-muted-foreground">
            Already have an account?{' '}
          </span>
          <button
            onClick={switchMode}
            className="text-sm font-bold text-[#f7931e] hover:text-[#e6851a]"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            Sign in
          </button>
        </motion.div>
      )}
    </>
  );
}
