import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { listUsersApi, updateUserRoleApi } from "@/services/authService";
import type { UserResponse } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminUsers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/", { replace: true });
      return;
    }
    listUsersApi()
      .then(setUsers)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load users"))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const handleRoleChange = async (userId: number, newRole: "user" | "admin") => {
    try {
      const updated = await updateUserRoleApi(userId, { role: newRole });
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update role");
    }
  };

  if (!user || user.role !== "admin") return null;
  if (loading) return <div className="p-8 pt-24">Loading users...</div>;
  if (error) return <div className="p-8 pt-24 text-destructive">{error}</div>;

  return (
    <div className="min-h-screen px-4 py-12 pt-24">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate("/admin")}>
            Back to Admin
          </Button>
          <h1 className="text-2xl font-bold">User Management</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>All users</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {users.map((u) => (
                <li
                  key={u.id}
                  className="flex flex-wrap items-center justify-between gap-2 py-2 border-b border-border last:border-0"
                >
                  <div>
                    <span className="font-medium">{u.name}</span>
                    <span className="text-muted-foreground ml-2">({u.email})</span>
                    <span className="ml-2 text-sm text-muted-foreground">{u.phone}</span>
                    <Badge variant="secondary" className="ml-2">
                      {u.role}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={u.role === "admin" ? "default" : "outline"}
                      onClick={() => handleRoleChange(u.id, "admin")}
                    >
                      Admin
                    </Button>
                    <Button
                      size="sm"
                      variant={u.role === "user" ? "default" : "outline"}
                      onClick={() => handleRoleChange(u.id, "user")}
                    >
                      User
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

