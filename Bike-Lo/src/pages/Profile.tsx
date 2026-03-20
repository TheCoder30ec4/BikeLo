import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { meApi } from '@/services/authService';
import type { UserResponse } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogOut, User, Mail, Shield } from 'lucide-react';

export default function Profile() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      Promise.resolve().then(() => setLoading(false));
      return;
    }
    let cancelled = false;
    Promise.resolve().then(() => setLoading(true));
    Promise.resolve().then(() => setError(null));
    meApi()
      .then((data) => {
        if (!cancelled) setProfile(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load profile');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [isAuthenticated, user, user?.id]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view your profile</h1>
          <Button
            onClick={() => navigate('/login')}
            style={{ 
              backgroundColor: '#f7931e',
              fontFamily: "'Noto Serif', serif"
            }}
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  const name = profile?.name ?? user.name;
  const email = profile?.email ?? user.email;
  const phone = profile?.phone ?? user.phone;
  const status = profile?.status ?? user.status ?? 'Unknown';
  const role = profile?.role ?? user.role;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16 pt-24">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 pt-24 gap-4">
        <p className="text-destructive">{error}</p>
        <Button variant="outline" onClick={() => navigate('/')}>Go home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-16 pt-24">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 
            className="text-4xl font-bold mb-2"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            My Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account information
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
          {/* Profile Header */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
            <div className="w-20 h-20 rounded-full bg-[#f7931e] flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h2 
                className="text-2xl font-bold mb-1"
                style={{ fontFamily: "'Noto Serif', serif" }}
              >
                {name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {email}
              </p>
              {phone && (
                <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-2">
                  <span className="text-sm">📞</span>
                  {phone}
                </p>
              )}
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
              style={{ fontFamily: "'Noto Serif', serif" }}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            <div>
              <h3 
                className="text-xl font-bold mb-4"
                style={{ fontFamily: "'Noto Serif', serif" }}
              >
                Account Information
              </h3>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      readOnly
                      className="pl-10 bg-muted"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      readOnly
                      className="pl-10 bg-muted"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="pt-6 border-t border-border">
              <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div>
                  <p className="font-semibold text-green-800 dark:text-green-200">
                    Account Status
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {status}
                  </p>
                  {role && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Role: {role}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-6 border-t border-border">
              <h3 
                className="text-xl font-bold mb-4"
                style={{ fontFamily: "'Noto Serif', serif" }}
              >
                Quick Actions
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <Button
                  variant="outline"
                  className="justify-start h-auto py-4"
                  onClick={() => navigate('/sell')}
                  style={{ fontFamily: "'Noto Serif', serif" }}
                >
                  <div className="text-left">
                    <div className="font-bold">Sell Your Bike</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      List your bike for sale
                    </div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-auto py-4"
                  onClick={() => navigate('/bikes')}
                  style={{ fontFamily: "'Noto Serif', serif" }}
                >
                  <div className="text-left">
                    <div className="font-bold">Browse Bikes</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Explore our collection
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
