angular.module('app.product.controller')
    .controller('productdetailsCtrl', ['$scope', '$modalInstance', 'productService', 'modalInput','$rootScope',
        function ($scope, $modalInstance, productService, modalInput, $rootScope) {
            $scope.product = {};
            $scope.cancel = function () {
                $modalInstance.close();
            };
            var getProductDetails = function () {
                if (modalInput && modalInput.product_id) {
                    productService.api.getProductDetails({ productId: modalInput.product_id }, function (response) {
                        if (response && response.success && !response.msg) {
                            if (!response.msg) {
                                $scope.product = response.data;
                            }
                            else {
                                $scope.dataNotFound = true;
                                $rootScope.$broadcast(rx.Constants.PublisherEventPayLoad.SHOW_SUCCESS_COMMAND, new rx.ExceptionHandler.SuccessAlert(response.msg || ''));
                            }
                        }
                        else {
                            throw new rx.ExceptionHandler.CustomError(rx.Constants.CommonErrorConstant.SERVICE_INVOCATION_ERR + (response.msg || ''));
                        }

                    });
                }
            };
            getProductDetails();

        }]);
