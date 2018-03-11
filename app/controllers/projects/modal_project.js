viguProjectManager.controller('modalProjectCtrl', ['$scope', 'dataService', modalProjectCtrl]);

function modalProjectCtrl($scope, dataService) {

    // Imported factories
    $scope.dataService = dataService;

    $scope.updateProjectsModalData = updateProjectsModalData;
    $scope.submitProjectData = submitProjectData;
    $scope.checkDataValidity = checkDataValidity;
    $scope.resetProjectsModalData = resetProjectsModalData;

    $scope.projectIndex = undefined;
    $scope.projectModalMode = undefined;

    // Functions definitions
    function updateProjectsModalData(index) {
		// if index is undefined, it means that the 'Add Project' button was clicked. Otherwise, an existing project is updated and data must insterted in the modal fields
		if (index != undefined) {
			$scope.projectsModalTitle = "Update Project";
			$scope.projectsModalButton = "Update";
			$scope.activeProject = index;
			$scope.projectModalName = dataService.projects[index].name;
			$scope.projectModalManager = dataService.projects[index].manager;
			$scope.projectModalReqs = dataService.projects[index].requirements;
			$scope.projectModalDes = dataService.projects[index].design;
			$scope.projectModalDev = dataService.projects[index].dev;
			$scope.projectModalQa = dataService.projects[index].qa;
			$scope.projectModalUat = dataService.projects[index].uat;
			$scope.projectModalDepl = dataService.projects[index].depl;
		}
		else {
			$scope.projectsModalTitle = "Add Project";
			$scope.projectsModalButton = "Add";
		}
	}

    function submitProjectData() {
		var validityStatus = []; // will hold validity status returned by checkDataValidity() function
		var allValid; // boolean to indicates if all submitted data are valid
		var project = {}; //container for new project
		var node; // stores 'span' attribute added to 'form-group' div of given field if invalid data is submitted
		var tempErrorMsg; // temporary container for a single error message

		// clears error messages
        $scope.projectModalErrorMsg = [];
        $scope.invalidFieldProjectName = false;
        $scope.invalidFieldProjectManager = false;
        $scope.invalidFieldProjectHours = [false,false,false,false,false,false]

		$scope.projectModalName = $scope.projectModalName.trim();
		$scope.projectModalManager = $scope.projectModalManager.trim();
		$scope.projectModalReqs = ($scope.projectModalReqs.toString()).trim();
		$scope.projectModalDes = ($scope.projectModalDes.toString()).trim();
		$scope.projectModalDev = ($scope.projectModalDev.toString()).trim();
		$scope.projectModalQa = ($scope.projectModalQa.toString()).trim();
		$scope.projectModalUat = ($scope.projectModalUat.toString()).trim();
		$scope.projectModalDepl = ($scope.projectModalDepl.toString()).trim();

        validityStatus = checkDataValidity();

        allValid = true;

        for (var i = 0; i < validityStatus.length; i++) {
			if (!validityStatus[i]) {
				allValid = false;
				break
			}
		}

    	if (allValid) {
			// checks if new project is added or exiting project is updated
			if ($scope.activeProject == undefined) {
				project.id =  Math.ceil(Math.random()*10000);
				project.name = $scope.projectModalName;
				project.manager = $scope.projectModalManager;
				project.requirements = Number($scope.projectModalReqs);
				project.design = Number($scope.projectModalDes);
				project.dev = Number($scope.projectModalDev);
				project.qa = Number($scope.projectModalQa);
				project.uat = Number($scope.projectModalUat);
				project.depl = Number($scope.projectModalDepl);
				dataService.projects.push(project)
			}
			else {
				project.id = dataService.projects[$scope.activeProject].id;
				project.name = $scope.projectModalName;
				project.manager = $scope.projectModalManager;
				project.requirements = Number($scope.projectModalReqs);
				project.design = Number($scope.projectModalDes);
				project.dev = Number($scope.projectModalDev);
				project.qa = Number($scope.projectModalQa);
				project.uat = Number($scope.projectModalUat);
				project.depl = Number($scope.projectModalDepl);
				$scope.dataService.projects[$scope.activeProject] = project
			}

			// dismisses projects modal and clears the data inside
			$('#modal-project').modal('hide');
			resetProjectsModalData();

		}

		// if any field is invalid, loops through statuses of each and displays error message where applicable
		else {

			for (var j = 0; j < validityStatus.length; j++) {

				if (!validityStatus[j]) {
					// checks if the invalid fiels is name/manager (j < 2) or an hour field (j=>2)
					if (j < 2) {

						if (j == 0) {
							$scope.projectModalErrorMsg.push("Name field cannot be empty!");
							$scope.invalidFieldProjectName = true;
						}
						else {
							$scope.projectModalErrorMsg.push("Manager field cannot be empty!")
							$scope.invalidFieldProjectManager = true;
						}

	    			}
	    			else {
	    				tempErrorMsg = "Hours fields must be integers that are equal or greater to 0!";

	    				if ($scope.projectModalErrorMsg.indexOf(tempErrorMsg) == -1) {
	    					$scope.projectModalErrorMsg.push(tempErrorMsg)
	    				}

	    				$scope.invalidFieldProjectHours[j-2] = true;

	    			}

	   			}
    		}

		}

	}

    function checkDataValidity() {
		var projectData = [
			$scope.projectModalName,
			$scope.projectModalManager,
			$scope.projectModalReqs,
			$scope.projectModalDes,
			$scope.projectModalDev,
			$scope.projectModalQa,
			$scope.projectModalUat,
			$scope.projectModalDepl
		]; // stores data from all sumbitted fields


		var validityStatus = []; // return var - array of booleans indicating if given field is valid

		// loops through all submitted fields
		for (var i = 0; i < projectData.length; i++) {

			// if checking name and manager fields, field is valid if not empty
			if (i < 2) {

				if (projectData[i] != "") {
					validityStatus[i] = true
				}
				else {
					validityStatus[i] = false
				}

			}
			// if checking the task hours fields, field is valid if contains only integers not less than 0
			else {

				if (projectData[i] != "" && projectData[i].search(/\D/) == -1 && projectData[i] >= 0) {
					validityStatus[i] = true
				}
				else {
					validityStatus[i] = false
				}
			}

		}

		return validityStatus
	}

    function resetProjectsModalData() {
        $scope.projectModalForm.projectModalNameInput.$setPristine();
		$scope.projectModalForm.projectModalManagerInput.$setPristine();
		$scope.projectModalForm.projectModalReqsInput.$setPristine();
		$scope.projectModalForm.projectModalDesInput.$setPristine();
		$scope.projectModalForm.projectModalDevInput.$setPristine();
		$scope.projectModalForm.projectModalQaInput.$setPristine();
		$scope.projectModalForm.projectModalUatInput.$setPristine();
		$scope.projectModalForm.projectModalDeplInput.$setPristine();
		$scope.projectModalForm.projectModalNameInput.$setUntouched();
		$scope.projectModalForm.projectModalManagerInput.$setUntouched();
		$scope.projectModalForm.projectModalReqsInput.$setUntouched();
		$scope.projectModalForm.projectModalDesInput.$setUntouched();
		$scope.projectModalForm.projectModalDevInput.$setUntouched();
		$scope.projectModalForm.projectModalQaInput.$setUntouched();
		$scope.projectModalForm.projectModalUatInput.$setUntouched();
		$scope.projectModalForm.projectModalDeplInput.$setUntouched();
        $scope.activeProject = undefined;
        $scope.projectModalName = "";
        $scope.projectModalManager = "";
        $scope.projectModalReqs = "0";
        $scope.projectModalDes = "0";
        $scope.projectModalDev = "0";
        $scope.projectModalQa = "0";
        $scope.projectModalUat = "0";
        $scope.projectModalDepl = "0";
    }

    $scope.$on('open project modal', function(event, data) {
        console.log('received open project modal');
        $scope.projectIndex = data.index;
        $scope.projectModalMode = data.mode;
        $scope.updateProjectsModalData(data.index);
    });


}
