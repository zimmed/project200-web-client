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

                $scope.errorMessages = {
                    minlength: 'Must be at least {ngMinlength} characters.',
                    maxlength: 'Must be no more than {ngMaxlength} character.',
                    email: 'This is not a valid email address.',
                    pattern: 'Username may not contain any `{lambda:' +
                                'var re, pat = "{ngPattern}";' +
                                'pat = pat.match(/\[([^\]]+)]/)[1];' +
                                're = eval("/[^" + pat + "]/");' +
                                'return (re === " ") ? "space" : "{value}".match(re)[0];' +
                             '}`s.',
                    required: 'This field is required.',
                    mustMatch: 'Does not match {lambda:return "{name}".replace("conf_", "");} field.',
                    attrs: {}
                };

                $scope.parseErrors = function (element) {
                    if (!element) return '';
                    for (var key in element.$error) {
                        if (element.$error.hasOwnProperty(key) && $scope.errorMessages.hasOwnProperty(key)) {
                            return $scope.formatError($scope.errorMessages[key],
                                                      $scope.errorMessages.attrs[element.$name],
                                                      {value: element.$viewValue});
                        }
                    }
                    console.log('NO ERROR: \n\t');
                    console.log(element.$error);
                };

                $scope.formatError = function (message, attrs, extra) {
                    message = message.replace(/(?:[^\{])\{([A-Za-z0-9\-_]+)}/g, function (m, key) {
                        var attr = key;
                        return m.charAt(0) + (attrs.hasOwnProperty(attr) ? attrs[attr]
                                                : extra.hasOwnProperty(key) ? extra[key] : key);
                    });
                    return message.replace(/\{lambda:([^}]+)}/g, function (m, script) {
                        try {
                            var func = new Function(script);
                            return func();
                        } catch(e) {
                            return script;
                        }
                    });
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