'use strict';

(function (ctrl, WebSocket) {
    /**
     * socket.service.js - WebSocket service
     * Adapted for generic WebSocket, from original socket.io case.
     * Original created for EDMEAN.js (https://github.com/zimmed/EDMEAN.js)
     * @author: Dave Zimmelman
     * @email: zimmed@zimmed.io
     */

    ctrl.getModule('core').service('Socket', ['Config', '$timeout',
        function (Config, $timeout) {
            var address = Config.socketUrl + ':' + Config.socketPort,
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

            this.connect = function () {
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
                    self.handle(event);
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
                data = data || {};
                if (this.connected) {
                    data['type'] = eventName;
                    this.socket.send(JSON.parse(data));
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
                var handler, stack, data = event.data || false;
                if (data && data.type && data.type in this._listeners) {
                    stack = this._listeners[data.type].slice(0);
                    handler = stack.pop();
                    handler(this.socket, data, stack);
                }
            };

            this.on('connect', function (event, self) {
                if (event.status == 200 && event.data) {
                    self.client_token = event.data.client_token;
                }
            }, [this]);
            this.on('user-signin', function (event, self) {
                if (event.status == 200 && event.data) {
                    self._session_uid = event.data.uid;
                }
            }, [this]);
            this.on('user-signout', function (event, self) {
                self._session_uid = null;
                self._session_token = null;
            }, [this]);
        }
    ]);

})(window.AppCtrl, window.WebSocket);