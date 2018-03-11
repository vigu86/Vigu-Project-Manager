viguProjectManager.controller('modalStartTimeCtrl', ['$scope', 'dataService', modalStartTimeCtrl]);

function modalStartTimeCtrl($scope, dataService) {

    	// Injected factories
    	$scope.dataService = dataService;

        $scope.startTimeModalTitle = "";
        $scope.startTimeModalButton = "";

        $scope.timesheetStartTime = ""; // [string (day's start time)] bound to start time field

        $scope.startTimeModalErrorMsg = [];
        $scope.invalidFieldStartTime = false;

        $scope.startTimeModalMode;

        $scope.setStartTimeModalData = setStartTimeModalData;
        $scope.setCurrentTimeStartTime = setCurrentTimeStartTime; // [function - no return value] sets current time in field start time field
        $scope.submitStartTime = submitStartTime; // [function - no return value] submits start time to database
        $scope.clearStartTimeModalData = clearStartTimeModalData;

        var validateStartTimeInput = validateStartTimeInput; // [function - returns boolean] checks correct format of entered start time (new or updated)

        // Functions definitions

        function setStartTimeModalData(mode) {
            console.log('fired setStartTimeModalData! Mode: ' + mode );
            if (mode == 'edit') {
                console.log('setStartTimeModalData: ' + mode );
                $scope.startTimeModalTitle = "Edit Start Time";
                $scope.startTimeModalButton = "Update";
                $scope.startTimeModalMode = "edit";
                $scope.timesheetStartTime = dataService.dateToString(dataService.timesheets[$scope.activeWeekTimesheet].days[$scope.activeTimesheet].start);
            }
            else  {
                $scope.startTimeModalTitle = "Add Timesheet";
                $scope.startTimeModalButton = "Add";
                $scope.startTimeModalMode = "add";
                $scope.timesheetStartTime = "";
            }
        }

        function setCurrentTimeStartTime() {
            var now = dataService.dateToString(dataService.today);
            $scope.timesheetStartTime = now;
        }

        function submitStartTime(action) {
    		var updatedStartTimeMillisecs;
    		var newDayTimesheet = {};
    		var startTimeStatus = [];

            // Clear all error messages in case any are displayed
    		$scope.startTimeModalErrorMsg = [];

    		// Check if time provided in not later than end time if first entry
            // validateStartTimeInput returns array with status (index 0) and error message (index 1)
    		startTimeStatus = validateStartTimeInput($scope.timesheetStartTime);
            console.log('soooo');
        	// 0 means all is ok
    		if (startTimeStatus[0]) {
                    console.log('sooo2');
    			// if we're creating a new timesheet
    			if (action == "add") {

    				newDayTimesheet.start = dataService.stringToDate($scope.timesheetStartTime, dataService.timesheets[$scope.activeWeekTimesheet].weekOf, $scope.activeTimesheet);
    				newDayTimesheet.entries = [];
    				dataService.timesheets[$scope.activeWeekTimesheet].days[$scope.activeTimesheet] = newDayTimesheet;
    				$scope.newDay = false;
    				$scope.setDayView();
    			}
    			// if we're updating start time of existing timesheet
    			else {
    				updatedStartTimeMillisecs = dataService.stringToDate($scope.timesheetStartTime, dataService.timesheets[$scope.activeWeekTimesheet].weekOf, $scope.activeTimesheet);
    				dataService.timesheets[$scope.activeWeekTimesheet].days[$scope.activeTimesheet].start = updatedStartTimeMillisecs;
    			}

    			$('#modal-start-time').modal('hide');
                clearStartTimeModalData();

    		}
    		else {
                // set the error message in the HTML and set the invalid var to highlight the input field
    			$scope.startTimeModalErrorMsg.push(startTimeStatus[1]);
    			$scope.invalidFieldStartTime = true;
    		}

    	}

        function validateStartTimeInput(time) {
    		var startTimeParsed = stringToDate(time, dataService.timesheets[$scope.activeWeekTimesheet].weekOf, $scope.activeTimesheet);
    		var status = [true,'']; //contains response returned by function
    		var actTimesheet = dataService.timesheets[$scope.activeWeekTimesheet].days[$scope.activeTimesheet]; //shortcut for active day timesheet
    		var firstEntryEndTime; // end time of the next entry

    		if (actTimesheet.entries[0]) {
    			firstEntryEndTime = actTimesheet.entries[0].endtime

    			if (firstEntryEndTime - startTimeParsed < 0) {
    				status[0] = false;
    				status[1] = "Start time cannot be later then the end time of the first entry!"
    			}
    		}

    		return status
    	}

    	function clearStartTimeModalData() {
    		$scope.startTimeModalTitle = "";
    		$scope.startTimeModalButton = "";
    		$scope.startTimeModalMode = "";
    		$scope.timesheetStartTime = "";
    		$scope.invalidFieldStartTime = false;
    		$scope.startTimeModalErrorMsg = [];
    		$scope.startTimeForm.startTimeInput.$setPristine();
    		$scope.startTimeForm.startTimeInput.$setUntouched();
    	}

        // function listens to event triggered by 'add start time' and 'edit start time' button clicks
        // When event is triggered, setStartTimeModalData function sets proper modal data based on mode passed
        $scope.$on('start time', function(event, mode) {
            $scope.startTimeModalMode = mode;
            setStartTimeModalData($scope.startTimeModalMode);
        });

}
