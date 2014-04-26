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
        },

        removeSelected: function (option) {
            this.selected.forEach(function (element, index, array) {
                if (element === option) {
                    array.splice(index, 1);
                }
            });
            console.log(this.selected);
        }
    };

    window.config = Config;
} (window));