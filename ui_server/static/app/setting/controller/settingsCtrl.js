﻿angular.module('app.settings.controller', [])
    .controller('settingsCtrl', ['$rootScope', '$scope', '$window', 'productService', 'RESTAPIUrlConfig', function ($rootScope, $scope, $window, productService, RESTAPIUrlConfig) {
        $scope.config = {};
        $scope.form = {
            name: 'settingsForm'
        }

        $scope.config.ConfiguredRestUrl = $rootScope.configuredUrl || RESTAPIUrlConfig.urlBaseService;

        $scope.saveConfiguration = function () {
            if ($scope.config.restUrl) {
                productService.api = productService.updateResourceByBaseUrl($scope.config.restUrl);
                $rootScope.configuredUrl = $scope.config.restUrl;
                $scope.config.ConfiguredRestUrl = $scope.config.restUrl;
                $scope.clear();
            }
        };

        $scope.clear = function () {
            $scope.config.restUrl = '';
            if ($scope.form && $scope.form.name && $scope.form.name.$setPristine) {
                $scope.form.name.$setPristine(true);
            }
        }

    }]);
