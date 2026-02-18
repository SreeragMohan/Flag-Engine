const resolveService = require('../services/resolveService');
const flagsService = require('../services/flagsService');
const overridesService = require('../services/overridesService');

class ResolveController {
    resolve(req, res) {
        const { key } = req.params;
        const { userId, groupId } = req.query;

        const flag = flagsService.getFlagByKey(key);
        if (!flag) return res.status(404).json({ error: `Flag '${key}' not found` });

        const overrides = overridesService.getOverridesByFlag(key);
        const result = resolveService.resolveFlag(flag, overrides, { userId, groupId });

        res.json({
            flag: key,
            enabled: result.enabled,
            reason: result.reason,
        });
    }
}

module.exports = new ResolveController();
