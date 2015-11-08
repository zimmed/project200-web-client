'use strict';

(function (module, angular, injections) {
    /**
     * config.js - Config and setup for main app controller.
     * Originally created for EDMEAN.js (https://github.com/zimmed/EDMEAN.js)
     * @author: Dave Zimmelman
     * @email: zimmed@zimmed.io
     *
     * Module must be included before main app controller.
     */

    var application = null;

    var config = {
        /** Application Configuration Setup **/

        applicationName: "project-200",

        applicationDependencies: [
            'ui.router',
            'snap',
            'ngAnimate',
            'ngResource',
            'ui.bootstrap',
            'ngSanitize'
        ],

        moduleConstants: function (moduleName) {
            return {
                partialsPath: 'partials/',
                modulePath: 'scripts/modules/' + moduleName + '/'
            };
        },

        appConstants: {
            roomid: null,
            localUrl: "localhost",
            localPort: "80",
            socketUrl: "localhost",
            socketPort: "27016",
            socketPath: "/ws",
            secure: false,
            socketSecure: false,
            title: "Project 200",
            description: "A Mutliplayer Card Game."
        }
    };

    var controller = {
        /** Angular Controller Methods **/

        createApp: function () {
            var configModule = angular.module(
                controller.getModuleName('config'),
                []
            ).constant('Config', config.appConstants);

            application = angular.module(
                config.applicationName,
                config.applicationDependencies
            );
            application.requires.push(controller.getModuleName('config'));
            for (var i = 0; i < injections.length; i++) {
                var factory = module[injections[i]];
                application.factory(injections[i], function () {
                    return factory;
                })
            }
            return application;
        },

        getApp: function () {
            return application;
        },

        createModule: function (name, dependencies) {
            var ngModule, ngModuleName = controller.getModuleName(name);

            ngModule = angular.module(
                ngModuleName,
                (dependencies || [])
            ).constant(name + 'Config', config.moduleConstants(name));

            application.requires.push(ngModuleName);

            return ngModule;
        },

        getModule: function (name) {
            try {
                return angular.module(controller.getModuleName(name));
            } catch (e) {
                return false;
            }
        },

        getModuleName: function (name) {
            return config.applicationName + '.' + name;
        }
    };

    /** Expose controller **/
    module.AppCtrl = controller;

})(window, window.angular, ['CryptoJS']);