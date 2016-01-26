(function () {
    'use strict';
    angular.module('app.core')
        .provider('routehelperConfig', function routehelperConfig() {
            var config = { $urlRouterProvider: '', $stateProvider: '' };
            this.setUrlRouterProvider = function (urlRouterProvider) {
                config.$urlRouterProvider = urlRouterProvider;
            };

            this.setSateRouterProvider = function (stateRouterProvider) {
                config.$stateProvider = stateRouterProvider;
            };

            this.$get = function () {
                return config;
            };
        })
        .factory('routehelper', ['$location', '$rootScope', '$route', 'routehelperConfig', '$state', function ($location,
            $rootScope, $route, routehelperConfig, $state) {
            var $urlRouterProvider = routehelperConfig.$urlRouterProvider, $stateProvider = routehelperConfig.$stateProvider;
            var configureRoutes = function (routes) {
                routes.forEach(function (route) {
                    route.config.resolve =
                        angular.extend(route.config.resolve || {}, routehelperConfig.resolveAlways || {});
                    $urlRouterProvider.when(route.url, route.config);
                });
                $urlRouterProvider.otherwise({ redirectTo: '/' });
            };
            var configureStates = function (states) {
                states.forEach(function (state) {
                    state.resolve =
                        angular.extend(state.resolve || {}, routehelperConfig.resolveAlways || {});
                    $stateProvider.state(state);
                });
            };

            function getRoutes() {
                return iterateItem($route.routes);
            }

            var iterateItem = function (iterateSource) {
                var routes = [];
                for (var prop in iterateSource) {
                    if (iterateSource.hasOwnProperty(prop)) {
                        var route = iterateSource[prop];
                        var isRoute = !!route.name;
                        if (isRoute) {
                            routes.push(route);
                        }
                    }
                }
                return routes;
            }

            function getStates() {
                return iterateItem($state.get());
            }

            return {
                configureRoutes: configureRoutes,
                getRoutesList: getRoutes,
                getStatesList: getStates,
                configureStates: configureStates
            }
        }]);
})();
