angular.module('myApp', []).controller('personCtrl', function($scope, $http, $q) {
    $scope.fullName = function() {
        return $scope.firstName + ' ' + $scope.lastName;
    };

    $scope.contacts = JSON.parse('[{"phone":"1234567890","lastName":"Ray","id":"0039000000wuq3CAAQ","firstName":"Kaushik"},{"phone":"(336) 222-7000","lastName":"Rogers","id":"0039000000wuq2yAAA","firstName":"aaaaa"},{"phone":"(512) 757-6000","lastName":"Forbes","id":"0039000000wuq2xAAA","firstName":"aass"}]');


    $scope.reset = function() {
        delete $scope.firstName;
        delete $scope.lastName;
        delete $scope.phone;
        delete $scope.id;
    }

    $scope.addRow = function() {
        var contactJS = new Contact();

        contactJS.firstName = $scope.firstName;
        contactJS.lastName = $scope.lastName;
        contactJS.phone = $scope.phone;
        contactJS.id = $scope.id;
        console.log('contactJS before upsert-->', contactJS);

        // This is required to create a result set for async call
        var deferred = $q.defer();
        // Create a promise to finalize after async exec is complete
        var promise = deferred.promise;

        Visualforce.remoting.Manager.invokeAction(
            '{!$RemoteAction.Angular_HelloWorld.upsertContact}',
            contactJS,
            function(result, event) {
                console.log('result', result);

                // Check if it is insert or update
                if (!contactJS.id) {
                    $scope.contacts.push(JSON.parse(result));
                } else {
                    for (var i=0; i<$scope.contacts.length;i++) {
                        if ($scope.contacts[i].id === contactJS.id) {
                            $scope.contacts[i] = contactJS;
                        }
                    }
                }
                deferred.resolve(result);
                console.log('-->', $scope.contacts);
            },
            {escape:false}
        );
        $scope.reset();
        promise.then(function(value){
            // This will automatically call the apply and digest to reflect 2 way binding
        });
    }

    function Contact() {
        this.id = null;
        this.lastName = null;
        this.phone = null;
        this.id = null;
    }

    // Edit record to capture all existing data and prepopulate
    $scope.editRecord = function(contactId) {
        console.log('--> edit record', $scope.contacts);
        var contactInstance = _.find($scope.contacts, function(cInst){
            return cInst.id === contactId;
        });
        console.log('contactInstance -->', contactInstance);
        $scope.firstName = contactInstance.firstName;
        $scope.lastName = contactInstance.lastName;
        $scope.phone = contactInstance.phone;
        $scope.id = contactInstance.id;
    }

    $scope.deleteRecord  = function(contactId) {
        console.log('delete record -->', contactId);
        console.log('delete record -->', $scope.contacts);
        // This is required to create a result set for async call
        var deferred = $q.defer();
        // Create a promise to finalize after async exec is complete
        var promise = deferred.promise;

        Visualforce.remoting.Manager.invokeAction(
            '{!$RemoteAction.Angular_HelloWorld.deleteContact}',
            contactId,
            function(result, event) {
                console.log('result', result);
                if (event.status) {
                    alert('Contact Record deleted');
                    var indexElement =
                        _.findIndex($scope.contacts, {id : contactId});
                    $scope.contacts.splice(indexElement, 1);
                    console.log('indexElement -->', indexElement);
                } else if (event.type === 'exception') {
                    alert('Faced error : ' + event.message + '\n Error at : ' + event.where);
                }
                deferred.resolve(result);
                console.log('-->', $scope.contacts);
            },
            {escape:false}
        );
        $scope.reset();
        promise.then(function(value){
            // This will automatically call the apply and digest to reflect 2 way binding
        });
    }
});
