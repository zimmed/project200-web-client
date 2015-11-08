'use strict';

(function (ctrl) {

    ctrl.getModule('view').controller('LoginCtrl',
        ['Socket', 'Authentication', '$scope', '$location',
            function(Socket, Authentication, $scope, $location) {
                $scope.form = {
                    username: '',
                    password: '',
                    errors: '',
                    errorLevel: ''
                };
                $scope.awaitingResponse = false;

                if (!Socket.connected) {
                    Socket.connect();
                }

                $scope.submit = function () {
                    console.log(Socket.connected);
                    if (!Socket.connected) {
                        Socket.connect();
                        $scope.form.errorLevel = 'error';
                        $scope.form.errors = 'The server is currently down. Please try again later.';
                    } else {
                        $scope.awaitingResponse = true;
                        Authentication.signinRequest($scope.form.username,
                                                     $scope.form.password);
                    }
                    return false;
                };

                Socket.on('user-signin', function (event) {
                    $scope.awaitingResponse = false;
                    switch (event.status) {
                        case 200:
                            $location.path('/dashboard');
                            $scope.form.errorLevel = '';
                            $scope.form.errors = '';
                            $scope.form.username = '';
                            $scope.form.password = '';
                            break;
                        case 400:case 403:
                        $scope.form.errorLevel = 'warn';
                            $scope.form.errors = 'Invalid signin request.';
                            break;
                        case 401:
                            $scope.form.errorLevel = 'warn';
                            $scope.form.errors = 'Incorrect username or password.';
                            break;
                        default:
                            $scope.form.errorLevel = 'error';
                            $scope.form.errors = 'Unknown Server Error.';
                    }
                });

            }
        ]
    );

})(window.AppCtrl);