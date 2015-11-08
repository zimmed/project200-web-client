'use strict';

(function (ctrl, WebSocket, mathlib) {
    /**
     * socket.service.js - WebSocket service
     * Adapted for generic WebSocket, from original socket.io case.
     * Original created for EDMEAN.js (https://github.com/zimmed/EDMEAN.js)
     * @author: Dave Zimmelman
     * @email: zimmed@zimmed.io
     */

    ctrl.getModule('core').service('Socket', ['Config', '$timeout', 'CryptoJS',
        function (Config, $timeout, CryptoJS) {
            var address = Config.socketUrl + ':' + Config.socketPort + Config.socketPath,
                protocol = Config.socketSecure ? 'wss://' : 'ws://';

            var Handler = function (method, args) {
                args = args || [];
                return function (socket, event, stack) {
                    var next;
                    args.unshift(event);
                    $timeout(function () { method.apply(socket, args); });
                    if (stack.length) {
                        next = stack.pop();
                        next(socket, event, stack);
                    }
                };
            };

            this.socket = null;
            this._listeners = {};
            this.client_token = null;
            this._session_token = null;
            this._session_uid = null;
            this.connected = false;

            this.encrypt = function (message, key) {
                throw "Not Implemented.";
            };

            this.decrypt = function (message, iv, key) {
                throw "Not Implemented.";
            };

            this.connect = function () {
                if (this.connected) return;
                var self = this;
                this.socket = new WebSocket(protocol + address);
                this.socket.onopen = function () {
                    if (self._session_token) {
                        self.on('connect-restore', function (event) {
                            if (event.status != 200) {
                                self.disconnect();
                            }
                            self.offLast('connect-restore');
                        });
                        self.emit('connect-restore', {
                            session_token: self._session_token,
                            uid: self._session_uid
                        });
                    }
                };
                this.socket.onmessage = function (event) {
                    var data = JSON.parse(event.data);
                    /*
                    if (data.sensitive) {
                        data = JSON.parse(this.decrypt(data.secret, data.iv, this.client_token));
                    }
                    */
                    self.handle(data);
                };
                this.socket.onclose = function () {
                    self.connected = false;
                    self.client_token = null;
                    self.socket = null;
                    self.handle({status:200,data:{type:'disconnect'}});
                };
            };

            this.disconnect = function () {
                if (this.socket) {
                    var s = this.socket;
                    this.client_token = null;
                    this._session_token = null;
                    this._session_uid = null;
                    this.socket = null;
                    s.close();
                }
            };

            this.on = function (eventName, method, args) {
                if (!(eventName in this._listeners)) {
                    this._listeners[eventName] = []
                }
                this._listeners[eventName].push(Handler(method, args))
            };

            this.emit = function (eventName, data) {
                var secret, data = data || {};
                /*
                if (data.sensitive) {
                    delete data['sensitive'];
                    secret = this.encrypt(JSON.stringify(data), this.client_token);
                    data = {
                        secret: secret.value,
                        iv: secret.iv,
                        sensitive: true
                    };
                }
                */
                if (this.connected) {
                    data['type'] = eventName;
                    this.socket.send(JSON.stringify(data));
                }
            };

            this.off = function (eventName) {
                if (eventName in this._listeners) {
                    delete this._listeners[eventName];
                }
            };

            this.offLast = function (eventName) {
                if (eventName in this._listeners) {
                    this._listeners[eventName].pop();
                    if (!this._listeners[eventName].length) {
                        delete this._listeners[eventName];
                    }
                }
            };

            this.handle = function (event) {
                var handler, stack;
                console.log(event);
                if (event && event.type && this._listeners.hasOwnProperty(event.type)) {
                    stack = this._listeners[event.type].slice(0);
                    handler = stack.pop();
                    handler(this, event, stack);
                } else {
                    console.log('uncaught event: ' + event.type);
                }
            };

            this.on('connect', function (event) {
                if (event.status == 200) {
                    this.client_token = event.client_token;
                    this.connected = true;
                }
            });
            this.on('user-signin', function (event) {
                if (event.status == 200) {
                    this._session_uid = event.uid;
                }
            });
            this.on('user-signout', function (event) {
                self._session_uid = null;
                self._session_token = null;
            });
        }
    ]);

})(window.AppCtrl, window.WebSocket, window.Math);