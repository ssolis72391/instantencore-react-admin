var dayjs = require("dayjs");
var utc = require('dayjs/plugin/utc')
dayjs.extend(utc);

var s = new Date();
var d = dayjs(s);

console.log(d.toString())
console.log(d.toISOString())

console.log(d.local().toDate().toISOString());

console.log(d.local().subtract(d.utcOffset(),"minutes").toDate().toISOString());

console.log({valid: dayjs("2021-13-13","YYYY-MM-DD").isValid()})

console.log( dayjs().locale())

console.log(dayjs("2021-10-01T20:00:00Z").toDate())

var date = new Date(s.getFullYear(), s.getMonth(), s.getDate());
console.log({ date, starOfday: dayjs(date).startOf("day").toDate()  })