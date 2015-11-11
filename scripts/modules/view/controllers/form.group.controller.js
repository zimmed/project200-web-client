'use strict';

(function (ctrl) {

    ctrl.getModule('view').controller('FormGroupCtrl',
        ['$scope', '$window',
            function($scope, $window) {
                $scope.$watch(function () {return $window.innerWidth;}, function (w) {
                    var pos = (w < 626 || (w > 767 && w < 1051)) ? 'bottom' : 'right';
                    if (pos !== $scope.errorPosition) {
                        $scope.isFocused = false;
                        $scope.errorPosition = pos;
                        $scope.isFocused = true;
                    }
                });
                $scope.parseErrors = function () {
                    var s = $scope.$parent.parseErrors($scope.parentForm[$scope.meta.name], $scope.meta);
                    console.log(s);
                    return s;
                };
                console.log($scope.el);
            }
        ]
    );

})(window.AppCtrl);