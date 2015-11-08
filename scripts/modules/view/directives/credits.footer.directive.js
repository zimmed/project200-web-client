'use strict';

(function (ctrl) {

    ctrl.getModule('view').directive('creditsFooter',
        ['viewConfig',
            function (config) {
                return  {
                    restrict: 'E',
                    templateUrl: config.modulePath + config.partialsPath + 'credits.footer.partial.html'
                };
            }]
    );

})(window.AppCtrl);