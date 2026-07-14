import User from "../../../models/User.js";

export async function searchUsers(context, step, user) {
    if (user.role !== 'Admin') {
        context.error = "You don't have permission to view user information.";
        return;
    }

    const query = step.input?.query?.trim();

    const filter = query ? {
        $or: [
            { username: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } }
        ]
    } : {}

    const users = await User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

    if (users.length === 0) {
        context.directReply = query
            ? `No users found matching "${query}".`
            : "No users found.";
        return;
    }

    context.users = users.map(u => ({
        username: u.username,
        email: u.email,
        role: u.role,
        city: u.city,
        country: u.country,
        joined: u.createdAt,
    }));
}