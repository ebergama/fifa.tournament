angular.module('fifa').controller('modalController', function ($scope, $modal, $log) {

    $scope.animationsEnabled = true;

    $scope.open = function (match) {

        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'resultsEditor',
            controller: 'modalInstanceController',
            resolve: {
                match: function () {
                    return match;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };

});

angular.module('fifa').controller('modalInstanceController', function ($scope, $modalInstance, match, $http) {

    $scope.match = match;


    $scope.ok = function () {
        $http.put("/api/match", match).success(function(response) {
            $modalInstance.close();
        }).error(
            $modalInstance.dismiss("error")
        )
        
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});