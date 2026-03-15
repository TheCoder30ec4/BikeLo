import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/hooks/use-theme';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { resolvedTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
  };

  const errorVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <motion.div 
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="text-center mb-8"
          variants={itemVariants}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Link 
              to="/" 
              className="inline-block"
              style={{ fontFamily: "'Noto Serif', serif" }}
            >
              <span className="text-4xl font-bold">
                <span className="text-[#DC2626]">Bike</span>
                <span className={resolvedTheme === 'dark' ? 'text-white' : 'text-black'}>-Lo</span>
              </span>
            </Link>
          </motion.div>
          <motion.h1 
            className="text-3xl font-bold mt-6 mb-2"
            style={{ fontFamily: "'Noto Serif', serif" }}
            variants={itemVariants}
          >
            Welcome Back
          </motion.h1>
          <motion.p 
            className="text-gray-600 dark:text-gray-400"
            variants={itemVariants}
          >
            Sign in to your account to continue
          </motion.p>
        </motion.div>

        <motion.div 
          className="bg-card border border-border rounded-xl p-8 shadow-lg"
          variants={cardVariants}
        >
          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={formVariants}
          >
            {error && (
              <motion.div 
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md text-sm"
                variants={errorVariants}
                initial="hidden"
                animate="visible"
              >
                {error}
              </motion.div>
            )}

            <motion.div 
              className="space-y-2"
              variants={itemVariants}
            >
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </motion.div>

            <motion.div 
              className="space-y-2"
              variants={itemVariants}
            >
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </motion.div>

            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                style={{ 
                  backgroundColor: '#f7931e',
                  fontFamily: "'Noto Serif', serif"
                }}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </motion.div>

            <motion.div 
              className="text-center text-sm"
              variants={itemVariants}
            >
              <span className="text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
              </span>
              <Link
                to="/signup"
                className="text-[#f7931e] hover:text-[#e6851a] font-semibold"
                style={{ fontFamily: "'Noto Serif', serif" }}
              >
                Sign up
              </Link>
            </motion.div>
          </motion.form>
        </motion.div>
      </motion.div>
    </div>
  );
}
