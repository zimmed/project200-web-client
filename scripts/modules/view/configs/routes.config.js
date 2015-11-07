'use strict';

(function (ctrl) {

    ctrl.getModule('view').config(
        ['viewConfig', '$stateProvider', '$urlRouteProvider',
            function(Config, $stateProvider, $urlRouterProvider) {

        $urlRouterProvider.when('/dashboard', '/dashboard/overview');
        $urlRouterProvider.otherwise('/login');

        $stateProvider
            .state('base', {
                abstract: true,
                url: '',
                templateUrl: Config.modulePath + config.partialsPath + 'base.partial.html'
            })
            .state('login', {
                url: '/login',
                parent: 'base',
                templateUrl: Config.modulePath + config.partialsPath + 'login.partial.html',
                controller: 'LoginCtrl'
            })
            .state('dashboard', {
                url: '/dashboard',
                parent: 'base',
                templateUrl: Config.modulePath + config.partialsPath + 'dashboard.partial.html',
                controller: 'DashboardCtrl'
            })
            .state('overview', {
                url: '/overview',
                parent: 'dashboard',
                templateUrl: Config.modulePath + config.partialsPath + 'dashboard.overview.partial.html'
            })
            .state('reports', {
                url: '/reports',
                parent: 'dashboard',
                templateUrl: Config.modulePath + config.partialsPath + 'dashboard.reports.partial.html'
            });
    }]);

})(window.AppCtrl);