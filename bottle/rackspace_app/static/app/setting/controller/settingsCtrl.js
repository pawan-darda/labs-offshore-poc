angular.module('app.settings.controller', [])
    .controller('settingsCtrl', ['$rootScope', '$scope', '$window', 'productService', 'RESTAPIUrlConfig', function ($rootScope, $scope, $window, productService, RESTAPIUrlConfig) {
        $scope.config = {};

        //temp code
        $scope.config.ConfiguredRestUrl = $rootScope.configuredUrl || RESTAPIUrlConfig.urlBaseService;

        $scope.saveConfiguration = function () {
            if ($scope.config.restUrl) {
                productService.api = productService.updateResourceByBaseUrl($scope.config.restUrl);
                $rootScope.configuredUrl = $scope.config.restUrl;
                $scope.config.ConfiguredRestUrl = $scope.config.restUrl;
            }
        };

        $scope.clear = function () {
            $scope.config.restUrl = '';
        }

    }]);