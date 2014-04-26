describe('Config testing', function () {
    'use strict';

    var notified = [1, 2, 3];

    beforeEach(function () {
        config.notified = notified;
    });

    it('Test file init', function () {
        expect(config.selected).toEqual([]);
        expect(config.notified).toEqual(notified);
    });

    it('Test notified system', function () {
        config.addNotified(4);
        expect(config.notified).toEqual([1, 2, 3, 4]);
        expect(sessionStorage.getItem('notified')).toEqual('1,2,3,4');
        expect(config.isNotified(4)).toBe(true);
        expect(config.isNotified(5)).toBe(false);
    });

    it('Test select system', function () {
        config.addSelected('mod');
        config.addSelected('aura');
        expect(config.selected).toEqual(['mod', 'aura']);
        config.removeSelected('notset');
        expect(config.selected).toEqual(['mod', 'aura']);
        config.removeSelected('mod');
        expect(config.selected).toEqual(['aura']);
        expect(localStorage.getItem('selected')).toEqual('aura');
    });
});