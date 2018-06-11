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
    let gradeData = await QisGrades.find({token: token}).populate('semester').populate('course').sort('id ASC').catch((e) => {
      sails.log.error(e);
      return exits.errorOccured();
    });
    let unsorted = [];
    var sorted = [];
    if (gradeData) {

      for (let i in gradeData) {
	unsorted.push(gradeData[i]);
      }
      for (let i = 0; i <= unsorted.length - 1; i++) {
	if (i === 0) {
	  sorted.push(unsorted[i]);
	} else {
	  let comapreValue = compare(sorted[i - 1].semester.semester, unsorted[i].semester.semester);
	  if (comapreValue === 0) {
	    sorted.push(unsorted[i]);
	  } else if (comapreValue === -1) {
	    sorted.push(unsorted[i]);
	  } else {
	    sorted.push(unsorted[i]);
	    for (let j = sorted.length - 1; j >= 0; j--) {
	      let sortedCompareValue = compare(sorted[j].semester.semester, sorted[j - 1].semester.semester);
	      if (sortedCompareValue === -1) {
		let temp = sorted[j - 1];
		sorted[j - 1] = sorted[j];
		sorted[j] = temp;
	      }
	      else {
		break;
	      }
	    }
	  }
	}
      }
      for (let i in sorted) {
	if (typeof output[sorted[i].semester.semester] === 'undefined') {
	  output[sorted[i].semester.semester] = [];
	}

	output[sorted[i].semester.semester].push({
	  course: sorted[i].course.course,
	  name: sorted[i].name,
	  grade: sorted[i].grade.toString().replace('.', ','),
	  ects: sorted[i].ects.toString().replace('.', ','),
	  passed: sorted[i].passed,
	  bachelor: sorted[i].bachelor,
	  master: sorted[i].master
	});

      }
      return exits.success(output);
    } else {
      return exits.noData({gradesReport: []});
    }

  }
};

function compare(a, b) {
  let firstYear = a.split(' ');
  let secondYear = b.split(' ');

  if (firstYear[1] < secondYear[1]) {
    return -1;
  } else if (firstYear[1] > secondYear[1]) {
    return 1;
  } else {
    return 0;
  }


}
