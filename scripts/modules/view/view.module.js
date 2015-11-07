'use strict';

(function (ctrl) {

    ctrl.createModule('view', [
        ctrl.getModuleName('config'),
        ctrl.getModuleName('core')
    ]);

})(window.AppCtrl);