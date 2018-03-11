viguProjectManager.controller('projectsCtrl', ['$scope', 'dataService', projectsCtrl]);

function projectsCtrl($scope, dataService) {

	// Internal data
	var checkDataValidity = checkDataValidity; // Checks validity of all modal fields when adding/updating projects data
	var activeProject; // Contains index of the selected project when modal is open

	// Injected factories
	$scope.dataService = dataService;

	$scope.projectEntryData = [
		{
			name: 'Requirements',
			type: 'requirements'
		},
		{
			name: 'Design',
			type: 'design'
		},
		{
			name: 'Development',
			type: 'dev'
		},
		{
			name: 'QA',
			type: 'qa'
		},
		{
			name: 'UAT',
			type: 'uat'
		},
		{
			name: 'Deployment',
			type: 'depl'
		}
	]

	// Vars binded to modal fields for adding / updating projects data
	$scope.projectModalErrorMsg = [];

	$scope.projectsModalTitle = "";
	$scope.projectsModalButton = "";
	$scope.projectModalName = "";
	$scope.projectModalManager = "";
	$scope.projectModalReqs = 0;
	$scope.projectModalDes = 0;
	$scope.projectModalDev = 0;
	$scope.projectModalQa = 0;
	$scope.projectModalUat = 0;
	$scope.projectModalDepl = 0;

	// View functions
	$scope.getProjectHours = getProjectHours; // Returns time spent for a given task in given project
	$scope.getProjTotEstHrs = getProjTotEstHrs; // Returns sum of estimated hours for all tasks in given project
	$scope.getProjTotSpentHrs = getProjTotSpentHrs; // Returns sum of all time entries for given project
	$scope.broadcastEvent = broadcastEvent;

	// Functions definitions
	function getProjectHours(type,index) {
		var totalTime = 0; // return var - sum of all project durations for all entries for given task
		var duration = 0; // temporary container for duration of single entry

		for (var i = 0; i < $scope.dataService.timesheets.length; i++) {

			// loops through all days in a given week
			for (var j = 0; j < $scope.dataService.timesheets[i].days.length; j++) {

				if ($scope.dataService.timesheets[i].days[j] != null) {

					//loops through all day entries
					for (var k = 0; k < $scope.dataService.timesheets[i].days[j].entries.length; k++) {

							if ($scope.dataService.timesheets[i].days[j].entries[k].id == dataService.projects[index].id && dataService.timesheets[i].days[j].entries[k].type == type) {
								duration = $scope.dataService.calculateEntryDuration(j,k,i);

								totalTime += duration;

							}

					}

				}

			}

		}

		return totalTime
	}

	function getProjTotEstHrs(index) {
		var sum = 0;

		sum += $scope.dataService.projects[index].requirements;
		sum += $scope.dataService.projects[index].design;
		sum += $scope.dataService.projects[index].dev;
		sum += $scope.dataService.projects[index].qa;
		sum += $scope.dataService.projects[index].uat;
		sum += $scope.dataService.projects[index].depl;

		return sum
	}

	function getProjTotSpentHrs(index) {

		var totalTime = 0; // return var - sum of all project durations for all entries for given task
		var duration = 0; // temporary container for duration of single entry

		for (var i = 0; i < $scope.dataService.timesheets.length; i++) {

			// loops through all days in a given week
			for (var j = 0; j < $scope.dataService.timesheets[i].days.length; j++) {

				if ($scope.dataService.timesheets[i].days[j] != null) {

					//loops through all days entries
					for (var k = 0; k < $scope.dataService.timesheets[i].days[j].entries.length; k++) {

							if ($scope.dataService.timesheets[i].days[j].entries[k].id == dataService.projects[index].id) {
								duration = dataService.calculateEntryDuration(j,k,i);

								totalTime += duration;

							}

					}

				}

			}

		}

		return totalTime
	}

	function broadcastEvent(event, data) {
		console.log('broadcast: ' + event + ', index: ' + data.index);
        $scope.$broadcast(event, data);
    };

}
