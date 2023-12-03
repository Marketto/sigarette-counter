const moment = require('moment');

const CHANGE_DATE_HOUR = 4;

/**
 * @param {Date | moment.Moment} date
 * @param {number} changeDateHour
 * @returns {moment.Moment}
 */
const dayBegin = (date = moment(), changeDateHour = CHANGE_DATE_HOUR) => {
	const dt = moment(date);
	return dt.hours() >= changeDateHour
		? dt.set('hour', changeDateHour)
		: dt.set('hour', -24 + changeDateHour);
};

/**
 * @param {Date | moment.Moment} date
 * @param {number} changeDateHour
 * @returns {moment.Moment}
 */
const dayEnd = (date = moment(), changeDateHour = CHANGE_DATE_HOUR) => {
	const dt = moment(date);
	return dt.hours() >= changeDateHour
		? dt.set('hour', 24 + changeDateHour)
		: dt.set('hour', changeDateHour);
};

module.exports = {
	CHANGE_DATE_HOUR,
	dayBegin,
	dayEnd,
};
