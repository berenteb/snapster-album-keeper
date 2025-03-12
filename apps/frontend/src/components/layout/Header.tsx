import { Camera } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center px-4">
        <Link to="/" className="flex items-center gap-2">
          <Camera className="h-6 w-6 text-teal-500" />
          <span className="text-xl font-semibold">Snapster</span>
        </Link>
        <nav className="ml-auto flex gap-4">
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
        </nav>
      </div>
    </header>
  );
};

export default Header;
