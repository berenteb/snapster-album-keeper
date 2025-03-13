import { Camera } from "lucide-react";
import { Link } from "react-router-dom";

import { useAuth } from "@/contexts/auth-context";

import { Button } from "../ui/button";

function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center px-4">
        <Link to="/" className="flex items-center gap-2">
          <Camera className="h-6 w-6 text-teal-500" />
          <span className="text-xl font-semibold">Snapster</span>
        </Link>
        <nav className="ml-auto flex gap-4 items-center">
          <Link
            to="/"
            className="text-sm font-medium transition-colors hover:text-teal-500"
          >
            Home
          </Link>
          <Link
            to="/albums"
            className="text-sm font-medium transition-colors hover:text-teal-500"
          >
            Albums
          </Link>
          {user && (
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium">
                {user.firstName || user.email.split("@")[0]}
              </div>
              <Button onClick={logout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
