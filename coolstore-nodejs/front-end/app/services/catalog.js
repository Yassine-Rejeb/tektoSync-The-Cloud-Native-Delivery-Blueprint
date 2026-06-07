'use strict';

angular.module("app")

.factory('catalog', ['$http', '$q', 'COOLSTORE_CONFIG', 'Auth', '$location', function($http, $q, COOLSTORE_CONFIG, $auth, $location) {
	var factory = {}, products, protocolUrl, baseUrl, apiUrl, hostUrl;

    protocolUrl = $location.protocol() + '://';
    hostUrl = COOLSTORE_CONFIG.OCP_NAMESPACE ? 'catalog-' + COOLSTORE_CONFIG.OCP_NAMESPACE + '.' + $location.host().replace(/^.*?\.(.*)/g,"$1") : 'localhost:7072'
    apiUrl = '/api/v1/products';

    baseUrl = protocolUrl + hostUrl + apiUrl;
    //  baseUrl = 'https://catalog-node-dev.apps.ci-ln-wfw1mxt-76ef8.aws-2.ci.openshift.org/api/v1/products';
    // baseUrl = $location.protocol() + '://localhost:7072/api/v1/products';
    // baseUrl = $location.protocol() + '://catalog-' + COOLSTORE_CONFIG.OCP_NAMESPACE + '.' + $location.host().replace(/^.*?\.(.*)/g,"$1") + '/api/v1/products';

    factory.getProducts = function() {
		var deferred = $q.defer();
        if (products) {
            deferred.resolve(products);
        } else {
            $http({
                method: 'GET',
                url: baseUrl
            }).then(function(resp) {
                products = resp.data;
                deferred.resolve(resp.data);
            }, function(err) {
                deferred.reject(err);
            });
        }
	   return deferred.promise;
	};

	return factory;
}]);
