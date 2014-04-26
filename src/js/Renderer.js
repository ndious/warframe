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