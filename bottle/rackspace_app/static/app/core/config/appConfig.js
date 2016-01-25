(function () {
    'use strict';
    angular.module('app.core')
        .provider('RESTAPIUrlConfig', function () {
            var serverUrl = {
                urlBaseService: 'http://0.0.0.0:5000/rackspace/flask/api/v1.0',//http://localhost:8989/:dest?rtype=json',
                urlFileDownload: 'http://localhost:4410/pcompui/fileDownloadWS/'
            };
            this.setServerBaseUrl = function (url) {
                serverUrl.urlBaseService = url;
            };
            this.setServerDownloadUrl = function (url) {
                serverUrl.urlFileDownload = url;
            };

            this.$get = [function () {
                return { urlBaseService: serverUrl.urlBaseService, urlFileDownload: serverUrl.urlFileDownload};
            }];
        });
})();
