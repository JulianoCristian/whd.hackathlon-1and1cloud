angular.module('whd').controller('createController', ['$scope', '$http', '$location', '$rootScope', function ($scope, $http, $location, $rootScope) {
    var config = {
        headers: {
            'x-token': $rootScope.key,
            'Content-Type': 'application/json'
        },
    };

    $scope.server = {
        "name": "",
        "description": "",
        "hardware": {
            "vcore": 2,
            "cores_per_processor": 1,
            "ram": 2,
            "hdds": [
            {
                "size": 20,
                "is_main": true
            }
            ]
        },
        // This appliance id creates CentOS 7 server
        "appliance_id": "B5F778B85C041347BCDCFC3172AB3F3C"
    }

    $scope.addHdd = function () {
        $scope.server.hardware.hdds.push({
            "size": 20,
            "is_main": false
        });
    };

    // Create a server with some hardcoded values
    $scope.createServer = function () {

        var newServer = {
            "name": $scope.server.name,
            "description": $scope.server.description,
            "hardware": {
                "vcore": $scope.server.hardware.vcore,
                "cores_per_processor": 1,
                "ram": $scope.server.hardware.ram,
                "hdds": [
                {
                    "size": 20,
                    "is_main": true
                }
                ]
            },
            "appliance_id": "B5F778B85C041347BCDCFC3172AB3F3C"
        }

        $http.post('https://cloudpanel-api.1and1.com/v1/servers', newServer, config)
           .then(function (response) {
               $location.path('/list');
           });
    };
}]);