'use strict';

(function (ctrl) {

    ctrl.getModule('core').directive('ngMustMatch', function () {
        return {
            require: "ngModel",
            scope: {
                val: '='
            },
            restrict: 'A',
            link: function (scope, element, attrs, ngModel) {

                var otherModel = ngModel.$$parentForm[attrs.ngMustMatch];
                console.log(scope);
                scope.$watch('$viewValue', function (value) {
                    console.log(value);
                });
                otherModel.$watch('$viewValue', function (value) {
                    console.log(value);
                });
                /*
                scope.$watch(attrs.ngModel, function () {
                    console.log(ngModel);
                    console.log(attrs);
                    ngModel.$setValidity('mustMatch', ngModel.$viewValue === attrs.ngMustMatch);
                });

                attrs.$observe('ngMustMatch', function (value) {
                    console.log(ngModel);
                    console.log(attrs);
                    ngModel.$setValidity('mustMatch', ngModel.$viewValue === attrs.ngMustMatch);
                });
                */
            }
        };
    });

})(window.AppCtrl);