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
