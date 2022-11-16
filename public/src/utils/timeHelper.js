const timeFromNow = (time) => {
	// Get timestamps
	var unixTime = new Date(time).getTime();
	if (!unixTime) return;
	var now = new Date().getTime();

    // Calculate difference
	var difference = (unixTime / 1000) - (now / 1000);

    // Setup return object
	var tfn = {};

	// Check if time is in the past, present, or future
	tfn.when = 'now';
	if (difference > 0) {
		tfn.when = 'future';
	} else if (difference < -1) {
		tfn.when = 'past';
	}

    // Convert difference to absolute
	difference = Math.abs(difference);

	// Calculate time unit
	if (difference / (60 * 60 * 24 * 365) > 1) {
		// Years
		tfn.unitOfTime = 'años';
		tfn.time = Math.floor(difference / (60 * 60 * 24 * 365));
	} else if (difference / (60 * 60 * 24 * 45) > 1) {
		// Months
		tfn.unitOfTime = 'meses';
		tfn.time = Math.floor(difference / (60 * 60 * 24 * 45));
	} else if (difference / (60 * 60 * 24) > 1) {
		// Days
		tfn.unitOfTime = 'días';
		tfn.time = Math.floor(difference / (60 * 60 * 24));
	} else if (difference / (60 * 60) > 1) {
		// Hours
		tfn.unitOfTime = 'horas';
		tfn.time = Math.floor(difference / (60 * 60));
	} else {
		// Seconds
		tfn.unitOfTime = 'segundos';
		tfn.time = Math.floor(difference);
	}

    // Return time from now data
	return tfn;
};

const formatMediumDate = (time) => {
	const timelineDate = new Date(time);
	return timelineDate.toLocaleDateString("es-CO", {
	  year: "numeric",
	  month: "short",
	  day: "numeric",
	});
}

export  { timeFromNow, formatMediumDate };

