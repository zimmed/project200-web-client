'use strict';

(function (ctrl) {

    ctrl.getModule('core').directive('ngMustMatch', function () {
        return {
            require: "ngModel",
            restrict: 'A',
            link: function (scope, element, attrs, ngModel) {
                if (!attrs.ngMustMatch) return;
                var form = element[0].form, name = attrs.name, other = attrs.ngMustMatch,
                    parent = attrs.hasOwnProperty('ngMustMatchParentScope') ? scope.$parent : scope,
                    form = parent[form.name];
                window.scope = parent;
                parent.$watch(form.$name + 'Data.' + name, function (value) {
                    console.log(form.$name + ': ' + other);
                    var otherVal = form[other].$viewValue,
                        valid = (value && value === otherVal);
                    ngModel.$setValidity('mustMatch', valid);
                    if (!form[name].$error) form[name].$error = {};
                    form[name].$valid = (form[name].$valid && valid);
                    form[name].$error.mustMatch = valid;
                });
                parent.$watch(form.$name + 'Data.' + other, function (value) {
                    var otherVal = form[name].$viewValue,
                        valid = (value && value === otherVal);
                    ngModel.$setValidity('mustMatch', valid);
                    form[name].$valid = (form[name].$valid && valid);
                    if (!form[name].$error) form[name].$error = {};
                    form[name].$error.mustMatch = valid;
                });
            }
        };
    });

})(window.AppCtrl);