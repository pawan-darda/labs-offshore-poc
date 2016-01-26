'use strict';
angular.module('app.product')
    .config(['RESTAPIUrlConfigProvider', function (RESTAPIUrlConfigProvider) {
        
    }])
    .run(['routehelper', function (routehelper) {
        var product = {
            parentRoute: {name: rx.Constants.ProductModuleConstant.PRODUCT_MODULE_HEADER}
        };

        var productList = angular.extend({
            name: rx.Constants.ProductModuleConstant.PRODUCT_LIST_STATE_NAME,
            url: rx.Constants.ProductModuleConstant.PRODUCT_LIST_ROUTER,
            templateUrl: 'static/app/product/templates/product-list.tpl.html',
            controller: 'productListCtrl'
        }, product);

        var addProduct = angular.extend({
            name: rx.Constants.ProductModuleConstant.ADD_PRODUCT_STATE_NAME,
            url: rx.Constants.ProductModuleConstant.ADD_PRODUCT_ROUTER,
            templateUrl: 'static/app/product/templates/product-create.tpl.html',
            controller: 'productCreateCtrl'
        }, product);

        var states = [productList, addProduct];

        routehelper.configureStates(states);
}]);