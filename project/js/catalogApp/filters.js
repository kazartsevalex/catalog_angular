angular.module('catalogFilters', []).filter('orderObjectBy', function() {
    return function(items, reverse) {
        var filtered = [];
        
        angular.forEach(items, function(item) {
            filtered.push(item);
        });
        
        filtered.sort(function (a, b) {
            return (parseInt(a.meta['Price'][0]) > parseInt(b.meta['Price'][0]) ? 1 : -1);
        });
        if (reverse) filtered.reverse();
        
        return filtered;
    };
});