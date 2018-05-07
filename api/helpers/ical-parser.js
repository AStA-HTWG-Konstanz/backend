const iCalDateParser = require('ical-date-parser');
const moment = require('moment');
require('moment-recur2');
const days = {
    MO: "Monday",
    TU: "Tuesday",
    WE: "Wednesday",
    TH: "Thursday",
    FR: "Friday",
    SA: "Saturday",
    SU: "Sunday"
};

module.exports = {


    friendlyName: 'Parse and format ics data',


    description: 'Formats ics data and returns it',


    inputs: {
        icsData: {
            type: 'string',
            required: true,
            description: 'ics data from LSF calendar files.'
        }
    },


    exits: {
        success: {
            outputFriendlyName: 'Parsed data',
            outputDescription: 'Parsed ics data.'
        },
        errorOccured: {
            outputFriendlyName: 'Failed to process data',
            outputDescription: 'Data processing failed.'
        }
    },


    fn: async function (inputs, exits) {
        const icsData = JSON.parse(inputs.icsData);
        let output = {events: []};
        if(typeof icsData["VCALENDAR"][0] === "undefined") {
            sails.log.info(icsData);
            return exits.errorOccured();
        }
        async.forEachOf(icsData["VCALENDAR"][0]["VEVENT"], function (event, key, cb) {
            try {
                let lsfID;
                let lsfCourseID;
                let room;
                let name;
                let prof;
                let category;
                let startTime;
                let endTime;
                let dates = [];
                /**
                 * Get LSF ID, CourseID, category and room
                 */
                lsfID = event["UID"].substr(-6);
                lsfCourseID = event["UID"].substr(1, 6);
                room = event["LOCATION"];
                category = event["CATEGORIES"];
                /**
                 * Get Name
                 */
                    //Remove id if present
                let tmpName;
                if (typeof event["SUMMARY"].split(" - ")[1] === "undefined") {
                    tmpName = event["SUMMARY"];
                } else {
                    tmpName = event["SUMMARY"].split(" - ")[1];
                }
                if (typeof  tmpName.split(" (")[1] !== "undefined") {
                    tmpName = tmpName.split(" (")[0]
                }
                name = tmpName;
                /**
                 * Get startTime
                 */
                let startDate = iCalDateParser(event["DTSTART;TZID=Europe/Berlin"] + "Z");
                startTime = startDate.toLocaleTimeString();
                /**
                 * Get endTime
                 */
                let endDate = iCalDateParser(event["DTEND;TZID=Europe/Berlin"] + "Z");
                endTime = endDate.toLocaleTimeString();
                /**
                 * Get dates
                 */
                if (typeof event["RRULE"] === "undefined") {
                    dates.push(startDate.toLocaleDateString());
                } else {
                    let rruleParams = event["RRULE"].split(";");
                    let untilDate = iCalDateParser(rruleParams[1].split("=")[1]);
                    let freq = rruleParams[0].split("=")[1];
                    let day = rruleParams[3].split("=")[1];
                    let interval = rruleParams[2].split("=")[1];
                    let recurrence = moment().recur(startDate.toLocaleString(), untilDate.toLocaleString()).every(days[day]).daysOfWeek().every(interval).weeks();
                    dates = recurrence.all("YYYY-MM-DD");
                }
                /**
                 * Push into output and finish
                 */
                output.events.push({
                    lsfID: lsfID,
                    lsfCourseID: lsfCourseID,
                    name: name,
                    category: category,
                    room: room,
                    startTime: startTime,
                    endTime: endTime,
                    dates: dates
                });
                cb();
            } catch (e) {
                cb();
            }
        }, function (error) {
            if (error) {
                return exits.errorOccured(error);
            }
            return exits.success(output);
        });

    }
};
