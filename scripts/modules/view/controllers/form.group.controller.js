'use strict';

(function (ctrl) {

    ctrl.getModule('view').controller('FormGroupCtrl',
        ['$scope',
            function($scope) {
                $scope.parseErrors = function () {
                    return $scope.$parent.parseErrors($scope.parentForm[$scope.meta.name], $scope.meta);
                };
            }
        ]
    );

})(window.AppCtrl);