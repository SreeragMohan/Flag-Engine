const db = require('../db');

class FlagsService {
    getAllFlags() {
        return db.prepare('SELECT * FROM feature_flags').all();
    }

    getFlagByKey(key) {
        return db.prepare('SELECT * FROM feature_flags WHERE key = ?').get(key);
    }

    createFlag(key, enabled, description) {
        db.prepare(
            'INSERT INTO feature_flags (key, enabled, description) VALUES (?, ?, ?)'
        ).run(key.trim(), enabled ? 1 : 0, description || null);

        return this.getFlagByKey(key.trim());
    }

    updateFlag(key, enabled, description) {
        const flag = this.getFlagByKey(key);
        if (!flag) return null;

        const newEnabled = enabled !== undefined ? (enabled ? 1 : 0) : flag.enabled;
        const newDescription = description !== undefined ? description : flag.description;

        db.prepare('UPDATE feature_flags SET enabled = ?, description = ? WHERE key = ?').run(
            newEnabled,
            newDescription,
            key
        );

        return this.getFlagByKey(key);
    }

    deleteFlag(key) {
        const info = db.prepare('DELETE FROM feature_flags WHERE key = ?').run(key);
        return info.changes > 0;
    }
}

module.exports = new FlagsService();
