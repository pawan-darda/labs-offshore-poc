angular.module('app.global.service', [])
    .factory('modalService', function ($modal) {

    var defaults = {
        backdrop: 'static',
        keyboard: false,
        modalFade: true,
        templateUrl: '',
        controller: ''
    };

    var show = function (option) {
        var tempModalDefaults = {};        
        angular.extend(tempModalDefaults, defaults, option);

        if (!tempModalDefaults.controller) {
            tempModalDefaults.controller = ['$scope', '$modalInstance', function ($scope, $modalInstance) {
                $scope.modalOptions = tempModalDefaults;
                $scope.modalOptions.ok = function (result) {
                    $modalInstance.close(result);
                };
                $scope.modalOptions.close = function (result) {
                    $modalInstance.dismiss('cancel');
                };
            }];
        }

        return $modal.open(tempModalDefaults).result;
    }

    return {
        showModal: show
    };
});