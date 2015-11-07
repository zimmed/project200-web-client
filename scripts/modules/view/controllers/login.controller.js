'use strict';

(function (ctrl) {

    ctrl.getModule('view').controller('LoginCtrl',
        ['Socket', '$scope', '$location',
            function(Socket, $scope, $location) {

            $scope.submit = function () {
                $location.path('/dashboard');
                return false;
            };

        }]
    );

})(window.AppCtrl);