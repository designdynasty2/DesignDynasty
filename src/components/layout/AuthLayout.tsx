import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react"; // for toggle icons

const AuthLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({
    username: "Guest",
    role: "User",
    image: "",
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const username = localStorage.getItem("username") || "Guest";
    const role = localStorage.getItem("role") || "User";
    const image = localStorage.getItem("profileImage") || "";
    setUser({ username, role, image });
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Auto-logout timer: clears storage and redirects after 5 minutes since login
  useEffect(() => {
    const TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

    const checkExpiry = () => {
      const loginTimeStr = localStorage.getItem("loginTime");
      const token = localStorage.getItem("ddtoken");
      if (!token || !loginTimeStr) {
        handleLogout();
        return;
      }
      const loginTime = Number(loginTimeStr);
      if (Number.isNaN(loginTime) || Date.now() - loginTime > TIMEOUT_MS) {
        handleLogout();
      }
    };

    const intervalId = setInterval(checkExpiry, 1000 * 15); // check every 15s
    // Run once immediately on mount
    checkExpiry();

    return () => clearInterval(intervalId);
  }, []);

  const isActivePath = (path) => {
    const current = location.pathname || "/";
    if (current === path) return true;
    if (current.startsWith(path + "/")) return true;
    return false;
  };

  const activeClass = "bg-[var(--orange)] text-white";
  const inactiveClass = "text-gray-300 hover:bg-gray-700 hover:text-white";

  const linkClass = (path) =>
    `block px-3 py-2 rounded transition ${
      isActivePath(path) ? activeClass : inactiveClass
    }`;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-white p-6 flex flex-col fixed lg:static inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out w-64 z-50`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Design Dynasty</h2>
          {/* Close button (mobile only) */}
          <button
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1">
          <ul className="space-y-4">
            <li>
              <Link
                to="/auth/dashboard"
                className={linkClass("/auth/dashboard")}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/auth/user-management"
                className={linkClass("/auth/user-management")}
              >
                User Management
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Overlay for sidebar (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Right side */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="h-16 bg-gray-800 text-white flex items-center justify-between px-6 shadow relative">
          {/* Left */}
          <div className="flex items-center gap-3">
            {/* Sidebar toggle (mobile) */}
            <button
              className="lg:hidden text-gray-300 hover:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold truncate">
              Welcome back, {user.username}
            </h1>
          </div>

          {/* Right (Profile) */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setMenuOpen((s) => !s)}
              className="flex items-center gap-2 focus:outline-none"
            >
              {user.image ? (
                <img
                  src={user.image}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white">
                  {String(user.username).charAt(0).toUpperCase() || "G"}
                </div>
              )}
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium">{user.username}</p>
                <p className="text-xs text-gray-300">{user.role}</p>
              </div>
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded shadow-lg z-50">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;
