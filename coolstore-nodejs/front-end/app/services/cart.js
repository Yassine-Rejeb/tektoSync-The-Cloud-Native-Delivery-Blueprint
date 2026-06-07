'use strict';

angular.module("app")

.factory('cart', ['$http', '$q', 'COOLSTORE_CONFIG', 'Auth', '$location', function($http, $q, COOLSTORE_CONFIG, $auth, $location) {
	var factory = {}, cart, cartId, protocolUrl, baseUrl, apiUrl, hostUrl;

  protocolUrl = $location.protocol() + '://';
  hostUrl = COOLSTORE_CONFIG.OCP_NAMESPACE ? 'cart-' + COOLSTORE_CONFIG.OCP_NAMESPACE + '.' + $location.host().replace(/^.*?\.(.*)/g,"$1") : 'localhost:7074'
  apiUrl = '/api/v2/cart';

	baseUrl = protocolUrl + hostUrl + apiUrl;
 	// baseUrl = $location.protocol() + '://cart-' + COOLSTORE_CONFIG.OCP_NAMESPACE + '.' + $location.host().replace(/^.*?\.(.*)/g,"$1") + '/api/v2/cart';
	// Following used for local testing
 	// baseUrl = 'http://localhost:7074/api/v2/cart';
	// baseUrl = 'https://cart-node-dev.apps.ci-ln-wfw1mxt-76ef8.aws-2.ci.openshift.org/api/v2/cart';


	factory.checkout_withBilling = function(ccinfo){
		var deferred = $q.defer();
		var orderId = "order-" + (Math.floor(Math.random() * 10000)) + "-" + cartId;
        let billingInfo = {"orderId": orderId ,"total": cart.cartTotal, "creditCard": {"number": ccinfo.creditCard,"expiration": ccinfo.month+"/"+ccinfo.year,"nameOnCard": ccinfo.nameOnCard}, "billingAddress": ccinfo.shippingAddress, "name": ccinfo.nameOnCard};
        $http({
            method:'POST',
            url: baseUrl + '/checkout/' + cartId,
            data: billingInfo,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function(resp) {
            cart = resp.data;
            deferred.resolve(resp.data);
        }, function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    };

	factory.checkout = function() {
		var deferred = $q.defer();
		$http({
			   method: 'POST',
			   url: baseUrl + '/checkout/' + cartId
		   }).then(function(resp) {
			    cart = resp.data;
			   	deferred.resolve(resp.data);
		   }, function(err) {
			   	deferred.reject(err);
		   });
		return deferred.promise;
	};

	factory.reset = function() {
		cart = {
			cartItems: []
		};
		var tmpId = localStorage.getItem('cartId');
		var authId = $auth.userInfo ? $auth.userInfo.sub : null;

		if (tmpId && authId) {
			// transfer cart
			cartId = authId;
			this.setCart(tmpId).then(function(result) {
				localStorage.removeItem('cartId');
			}, function(err) {
				console.log("could not transfer cart " + tmpId + " to cart " +  authId + ": " + err);
			});
			return;
		}

		if (tmpId && !authId) {
			cartId = tmpId;
		}

		if (!tmpId && authId) {
			cartId = authId;
		}

		if (!tmpId && !authId) {
			tmpId = 'id-' + Math.random();
			localStorage.setItem('cartId', tmpId);
			cartId = tmpId;
		}

		cart.cartItems = [];
		$http({
			   method: 'GET',
			   url: baseUrl + '/' + cartId
		   }).then(function(resp) {
			    cart = resp.data;
		   }, function(err) {
		});

	};

	factory.getCart = function() {
		return cart;
	};

	factory.removeFromCart = function(product, quantity) {
		var deferred = $q.defer();
		$http({
			method: 'DELETE',
			url: baseUrl + '/' + cartId + '/' + product.itemId
		}).then(function(resp) {
			cart = resp.data;
			deferred.resolve(resp.data);
		}, function(err) {
			deferred.reject(err);
		});
		return deferred.promise;

	};

	factory.setCart = function(id) {
		var deferred = $q.defer();
		$http({
			method: 'POST',
			url: baseUrl + '/' + cartId + '/' + id
		}).then(function(resp) {
			cart = resp.data;
			deferred.resolve(resp.data);
		}, function(err) {
			deferred.reject(err);
		});
		return deferred.promise;

	};

	factory.addToCart = function(product, quantity) {
		var deferred = $q.defer();
		$http({
			   method: 'PUT',
			   url: baseUrl + '/' + cartId,
				 data: { product, quantity }
		   }).then(function(resp) {
			    cart = resp.data;
			   	deferred.resolve(resp.data);
		   }, function(err) {
			   	deferred.reject(err);
		   });
		return deferred.promise;

	};

	factory.reset();
	return factory;
}]);
