const overridesService = require('../services/overridesService');
const flagsService = require('../services/flagsService');

class OverridesController {
    listOverrides(req, res) {
        const flag = flagsService.getFlagByKey(req.params.key);
        if (!flag) return res.status(404).json({ error: 'Flag not found' });

        const overrides = overridesService.getOverridesByFlag(req.params.key);
        res.json(overrides);
    }

    setOverride(req, res) {
        const { key, type, targetId } = req.params;
        const { enabled } = req.body;

        if (!['user', 'group'].includes(type)) {
            return res.status(400).json({ error: 'Type must be user or group' });
        }
        if (typeof enabled !== 'boolean') {
            return res.status(400).json({ error: 'Enabled is required and must be a boolean' });
        }

        const flag = flagsService.getFlagByKey(key);
        if (!flag) return res.status(404).json({ error: 'Flag not found' });

        const override = overridesService.setOverride(key, type, targetId, enabled);
        res.json(override);
    }

    deleteOverride(req, res) {
        const { key, type, targetId } = req.params;
        const deleted = overridesService.deleteOverride(key, type, targetId);

        if (!deleted) return res.status(404).json({ error: 'Override not found' });
        res.status(204).send();
    }
}

module.exports = new OverridesController();
