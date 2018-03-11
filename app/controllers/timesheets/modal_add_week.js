viguProjectManager.controller('modalAddWeekCtrl', ['$scope', 'dataService', modalAddWeekCtrl]);

function modalAddWeekCtrl($scope, dataService) {

    // Imported factories
	$scope.dataService = dataService;

    // New Week Modal
	$scope.newWeekFltrYear; // [number (year)] bound to modal's year field
	$scope.newWeekFltrMonth; // [string (month)] bound to modal's month field
	$scope.getSundays = getSundays; // [function - returns array] returns all sundays (ie week timesheets) for selected year and month
	$scope.newWeekSundays = []; // [array of numbers (timestamps in milliseconds)] contains list of sundays for selected year and month
	$scope.newWeekSelected; // [number (index of the week selected)] contains selected week index
	$scope.createWeek = createWeek; // [function - no return value] adds selected week to database and sets it as active
	$scope.addWeekModalErrorMsg = []; // [array] displays error message if search fields are empty
	$scope.purgeNewWeek = purgeNewWeek; // [function - no return value] resets modal's fields
	$scope.selectWeek = selectWeek; // [function - no return value] selects a week from the week list when adding a new week timesheet

    function createWeek() {
		var newWeek = {};

		newWeek.weekOf = $scope.newWeekSundays[$scope.newWeekSelected].date;
		newWeek.days = [
			{
				start: null,
				entries: []
			},
			{
				start: null,
				entries: []
			},
			{
				start: null,
				entries: []
			},
			{
				start: null,
				entries: []
			},
			{
				start: null,
				entries: []
			},
			{
				start: null,
				entries: []
			},
			{
				start: null,
				entries: []
			},
		];
		dataService.timesheets.push(newWeek);
		$scope.$parent.$parent.activeWeekTimesheet = dataService.timesheets.length-1;
		$scope.$parent.$parent.activeTimesheet = 0;
		$scope.$parent.$parent.newDay = true;
		$scope.purgeNewWeek();
		$scope.setDayView();
	}

	function purgeNewWeek() {
		console.log('test111');
		$scope.newWeekSundays = [];
		$scope.newWeekFltrYear = undefined;
		$scope.newWeekFltrMonth = undefined;
		$scope.addWeekModalErrorMsg = [];
		$scope.addWeekForm.addWeekYearInput.$setPristine();
		$scope.addWeekForm.addWeekYearInput.$setUntouched();
		$scope.addWeekForm.addWeekYearInput.$setPristine();
		$scope.addWeekForm.addWeekMonthInput.$setUntouched();
	}

    function getSundays() {
		var sundays = [];
		var sunday = {};
		var day = 1;
		var date = new Date($scope.newWeekFltrYear,$scope.newWeekFltrMonth,day);

		$scope.addWeekModalErrorMsg = [];

		if (!$scope.newWeekFltrYear || !$scope.newWeekFltrMonth) {
			$scope.addWeekModalErrorMsg.push("Please enter the search criteria!");
			return
		}

		for (var day = 1; date.getMonth() == $scope.newWeekFltrMonth; day++) {
			date.setDate(day);

			if (date.getDay() == 0) {
				sunday.date = Date.parse(date);
				sunday.existing = false;

				for (var i = 0; i < dataService.timesheets.length; i++) {

					if (dataService.timesheets[i].weekOf == sunday.date) {
						sunday.existing = true
					}

				}

				sundays.push(sunday);
				sunday = {};
			}

		}

		$scope.newWeekSundays = sundays;

	}

    function selectWeek(index,existingWeek) {
		if (!existingWeek) {
			$scope.newWeekSelected = index
		}
	}

}
