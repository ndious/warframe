(function (window) {
    'use strict';

    var Config = {
        /**
         * Filters
         *
         * @var object
         */
        cases: {
            mod: /\(Mod\)/,
            blueprint: /\(Blueprint\)/,
            aura: /\(Aura\)/,
            resource: /\(Resource\)/
        },
        /**
         * Selected option filters
         *
         * @var array
         */
        selected: [],
        /**
         * Send notifications
         *
         * @var array
         */
        notified: [],
        /**
         * Deleted notifications
         *
         * @var array
         */
        deleted: [],

        isNotificationAvailable: true,
        /**
         * Set the notification as been send
         *
         * @param id mixed notification identifier
         */
        wekit: false,

        /**
         * Set the notification as been send
         *
         * @param id mixed notification identifier
         */
        addNotified: function (id) {
            this.notified.push(id);
            sessionStorage.setItem('notified', this.notified);
        },

        /**
         * Return true or false is the notification as been send
         *
         * @param id mixed notification identifier
         */
        isNotified: function (id) {
            for (var i = 0; i < this.notified.length; i = i + 1) {
                if (this.notified[i] === id) {
                    return true;
                }
            }
            return false;
        },

        /**
         * Add an option filter
         *
         * @param option string
         */
        addSelected: function (option) {
            this.selected.push(option);
            localStorage.setItem('selected', this.selected);
        },

        /**
         * Remove an option filter
         *
         * @param option string
         */
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