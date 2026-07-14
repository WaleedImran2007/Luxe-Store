import { useEffect, useMemo, useState } from "react";
import api from '../../../api/api.js';

import {
    Search,
    Users,
    Mail,
    Phone,
    MapPin,
    Calendar,
    ShieldCheck
} from "lucide-react";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get("/admin/all-users");
                setUsers(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const username = user.username?.toLowerCase() || "";
            const email = user.email?.toLowerCase() || "";

            return (
                username.includes(search.toLowerCase()) ||
                email.includes(search.toLowerCase())
            );
        });
    }, [users, search]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="w-10 h-10 border-4 border-neutral-200 border-t-[#B8860B] rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 p-4 sm:p-6 lg:p-8">

            {/* Header */}

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end mb-8 border-b border-neutral-200 pb-6">

                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#B8860B] font-semibold mb-1">
                        LUXE Admin
                    </p>

                    <h1 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900">
                        Users
                    </h1>

                    <p className="text-neutral-500 mt-1 text-sm">
                        {filteredUsers.length} total user{filteredUsers.length !== 1 && "s"}
                    </p>
                </div>

                <div className="relative w-full sm:w-72">
                    <Search
                        size={17}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                    />

                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full border border-neutral-300 rounded-lg pl-10 pr-4 py-2.5 text-sm bg-white focus:ring-2 focus:ring-[#B8860B]/40 focus:border-[#B8860B] outline-none transition-colors"
                    />
                </div>

            </div>

            {/* User Cards Grid */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

                {filteredUsers.map((user) => (

                    <div
                        key={user._id}
                        className="bg-white rounded-xl shadow-sm border border-neutral-200 p-5 hover:shadow-md transition-shadow"
                    >

                        {/* Top row: name + role */}

                        <div className="flex justify-between items-start mb-4">

                            <div className="flex items-center gap-3">

                                <div className="w-11 h-11 rounded-full bg-neutral-900 text-[#B8860B] flex items-center justify-center font-serif font-bold text-lg shrink-0">
                                    {user.username?.charAt(0).toUpperCase() || "?"}
                                </div>

                                <div>
                                    <h2 className="font-semibold text-neutral-900 leading-tight">
                                        {user.username}
                                    </h2>
                                    <p className="text-xs text-neutral-400 font-mono mt-0.5">
                                        #{user._id.slice(-8)}
                                    </p>
                                </div>

                            </div>

                            <span
                                className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${
                                    user.role === "Admin"
                                        ? "bg-green-50 text-green-800 border border-green-200"
                                        : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                                }`}
                            >
                                {user.role}
                            </span>

                        </div>

                        {/* Details */}

                        <div className="space-y-2.5 text-sm text-neutral-600">

                            <div className="flex items-center gap-2">
                                <Mail size={15} className="text-neutral-400 shrink-0" />
                                <span className="truncate">{user.email}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Phone size={15} className="text-neutral-400 shrink-0" />
                                {user.phone || "—"}
                            </div>

                            <div className="flex items-start gap-2">
                                <MapPin size={15} className="text-neutral-400 shrink-0 mt-0.5" />
                                <span>
                                    {user.address ? `${user.address}, ` : ""}
                                    {user.city}
                                    {user.postalCode ? ` ${user.postalCode}` : ""}
                                    {user.country ? `, ${user.country}` : ""}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Calendar size={15} className="text-neutral-400 shrink-0" />
                                Joined {new Date(user.createdAt).toLocaleDateString()}
                            </div>

                        </div>

                    </div>

                ))}

            </div>

            {filteredUsers.length === 0 && (

                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 py-16 text-center mt-8">

                    <Users
                        size={48}
                        className="mx-auto text-neutral-300 mb-4"
                    />

                    <h2 className="text-lg font-serif font-semibold text-neutral-800">
                        No Users Found
                    </h2>

                    <p className="text-neutral-500 mt-1 text-sm">
                        Try another search.
                    </p>

                </div>

            )}

        </div>
    );
};

export default AdminUsers;