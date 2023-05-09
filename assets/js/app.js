var app = angular.module('app', ['tableSort']);

app
    .controller('MainController', function MainController($scope, $http) {
        $scope.competitions = [];
        $scope.site = [];

        $http({
            method: 'GET',
            url: 'data/competitions.yaml'
        }).then(function successCallback(response) {
            $scope.competitions = jsyaml.load(response.data); // response data
        }, function errorCallback(error) {
            console.error(error);
        });

        $http({
            method: 'GET',
            url: 'data/config.yml'
        }).then(function successCallback(response) {
            $scope.site = jsyaml.load(response.data); // response data
        }, function errorCallback(error) {
            console.error(error);
        });


        $scope.showMessage = function(message) {
            alert('视频地址: '+message);
          };

    })
    .filter('parseCurrency', function () {
        return function (input) {
            return input.replace('$', '').replace(/,/g, '');
        };
    }).filter('trustHtml', function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        }
    });

// 多条件过滤, 实现|表示或, &表示与
app.filter('multiFilter', function () {
    return function (merchants, searchText) {
        if (!searchText) return merchants;

        merchants = merchants.map(function (term) {
            return JSON.stringify(term);
        })
        var searchTerms = searchText.split(';');
        searchTerms = searchTerms.map(function (term) {
            return term.trim();
        })

        // searchTerms = searchTerms.map(function (term) {
        //     return term.trim();
        // })
        console.log(searchTerms);
        console.log(merchants);

        var returnedArray = [];
        merchants.forEach(function (merchant) {
            console.log(searchTerms.map(function (term) {
                return merchant.indexOf(term) > -1;
            }).indexOf(false)==-1)

            if (searchTerms.map(function (term) {
                return merchant.indexOf(term) > -1;
            }).indexOf(false)==-1) {
                returnedArray.push(JSON.parse(merchant))
            }
        })

        // console.log((_.find(searchTerms, function(term) {
        //     console.log(merchant.find(term));
        //     return merchant.find(term) > -1;
        //   })));
        return returnedArray;
    }
});