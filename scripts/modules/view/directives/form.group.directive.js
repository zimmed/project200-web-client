'use strict';

(function (ctrl) {

    ctrl.getModule('view').directive('formGroup',
        ['viewConfig', '$window',
            function (config, $window) {
                return  {
                    restrict: 'E',
                    templateUrl: config.modulePath + config.partialsPath + 'form.group.partial.html',
                    scope: true,
                    transclude: true,
                    controller: 'FormGroupCtrl',
                    link: function ($scope, $element, $attrs) {
                        var formName = $attrs.form || 'form', width = $window.innerWidth;
                        if (!config.numFormCtrl) config.numFormCtrl = 0;
                        $scope.meta = {
                            num: ++config.numFormCtrl,
                            type: $attrs.type || 'text',
                            name: $attrs.name || 'undefined',
                            nested: $attrs.nextGroupNestLevel || 1,
                            minlength: $attrs.minlength || 0,
                            maxlength: $attrs.maxlength || 128,
                            pattern: eval($attrs.pattern || '/^.*$/'),
                            lastTabField: $attrs.hasOwnProperty('onEnterSubmit') || false,
                            required: !($attrs.hasOwnProperty('optional')),
                            trim: $attrs.trim || 'true',
                            divStyle: $attrs.divStyle || '',
                            label: $attrs.label || 'Input'
                        };
                        $scope.meta.nested += 1;
                        $scope.el = $element;
                        console.log('directive.link');
                        $scope.errorPosition = (width < 626 || (width > 767 && width < 1051)) ? 'bottom' : 'right';
                        $scope.meta.confirm = $scope.meta.name.substr(0,5) === 'conf_' ?
                                              $scope.meta.name.substr(5) : undefined;
                        $scope.meta.placeholder = $attrs.placeholder || ($scope.meta.confirm ?
                                'CONFIRM ' + $scope.meta.confirm.toUpperCase() : $scope.meta.name.toUpperCase());
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