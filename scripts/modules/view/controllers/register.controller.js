'use strict';

(function (ctrl) {

    ctrl.getModule('view').controller('RegisterCtrl',
        ['Socket', 'Authentication', '$scope', '$location',
            function(Socket, Authentication, $scope, $location) {
                $scope.awaitingResponse = false;
                $scope.data = {
                    username: '',
                    password: '',
                    conf_password: '',
                    email: '',
                    conf_email: '',
                    agree: false,
                    refer: undefined,
                    errors: '',
                    errorLevel: '',
                };

                if (!Socket.connected) {
                    Socket.connect();
                }

                $scope.submit = function () {
                    console.log(Socket.connected);
                    if (!Socket.connected) {
                        Socket.connect();
                        $scope.data.errorLevel = 'error';
                        $scope.data.errors = 'The server is currently down. Please try again later.';
                    } else if ($scope.form.$valid) {
                        $scope.awaitingResponse = true;
                        Authentication.registerRequest(
                            $scope.data.username,
                            $scope.data.email,
                            $scope.data.password,
                            $scope.data.refer
                        );
                    }
                    return false;
                };

            }]
    );

})(window.AppCtrl);