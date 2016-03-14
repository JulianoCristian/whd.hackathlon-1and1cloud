angular.module('whd').controller('apiController', ['$scope', '$rootScope', '$location', '$interval', function ($scope, $rootScope, $location, $interval) {

    var applicationData = Windows.Storage.ApplicationData.current,
        localFolder = applicationData.localFolder;
        datarecovered = false;

    // We can't redirect from the callback, that's why we do this crazyness here
    var timer = $interval(function () {
        if (datarecovered) {
            $location.path('/list');
        }
    }, 1000);

    // Check if we have saved an API key
    var getData = function () {
        localFolder.getFileAsync('settings.txt').then(function (sampleFile) {
            return Windows.Storage.FileIO.readTextAsync(sampleFile);
        }).done(function (dataObj) {
            var data = JSON.parse(dataObj);
            datarecovered = true;

            $scope.key = data.key;
            $rootScope.key = data.key;

        });
    }

    // Save the API key in the settings file
    $scope.saveApiKey = function () {
        $rootScope.key = $scope.key;
        localFolder.createFileAsync('settings.txt', Windows.Storage.CreationCollisionOption.replaceExisting).then(
           function (sampleFile) {
               var dataObj = { key: $scope.key };
               return Windows.Storage.FileIO.writeTextAsync(sampleFile, JSON.stringify(dataObj));
           }).done(function () {
               getData();
           });;
    }

    // When we destroy the controller, remove the interval as well
    $scope.$on("$destroy", function () {
        if (timer)
        {
            $interval.cancel(timer);
        }
    });
}]);