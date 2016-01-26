angular.module('app.core').config(['RESTAPIUrlConfigProvider', '$urlRouterProvider', '$stateProvider',
    'routehelperConfigProvider','$routeProvider','$httpProvider', function (RESTAPIUrlConfigProvider,
        $urlRouterProvider, $stateProvider,
        routehelperConfigProvider, $routeProvider, $httpProvider) {
        
        routehelperConfigProvider.setUrlRouterProvider($routeProvider);
        routehelperConfigProvider.setSateRouterProvider($stateProvider);
        $httpProvider.interceptors.push('httpInterceptor');
        $httpProvider.interceptors.push('UnauthorizedInterceptor');
        $httpProvider.interceptors.push('TokenInterceptor');

    }]).value('config', function () {
        var config = {
            restApiFrameworkName: ''
        };
        return config;
    });