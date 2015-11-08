'use strict';

(function (ctrl) {

    ctrl.getModule('core').directive('ngMustMatch', function () {
        return {
            require: "ngModel",
            restrict: 'A',
            link: function (scope, element, attrs, ngModel) {


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
            }
        };
    });

})(window.AppCtrl);