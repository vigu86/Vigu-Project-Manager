viguProjectManager.controller('modalChooseWeekCtrl', ['$scope', 'dataService', modalChooseWeekCtrl]);

function modalChooseWeekCtrl($scope, dataService) {

    // Imported factories
	$scope.dataService = dataService;

    // Choose Week Modal
	$scope.selectWeekFltrYear; // [number] bound to modal's year field
	$scope.selectWeekFltrMonth; // [string] bound to modal's month field
	$scope.getWeeks = getWeeks; // [function] gets list of weeks meeting the filter conditions
	$scope.weeks = []; // [array of numbers (timestamps in milliseconds)] list of weeks returned by getWeeks function
	$scope.selectWeekModalErrorMsg = []; // [array]  displays error messages if search fields are empty or no weeks found
	$scope.purgeChooseWeek = purgeChooseWeek; // [function - no return value] resets modal's fields
	$scope.invalidFieldYear = false;
	$scope.invalidFieldMonth = false;
    $scope.activateWeek = activateWeek;

    function getWeeks() {
        var date; // stores date object built of timesheet's 'weekOf' property
        var year; // timesheet's year
        var month; // timesheet's month

        // reset weeks list and error messages
        $scope.weeks = [];
        $scope.selectWeekModalErrorMsg = [];

        // check if search fields are populated, if not, display error message
        if ($scope.selectWeekFltrYear == "" || !$scope.selectWeekFltrMonth) {
            $scope.selectWeekModalErrorMsg.push("Please enter the search criteria!");
            return
        }

        // loops through all timesheets in database
        for (var i = 0; i < dataService.timesheets.length; i++) {
            date = new Date(dataService.timesheets[i].weekOf);
            year = date.getFullYear();
            month = date.getMonth();

            // if timesheet's year and month meet the filter criteria, adds weekOf property (date) to the weeks array
            if (year == $scope.selectWeekFltrYear && month == $scope.selectWeekFltrMonth) {
                $scope.weeks.push(dataService.timesheets[i].weekOf)
            }
        }

        // if no timesheets found, display error message
        if (!$scope.weeks.length) {
            $scope.selectWeekModalErrorMsg.push("No timesheets meet the selected criteria!");
            return
        }

    }

    function purgeChooseWeek() {
        $scope.weeks = [];
        $scope.selectWeekFltrYear = undefined;
        $scope.selectWeekFltrMonth = undefined;
        $scope.selectWeekModalErrorMsg = [];
        $scope.selectWeekForm.selectWeekYearInput.$setPristine();
        $scope.selectWeekForm.selectWeekYearInput.$setUntouched();
        $scope.selectWeekForm.selectWeekYearInput.$setPristine();
        $scope.selectWeekForm.selectWeekMonthInput.$setUntouched();

    }

    function activateWeek(week) {

        for (var i = 0; i < dataService.timesheets.length; i++) {
            console.log('loop: ' + i);
            if (dataService.timesheets[i].weekOf == $scope.weeks[week]) {
                console.log($scope.$parent.$parent.activeWeekTimesheet);
                $scope.$parent.$parent.activeWeekTimesheet = i;
                console.log($scope.$parent.$parent.activeWeekTimesheet);
                break
            }
            console.log('error');
        }

        $('#modal-choose-week').modal('hide');
    }


}
