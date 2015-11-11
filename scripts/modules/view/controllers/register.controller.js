'use strict';

(function (ctrl) {

    ctrl.getModule('view').controller('RegisterCtrl',
        ['Socket', 'Authentication', '$scope', '$location',
            function(Socket, Authentication, $scope, $location) {
                $scope.awaitingResponse = false;
                $scope.registerFormData = $scope.data = {
                    username: '',
                    password: '',
                    conf_password: '',
                    email: '',
                    conf_email: '',
                    agree: false,
                    refer: undefined,
                    errors: '',
                    errorLevel: ''
                };

                $scope.errorMessages = {
                    minlength: 'Must be at least {minlength} characters.',
                    maxlength: 'Must be less than {maxlength} character.',
                    email: 'This is not a valid email address.',
                    pattern: 'Username may not contain any `{func:' +
                                'var re, pat = String({pattern});' +
                                'pat = pat.match(/\\[([^\\]]+)]/)[1];' +
                                're = eval("/[^" + pat + "]/");' +
                                're = "{value}".match(re)[0];' +
                                'return (re === " ") ? "space" : re;' +
                             '/func}`s.',
                    required: 'This field is required.',
                    mustMatch: 'Does not match {lambda:return "{name}".replace("conf_", "");} field.',
                };

                $scope.parseErrors = function (element, meta) {
                    if (!element) return '';
                    for (var key in element.$error) {
                        if (element.$error.hasOwnProperty(key) && $scope.errorMessages.hasOwnProperty(key)) {
                            var val = element.$viewValue.replace(/\\/g, "\\\\");
                            return $scope.formatError($scope.errorMessages[key], meta,
                                                      {value: val});
                        }
                    }
                };

                $scope.formatError = function (message, attrs, extra) {
                    message = message.replace(/(?:[^\{])\{([A-Za-z0-9\-_]+)}/g, function (m, key) {
                        var attr = key;
                        return m.charAt(0) + (attrs.hasOwnProperty(attr) ? attrs[attr]
                                                : extra.hasOwnProperty(key) ? extra[key] : key);
                    });
                    return message.replace(/\{func:(.+)\/func}/g, function (m, script) {
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