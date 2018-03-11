(function() {

	angular
		.module("ViguProjectManager")
		.filter("dateToString", dateToString);

		function dateToString() {
			return function(dateMilliseconds) {

				var hh = Math.floor(dateMilliseconds / 3600000);
				var mm = (dateMilliseconds % 3600000) / 60000;
				var time = "";

				if (dateMilliseconds) {
					
					if (hh < 10) {
						hh = "0" + hh;
					}
					
					if (mm < 10) {
						mm = "0" + mm;
					}
					
					time = hh + ":" + mm;
					
					return time 		
				}
				else {
					time = "00:00";
					return time
				}
			}
		}

})();