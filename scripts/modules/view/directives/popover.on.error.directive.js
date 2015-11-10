'use strict';

(function (ctrl) {

    ctrl.getModule('view').directive('popoverOnError', function ($compile) {
        return {
            restrict: 'A',
            compile: function (element, attrs) {
                var fn, el = element, name = el[0].name, form = attrs.popoverOnError;
                el.removeAttr('popover-on-error');
                el.attr('ng-focus', form + '.' + name + '.isFocused = true');
                el.attr('ng-blur', form + '.' + name + '.isFocused = false');
                fn = $compile(el);
                return function (scope) {
                    fn(scope);
                };
            }
        };
    });

})(window.AppCtrl);