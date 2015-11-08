'use strict';

(function (ctrl, mathlib, ctime) {

    ctrl.getModule('user').factory('Authentication', ['Config', 'Socket', 'CryptoJS',
        function (Config, Socket, CryptoJS) {

            return {
                hashPassword: function (username, password) {
                    var salt = password.match(/[^A-Z]/g).join(username.charAt(0)) + username;
                    salt += CryptoJS.SHA256(username + password).toString();
                    return CryptoJS.SHA256(Array(password.length).join(username.charAt(3)) + salt).toString();
                },

                createToken: function () {
                    var i, key, salt = '';
                    if (arguments.length < 2) {
                        throw "Cannot create a token with fewer than two arguments.";
                    }
                    key = arguments[0];
                    for (i = 1; i < arguments.length; i++) {
                        salt += arguments[i];
                    }
                    return {
                        salt: salt,
                        hash: CryptoJS.HmacMD5(salt, key).toString()
                    };
                },

                createSessionObject: function (pw_hash, uid) {
                    if (!Socket.connected) return false;
                    Socket.setSession(this.createToken(pw_hash, Socket.client_token, uid).hash, uid);
                    return true;
                },

                signinRequest: function (username, password) {
                    var pw_hash = this.hashPassword(username, password),
                        ts = mathlib.floor(ctime() / 1000);
                    Socket.on('user-signin', function (event) {
                        if (event.status == 200) {
                            event._pw_hash = pw_hash;
                        }
                        this.offLast('user-signin');
                    });
                    Socket.emit('user-signin', {
                        username: username,
                        timestamp: ts,
                        token: this.createToken(pw_hash, ts, username).hash
                    });
                },

                registerRequest: function (username, email, password, refer) {
                    // TODO: Add AES-128 encryption layer.
                    var pw_hash = this.hashPassword(username, password),
                        ts = mathlib.floor(ctime() / 1000),
                        token = this.createToken(Socket.client_token, ts, username, email, pw_hash).hash;
                    Socket.emit('user-register', {
                        username: username,
                        email: email,
                        pw_hash: pw_hash,
                        token: token,
                        timestamp: ts,
                        refer: refer
                    });
                }
            };
        }
    ]);

})(window.AppCtrl, window.Math, window.Date.now);