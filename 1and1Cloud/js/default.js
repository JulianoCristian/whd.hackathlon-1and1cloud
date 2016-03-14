// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize your application here.
            } else {
                // TODO: This application was suspended and then terminated.
                // To create a smooth user experience, restore application state here so that it looks like the app never stopped running.
            }
            args.setPromise(WinJS.UI.processAll());
        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state that needs to persist across suspensions here.
        // You might use the WinJS.Application.sessionState object, which is automatically saved and restored across suspension.
        // If you need to complete an asynchronous operation before your application is suspended, call args.setPromise().
    };



    /**
     * Created by amcuesta on 13/03/2016.
     */
    var whd = angular.module('whd', ['ngRoute']);

    whd.config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.
              when('/list', {
                  templateUrl: 'html-views/list.html',
                  controller: 'listController'
              }).
              when('/create', {
                  templateUrl: 'html-views/server-create.html',
                  controller: 'createController'
              }).
              when('/api', {
                  templateUrl: 'html-views/api.html',
                  controller: 'apiController'
              })
        }]);

    whd.run(['$rootScope', '$location', '$interval', '$timeout', function ($rootScope, $location, $interval, $timeout) {
        var applicationData = Windows.Storage.ApplicationData.current,
            localFolder = applicationData.localFolder,
            datarecovered = false,
            hasKey = false;

        // We need the timeout as for some reason we can't redirect from the done callback
        $timeout(function () {
            if (datarecovered) {
                if (hasKey == true) {
                    $location.path('/list');
                } else {
                    $location.path('/api');
                }
            }
        }, 2000);

        var getData = function () {
            // Check if we have settings file with API key in it
            localFolder.tryGetItemAsync('settings.txt').done(function (file) {
                if (file == null) {
                    datarecovered = true;
                    hasKey = false;
                } else {
                    localFolder.getFileAsync('settings.txt').then(function (sampleFile) {
                        return Windows.Storage.FileIO.readTextAsync(sampleFile);
                    }).done(function (dataObj) {
                        var data = JSON.parse(dataObj);
                        $rootScope.key = data.key;
                        hasKey = true;
                        datarecovered = true;
                    });
                }
            });
        }

        getData();
    }])
})();
