import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    if (user.role !== 'admin') {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-6" style={{ fontFamily: "'Noto Serif', serif" }}>
          Admin Dashboard
        </h1>
        <p className="mb-6">Welcome, {user.name}. You have administrator access.</p>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Bikes */}
          <div className="bg-card border border-border rounded-lg p-6 flex flex-col">
            <h2 className="font-semibold text-lg mb-2">Bikes</h2>
            <p className="text-sm text-muted-foreground flex-1">
              Manage bike inventory — add, edit or remove listings.
            </p>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" onClick={() => navigate('/buy')}>View Bikes</Button>
              <Link to="/admin/add-bike" className="inline-flex">
                <Button>Add Bike</Button>
              </Link>
            </div>
          </div>

          {/* Analytics */}
          <div className="bg-card border border-border rounded-lg p-6 flex flex-col">
            <h2 className="font-semibold text-lg mb-2">Analytics</h2>
            <p className="text-sm text-muted-foreground flex-1">
              View site analytics and recent activity (demo charts).
            </p>
            <div className="mt-4">
              <Button variant="outline" onClick={() => alert('Open analytics (demo)')}>Open Analytics</Button>
            </div>
          </div>

          {/* User Management */}
          <div className="bg-card border border-border rounded-lg p-6 flex flex-col">
            <h2 className="font-semibold text-lg mb-2">User Management</h2>
            <p className="text-sm text-muted-foreground flex-1">
              View and manage registered users, roles and statuses.
            </p>
            <div className="mt-4">
              <Button variant="outline" onClick={() => navigate('/admin/users')}>Open Users</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

