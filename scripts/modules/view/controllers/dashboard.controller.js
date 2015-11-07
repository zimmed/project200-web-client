'use strict';

(function (ctrl) {

    ctrl.getModule('view').controller('DashboardCtrl',
        ['Socket', '$scope', '$state',
            function(Socket, $scope, $state) {

                $scope.$state = $state

            }]
    );

})(window.AppCtrl);