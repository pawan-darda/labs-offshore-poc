angular.module('app.layout.controller',[])
    .controller('shellCtrl', ['$scope', '$location', 'routehelper',
        '$rootScope', '$window', 'encoreRoutes',
        'rxVisibility', '$state','rxBreadcrumbsSvc',
        function ($scope, $location, routehelper, $rootScope, $window,
            encoreRoutes, rxVisibility, $state, rxBreadcrumbsSvc) {

            rxBreadcrumbsSvc.set([{
                name: rx.Constants.Common.ALL_PRODUCT
            }]);

            rxBreadcrumbsSvc.setHome(rx.Constants.ProductModuleConstant.DEFAULT_PRODUCT_ROUTER, rx.Constants.Common.HOME);

            $scope.navRoutes = [];

            var getNavRoutes = function () {
                var states = routehelper.getStatesList();
                /* Need to construct hierarchy order
                
                */                
                if (states) {
                    states.forEach(function (state) {
                        if (state.parentRoute) {
                            var parent = getParentStateInstance($scope.navRoutes, state.parentRoute);
                            if (parent) {
                                parent.children.push(getNav(state));
                            }
                        }
                        else {
                            var root = { title: '', children: [] };                            
                            root.children.push(getNav(state));
                            $scope.navRoutes.push(root);
                        }
                    });
                }

                $state.go(rx.Constants.ProductModuleConstant.PRODUCT_LIST_STATE_NAME);
            };

            var getNav = function (state) {
                return {
                    href: state.url ? ("#" + state.url) : '', linkText: state.name, url: state.url, name: state.name
                };
            }

            var iterateStates = function (states, parentState) {
                if (!states) return;
                var root;
                for (var i = 0, j = states.length; i < j; i++) {
                    if (states[i].name && states[i].name == parentState.name) {
                        states[i].children = states[i].children || [];
                        root = states[i];
                        break;
                    }
                    else {
                        root = iterateStates(states[i].children, parentState);
                    }
                }
                return root;

            }

            var getParentStateInstance = function (states, parentState) {
                var root = iterateStates(states, parentState);
                if (root) return root;
                //It doesnt exist in the root collection. needs to insert into root children
                var nav = getNav(parentState);
                var root = { title: '', children: [] };
                $scope.navRoutes.push(root);
                nav.children = nav.children || [];
                nav.active = true;
                root.children.push(nav);
                return nav;
            }

            getNavRoutes();
}]);