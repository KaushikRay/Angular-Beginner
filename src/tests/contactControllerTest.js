describe("personCtrl", function() {
    var $rootScope, $scope, controller;

    beforeEach(function() {
        module('myApp');

        inject(function($injector){
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            controller = $injector.get('$controller')("personCtrl", {$scope : $scope});
        });
    });

    describe("Initialization", function() {
        it("should initialize values correctly", function() {
            expect($scope.contacts).not.toBe(null);
            expect($scope.contacts.length).toBe(3);
        });
    });

    describe("Reset functionality", function() {
        beforeEach(function() {
            $scope.firstName = 'Kaushik';
            $scope.lastName = 'Ray';
            $scope.phone = '123456789';
            $scope.id = '12345';
        });

        it("should reset values properly", function() {
            $scope.reset();
            expect($scope.firstName).toBe(undefined);
            expect($scope.lastName).toBe(undefined);
            expect($scope.phone).toBe(undefined);
            expect($scope.id).toBe(undefined);
        });
    });

    describe("Edit functionality", function() {
        beforeEach(function() {

        });

        it("should populate correct scope values", function() {
            $scope.editRecord("0039000000wuq3CAAQ");
            expect($scope.firstName).toBe("Kaushik");
            expect($scope.lastName).toBe("Ray");
            expect($scope.phone).toBe("1234567890");
        });
    });
});