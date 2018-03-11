viguProjectManager.controller('timesheetsCtrl', ['$scope', 'dataService', timesheetsCtrl]);

function timesheetsCtrl($scope, dataService) {

	// Imported factories
	$scope.dataService = dataService;

	// Dynamic views
	$scope.dayView;
	$scope.setDayView = setDayView; // [function - no return value] - sets proper html file for the selected day in the ng-include element

	// Week summary
	$scope.getSummary = getSummary; // [function returns array of objects (weekdays)] returns all week's project entries by weekday
	$scope.summary = []; // [array of objects] stores the array returned from getSummary function
	$scope.getRowTotal = getRowTotal; // [function - returns number (duration in milliseconds)] calculates total duration for given entry
	$scope.getDayTotal = getDayTotal; // function - returns number (duration in milliseconds)] calculates total duration for given weekday

	// Internal (only used in model)
	var today = new Date();
	var findLastWeek = findLastWeek; // [function] returns last week from the database so that the default week to display is the last one added
	var setInitialTimesheet = setInitialTimesheet; // [function] sets the initial day timesheet to current weekday
	var checkIfNewDay = checkIfNewDay; // [function] checks if active day exisits in database

	// Variables and functions for controlling active week and day
	$scope.activeTimesheet = setInitialTimesheet(); // [number: 0-7] stores active day timesheets
	$scope.activeWeekTimesheet = findLastWeek(); // [number] indicates the index of the active Week Timesheet. Initializes to most recently created Week Timesheet
	$scope.newDay = checkIfNewDay(); // [boolean] indicates if currently active day exisits in database to display correct layout
	$scope.setActiveTimesheet = setActiveTimesheet; // [function] sets active day or week summary upon clicking a weekday or summary button

	$scope.entryDuration = entryDuration;
	$scope.removeItem = removeItem;
	$scope.removeItemIndex = undefined;

	$scope.startTimeModalMode = undefined;

	// Test variables
	$scope.test = "This is a test!";
	$scope.testCounterX = 0;

	$scope.broadcastEvent = broadcastEvent;

	// Functions definintions
	function findLastWeek() {
		var lastTimesheet = dataService.timesheets.length-1;
		return lastTimesheet
	}

	function checkIfNewDay() {
		if (!$scope.dataService.timesheets[$scope.activeWeekTimesheet].days[$scope.activeTimesheet].start) {
			$scope.newDay = true;
		}
		else {
			$scope.newDay = false;
		}
		$scope.setDayView();
	}

	function setInitialTimesheet() {
		var weekDay = today.getDay();
		return weekDay;
	}

	function setActiveTimesheet(weekDay) {
		$scope.activeTimesheet = weekDay;
		if (weekDay == 7) {
			$scope.setDayView();
			return
		}
		$scope.newDay = checkIfNewDay();
	}

	function checkDateFilter(index) {
		var date = new Date(dataService.timesheets[index].weekOf)
		var year = date.getFullYear();
		var month = date.getMonth();

		if ($scope.selectWeekFltrYear == year && $scope.selectWeekFltrMonth == month) {
			return true
		}
		else {
			return false
		}
	}

	function getCurrentYear() {
		var year = today.getFullYear();
		return year
	}

	function getCurrentMonth() {
		var month = today.getMonth();
		return  month.toString()
	}

	function checkCurrentMonth(monthNumber) {
		var month = today.getMonth();
		if (month == monthNumber) {
			return true
		}
		else {
			return false
		}
	}

	function setDayView() {
		if ($scope.activeTimesheet == 7) {
			$scope.dayView = 'week_summary.html';
		}
		else if (!$scope.newDay) {
			$scope.dayView = 'existing_day.html';
		}
		else {
				$scope.dayView ='new_day.html';
		}
	}

	function entryDuration(index) {
		var entryDuration = dataService.calculateEntryDuration($scope.activeTimesheet,index,$scope.activeWeekTimesheet);

		entryDurationHH = Math.floor(entryDuration / 3600000);
		if (entryDurationHH < 10) {
			entryDurationHH = "0" + entryDurationHH;
		}

		entryDurationMM = (entryDuration % 3600000) / 60000;
		if (entryDurationMM === 0) {
			entryDurationMM = "0" + entryDurationMM;
		}
		entryDuration = entryDurationHH + ":" + entryDurationMM;

		return entryDuration;
	}

	function removeItem() {
		// value 'timesheet' means we're deleting entire timesheet
		if ($scope.removeItemIndex == 'timesheet') {
			console.log('fired removeItem');
			dataService.timesheets[$scope.activeWeekTimesheet].days[$scope.activeTimesheet].start = null;
			dataService.timesheets[$scope.activeWeekTimesheet].days[$scope.activeTimesheet].entries = [];
			$scope.newDay = true;
			$scope.setDayView();
		}
		else {
			console.log($scope.removeItemIndex);
			dataService
				.timesheets[$scope.activeWeekTimesheet]
				.days[$scope.activeTimesheet]
				.entries.splice($scope.removeItemIndex, 1);
		}
	}

	function getSummary() {
		var timesheets = dataService.timesheets[$scope.activeWeekTimesheet].days;
		var entryStatus;
		var newSummaryEntry = {
			id: 0,
			type: "",
			days: []
		};

		$scope.summary = [];
		var daysNumber = timesheets.length;

		// loops through all days in the active week timesheet
		for (var i = 0; i < daysNumber; i++) {

			// loops through al entries in a given day
			for (var j = 0; j < timesheets[i].entries.length; j++) {

				// loops through summary array to check if entry already added in previous iterations
				for (var k = 0; k < $scope.summary.length; k++) {

					entryStatus = 'newEntry';

					if (timesheets[i].entries[j].id == $scope.summary[k].id && timesheets[i].entries[j].type == $scope.summary[k].type) {

						existingEntryIndex = k;

						if ($scope.summary[k].days[i] != undefined) {
							entryStatus = 'existingEntry';
						}

						else {
							entryStatus = 'existingEntryNewDay'

						}
						break
					}

				}

				duration = dataService.calculateEntryDuration(i,j,$scope.activeWeekTimesheet);

				if (entryStatus == 'existingEntry') {
					$scope.summary[existingEntryIndex].days[i] += duration
				}
				else if (entryStatus == 'existingEntryNewDay') {

					$scope.summary[existingEntryIndex].days[i] = duration;

				}
				else {
					newSummaryEntry.id = timesheets[i].entries[j].id;
					newSummaryEntry.type = timesheets[i].entries[j].type;
					newSummaryEntry.days[i] = duration;
					$scope.summary.push(newSummaryEntry);
					newSummaryEntry = {id: 0, type: "", days: []}
				}



			}

		}

	} // getSummary END

	function getRowTotal(row) {

		var rowTotal = 0;

		for (var i = 0; i < $scope.summary[row].days.length; i++) {

			if ($scope.summary[row].days[i] != null) {
				rowTotal += $scope.summary[row].days[i]
			}

		}

		return rowTotal
	}

	function getDayTotal(day) {

		var dayTotal = 0;

		if (day != 7) {
			for (var i = 0; i < $scope.summary.length; i++) {

				if ($scope.summary[i].days[day] != null) {
					dayTotal += $scope.summary[i].days[day]
				}

			}
		}
		else {
			for (var j = 0; j < $scope.summary.length; j++) {
				dayTotal += $scope.getRowTotal(j)
			}
		}

		return dayTotal
	}

	function broadcastEvent(event, mode) {

		$scope.$broadcast(event, mode);
	}

}
