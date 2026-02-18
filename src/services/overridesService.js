const db = require('../db');

class OverridesService {
    getOverridesByFlag(flagKey) {
        return db.prepare('SELECT * FROM overrides WHERE flag_key = ?').all(flagKey);
    }

    setOverride(flagKey, type, targetId, enabled) {
        db.prepare(`
            INSERT INTO overrides (flag_key, target_type, target_id, enabled)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(flag_key, target_type, target_id) DO UPDATE SET enabled = excluded.enabled
        `).run(flagKey, type, targetId, enabled ? 1 : 0);

        return db.prepare(
            'SELECT * FROM overrides WHERE flag_key = ? AND target_type = ? AND target_id = ?'
        ).get(flagKey, type, targetId);
    }

    deleteOverride(flagKey, type, targetId) {
        const info = db.prepare(
            'DELETE FROM overrides WHERE flag_key = ? AND target_type = ? AND target_id = ?'
        ).run(flagKey, type, targetId);

        return info.changes > 0;
    }
}

module.exports = new OverridesService();
