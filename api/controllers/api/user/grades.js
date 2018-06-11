module.exports = {

  friendlyName: 'User grades',

  description: 'Grades for user.',

  inputs: {
    token: {
      type: 'string',
      required: true,
      example: 'cjdsuofh789ewzr823clds',
      description: 'Anonymous token to fetch grades from database.'
    }
  },

  exits: {
    success: {
      statusCode: 200
    },
    errorOccured: {
      statusCode: 500,
    },
    noData: {
      statusCode: 204
    }
  },

  fn: async function (inputs, exits) {
    let token = inputs.token;
    let output = {gradesReport: {}};
    let gradeData = await QisGrades.find({token: token}).populate("semester").populate("course").sort("id ASC").catch((e) => {
      sails.log.error(e);
      return exits.errorOccured();
    });
    if (gradeData) {
        let counter = getSemesterCounter(gradeData);
      for (let i = 0; i === counter; i++) {
	if (typeof output.gradesReport[gradeData[i].semester.semester] === "undefined") {
	  output.gradesReport[gradeData[i].semester.semester] = [];
	};
	output.gradesReport[gradeData[i].semester.semester].push({
	  course: gradeData[i].course.course,
	  name: gradeData[i].name,
	  grade: gradeData[i].grade.toString().replace(".", ","),
	  ects: gradeData[i].ects.toString().replace(".", ","),
	  passed: gradeData[i].passed,
	  bachelor: gradeData[i].bachelor,
	  master: gradeData[i].master
	});
      }
      return exits.success(output);
    } else {
      return exits.noData({gradesReport: []});
    }

  }
};

function getSemesterCounter(a) {
  let semester = [];
  for (let i in a) {
    let counter = 0;
    let id = a[i].semester.id;

    if (semester.length === 0) {
      semester.push(id);
      counter++;
    } else {
      for (let j = 0; j < semester.length; j++) {
	if (id === semester[j]) {
	  counter++;
	  break;
	}
      }
    }

    if (counter === 0) {
      semester.push(id);
    }
  }
  console.log(semester.length);
}
