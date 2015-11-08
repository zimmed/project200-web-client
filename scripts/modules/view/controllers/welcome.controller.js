'use strict';

(function (ctrl) {

    ctrl.getModule('view').controller('WelcomeCtrl',
        ['Socket', '$scope', '$location',
            function(Socket, $scope, $location) {

                $scope.login = function () {
                    $location.path('/login');
                    return false;
                };

                $scope.register = function () {
                    $location.path('/register');
                    return false;
                };

            }]
    );

})(window.AppCtrl);