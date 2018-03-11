viguProjectManager.controller('modalEntryCtrl', ['$scope', 'dataService', modalEntryCtrl]);

function modalEntryCtrl($scope, dataService) {

    // Injected factories
    $scope.dataService = dataService;

	$scope.entryModalTitle = "";
	$scope.entryModalButton = "";
	$scope.entryModalMode = "";

    $scope.setEntryModalData = setEntryModalData; // [function - no return value] - sets Entry Modal fields
    $scope.clearEntryModalData = clearEntryModalData; // [function - no return value] - clears Entry Modal field and error messages

	$scope.entryModalErrorMsg = [];

	$scope.entryIndex = undefined;

	$scope.entryId = ""; // [string] bound to entry's project name field
	$scope.entryType = ""; // [string] bound to entry's type
	$scope.entryEndTime = ""; // [string] bound to entry's end time field

	$scope.submitEntry = submitEntry; // [function - no return value] submits entry data to database

    $scope.invalidFieldEntryEndTime = false; // contols classes added to entry end time input fields when invalid

    $scope.setCurrentTimeEntry = setCurrentTimeEntry; // [function] sets current time in hh:ss format in entry input

    var validateEntryEndTimeInput = validateEntryEndTimeInput; // [function - returns boolean] checks correct format of enterted entry end time (new or udpated)

    function setEntryModalData(mode, index) {
		if (mode == 'edit') {
			$scope.entryModalTitle = "Edit Entry";
			$scope.entryModalButton = "Update";
			$scope.entryModalMode = "edit";
			$scope.entryId = dataService.timesheets[$scope.activeWeekTimesheet].days[$scope.activeTimesheet].entries[index].id.toString();
			$scope.entryType = dataService.timesheets[$scope.activeWeekTimesheet].days[$scope.activeTimesheet].entries[index].type;
			$scope.entryEndTime = dataService.dateToString(dataService.timesheets[$scope.activeWeekTimesheet].days[$scope.activeTimesheet].entries[index].endtime);
			$scope.entryIndex = index;
		}
		else  {
			$scope.entryModalTitle = "Add Entry";
			$scope.entryModalButton = "Add";
			$scope.entryModalMode = "add";
		}
	}

    function setCurrentTimeEntry() {
        var now = dataService.dateToString(today);
        $scope.entryEndTime = now;
    }

	function submitEntry(action, index) {
		var newEntry = {};
		var entryEndTimeParsed;
		var endTimeStatus;

        // clear error messages and highlighting
		$scope.entryModalErrorMsg = [];
		$scope.invalidFieldEntryEndTime = false;

		// check if end time is later than the end time of previous entry or start time
        // function returns array with status (index 0) and error message (index 1)
		endTimeStatus = validateEntryEndTimeInput(action, index, $scope.entryEndTime);

		// status 0 is ok
		if (endTimeStatus[0]) {

			if (action == "add") {
                console.log($scope.entryEndTime);
                console.log($scope.entryEndTime,$scope.activeWeekTimesheet,$scope.activeTimesheet);
				entryEndTimeParsed = dataService.stringToDate($scope.entryEndTime,dataService.timesheets[$scope.activeWeekTimesheet].weekOf,$scope.activeTimesheet);
				newEntry.id = Number($scope.entryId);
				newEntry.type = $scope.entryType;
				newEntry.endtime = entryEndTimeParsed;
				dataService.timesheets[$scope.activeWeekTimesheet].days[$scope.activeTimesheet].entries.push(newEntry);
			}
			else {
				dataService.timesheets[$scope.activeWeekTimesheet].days[$scope.activeTimesheet].entries[index].id = Number($scope.entryId);
				dataService.timesheets[$scope.activeWeekTimesheet].days[$scope.activeTimesheet].entries[index].type = $scope.entryType;
				dataService.timesheets[$scope.activeWeekTimesheet].days[$scope.activeTimesheet].entries[index].endtime = stringToDate($scope.entryEndTime,dataService.timesheets[$scope.activeWeekTimesheet].weekOf,$scope.activeTimesheet);
			}

			$('#modal-entry').modal('hide');
			clearEntryModalData();

		}
		else {
			$scope.entryModalErrorMsg.push(endTimeStatus[1]);
			$scope.invalidFieldEntryEndTime = true
		}

	}

    function validateEntryEndTimeInput(action, index, entryEndTime) {
		var status = [true,'']; // contains response returned by function
		var actTimesheet = dataService.timesheets[$scope.activeWeekTimesheet].days[$scope.activeTimesheet]; //shortcut for active day timesheet
		var previousEntryIndex; //number of enties in active day timesheet
		var previousEntryEndTime; //end time of the previous entry or start time
		var newEntryEndTimeParsed; //end time parsed to milliseconds format
		var nextEntryIndex // index of the next entry
		var nextEntryEndTime; // end time of the next entry

		// set entry end time to milliseconds format
		newEntryEndTimeParsed = dataService.stringToDate(entryEndTime, dataService.timesheets[$scope.activeWeekTimesheet].weekOf, $scope.activeTimesheet);

		// find previous entry index
		if (action == 'add') {
			previousEntryIndex = actTimesheet.entries.length-1;
		}
		else {
			previousEntryIndex = index -1;
			nextEntryIndex = index +1
		}

		// set end time of previous entry
		if (previousEntryIndex < 0) {
			previousEntryEndTime = actTimesheet.start;
		}
		else {
			previousEntryEndTime = actTimesheet.entries[previousEntryIndex].endtime;
		}

        console.log(newEntryEndTimeParsed+','+previousEntryEndTime);

		// check if new entry is not earlier then previous entry
		if (newEntryEndTimeParsed - previousEntryEndTime < 0) {
			status[0] = false;
			status[1] = "Time entry cannot be earlier than the previous time entry!";
		}

		// if edited entry is not last
		if (nextEntryIndex < actTimesheet.entries.length) {
			nextEntryEndTime = actTimesheet.entries[nextEntryIndex].endtime;
			if (nextEntryEndTime - newEntryEndTimeParsed < 0) {
				status[0] = false;
				status[1] = "Time entry cannot be later than the next time entry!";
			}

		}

		return status
	}

	function clearEntryModalData() {
		$scope.entryModalTitle = "";
		$scope.entryModalButton = "";
		$scope.entryModalMode = "";
		$scope.entryId = "";
		$scope.entryType = "";
		$scope.entryEndTime = "";
		$scope.invalidFieldEntryName = false;
		$scope.invalidFieldEntryType = false;
		$scope.invalidFieldEntryEndTime = false;
		$scope.entryModalErrorMsg = [];
		$scope.entryForm.entryNameInput.$setPristine();
		$scope.entryForm.entryNameInput.$setUntouched();
		$scope.entryForm.entryTypeInput.$setPristine();
		$scope.entryForm.entryTypeInput.$setUntouched();
		$scope.entryForm.entryEndTimeInput.$setPristine();
		$scope.entryForm.entryEndTimeInput.$setUntouched();
	}

    // function listens to event triggered by 'add entry' and 'edit entry' button clicks
    // When event is triggered, setEntryModalData function sets proper modal data based on mode passed
    $scope.$on('entry', function(event, data) {
        $scope.entryModalMode = data.mode;
        $scope.entryIndex = data.index;
        setEntryModalData(data.mode, data.index);
    });

}
