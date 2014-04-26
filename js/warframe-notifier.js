
/* src/js/Config.js */
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
/* src/js/Notify.js */
(function (window) {
    'use strict';

    var Notification = window.Notification || window.mozNotification || window.webkitNotification,
        
        showNotification = function (notify) {
            var instance = new Notification(
                notify.title, {
                    body: notify.body,
                    icon: notify.icon
                }
            );

            instance.onclick = function () {
                // Something to do
            };
            instance.onerror = function () {
                // Something to do
            };
            instance.onshow = function () {
                // Something to do
            };
            instance.onclose = function () {
                // Something to do
            };

            return false;
        },

        Notify = {
            icon: 'img/default.png',
            body: '',
            title: '',

            setTitle: function (type) {
                if (type === undefined) {
                    type = 'mission';
                }
                this.title = 'New ' + type + ' available';
            },

            show: function () {
                showNotification(this);
            },

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


    
    Notification.requestPermission(function (permission) {
        config.isNotificationAvailable = permission;
    });

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
            this.container.innerHtml = '';
        },

        addContent: function (type, id, text) {
            this.contents.push('<p class="bg-' + type + '" data-id="' + id + '">' + text + '</p>');
        },

        render: function () {
            jQuery(this.container).html(this.contents);
        },

        title: function (available) {
            if (available < 2) {
                document.title = available + " mission available";
            } else {
                document.title = available + " missions available";
            }
        }
    };

    window.renderer = Renderer;
} (window));