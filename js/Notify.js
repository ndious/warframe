(function (window) {
    "use strict";

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
    }
} (window));