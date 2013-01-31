//
//ISO Date formatting/parsing implementation
//
// Examples:
// isoDate.parse("1753-01-01T00:00:00Z");
// isoDate.toLocalString(new Date());
// isoDate.toUTCString(new Date());

var isoDate = {
	_expression: new RegExp("^" +
			"(\\d{4}|[\+\-]\\d{6})" + // four-digit year capture or sign + 6-digit extended year
			"(?:-(\\d{2})" + // optional month capture
			"(?:-(\\d{2})" + // optional day capture
			"(?:" + // capture hours:minutes:seconds.milliseconds
				"T(\\d{2})" + // hours capture
				":(\\d{2})" + // minutes capture
				"(?:" + // optional :seconds.milliseconds
					":(\\d{2})" + // seconds capture
					"(?:\\.(\\d{3}))?" + // milliseconds capture
				")?" +
			"(?:" + // capture UTC offset component
				"Z|" + // UTC capture
				"(?:" + // offset specifier +/-hours:minutes
					"([-+])" + // sign capture
					"(\\d{2})" + // hours offset capture
					":?(\\d{2})" + // minutes offset capture
				")" +
			")?)?)?)?" +
		"$"),
	match: function(string) {
		return this._expression.exec(string) != null;
	},
	parse: function(string) {
		var match = this._expression.exec(string);
		if (match) {
			match.shift(); // kill match[0], the full match
			// parse months, days, hours, minutes, seconds, and milliseconds
			for (var i = 1; i < 7; i++) {
				// provide default values if necessary
				match[i] = +(match[i] || (i < 3 ? 1 : 0));
				// match[1] is the month. Months are 0-11 in JavaScript
				// `Date` objects, but 1-12 in ISO notation, so we
				// decrement.
				if (i == 1) {
					match[i]--;
				}
			}

			// parse the UTC offset component
			var minuteOffset = +match.pop(), hourOffset = +match.pop(), sign = match.pop();

			// compute the explicit time zone offset if specified
			var isUtc = string.indexOf("Z") > 0;
			var isTzSpecified = sign || isUtc;
			var offset = 0;
			if (sign) {
				// detect invalid offsets and return early
				if (hourOffset > 23 || minuteOffset > 59) {
					return NaN;
				}

				// express the provided time zone offset in minutes. The offset is
				// negative for time zones west of UTC; positive otherwise.
				offset = (hourOffset * 60 + minuteOffset) * 6e4 * (sign == "+" ? -1 : 1);
			}

			if (isTzSpecified) {
				var utc = new Date(1970, 1, 1);
				utc.setUTCFullYear(match[0]);
				utc.setUTCMonth(match[1]);
				utc.setUTCDate(match[2]);
				utc.setUTCHours(match[3]);
				utc.setUTCMinutes(match[4]);
				utc.setUTCSeconds(match[5]);
				utc.setUTCMilliseconds(0);
				return new Date(utc.getTime() + offset);
			} else {
				var date = new Date(new Date(1970, 1, 1));
				date.setFullYear(match[0]);
				date.setMonth(match[1]);
				date.setDate(match[2]);
				date.setHours(match[3]);
				date.setMinutes(match[4]);
				date.setSeconds(match[5]);
				date.setMilliseconds(0);
				return date;
			}
		}
		return NaN;
	},
	toLocalString: function(date) {
		if (date == null || isNaN(date)) { return null; }
		var month = date.getMonth() + 1,
			day = date.getDate(),
			year = date.getFullYear(),
			hours = date.getHours(),
			minutes = date.getMinutes(),
			seconds = date.getSeconds();

		if (year < 1000) {
			year = ('0000' + year);
			year = year.substr(year.length - 4, 4);
		}
		if (month < 10) {
			month = '0' + month;
		}
		if (day < 10) {
			day = '0' + day;
		}
		if (hours < 10) {
			hours = '0' + hours;
		}
		if (minutes < 10) {
			minutes = '0' + minutes;
		}
		if (seconds < 10) {
			seconds = '0' + seconds;
		}
		return '' + year + '-' + month + '-' + day + 'T' +
			hours + ':' + minutes + ':' + seconds;
	},
	toUTCString: function(date) {
		if (date == null || isNaN(date)) { return null; }
		var month = date.getUTCMonth() + 1,
			day = date.getUTCDate(),
			year = date.getUTCFullYear(),
			hours = date.getUTCHours(),
			minutes = date.getUTCMinutes(),
			seconds = date.getUTCSeconds();

		if (year < 1000) {
			year = ('0000' + year);
			year = year.substr(year.length - 4, 4);
		}
		if (month < 10) {
			month = '0' + month;
		}
		if (day < 10) {
			day = '0' + day;
		}
		if (hours < 10) {
			hours = '0' + hours;
		}
		if (minutes < 10) {
			minutes = '0' + minutes;
		}
		if (seconds < 10) {
			seconds = '0' + seconds;
		}
		return '' + year + '-' + month + '-' + day + 'T' +
			hours + ':' + minutes + ':' + seconds + "Z";
	}
};
