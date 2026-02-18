const { resolveFlag } = require('../src/services/resolveService');

const flag = (enabled) => ({ key: 'test_flag', enabled: enabled ? 1 : 0 });
const override = (type, id, enabled) => ({ target_type: type, target_id: id, enabled: enabled ? 1 : 0 });

describe('resolveFlag()', () => {
    test('returns global default false when flag is off and no context given', () => {
        expect(resolveFlag(flag(false), [], {})).toEqual({ enabled: false, reason: 'global_default' });
    });

    test('returns global default true when flag is on and no context given', () => {
        expect(resolveFlag(flag(true), [], {})).toEqual({ enabled: true, reason: 'global_default' });
    });

    test('returns global default when overrides array is empty', () => {
        expect(resolveFlag(flag(true), [], { userId: 'alice', groupId: 'beta' })).toEqual({
            enabled: true,
            reason: 'global_default',
        });
    });

    test('returns global default when no override matches the given context', () => {
        const overrides = [override('user', 'alice', true)];
        expect(resolveFlag(flag(false), overrides, { userId: 'bob', groupId: 'gamma' })).toEqual({
            enabled: false,
            reason: 'global_default',
        });
    });

    test('user override true beats global default false', () => {
        const overrides = [override('user', 'alice', true)];
        expect(resolveFlag(flag(false), overrides, { userId: 'alice' })).toEqual({
            enabled: true,
            reason: 'user_override',
        });
    });

    test('user override false beats global default true', () => {
        const overrides = [override('user', 'alice', false)];
        expect(resolveFlag(flag(true), overrides, { userId: 'alice' })).toEqual({
            enabled: false,
            reason: 'user_override',
        });
    });

    test('group override true beats global default false', () => {
        const overrides = [override('group', 'beta', true)];
        expect(resolveFlag(flag(false), overrides, { groupId: 'beta' })).toEqual({
            enabled: true,
            reason: 'group_override',
        });
    });

    test('group override false beats global default true', () => {
        const overrides = [override('group', 'beta', false)];
        expect(resolveFlag(flag(true), overrides, { groupId: 'beta' })).toEqual({
            enabled: false,
            reason: 'group_override',
        });
    });

    test('user override wins over group override when both match', () => {
        const overrides = [
            override('user', 'alice', false),
            override('group', 'beta', true),
        ];
        expect(resolveFlag(flag(false), overrides, { userId: 'alice', groupId: 'beta' })).toEqual({
            enabled: false,
            reason: 'user_override',
        });
    });

    test('group override applies when user does not match but group does', () => {
        const overrides = [
            override('user', 'alice', false),
            override('group', 'beta', true),
        ];
        expect(resolveFlag(flag(false), overrides, { userId: 'bob', groupId: 'beta' })).toEqual({
            enabled: true,
            reason: 'group_override',
        });
    });

    test('works when no context argument is passed at all', () => {
        expect(resolveFlag(flag(true), [])).toEqual({ enabled: true, reason: 'global_default' });
    });

    test('undefined userId falls through to group override', () => {
        const overrides = [override('group', 'beta', true)];
        expect(resolveFlag(flag(false), overrides, { userId: undefined, groupId: 'beta' })).toEqual({
            enabled: true,
            reason: 'group_override',
        });
    });
});
