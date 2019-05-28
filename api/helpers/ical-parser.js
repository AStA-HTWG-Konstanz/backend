const iCalDateParser = require('ical-date-parser');
const moment = require('moment');
require('moment-recur2');
require('moment-timezone');
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


    fn: async function (input, exits) {
        let output = { events: [] };
        let icsData = input.icsData;
        sails.log(icsData);
        var events = icsData.split("END:VEVENT\\\\r\\\\n");
        if (events.length == 1) {
            sails.log('Hallo');
            //sails.log.info(icsData);
            return exits.errorOccured();
        }
        events.forEach(function (event) {
            if (event.search("BEGIN:VCALENDAR") != -1) {
                event = event.split("BEGIN:VEVENT")[1];
            }
            try {
                let lsfID;
                let lsfCourseID;
                let room;
                let summary;
                let name;
                let dateFormatStart;
                let dateFormatEnd;
                let rRule;
                let prof;
                let category;
                let startTime;
                let endTime;
                let dates = [];
                /**
                 * Get LSF ID, CourseID, category and room
                 */
                lsfID = event.substring(event.search("UID:") + 4, event.search("DESCRIPTION:"));
                lsfID = lsfID.replace("\\\\r\\\\n", "");
                lsfCourseID = lsfID.substr(1, 6);
                lsfID = lsfID.substr(-6);
                if (lsfCourseID.length == 6) {
                    room = event.substring(event.search("[^-]LOCATION:") + 10, event.search("DTSTAMP:"));
                    room = room.replace("\\\\r\\\\n", "");
                    category = event.slice(event.search("CATEGORIES:") + 11, -1);
                    category = category.replace("\\\\r\\\\\\\\r\\\\n", "");
                    /**
                     * Get Name
                     */
                    //Remove id if present
                    summary = event.substring(event.search("SUMMARY:") + 8, event.search("COMMENT:"));
                    summary = summary.replace("\\\\r\\\\n", "");
                    let tmpName;
                    if (typeof summary.split(" - ")[1] === "undefined") {
                        tmpName = summary;
                    } else {
                        tmpName = summary.split(" - ")[1];
                    }
                    if (typeof tmpName.split(" (")[1] !== "undefined") {
                        tmpName = tmpName.split(" (")[0]
                    }
                    name = tmpName;
                    /**
                     * Get startTime
                     */
                    dateFormatStart = event.substring(event.search("DTSTART;TZID=Europe/Berlin:") + 27, event.search("DTEND;TZID=Europe/Berlin:"));
                    dateFormatStart = dateFormatStart.replace("\\\\r\\\\n", "");
                    let startDate = moment.tz(dateFormatStart, 'YYYYMMDDTHHmmSS', 'Europe/Berlin').toDate();
                    startTime = moment.tz(dateFormatStart, 'YYYYMMDDTHHmmSS', 'Europe/Berlin').format('HH:mm');
                    /**
                     * Get endTime
                     */
                    dateFormatEnd = event.substring(event.search("DTEND;TZID=Europe/Berlin:") + 25, event.search("RRULE:"));
                    dateFormatEnd = dateFormatEnd.replace("\\\\r\\\\n", "");
                    endTime = moment.tz(dateFormatEnd, 'YYYYMMDDTHHmmSS', 'Europe/Berlin').format('HH:mm');
                    /**
                     * Get dates
                     */
                    if (event.search("RRULE:") == -1) {
                        dates.push(startDate.toLocaleDateString());
                    } else {
                        rRule = event.substring(event.search("RRULE:") + 6, event.search("EXDATE:"));
                        rRule = rRule.replace("\\\\r\\\\n", "");
                        let rruleParams = rRule.split(";");

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

                }
            } catch (e) { }
        });
        return exits.success(output);
    }
};
