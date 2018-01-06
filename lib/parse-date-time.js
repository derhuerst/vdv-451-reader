'use strict'

const {DateTime} = require('luxon')

// todo: what is the time zone of a VDV-451 file?
const TIMEZONE = 'Europe/Berlin'

const parseDateTime = (dateFormat, date, timeFormat, time) => {
	// map VDV-451 tokens to luxon tokens
	dateFormat = dateFormat.replace(/Y/g, 'y').replace(/D/g, 'd')
	timeFormat = timeFormat.replace(/M/g, 'm').replace(/S/g, 's')

	return DateTime.fromString([
		date, time, TIMEZONE
	].join(' '), [
		dateFormat, timeFormat, 'z'
	].join(' ')).toJSDate()
}

module.exports = parseDateTime
