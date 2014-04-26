(function (window) {
    'use strict';

    var noNotif = {requestPermission: function () {}},
        Notification = window.Notification || window.mozNotification || noNotif,
        
        showNotification = function (notify) {
            var instance = {};
            if (config.chrome) {
                instance = Notification.create('warframenotif', {
                    type: 'basic',
                    iconUrl: notify.icon,
                    title: notify.title,
                    message: notify.body
                });
                instance.show();
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
        config.chrome = true;
    } else if (window.Notification || window.mozNotification) {
        config.chrome = false;
    } else {
        config.isNotificationAvailable = false;
    }
    
    Notification.requestPermission(function (permission) {
        config.isNotificationAvailable = permission;
    });

    window.notify = function (id, type, text) {
        return Notify.execute.apply(Notify, [id, type, text]);
    };
} (window));