var catalogServices = angular.module('catalogServices', []);

angular.module('catalogServices').factory('orderService', ['$resource', '$http',
    function ($resource, $http) {
        var orderService = {};
        orderService.reverse = true;        
        
        return orderService;
    }
]);

angular.module('catalogServices').factory('filtersService', ['$resource', '$http', '$sanitize',
    function ($resource, $http, $sanitize) {
        var filtersService = {};
        filtersService.productType = null;
        filtersService.colors = [];
        filtersService.models = [];
        filtersService.priceRange = [0, 0];
        
        filtersService.byParams = function(item) {
            var inPriceRange = false,
                inCategory = false,
                hasColors = false,
                inColors = false,
                hasModels = false,
                inModels = false;
                
            if (parseInt(item.meta['Price'][0]) >= parseInt(filtersService.priceRange[0]) && parseInt(item.meta['Price'][0]) <= parseInt(filtersService.priceRange[1])) {           
                inPriceRange = true;
            }
            
            if (filtersService.productType === null) {
                inCategory = true;
            } else { 
                if (item.terms.product_type[0].ID === filtersService.productType.ID) {
                    inCategory = true;
                }
            }
             
            if (typeof item.terms.product_colors != 'undefined') {
                hasColors = true;
                if (!filtersService.colors.length) {
                    inColors = true;
                } else if (filtersService.colors.indexOf(item.terms.product_colors[0].ID) != -1) {      
                    inColors = true;
                }
            }
             
            if (typeof item.terms.product_models != 'undefined') {
                hasModels = true;
                if (!filtersService.models.length) {
                    inModels = true;
                } else if (filtersService.models.indexOf(item.terms.product_models[0].ID) != -1) {      
                    inModels = true;
                }
            }
            
            if (inPriceRange && inCategory) {
                if (!hasColors || inColors) {
                    if (!hasModels || inModels) {
                        return true;
                    }
                }
            }
        };
        
        return filtersService;
    }
]);