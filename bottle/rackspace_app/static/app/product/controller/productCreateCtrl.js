angular.module('app.product.controller')
    .controller('productCreateCtrl', ['$scope', 'productService', '$rootScope', function ($scope, productService, $rootScope) {
        $scope.product = {};
        $scope.form = {
            name:'createProductForm'
        }
        $scope.saveProduct = function () {
            productService.api.saveProduct({ productId: $scope.product.product_id }, $scope.product, function (response) {
                if (response && response.success) {
                    $scope.product = {};
                    $rootScope.$broadcast(rx.Constants.PublisherEventPayLoad.SHOW_SUCCESS_COMMAND, new rx.ExceptionHandler.SuccessAlert(response.msg || ''));
                }
                else {
                    throw new rx.ExceptionHandler.CustomError(rx.Constants.CommonErrorConstant.SERVICE_INVOCATION_ERR + response.msg || '');
                }
            });
        }

        $scope.clear = function () {
            $scope.product = {};
            //$scope.form.name.$setPristine(true);
        }
    }]);
