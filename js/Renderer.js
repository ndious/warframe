(function (window, document) {
    "use strict";

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