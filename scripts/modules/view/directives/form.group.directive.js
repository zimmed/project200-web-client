'use strict';

(function (ctrl) {

    ctrl.getModule('view').directive('formGroup',
        ['viewConfig',
            function (config) {
                return  {
                    restrict: 'E',
                    templateUrl: config.modulePath + config.partialsPath + 'form.group.partial.html',
                    scope: true,
                    transclude: true,
                    controller: 'FormGroupCtrl',
                    link: function ($scope, $element, $attrs) {
                        var formName = $attrs.form || 'form';
                        if (!config.numFormCtrl) config.numFormCtrl = 0;
                        $scope.meta = {
                            num: ++config.numFormCtrl,
                            type: $attrs.type || 'text',
                            name: $attrs.name || 'undefined',
                            nested: $attrs.nextGroupNestLevel || 1,
                            minlength: $attrs.minlength || 0,
                            maxlength: $attrs.maxlength || 128,
                            pattern: eval($attrs.pattern || '/^.*$/'),
                            lastTabField: $attrs.lastTabField || 'undefined',
                            required: !($attrs.hasOwnProperty('optional')),
                            trim: $attrs.trim || 'true'
                        };
                        $scope.meta.confirm = $scope.meta.name.substr(0,5) === 'conf_' ?
                                              $scope.meta.name.substr(5) : undefined;
                        console.log($scope.meta.name + ': ' + $scope.meta.confirm);
                        $scope.meta.placeholder = $attrs.placeholder || $scope.meta.name.toUpperCase(),
                        $scope.parentForm = $scope.$parent[formName];
                        $scope.parentData = $scope.$parent[formName + 'Data'];
                        if (!$scope.parentData) {
                            $scope.parentData = $scope.$parent[formName + 'Data'] = {};
                        }
                    }
                };
            }]
    );

})(window.AppCtrl);