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
                        el = el.next();
                        for (i = 0; i < depth; i++) {
                            el = el.children()[0];
                        }
                        el.focus();
                    }
                });
            }
        };
    });

})(window.AppCtrl);