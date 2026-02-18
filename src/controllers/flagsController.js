const flagsService = require('../services/flagsService');

class FlagsController {
    listFlags(req, res) {
        const flags = flagsService.getAllFlags();
        res.json(flags);
    }

    getFlag(req, res) {
        const flag = flagsService.getFlagByKey(req.params.key);
        if (!flag) return res.status(404).json({ error: 'Flag not found' });
        res.json(flag);
    }

    createFlag(req, res) {
        const { key, enabled, description } = req.body;

        if (!key || typeof key !== 'string') {
            return res.status(400).json({ error: 'Key is required and must be a string' });
        }
        if (typeof enabled !== 'boolean') {
            return res.status(400).json({ error: 'Enabled must be a boolean' });
        }

        try {
            const flag = flagsService.createFlag(key, enabled, description);
            res.status(201).json(flag);
        } catch (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(409).json({ error: 'Flag with this key already exists' });
            }
            res.status(500).json({ error: 'Failed to create flag' });
        }
    }

    updateFlag(req, res) {
        const { enabled, description } = req.body;

        if (enabled !== undefined && typeof enabled !== 'boolean') {
            return res.status(400).json({ error: 'Enabled must be a boolean' });
        }

        const updated = flagsService.updateFlag(req.params.key, enabled, description);
        if (!updated) return res.status(404).json({ error: 'Flag not found' });

        res.json(updated);
    }

    deleteFlag(req, res) {
        const deleted = flagsService.deleteFlag(req.params.key);
        if (!deleted) return res.status(404).json({ error: 'Flag not found' });
        res.status(204).send();
    }
}

module.exports = new FlagsController();
