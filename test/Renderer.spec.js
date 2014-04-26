describe('Renderer testing', function () {
    'use strict';

    var container = jQuery('<p></p>');

    beforeEach(function () {
        renderer.container = container;
    });


    it('Test file init and cleanup', function () {
        expect(renderer.container).toEqual(container);
        expect(renderer.contents).toEqual([]);
        renderer.contents = ['foo', 'bar'];
        renderer.cleanup();
        expect(renderer.container).toEqual(container);
        expect(renderer.contents).toEqual([]);
    });

    it('Test set document title', function () {
        renderer.title('foo');
        expect(document.title).toEqual('0 mission available');
        renderer.title('3');
        expect(document.title).toEqual('3 missions available');
        renderer.title(1);
        expect(document.title).toEqual('1 mission available');
    });
});