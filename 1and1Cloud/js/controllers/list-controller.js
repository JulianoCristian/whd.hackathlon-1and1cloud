angular.module('whd').controller('listController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
    var config = {
        headers: {
            'x-token': $rootScope.key,
            'Content-Type': 'application/json'
        }
    };

    function loadList() {
        // Add a timestamp to the request, without it the edge engine is caching the requests
        config.params = {
            time: new Date().getTime()
        };

        // Fetch the servers
        $http.get('https://cloudpanel-api.1and1.com/v1/servers',
            config
        ).then(function (response) {
            $scope.servers = response.data;
            angular.forEach($scope.servers, function (server) {
                // Get the monitoring Data for the CPU for the last 1h
                if (server.status.state != 'DEPLOYING') {
                    var scopedConfig = angular.copy(config);
                    scopedConfig.params = {
                        period: 'LAST_HOUR'
                    }
                    $http.get('https://cloudpanel-api.1and1.com/v1/monitoring_center/' + server.id,
                        scopedConfig
                    ).then(function (response) {
                        server.lastCPUStatus = response.data.cpu.status;
                    });
                }
            });
        });

        // Fetch the loadBalencers
        $http.get('https://cloudpanel-api.1and1.com/v1/load_balancers',
            config
        ).then(function (response) {
            $scope.loadBalancers = response.data;
        });

        // Fetch the firewall policies
        $http.get('https://cloudpanel-api.1and1.com/v1/firewall_policies',
           config
       ).then(function (response) {
           $scope.firewallPolicies = response.data;

           angular.forEach($scope.firewallPolicies, function (firewall) {
               firewall.protocols = {};

               // Get the ports per Protocol
               angular.forEach(firewall.rules, function (rule) {
                   var name = rule.protocol;
                   if (typeof firewall.protocols[name] == 'undefined') {
                       firewall.protocols[name] = [];
                   }
                   firewall.protocols[name].push(rule.port_from);
               });

           });
       });

        return $scope.servers;
    }

    // Delete a Server
    $scope.deleteServer = function (id) {
        var data = null;

        // Unfortunatly with $http.delete we couldn't send a content-type header, so we will use native JS for this
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                loadList();
            }
        });

        xhr.open("DELETE", "https://cloudpanel-api.1and1.com/v1/servers/" + id);
        xhr.setRequestHeader("x-token", $rootScope.key);
        xhr.setRequestHeader("content-type", "application/json");

        xhr.send(data);
    }

    loadList();
}]);