'use strict';

(function (ctrl) {

    ctrl.createModule('user', [
        ctrl.getModuleName('config'),
        ctrl.getModuleName('core')
    ]);

})(window.AppCtrl);