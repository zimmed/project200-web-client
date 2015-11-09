'use strict';

(function (ctrl) {

    ctrl.getModule('core').directive('ngMustMatch', function () {
        return {
            require: "ngModel",
            restrict: 'A',
            link: function (scope, element, attrs, ngModel) {

                var getScopeVal = function (name, scope) {
                    var i, names = name.split('.'), s = scope;
                    for (i = 0; i < names.length; i++) {
                        s = s[names[i]];
                    }
                    return s;
                };
                scope.$watch(attrs.ngModel, function (value) {
                    var otherVal = getScopeVal(attrs.ngMustMatch, scope),
                        valid = (value && value === otherVal);
                    ngModel.$setValidity('mustMatch', valid);
                    scope.form[attrs.name].$valid = (scope.form[attrs.name].$valid && valid);
                });
                scope.$watch(attrs.ngMustMatch, function (value) {
                    var otherVal = getScopeVal(attrs.ngModel, scope),
                        valid = (value && value === otherVal);
                    ngModel.$setValidity('mustMatch', valid);
                    scope.form[attrs.name].$valid = (scope.form[attrs.name].$valid && valid);
                });
            }
        };
    });

})(window.AppCtrl);