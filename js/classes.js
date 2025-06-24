class Mark {
	constructor(grade, date, subject, mark, info) {
		if (typeof grade == "object") {
			this.grade = grade.grade;
			this.date = grade.date;
			this.subject = grade.subject;
			this.mark = grade.mark;
			this.info = grade.info;
			this.part = grade.part;
		} else {
			this.grade = grade;
			this.date = date;
			this.subject = subject;
			this.mark = mark;
			this.info = info;
			this.part = {};
		}
		this.subjectObj = app.subjects[this.subject];
	}

	get full() {
		return this.subjectObj.full;
	}

	get value() {
		return this.mark;
	}

	get name() {
		return this.subjectObj.name;
	}

	get data() {
		return {
			grade: this.grade,
			date: this.date,
			subject: this.subject,
			mark: this.mark,
			info: this.info,
			part: this.part
		};
	}

	getPartProp(name) {
		if (this.part[name]) {
			return this.part[name].mark / this.mark;
		}
	}
}

class Exam {
	constructor(grade, date, marks, info) {
		this.grade = grade;
		this.date = date;
		this.marks = marks;
		this.info = info;
	}

	add(mark) {
		return this.marks.push(mark);
	}
}

function $(query) {
	if (query.charAt(0) === "#") {
		return document.querySelector(query);
	} else {
		return document.querySelectorAll(query);
	}
}

window.themes = {
	green: {
		name: "绿野仙踪",
		style: {
			bg0: "#aecbb4",
			bg1: "#428675",
			bg2: "#66a9c9",
			c: "#fff",
			shadow: "#ccc"
		}
	},
	red: {
		name: "枫林叶晚",
		style: {
			bg0: "#c39e5d",
			bg1: "#986524",
			bg2: "#ac8156",
			c: "#fff",
			shadow: "#ccc"
		}
	},
	black: {
		name: "暗夜幽冥",
		style: {
			bg0: "#333",
			bg1: "#444",
			bg2: "#888",
			c: "#fff",
			shadow: "#666"
		}
	},
	tea: {
		name: "茶韵清幽",
		style: {
			bg0: "#87723e",
			bg1: "#a28b68",
			bg2: "#867018",
			c: "#fff",
			shadow: "#ccc"
		}
	},
	pink: {
		name: "桃染樱红",
		style: {
			bg0: "#f8c3cd",
			bg1: "#f4a7b9",
			bg2: "#df8786",
			c: "#fedfe1",
			shadow: "#ccc"
		}
	},
	silver: {
		name: "银光珠白",
		style: {
			bg0: "#f9f1db",
			bg1: "#c1b2a3",
			bg2: "#b7ae8f",
			c: "#f9f4dc",
			shadow: "#888"
		}
	}
};

warn = "2px solid #F79";

window.icons = {
	datas: "◔",
	pusher: "☼",
	me: "⊹"
};

window.grades = [
	" 一 ",
	" 二 ",
	" 三 ",
	" 四 ",
	" 五 ",
	" 六 ",
	"初一",
	"初二",
	"初三",
	"高一",
	"高二",
	"高三",
	"大一",
	"大二",
	"大三",
	"大四",
	"研一",
	"研二",
	"研三",
	"博士"
];

window.GET_GRADE_NAME = function (grade) {
	if (grade < grades.length) {
		return grades[grade];
	} else {
		return null;
	}
};

window.gradeTempo = {
	mid: {
		ch: { name: "语文", marks: [], enable: true, full: "120" },
		ma: { name: "数学", marks: [], enable: true, full: "120" },
		en: { name: "英语", marks: [], enable: true, full: "120" },
		ph: { name: "物理", marks: [], enable: true, full: "100" },
		chm: { name: "化学", marks: [], enable: true, full: 100 },
		bi: { name: "生物", marks: [], enable: true, full: "60" },
		his: { name: "历史", marks: [], enable: true, full: "75" },
		geo: { name: "地理", marks: [], enable: true, full: "60" },
		pol: { name: "政治", marks: [], enable: true, full: "75" },
		pe: { name: "体育", marks: [], enable: true, full: "60" }
	}
};

const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];