viguProjectManager.factory("dataService", dataService);

		function dataService() {
			var dataObj = {
				projects: projects,
				timesheets: timesheets,
				calculateEntryDuration: calculateEntryDuration,
				displayProjectName: displayProjectName,
				stringToDate: stringToDate,
				dateToString: dateToString,
				today: today
			};
			return dataObj;
		}

		function calculateEntryDuration(dayIndex,entryIndex,weekIndex) {
				var startDate = timesheets[weekIndex].days[dayIndex].start;
				var date1 = timesheets[weekIndex].days[dayIndex].entries[entryIndex].endtime;
				var date2 = 0;
				var entryDuration = 0;
				var rem;

				if (entryIndex === 0) {
					entryDuration = date1 - startDate;
				}
				else {
					date2 = timesheets[weekIndex].days[dayIndex].entries[entryIndex-1].endtime;
					entryDuration = date1 - date2;
				}

				rem = entryDuration % 600000;
				if (rem <= 300000) {
					entryDuration -= rem
				}
				else {
					entryDuration += (600000 - rem)
				}

				return entryDuration

			}

		function displayProjectName(projectId) {
			var projectName = "";

			for (var i = 0; i < projects.length; i++) {

				if (projects[i].id == projectId) {

					return projects[i].name

				}

			}
		}

		function stringToDate(time,activeWeek,activeTimesheet) {
			var activeWeekMiliseconds = activeWeek
			var date = new Date(activeWeekMiliseconds);
			var day = date.getDate() + activeTimesheet;
			var year = date.getFullYear();
			var month = date.getMonth();
			var hh;
			var mm;
			var dateNumber;

			if (time.length == 5) {
				hh = time.substr(0,2);
				mm = time.substr(3,2)
			}
			else {
				hh = time.substr(0,1);
				mm = time.substr(2,2)
			}

			mm = (Math.round(mm/10))*10;
			date = new Date(year,month,day,hh,mm);
			dateNumber = Date.parse(date);
			return dateNumber
		}


		function dateToString(date) {
			var date = new Date(date);
			var hh = date.getHours();
			var mm = date.getMinutes();
			var time = "";

			if (hh < 10) {
				hh = "0" + hh;
			}
			if (mm < 10) {
				mm = "0" + mm;
			}
			time = hh + ":" + mm;
			return time
		}

		var today = new Date();

		var projects = [
				{
					id: 78474572,
					name: 'Monster Inc. New Mobile App Build',
					manager: 'Tony Brown',
					requirements: 2,
					design: 3,
					dev: 4,
					qa: 3,
					uat: 2,
					depl: 2
				},
				{
					id: 93583912,
					name: 'GreyHouse Inc. Database Update',
					manager: 'John Doe',
					requirements: 1,
					design: 2,
					dev: 1,
					qa: 1,
					uat: 1,
					depl: 1
				},
				{
					id: 82678245,
					name: 'Greenbay Inc New Website Build',
					manager: 'Monica White',
					requirements: 4,
					design: 4,
					dev: 7,
					qa: 3,
					uat: 2,
					depl: 1
				},
			];

			var timesheets = [
				{
					weekOf: 1500156000000,
					days: [
						{
							start: 1500188400000,
							entries: [
								{
									id: 78474572,
									type: "requirements",
									endtime: 1500192000000
								},
								{
									id: 93583912,
									type: "design",
									endtime: 1500194400000
								},
							]
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
					]
				},
				{
					weekOf: 1500760800000,
					days: [
						{
							start: 1500793200000,
							entries: [
								{
									id: 78474572,
									type: "requirements",
									endtime: 1500796800000
								},
								{
									id: 93583912,
									type: "design",
									endtime: 1500799200000
								},
							]
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
					]
				}
			];
