'use strict';

(function (module, angular) {
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
            'ngResource',
            'ngAnimate',
            'ui.bootstrap',
            'ngSanitize'
        ],

        moduleConstants: function (moduleName) {
            return {
                partialsPath: 'partials/',
                modulePath: 'modules/' + moduleName + '/'
            };
        },

        appConstants: {
            roomid: null,
            localUrl: "localhost",
            localPort: "80",
            socketUrl: "localhost",
            socketPort: "27016",
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

})(window, window.angular);