(function (window) {
    "use strict";

    var Config = {

        cases: {
            mod: /\(Mod\)/,
            blueprint: /\(Blueprint\)/,
            aura: /\(Aura\)/,
            resource: /\(Resource\)/
        },

        selected: [],

        known: [],

        deleted: [],

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

    if (localStorage.getItem('selected') !== null) {
        Config.selected = localStorage.getItem('selected').split(',');
    }

    window.config = Config;
} (window));