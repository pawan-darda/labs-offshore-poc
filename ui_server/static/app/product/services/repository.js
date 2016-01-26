angular.module('app.product.service', [])
    .factory('productService', ['$resource', 'RESTAPIUrlConfig', function ($resource, RESTAPIUrlConfig) {

        var getApiMethod = function (url) {
            var apiMethod = {
                retrieveProductList: { method: 'GET', url: url + "/products" },
                saveProduct: { method: 'POST', url: url + "/product/:productId" },
                getProductDetails: { method: 'GET', url: url + "/product/:productId" },
                deleteProduct: { method: 'DELETE', url: url + "/product/:productId" }
            };

            return apiMethod;
        }

        var resource = $resource(RESTAPIUrlConfig.urlBaseService, {}, getApiMethod(RESTAPIUrlConfig.urlBaseService));

        //temp code
        var updateResourceByBaseUrl = function (url) {
            return $resource(url, {}, getApiMethod(url));
        }

        return { api: resource, updateResourceByBaseUrl: updateResourceByBaseUrl };
}]);