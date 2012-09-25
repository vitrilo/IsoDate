IsoDate
=======

Javascript implementation of Dates parsing and formatting in ISO-8601 standard. Good time zone support.
Why this need:
* Some browsers do not support ISO formatting/parsing. Like: IE6,7,8,9
* Some browser/libraries treat missing of TZ info("1753-01-01T00:00:00") differently - as local date or like UTC.
* Some libraries can not format Date as ISO without TZ info.
* Cross-browser support. This library do not rely on non consistent Date.parse() or Date.toISOString() functions. Only low level used, like: Date.setDate(), Date.setUTCDate().
* Using JSON format with Date objects. This library provide fast match for ISO date text values.

Parsing
=======
UTC:
isoDate.parse("1753-01-01T00:00:00Z");

Local date(note: some browsers consider this as UTC):
isoDate.parse("1753-01-01T00:00:00");

Specified TZ:
isoDate.parse("1753-01-01T00:00:00+30:00");
isoDate.parse("1753-01-01T00:00:00+3000");

Formating
=======

UTC(same as w3c Date.toJSON()):
isoDate.toUTCString(new Date());

Local date (without TZ info):
isoDate.toLocalString(new Date());

Match
=======
if(isoDate.match("1753-01-01T00:00:00+30:00")){
	//provided text is ISO date
};

Using dates in JSON
=======
JSON specification do NOT cover date type!
There in no common practice to handle this.
Some use number: new Date().getTime().
Some use special format (ASP.NET, WCF): "\"\\/Date(" + this.getTime() + ")\\/\"";
Following examples use ISO format:

//Convert all Date values to String in all properties of object.
//Note: given example use IsoDate.toLocalString, alternative you can use IsoDate.toUTCString.
function preJSON = function(obj, copyObj) {
	var c = copyObj || {};
	for (var i in obj) {
		if (typeof obj[i] === 'function') {
			continue;
		}
		if (obj[i] != null && typeof obj[i] === 'object') {
			if (obj[i] instanceof Date) {
				c[i] = IsoDate.toLocalString(obj[i]);
			} else {
				c[i] = (obj[i].constructor === Array) ? [] : {};
				preJSON(obj[i], c[i]);
			}
		} else {
			c[i] = obj[i];
		}
	}
	return c;
};
//Convert all date-like String to Date in all properties of object.
function postJSON = function(obj, copyObj) {
	var c = copyObj || {};
	for (var i in obj) {
		if (obj[i] != null && typeof obj[i] === 'object') {
			c[i] = (obj[i].constructor === Array) ? [] : {};
			postJSON(obj[i], c[i]);
		} else {
			if (obj[i] != null && typeof obj[i] === 'string' && IsoDate.match(obj[i])) {
				obj[i] = IsoDate.parse(obj[i]);
			}
			c[i] = obj[i];
		}
	}
	return c;
};

var json = JSON.stringify(preJSON({date: new Date()}));
var object = JSON.parse(postJSON(json));
alert(object.date);