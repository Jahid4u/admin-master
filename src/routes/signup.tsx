import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { claimFirstAdmin } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account | Admin" }] }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const claim = useServerFn(claimFirstAdmin);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin + "/admin" },
    });
    if (error) {
      setLoading(false);
      toast.error(error.message);
      return;
    }
    // Make sure session is established (auto-confirm is on)
    await supabase.auth.signInWithPassword({ email, password }).catch(() => {});
    try {
      const res = await claim();
      if (res.promoted) toast.success("Welcome — you're the admin");
      else toast.success("Account created");
    } catch {
      toast.success("Account created");
    }
    setLoading(false);
    navigate({ to: "/admin" });
  }

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
              <p className="text-xs text-muted-foreground">At least 8 characters.</p>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating…" : "Create account"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Already have one? <Link to="/login" className="underline">Sign in</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
