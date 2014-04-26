(function (window) {
    'use strict';

    var Config = {

        cases: {
            mod: /\(Mod\)/,
            blueprint: /\(Blueprint\)/,
            aura: /\(Aura\)/,
            resource: /\(Resource\)/
        },

        selected: [],

        notified: [],

        deleted: [],

        isNotificationAvailable: true,

        chrome: false,

        addNotified: function (id) {
            this.notified.push(id);
            sessionStorage.setItem('notified', this.notified);
        },

        isNotified: function (id) {
            for (var i = 0; i < this.notified.length; i = i + 1) {
                if (this.notified[i] === id) {
                    return true;
                }
            }
            return false;
        },

        addSelected: function (option) {
            this.selected.push(option);
            localStorage.setItem('selected', this.selected);
        },

        removeSelected: function (option) {
            this.selected.forEach(function (element, index, array) {
                if (element === option) {
                    array.splice(index, 1);
                }
            });
            localStorage.setItem('selected', this.selected);
        }
    };

    /**
     * Load user config
     */
    if (localStorage.getItem('selected') !== null && 
        localStorage.getItem('selected') !== ''
    ) {
        console.log('bad');
        Config.selected = localStorage.getItem('selected').split(',');
    }
    /**
     * Load previous notifications
     */
    if (sessionStorage.getItem('notified') !== null && 
        sessionStorage.getItem('notified') !== ''
    ) {
        Config.notified = sessionStorage.getItem('notified').split(',');
    }

    window.config = Config;
} (window));