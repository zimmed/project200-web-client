'use strict';

(function (ctrl) {

    ctrl.getModule('core').directive('parseAttributesTo', function () {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attrs) {

                var ref = getScopeVal($attrs.parseAttributesTo, $scope),
                    filter = $attrs.parseAttributesFilter || false,
                    attrs = {};

                for (var key in $attrs) {
                    if ($attrs.hasOwnProperty(key) && (!filter || filter.hasOwnProperty(key))) {
                        attrs[key] = $attrs[key];
                    }
                }

                ref[$attrs.name] = attrs;

                function getScopeVal (name, scope) {
                    var i, names = name.split('.'), s = scope;
                    for (i = 0; i < names.length; i++) {
                        s = s[names[i]];
                    }
                    return s;
                }
            }
        };
    });

})(window.AppCtrl);