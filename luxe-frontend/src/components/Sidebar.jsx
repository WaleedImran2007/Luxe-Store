import { useContext, useState } from "react";
import {
    LayoutDashboard,
    Package,
    FolderOpen,
    ShoppingCart,
    Users,
    PlusSquare,
    FolderPlus,
    LogOut,
    Menu,
    X,
    Home,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../store/AuthContext.jsx";

const Sidebar = () => {
    const [open, setOpen] = useState(false);
    const { decodedUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setOpen(false);
        navigate('/login');
    };

    const links = [
        { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
        { name: "Products", path: "/admin/products", icon: <Package size={20} /> },
        { name: "Add Product", path: "/admin/add-item", icon: <PlusSquare size={20} /> },
        { name: "Categories", path: "/admin/categories", icon: <FolderOpen size={20} /> },
        { name: "Add Category", path: "/admin/add-category", icon: <FolderPlus size={20} /> },
        { name: "Orders", path: "/admin/orders", icon: <ShoppingCart size={20} /> },
        { name: "Users", path: "/admin/users", icon: <Users size={20} /> },
        { name: "Back To Home", path: "/", icon: <Home size={20} /> },
    ];

    return (
        <>
            {/* Mobile Topbar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-neutral-950 flex items-center justify-between px-5 z-40 border-b border-amber-500/20">
                <h1 className="text-xl font-bold">
                    <span className="text-amber-400">LUXE</span>
                    <span className="text-white"> Admin</span>
                </h1>
                <button onClick={() => setOpen(true)} className="text-white">
                    <Menu size={28} />
                </button>
            </div>

            {/* Overlay */}
            {open && (
                <div
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:sticky top-0 left-0 z-50 h-screen max-h-screen w-72 bg-neutral-950 text-white flex flex-col transition-transform duration-300 ${
                    open ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-6 [@media(max-height:700px)]:py-3 border-b border-amber-500/20 flex-shrink-0">
                    <div>
                        <h1 className="text-2xl font-bold">
                            <span className="text-amber-400">LUXE</span> Admin
                        </h1>
                        <p className="text-sm text-gray-400">Store Dashboard</p>
                    </div>
                    <button onClick={() => setOpen(false)} className="lg:hidden">
                        <X />
                    </button>
                </div>

                {/* Scrollable Navigation — min-h-0 lets this actually shrink & scroll instead of pushing the footer offscreen */}
                <div className="flex-1 min-h-0 overflow-y-auto px-4 py-5 [@media(max-height:700px)]:py-2">
                    <nav className="space-y-2">
                        {links.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                end={link.path === "/admin"}
                                onClick={() => setOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 px-4 py-3 [@media(max-height:700px)]:py-2 rounded-xl transition
                                    ${
                                        isActive
                                            ? "bg-amber-500 text-black font-medium"
                                            : "text-gray-300 hover:bg-neutral-800 hover:text-amber-400"
                                    }`
                                }
                            >
                                {link.icon}
                                {link.name}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Footer */}
                <div className="border-t border-amber-500/20 p-5 [@media(max-height:700px)]:p-3 flex-shrink-0">
                    <div className="flex items-center gap-3 mb-5 [@media(max-height:700px)]:mb-3">
                        <div className="w-12 h-12 [@media(max-height:700px)]:w-9 [@media(max-height:700px)]:h-9 rounded-full bg-amber-500 flex items-center justify-center font-bold text-black flex-shrink-0">
                            {decodedUser?.username?.[0]?.toUpperCase() || "A"}
                        </div>
                        <div className="min-w-0">
                            <h2 className="font-semibold truncate">{decodedUser?.username || "Admin"}</h2>
                            <p className="text-sm text-gray-400 truncate">Administrator</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-3 [@media(max-height:700px)]:py-2 rounded-xl bg-red-500/90 hover:bg-red-600 transition"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;