class ResolveService {
    resolveFlag(flag, overrides, context = {}) {
        const { userId, groupId } = context;

        if (userId) {
            const userMatch = overrides.find(o => o.target_type === 'user' && o.target_id === userId);
            if (userMatch) {
                return { enabled: userMatch.enabled === 1, reason: 'user_override' };
            }
        }

        if (groupId) {
            const groupMatch = overrides.find(o => o.target_type === 'group' && o.target_id === groupId);
            if (groupMatch) {
                return { enabled: groupMatch.enabled === 1, reason: 'group_override' };
            }
        }

        return { enabled: flag.enabled === 1, reason: 'global_default' };
    }
}

module.exports = new ResolveService();
