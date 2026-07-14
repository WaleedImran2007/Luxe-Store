import { useState, useRef, useEffect, useContext } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  User,
  Package,
  Heart,
  LogOut,
  LayoutDashboard
} from 'lucide-react'

import { AuthContext } from '../../store/AuthContext.jsx';
import { CartContext } from '../../store/CartContext.jsx';
import { jwtDecode } from 'jwt-decode';
import api from '../../api/api.js';

const navLinks = [
  { label: 'Shop', path: '/shop' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const [user, setUser] = useState(null);
  const { token, decodedUser, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);

  const fetchUser = async () => {
    try {
      const res = await api.get(
        `${import.meta.env.VITE_API_URL}/api/user/profile`
      );

      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setUser(null);
    }
  }, [token]);


  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigate = useNavigate();

  const isLoggedIn = Boolean(token);
  const username = decodedUser?.username || '';
  const role = decodedUser?.role || '';

  const userMenuRef = useRef(null)

  // close user dropdown when clicking outside (works for both mobile & desktop)
  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false)
    setMobileOpen(false)
    alert('Succesfully Log Out');
    navigate('/login');
  }

  const userDropdownLinks = [
    { label: 'My Profile', path: '/profile', icon: User },
    { label: 'My Orders', path: '/my-orders', icon: Package },
    { label: 'Wishlist', path: '/wishlist', icon: Heart },
    { label: `Cart (${cart.length})`, path: '/cart', icon: ShoppingBag },
  ]

  if (role === 'Admin') {
    userDropdownLinks.push({
      label: 'Dashboard',
      path: '/admin',
      icon: LayoutDashboard,
    })
  }

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-navy-900 text-cream text-center text-xs py-2 px-4 tracking-widest uppercase font-medium">
        Free shipping on orders over $150 &nbsp;·&nbsp; Use code{' '}
        <span className="text-amber-400 font-bold">LUXE20</span> for 20% off
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Mobile Menu Button — opens nav-link overlay only */}
            <button
              className="md:hidden p-2 text-navy-900"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo + Desktop Nav Links */}
            <div className="flex items-center justify-between w-[60%] gap-10">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-navy-900 flex items-center justify-center">
                  <span className="font-display text-amber-400 font-bold text-lg leading-none">L</span>
                </div>
                <span className="font-display text-2xl font-bold text-navy-900 tracking-tight">LUXE</span>
              </Link>

              <nav className="hidden md:flex items-center gap-8">
                {navLinks.map(link => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `text-sm font-medium tracking-wide transition-colors duration-200 pb-0.5 border-b-2 ${isActive
                        ? 'text-amber-500 border-amber-500'
                        : 'text-navy-900 border-transparent hover:text-amber-500 hover:border-amber-300'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Right Side: Auth Area */}
            <div className="flex items-center gap-1 sm:gap-2">

              {/* Logged Out — Login / Sign Up (desktop only; mobile version lives in the hamburger overlay) */}
              {!isLoggedIn && (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-navy-900 hover:text-amber-500 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 rounded-md bg-navy-900 text-cream hover:bg-navy-800 transition"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Logged In — avatar dropdown, shared trigger for mobile + desktop */}
              {isLoggedIn && (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-2 md:px-3 py-2 rounded-md text-navy-900 hover:bg-stone-100 transition"
                  >
                    <span className="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden bg-navy-900 text-cream flex items-center justify-center flex-shrink-0 ring-2 ring-stone-200">
                      {user?.profileImage ? (
                        <img
                          src={`${import.meta.env.VITE_API_URL}/uploads/pfp/${user.profileImage}`}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-semibold">
                          {user?.username?.[0]?.toUpperCase() || "U"}
                        </span>
                      )}
                    </span>
                    <span className="hidden md:inline text-sm font-medium">{username}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-cream border border-stone-200 rounded-md shadow-xl py-2 z-50">
                      <div className="md:hidden px-4 pb-2 mb-1 border-b border-stone-200">
                        <p className="text-sm font-semibold text-navy-900">{username}</p>
                      </div>
                      {userDropdownLinks.map(item => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-navy-900 hover:bg-stone-100 transition"
                        >
                          <item.icon size={16} className="text-navy-900/70" />
                          {item.label}
                        </Link>
                      ))}
                      <div className="border-t border-stone-200 my-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Logged Out — mobile trigger just points into the hamburger overlay */}
              {!isLoggedIn && (
                <button
                  className="md:hidden p-2 text-navy-900"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Account"
                >
                  <User size={22} />
                </button>
              )}

            </div>

          </div>
        </div>
      </header>

      {/* Mobile Hamburger Overlay — nav links only (+ login/signup if logged out) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-navy-900/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-cream shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200">
              <Link to="/" onClick={() => setMobileOpen(false)} className="font-display text-2xl font-bold text-navy-900">
                LUXE
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-1 text-navy-900">
                <X size={22} />
              </button>
            </div>

            <nav className="flex flex-col px-6 py-8 gap-6">
              {navLinks.map(link => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `text-lg font-medium transition-colors ${isActive ? 'text-amber-500' : 'text-navy-900 hover:text-amber-500'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {!isLoggedIn && (
              <div className="mt-auto px-6 pb-8 flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full border border-navy-900 py-3 text-center rounded-md text-navy-900 font-medium hover:bg-stone-100"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="w-full bg-navy-900 text-cream py-3 text-center rounded-md font-medium hover:bg-navy-800"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
