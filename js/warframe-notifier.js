
/* src/js/Config.js */
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
/* src/js/Notify.js */
(function (window) {
    'use strict';

    var noNotif = {requestPermission: function () {}},
        Notification = window.Notification || window.mozNotification || noNotif,
        
        showNotification = function (notify) {
            var instance = {};
            if (config.wekit) {
                if (Notification.checkPermission() === 0) {
                    instance = Notification.createNotification(notify.icon, notify.title, notify.body);
                    instance.show();
                }
            } else {
                instance = new Notification(
                    notify.title, {
                        body: notify.body,
                        icon: notify.icon
                    }
                );
            }

            return false;
        },

        Notify = {
            /**
             * Notification picture.
             * @var string image path
             */
            icon: 'img/default.png',
            /**
             * Notification body.
             * @var string message
             */
            body: '',
            /**
             * Notification title.
             * @var string message title
             */
            title: '',

            /**
             * Set the title notification.
             * @param type string
             */
            setTitle: function (type) {
                if (type === undefined) {
                    type = 'mission';
                }
                this.title = 'New ' + type + ' available';
            },

            /**
             * Display the notification.
             */
            show: function () {
                showNotification(this);
            },

            /**
             * Create and print a notification.
             * @param id integer id notification
             * @param type string type of notification
             * @param text string body content
             */
            execute: function (id, type, text) {
                if (!config.isNotified(id)) {
                    config.addNotified(id);
                    if (config.isNotificationAvailable) {
                        this.setTitle();
                        this.body = text;
                        this.show();
                    }
                }
            }
        };

    if (window.webkitNotifications) {
        Notification = window.webkitNotifications;
        if (Notification.checkPermission() !== 0) {
            Notification.requestPermission();
        }
        config.wekit = true;
    } else if (Notification) {
        config.wekit = false;
        Notification.requestPermission(function (permission) {
            config.isNotificationAvailable = permission;
        });
    } else {
        config.isNotificationAvailable = false;
    }
    

    window.notify = function (id, type, text) {
        return Notify.execute.apply(Notify, [id, type, text]);
    };
} (window));
/* src/js/Parser.js */
(function (window) {
    'use strict';

    var jQuery = window.jQuery,
        Parser = {
        match: function (text) {
            if (text !== undefined) {
                if (config.selected.length === 0) {
                    return true;
                }
                for (var i = 0; i < config.selected.length; i = i + 1) {
                    if (text.match(config.cases[config.selected[i]])) {
                        return true;
                    }
                }

            }
            return false;
        },

        parse: function (timeline) {

            var available = 0,
                now = new Date(),
                self = this,
                li;


            if (timeline !== undefined) {
                renderer.cleanup();
                li = jQuery(timeline).contents().find('li');

                li.each(function () {
                    var text = jQuery(this).find('.e-entry-title').html(),
                        datetime = jQuery(this).find('.permalink').data('datetime'),
                        id = jQuery(this).data('tweet-id');

                    if (self.match(text)) {
                        var duration = text.match(/(\d+)m/),
                            time = parseInt(duration[1], 10),
                            date = new Date(datetime),
                            limit = new Date(date.getTime() + (time * 60000));

                        text = date.getHours() + 'h' + date.getMinutes() + ' - ' + text;

                        notify(id, '', text);

                        if (limit.getTime() > now.getTime()) {
                            available = available + 1;

                            if ((limit.getTime() - now.getTime()) <= 600000) {
                                renderer.addContent('warning', id, text);
                            } else {
                                renderer.addContent('success', id, text);
                            }
                        } else {
                            renderer.addContent('danger', id, text);
                        }
                    }

                });
                renderer.render();
                renderer.title(available);
            }
        }
    };

    window.parser = function (timeline) {
        Parser.parse.apply(Parser, timeline);
    };
} (window));

/* src/js/Renderer.js */
(function (window) {
    'use strict';

    var document = window.document,
        jQuery = window.jQuery,
        Renderer = {
            container: '',
            contents: [],

            cleanup: function () {
                this.contents = [];
                this.container.html = '';
            },

            addContent: function (type, id, text) {
                this.contents.push('<p class="bg-' + type + '" data-id="' + id + '">' + text + '</p>');
            },

            render: function () {
                jQuery(this.container).html(this.contents);
            },

            title: function (available) {
                if (isNaN(parseInt(available, 10))) {
                    available = 0;
                }
                if (available < 2) {
                    document.title = available + ' mission available';
                } else {
                    document.title = available + ' missions available';
                }
            }
        };

    window.renderer = Renderer;
} (window));