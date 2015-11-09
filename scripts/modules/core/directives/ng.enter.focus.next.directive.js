'use strict';

(function (ctrl) {

    ctrl.getModule('core').directive('ngEnterFocusNext', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind("keydown keypress", function (event) {
                    var key = event.keyCode || event.which;
                    var i, el, depth = attrs.ngEnterFocusNext || 0;
                    if (key === 13) {
                        event.preventDefault();
                        el = element;
                        for (i = 0; i < depth; i++) {
                            el = el.parent();
                        }
                        el = el.next()[0];
                        for (i = 0; i < depth; i++) {
                            console.log(el);
                            window.el = el;
                            el = el.children[0]
                            window.el2 = el;
                        }
                        el.focus();
                        window.scope = scope;
                    }
                });
            }
        };
    });

})(window.AppCtrl);