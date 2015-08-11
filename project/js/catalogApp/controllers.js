var catalogControllers = angular.module('catalogControllers', []);

catalogControllers.controller('catalogCtrl', ['$scope', '$http', 'orderService', 'filtersService', '$filter', '$state', '$stateParams', '$log', 
    function ($scope, $http, orderService, filtersService, $filter, $state, $stateParams, $log) {   
        $scope.productData = {};
        $scope.currentPage = 1;
        $scope.pageSize = 5;
        $scope.$watch('currentPage', function() { changeUrl(); }, true);
        $scope.$watch('searchTerm', function() { changeUrl(); }, true);
        $scope.$watch('pageSize', function() { changeUrl(); }, true);
        $scope.$watch('filtersService.priceRange[0]', function() { changeUrl(); }, true);
        $scope.$watch('filtersService.priceRange[1]', function() { changeUrl(); }, true);
        $scope.$watch('filtersService.colors', function() { changeUrl(); }, true);
        $scope.$watch('filtersService.models', function() { changeUrl(); }, true);
        $state.current.reloadOnSearch = false;
            
        $http.get('data/products.json').success(function(data) {
            $scope.products = data;
            document.getElementById('loading').className = 'hidden';
        
            $scope.currentPage = parseInt($stateParams.curr);
            $scope.pageSize = parseInt($stateParams.size); 
            $scope.searchTerm = $stateParams.st;
            
            var productsLength = $scope.products.length;
            $scope.minPrice = parseInt($stateParams.min); 
            var maxPrice = 0; 
            for (var i = 0; i < productsLength; i++) {
                var price = parseInt($scope.products[i].meta['Price'][0]);
                maxPrice = price > maxPrice ? price : maxPrice; 
            }
            maxPrice = $stateParams.max != null ? parseInt($stateParams.max) : maxPrice;
            $scope.maxPrice = maxPrice;   

            filtersService.priceRange = [$scope.minPrice, $scope.maxPrice];
        });
        
        $http.get('data/product_types.json').success(function(data) {
            $scope.productData.types = data;
            var productTypeId = $stateParams.prod;
            
            angular.forEach($scope.productData.types, function(typeObject, i) {
                if (typeObject.ID == productTypeId) {
                    filtersService.productType = typeObject;
                    if (typeObject.name == "Dress") {
                        $scope.showMoreOptions = true;
                    } else {                        
                        filtersService.colors = [];
                        filtersService.models = [];
                    }
                }
            });
        });
        
        $http.get('data/colors.json').success(function(data) {
            $scope.productData.colors = data;
            var paramColors = stringToIntArray($stateParams.cols);
            filtersService.colors = paramColors.length ? getArrayMatching($scope.productData.colors, paramColors) : [];
        });
        $http.get('data/models.json').success(function(data) {
            $scope.productData.models = data; 
            var paramModels = stringToIntArray($stateParams.mods);            
            filtersService.models = paramModels.length ? getArrayMatching($scope.productData.models, paramModels) : [];
        });
        $scope.setMinPrice = function() {
            filtersService.priceRange[0] = parseInt(filtersService.priceRange[0]);
        }
        
        $scope.setMaxPrice = function() {
            filtersService.priceRange[1] = parseInt(filtersService.priceRange[1]);
        }
        
        $scope.checkAll = function(type) {
            filtersService[type] = [];
            angular.forEach($scope.productData[type], function(typeObject, i) {
                filtersService[type].push(typeObject.ID);
            });
            changeUrl();
        }
        
        $scope.isThisChecked = function(index, type) {
            return filtersService[type].indexOf($scope.productData[type][index].ID) != -1;
        }
        
        function stringToIntArray(str) {
            var output = str ? str.split(",") : [];
            if (output.length) {
                angular.forEach(output, function(value, key) {
                    output[key] = parseInt(value);
                });
            }
            
            return output;
        }
        
        function getArrayMatching(originalArray, matchingArray) {
            var output = [];
            angular.forEach(originalArray, function(value, key) {
                var item = null;
                if (matchingArray.indexOf(value.ID) != -1) {
                    item = parseInt(value.ID);
                }
                output.push(item);
            });
        
            return output;
        }
        
        $scope.viewStyle = 'flexable';
        $scope.orderService = orderService;
        $scope.filtersService = filtersService;    
        $scope.reverse = [true, false];   
        
        $scope.slider = {
            'options': {
                range: true,
                start: function (event, ui) { },
                stop: function (event, ui) { }
            }
        };
        
        $scope.isFlexable = function() {
            return $scope.viewStyle == 'flexable';
        };
        
        $scope.setField = function() {
            $scope.showMoreOptions = (filtersService.productType !== null && filtersService.productType.name === "Dress");
            
            if (filtersService.productType === null) {
                filtersService.colors = [];
                filtersService.models = [];
            }
            
            changeUrl();
        }
        
        function changeUrl() {
            var product = filtersService.productType == null ? null : filtersService.productType.ID;
            var colors = intArrayToString(filtersService.colors);
            var models = intArrayToString(filtersService.models);
            
            var args = {
                'prod': product,
                'cols': colors,
                'mods': models,
                'curr': $scope.currentPage,
                'size': $scope.pageSize,
                'min': filtersService.priceRange[0],
                'max': filtersService.priceRange[1],
                'st': $scope.searchTerm
            };
            $state.transitionTo('root', args, { notify: false });
        }
        
        function intArrayToString(arr) {
            var str = '';
            angular.forEach(arr, function(value, key) {
                if (value != null) {
                    str += value;
                    if (key < arr.length - 1 && arr.length > 1) {
                        str += ',';
                    }
                }
            });
            
            return str;
        }
    }
]);