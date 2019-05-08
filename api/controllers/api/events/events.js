let request = require('request');

module.exports = {

  friendlyName: 'Events',

  description: 'Load events to the app.',

  inputs: {},

  exits: {
    success: {
      statusCode: 200
    },
    invalidRequest: {
      statusCode: 400
    },
    errorOccured: {
      statusCode: 500,
      responseType: ''
    }
  },

  fn: async function (inputs, exits) {
    request.get({
      url: sails.config.custom.events.urlopen,
      headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0'}
    }, function (err, httpResponse, body) {
      if (err) {
        sails.log.error(err);
        return exits.errorOccured();
      }

      try {
        const response = body;
        let output = {events: []};

        // Zeichenlängen für:
        // "Prüfungsanmeldezeitraum Sommersemester 20XX"
        // "Prüfungszeitraum Sommersemester 20XX"
        // "Zweiter Prüfungszeitraum Sommersemester 20XX"
        // "Vorlesungsbeginn"
        // "Vorlesungsende"
        const summerSemesterLengths = [43, 36, 44, 16, 14];

        // Zeichenlängen für:
        // "Prüfungsanmeldezeitraum Wintersemester 20XX/XX"
        // "Prüfungszeitraum Wintersemester 20XX/XX"
        // "Zweiter Prüfungszeitraum Wintersemester 20XX/XX"
        // "Vorlesungsbeginn"
        // "Vorlesungsende"
        const winterSemesterLengths = [46, 39, 47, 16, 14];

        // Suchbegriffe im HTML-Code
        const values = ["Prüfungsanmeldezeitraum", "Prüfungszeitraum", "Zweiter Prüfungszeitraum", "Vorlesungsbeginn", "Vorlesungsende"];

        // Jahr des Sommersemesters zwischenspeichern
        let summerSemesterYear;

        // Jahre des Wintersemesters in der richtigen Reihenfolge zwischenspeichern (siehe unten für mehr Details)
        let winterSemesterYears = [];

        // Positionsindex von "Prüfungsanmeldezeitraum" im HTML-Code
        const indexOfFirstValue = response.indexOf(values[0]);

        if (response.substring(indexOfFirstValue, indexOfFirstValue + 38).endsWith("Sommersemester")) {
          let i = 0;
          for (i; i < values.length; i++) {
            let index = response.indexOf(values[i]); // Positionsindex des jeweiligen Suchbegriffs

            if (i === 0) {
              summerSemesterYear = response.substring(index + 39, index + 43); // z.B. "2019"
            }

            let text = response.substring(index, index + summerSemesterLengths[i]); // z.B. "Prüfungsanmeldezeitraum Sommersemester 2019"
            let yearIndex = response.indexOf(summerSemesterYear, index + summerSemesterLengths[i]); // Positionsindex vom aktuellen Jahr im Datum
            let date = response.substring(index + summerSemesterLengths[i], yearIndex + 4); // Zeitraum bzw. Datum
            date = removeHtmlTags(date);
            output.events.push({title: text, eventDate: date});
          }
          return exits.success(output);
        } else if (response.substring(indexOfFirstValue, indexOfFirstValue + 38).endsWith("Wintersemester")) {
          let i = 0;
          for (i; i < values.length; i++) {
            let index = response.indexOf(values[i]); // Positionsindex des jeweiligen Suchbegriffs

            if (i === 0) {
              let firstWinterSemesterYear = response.substring(index + 39, index + 43); // z.B. "2019"
              let secondWinterSemesterYear = firstWinterSemesterYear.substring(0, 2) + response.substring(index + 44, index + 46); // z.B. "2020"

              // Der Prüfungsanmeldezeitraum ist immer im ersten Wintersemesterjahr, z.B. 2019
              // Der Prüfungszeitraum ist immer im zweiten Wintersemesterjahr, z.B. 2020
              // Der zweite Prüfungszeitraum ist immer im zweiten Wintersemesterjahr, z.B. 2020
              // Der Vorlesungsbeginn ist immer im ersten Wintersemesterjahr, z.B. 2019
              // Das Vorlesungsende ist immer im zweiten Wintersemesterjahr, z.B. 2020
              winterSemesterYears.push(firstWinterSemesterYear, secondWinterSemesterYear, secondWinterSemesterYear, firstWinterSemesterYear, secondWinterSemesterYear);
            }

            let text = response.substring(index, index + winterSemesterLengths[i]); // z.B. "Prüfungsanmeldezeitraum Wintersemester 2019/20"
            let yearIndex = response.indexOf(winterSemesterYears[i], index + winterSemesterLengths[i]); // Positionsindex vom jeweiligen Jahr im Datum
            let date = response.substring(index + winterSemesterLengths[i], yearIndex + 4); // Zeitraum bzw. Datum
            date = removeHtmlTags(date);
            output.events.push({title: text, eventDate: date});
          }
          return exits.success(output);
        } else {
          sails.log.error("Events not found");
          return exits.failure();
        }
      } catch (error) {
        sails.log.error(error);
        return exits.failure();
      }
    });
  }
};

// HTML-Tags entfernen, nur den relevanten Text behalten
function removeHtmlTags(htmlCode) {
  return htmlCode.replace(/<[^>]*>/g, "").replace("&nbsp;", "").replace(": ", "");
}
