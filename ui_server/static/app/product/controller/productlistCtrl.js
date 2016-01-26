angular.module('app.product.controller', [])
    .controller('productListCtrl', ['$scope', 'productService','$route','modalService','$rootScope',
        function ($scope, productService, $route, modalService, $rootScope) {

            $scope.getModalParam = function (data, path, controller) {
                return modalParam = {
                    backdrop: true,
                    keyboard: true,
                    modalFade: true,
                    templateUrl: 'static/app/product/templates/product-details.tpl.html',
                    controller: 'productdetailsCtrl',
                    windowClass: 'modalCSS fluid-Modal',
                    resolve: {
                        modalInput: function () {
                            return data;
                        }
                    }
                }
            };

            $scope.showModel = function (item) {
                modalService.showModal($scope.getModalParam(item), $scope.modalOptions).then(function (result) {
                });
            };

            $scope.OnDeleteClick = function (item) {
                if (item && item.product_id) {
                    productService.api.deleteProduct({ productId: item.product_id }, function (response) {
                        if (response && response.success) {
                            $rootScope.$broadcast(rx.Constants.PublisherEventPayLoad.SHOW_SUCCESS_COMMAND, new rx.ExceptionHandler.SuccessAlert(response.msg || ''));
                            if($scope.productList)
                            {
                                var index = $scope.productList.indexOf(item);
                                if(index>-1)
                                {
                                    $scope.productList.splice(index,1);
                                }
                            }
                        }
                        else {
                            throw new rx.ExceptionHandler.CustomError(rx.Constants.CommonErrorConstant.SERVICE_INVOCATION_ERR + response.msg || '');
                        }
                    });
                }
            };

            $scope.getProductList = function () {
                productService.api.retrieveProductList({}, function (response) {
                    if (response && response.success) {
                        if (!response.msg) {
                            $scope.productList = response.products;
                        }
                        else {
                            $rootScope.$broadcast(rx.Constants.PublisherEventPayLoad.SHOW_SUCCESS_COMMAND, new rx.ExceptionHandler.SuccessAlert(response.msg || ''));
                        }
                    }
                    else {
                        throw new rx.ExceptionHandler.CustomError(rx.Constants.CommonErrorConstant.SERVICE_INVOCATION_ERR + (response.msg || ''));
                    }
                });
            }

            $scope.getProductList();

}]);
