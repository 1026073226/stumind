const app = new Vue({
	el: "#app",
	data: {
		today: "",
		check: {},
		result: [],
		current: {
			subject: "",
			type: "学科",
			exam: 0
		},
		types: ["学科", "考试"],
		option: {
			dataset: {
				source: false
			},
			title: {
				text: ""
			},
			tooltip: {
				triggerOn: "click",
				enterable: true,
				formatter(params) {
					return `
			      <span class="chart-date">${app.dateFormatter(new Date(params.data.date))}</span>
			      <br />
			      <div class="chart-color" style="background-color:${params.color}"></div>
			      <b class="chart-mark">${params.data.mark}</b>
			      <br />
			      <span class="chart-info">${params.data.info}</span>
			      <button class="tooltip-button" onclick="app.moreAboutMark(${params.dataIndex})">+</button>
			      <button class="tooltip-button">◔</button>
			    `;
				}
			},
			legend: {
				data: ["条形", "折线", "散点", "平均"],
				show: true,
				top: 20,
				left: "center",
				selected: {
					条形: true,
					折线: true,
					散点: false,
					平均: false
				}
			},
			xAxis: [
				{
					type: "category",
					axisLabel: {
						formatter(value) {
							const date = new Date(Number(value));
							return date.getMonth() + 1 + "-" + date.getDate();
						}
					}
				},
				{
					type: "value",
					min: 0,
					max: 1,
					show: false
				}
			],
			yAxis: {
				type: "value"
			},
			series: [
				{
					name: "条形",
					type: "bar",
					encode: {
						x: "date",
						y: "mark"
					},
					xAxisIndex: 0
				},
				{
					name: "折线",
					type: "line",
					encode: {
						x: "date",
						y: "mark"
					},
					xAxisIndex: 0
				},
				{
					name: "散点",
					type: "scatter",
					encode: {
						x: "date",
						y: "mark"
					},
					symbolSize(data) {
						return data.mark / 2;
					}
				},
				{
					name: "平均",
					type: "line",
					encode: {
						y: "mark"
					},
					markLine: {
						symbol: ["none", "none"],
						data: [
							{
								type: "average",
								name: "平均"
							}
						]
					},
					xAxisIndex: 1
				}
			]
		},
		examOption: {
			dataset: {
				source: false
			},
			title: {
				text: ""
			},
			tooltip: {
				formatter(params) {
					return `
			      <span class="chart-date">${app.dateFormatter(new Date(params.data.date))}</span>
			      <br />
			      <div class="chart-color" style="background-color:${params.color}"></div>
			      <b class="chart-mark">${params.data.mark}</b>
			      <br />
			      <span class="chart-info">${params.data.info}</span>
			    `;
				}
			},
			legend: {
				data: ["饼图", "条形", "散点", "平均"],
				show: true,
				top: 20,
				left: "center",
				selected: {
					饼图: true,
					条形: false,
					散点: false,
					平均: false
				}
			},
			xAxis: [
				{
					type: "category",
					axisLabel: {
						formatter(value) {
							return value;
						}
					}
				},
				{
					type: "value",
					min: 0,
					max: 1,
					show: false
				}
			],
			yAxis: {
				type: "value"
			},
			series: [
				{
					name: "饼图",
					type: "pie",
					encode: {
						itemName: "name",
						value: "value"
					}
				},
				{
					name: "条形",
					type: "bar",
					encode: {
						x: "name",
						y: "mark"
					},
					xAxisIndex: 0
				},
				{
					name: "散点",
					type: "scatter",
					encode: {
						x: "name",
						y: "mark"
					},
					symbolSize(data) {
						return data.mark;
					}
				},
				{
					name: "平均",
					type: "line",
					encode: {
						y: "mark"
					},
					markLine: {
						symbol: ["none", "none"],
						data: [
							{
								type: "average",
								name: "平均"
							}
						]
					},
					xAxisIndex: 1
				}
			]
		},
		pages: {
			datas: false,
			pusher: true,
			me: false
		},
		subjects: {
			ch: {
				name: "语文",
				marks: [],
				enable: true,
				full: 150
			},
			ma: {
				name: "数学",
				marks: [],
				enable: true,
				full: 150
			},
			en: {
				name: "英语",
				marks: [],
				enable: true,
				full: 150
			},
			ph: {
				name: "物理",
				marks: [],
				enable: true,
				full: 100
			},
			chm: {
				name: "化学",
				marks: [],
				enable: true,
				full: 100
			},
			bi: {
				name: "生物",
				marks: [],
				enable: true,
				full: 100
			},
			his: {
				name: "历史",
				marks: [],
				enable: true,
				full: 100
			},
			geo: {
				name: "地理",
				marks: [],
				enable: true,
				full: 100
			},
			pol: {
				name: "政治",
				marks: [],
				enable: true,
				full: 100
			},
			pe: {
				name: "体育",
				marks: [],
				enable: true,
				full: 60
			}
		},
		exams: [],
		user: {
			name: "default",
			grade: 0,
			checked: [],
			theme: "green",
			img: "appIcon.png"
		},
		time: {},
		itv: {},
		chart: false
	},
	created() {
		this.load();
		for (let key in this.subjects) {
			this.current.subject = key;
			break;
		}
		this.today = this.dateFormatter(new Date());
		window.addEventListener("beforeunload", this.save);
		this.itv.DATA_SAVER = setInterval(this.save, 1000);
		this.initCheck();
	},
	mounted() {
		this.initChart();
		window.addEventListener(
			"load",
			() => {
				this.initAnima();
				this.loadChart();
			},
			{
				once: true
			}
		);
	},
	computed: {
		marks() {
			let n = [];
			Object.values(this.subjects).map(value => {
				if (value.marks) {
					value.marks.map(mark => {
						if (mark.grade == this.user.grade) n.push(mark);
					});
				}
			});
			return n;
		}
	},
	methods: {
		doCheck() {
			this.user.checked.push(this.today);
			this.check[this.today] = true;
		},

		checkin() {
			this.start("check", this.doCheck, 17, () => {
				return this.user.checked.includes(this.today) && this.time.check > 3;
			});
		},

		setCssRoot(key, value) {
			return document.documentElement.style.setProperty("--" + key, value);
		},

		dateFormatter(date, time = false) {
			if (time) {
				const hours = date.getHours(); // 时 (0-23)
				const minutes = date.getMinutes(); // 分 (0-59)
				const seconds = date.getSeconds(); // 秒 (0-59)

				// 格式化为两位数（例如：01:05:09）
				const formattedTime = [hours.toString().padStart(2, "0"), minutes.toString().padStart(2, "0"), seconds.toString().padStart(2, "0")].join(":");
				return formattedTime;
			}
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, "0");
			const day = String(date.getDate()).padStart(2, "0");
			const formattedDate = `${year}-${month}-${day}`;
			return formattedDate;
		},

		initCheck() {
			const width = $("#check-board").clientWidth - 2;
			const height = 140;
			const size = height / 7;
			const row = Math.floor(width / size) - 1; // 计算可以显示的行数（周数）
			const diff = (width - row * size) / row / 2; // 计算间距
			const number = row * 7; // 总天数
			const today = new Date();
			const weekStart = this.getWeekStart(today); // 获取本周的第一天（周日）

			this.setCssRoot("check-box-margin", diff + "px");

			for (let i = 0; i < row; i++) {
				// 遍历每一行（每一周）
				for (let j = 0; j < 7; j++) {
					// 遍历每一天
					const date = new Date(weekStart);
					date.setDate(weekStart.getDate() - i * 7 - j); // 从本周的第一天开始，逐天递减
					let formatted = this.dateFormatter(date);
					if (date <= today) {
						this.check[formatted] = this.user.checked.includes(formatted);
					} else {
						this.check[formatted] = "future";
					}
				}
			}
		},

		getWeekStart(obj) {
			let date = new Date(obj);
			const dayOfWeek = 6 - date.getDay(); // 获取当前日期是周几（0 表示周日，1 表示周一，依此类推）
			const diff = date.getDate() + dayOfWeek; // 计算本周第一天（周日）的日期
			date.setDate(diff);
			return date;
		},

		initAnima() {
			$("button").forEach(e => {
				e.addEventListener("click", e => {
					e.target.classList.add("waving");
					setTimeout(() => {
						e.target.classList.remove("waving");
					}, 384);
				});
			});
		},

		setUser() {},

		save() {
			localStorage[this.user.name] = JSON.stringify(this.subjects);
			localStorage[this.user.name + "_USER"] = JSON.stringify(this.user);
			localStorage.current_USER = this.user.name;
			localStorage[this.user.name + "_EXAM"] = JSON.stringify(this.exams);
		},

		load() {
			if (localStorage.current_USER) this.user.name = localStorage.current_USER;
			if (localStorage[this.user.name + "_USER"]) {
				this.user = JSON.parse(localStorage[this.user.name + "_USER"]);
			}
			if (localStorage[this.user.name + "_EXAM"]) {
				this.exams = JSON.parse(localStorage[this.user.name + "_EXAM"]);
			}
			if (localStorage[this.user.name]) {
				this.subjects = JSON.parse(localStorage[this.user.name]);
			}
		},

		newSubject(key, name) {
			this.$set(this.subjects, key, this.subjectObj(name));
		},

		newMark(subject, mark, info) {
			if (subject && mark) {
				let currentSubject;
				if (this.subjects[subject]) {
					currentSubject = this.subjects[subject];
				}
				return currentSubject.marks.push(new Mark(this.user.grade, Date.now(), subject, mark, info));
			}
			return false;
		},

		createMark() {
			let subject;
			let res;
			let lastone;
			this.confirm(
				"创建成绩",
				`
        <span>科目</span>
        <div id="mark-subject"></div>
        <span>分数</span>
        <input id="mark-mark" type="number"  placeholder="100"/>
        <br />
        <span>信息</span>
        <input id="mark-info" placeholder="月考" />
        `,
				choice => {
					if (!choice) return;
					let mark = $("#mark-mark").value;
					let info = $("#mark-info").value || this.dateFormatter(new Date(), true);
					this.checkEmpty([$("#mark-mark")]);
					if (!subject) {
						$("#mark-subject").style.border = warn;
					} else {
						$("#mark-subject").style.border = "";
					}
					if (mark && subject) {
						if (mark > this.subjects[subject].full) {
							$("#mark-mark").style.border = warn;
							return false;
						}
						res = this.newMark(subject, mark, info);
					} else {
						return false;
					}
				}
			);
			let keys = Object.keys(this.subjects).filter(key => {
				return this.subjects[key].enable;
			});
			for (let i = 0; i < keys.length; i++) {
				let key = keys[i];
				const button = document.createElement("button");
				button.className = "mark-subject-button";
				button.innerText = this.subjects[key].name;
				if (i === keys.length - 1) {
					button.style.border = "none";
				}
				$("#mark-subject")
					.appendChild(button)
					.addEventListener("click", e => {
						subject = key;
						e.target.style.backgroundColor = "var(--bg0)";
						if (lastone) {
							lastone.style.backgroundColor = "";
						}
						if (lastone == e.target) {
							lastone = null;
						} else {
							lastone = e.target;
						}
					});
			}
			return res;
		},

		createSubject() {
			let res;
			this.confirm(
				"新学科",
				`
        <span>I D</span>
        <input placeholder="留空以自动生成" id="subject-id" />
        <br />
        <span>名称</span>
        <input id="subject-name" placeholder="数学" />
        `,
				choice => {
					if (!choice) return;
					let id = $("#subject-id").value;
					let name = $("#subject-name").value;
					if (!id) {
						id = Date.now();
					}
					if (name) {
						res = this.newSubject(id, name);
					} else {
						$("#subject-name").style.border = warn;
						return false;
					}
				}
			);
			return res;
		},

		subjectObj(name) {
			return {
				name: name,
				marks: [],
				enable: true,
				full: 100
			};
		},

		confirm(
			msg,
			innerHTML = "",
			f = function () {
				return true;
			},
			ym = "确认",
			nm = "取消"
		) {
			let t = $("#conf");
			t.innerHTML = `
      <p>${msg}</p>
      ${innerHTML}
      <button class="menuBtn" style="background-color: var(--bg2);width: calc(50% - 8px)">${ym}</button>
      <button class="menuBtn" style="background-color: var(--bg2);width: calc(50% - 8px)">${nm}</button>
      `;
			t.style.opacity = 0.9;
			t.style.pointerEvents = "all";
			let cancel = () => {
				f(false);
				t.style.opacity = 0;
				t.style.pointerEvents = "none";
			};
			let yeah = () => {
				if (f(true) !== false) {
					t.style.opacity = 0;
					t.style.pointerEvents = "none";
				}
			};
			t.querySelectorAll(".menuBtn")[0].addEventListener("click", yeah);
			t.querySelectorAll(".menuBtn")[1].addEventListener("click", cancel);
			return { cancel: cancel, confirm: yeah };
		},

		styleComputer(bool) {
			return "opacity:" + (bool ? "1" : "0") + ";pointer-events:" + (bool ? "auto" : "none");
		},

		configSubject(key, value = false) {
			if (!value) {
				value = this.subjects[key];
			}
			let com = this.confirm(
				"设置学科",
				`
		    <span>I D</span>
		    <input id="subject-id" value="${key}" />
		    <span>名称</span>
		    <input id="subject-keyname" value="${value.name}"
		    <span>总分</span>
		    <input type="number" id="subject-full-score" value="${value.full}" />
		    <button id="subject-delete" class="fully">删除</button>
		  `,
				choice => {
					if (!choice) return;
					let res = true;
					let nk = $("#subject-id").value;
					let kn = $("#subject-keyname").value;
					let fl = $("#subject-full-score").value;
					if (kn) {
						value.name = kn;
						$("#subject-keyname").style.border = "";
					} else if (!kn) {
						$("#subject-keyname").style.border = warn;
						res = false;
					}
					if (fl) {
						value.full = fl;
						$("#subject-full-score").style.border = "";
					} else if (!fl) {
						$("#subject-full-score").style.border = warn;
						res = false;
					}
					if (nk && nk != key && !Object.keys(this.subjects).includes(nk)) {
						this.subjects[nk] = this.subjects[key];
						this.$delete(this.subjects, key);
						$("#subject-id").style.border = "";
					} else if (nk != key) {
						$("#subject-id").style.border = warn;
						res = false;
					}
					return res;
				}
			);
			setTimeout(() => {
				$("#subject-delete").addEventListener("touchstart", () => {
					this.start(
						"subject",
						() => {
							this.$delete(this.subjects, key);
							com.cancel();
						},
						15,
						() => {
							$("#subject-delete").style.filter = "brightness(" + (this.time.subject / 10 + 1) + ")";
							return false;
						}
					);
				});
				$("#subject-delete").addEventListener("touchend", () => {
					this.stop("subject", () => {
						$("#subject-delete").style.filter = "";
					});
				});
			}, 384);
		},

		showCheck(key, value = false) {
			if (!value) {
				value = this.check[key];
			}
			const day = new Date(key).getDay();
			this.confirm(
				"查看详情",
				`
		    <span>时间</span>
		    <input value="${key} ${weekdays[day]}" disabled="true" />
		    <span>情况</span>
		    <input value="${value === "future" ? "未来" : value ? "已签到" : "未签到"}" disabled="true">
		  `
			);
		},

		changeTheme(key) {
			let theme = themes[key];
			if (theme) {
				for (let key in theme.style) {
					this.setCssRoot(key, theme.style[key]);
				}
			}
		},

		changePage(key) {
			for (let page in this.pages) {
				this.pages[page] = false;
			}
			this.pages[key] = true;
		},

		nextTheme(key) {
			let keys = Object.keys(themes);
			let i = keys.indexOf(key);
			if (i < keys.length - 1) {
				i++;
			} else {
				i = 0;
			}
			this.user.theme = keys[i];
		},

		start(
			n,
			d,
			t = 15,
			f = function () {
				return false;
			}
		) {
			this.$set(this.time, n, 0);
			this.$set(
				this.itv,
				n,
				setInterval(() => {
					if (f()) {
						return;
					}
					this.$set(this.time, n, this.time[n] + 1);
					if (this.time[n] > t) {
						d();
						this.stop(n);
					}
				}, 100)
			);
		},

		stop(
			n,
			f = function () {
				return;
			}
		) {
			f();
			clearInterval(this.itv[n]);
			this.$set(this.time, n, 0);
		},

		clearData() {
			this.confirm("清空数据", "数据清空后无法恢复，是否继续?<br /><br />", choice => {
				if (choice) {
					clearInterval(this.itv.DATA_SAVER);
					window.removeEventListener("beforeunload", this.save);
					localStorage[this.user.name] = "";
					localStorage[this.user.name + "_USER"] = "";
					localStorage[this.user.name + "_EXAM"] = "";
					this.user.name = "default";
					location = location;
				}
			});
		},
		changeGrade() {
			this.user.grade++;
			if (!GET_GRADE_NAME(this.user.grade)) {
				this.user.grade = 0;
			}
		},
		initChart() {
			this.chart = echarts.init($("#data-bar"));
		},
		loadChart() {
			this.dataPreRenderer();
			let option = this[this.current.type == "学科" ? "option" : "examOption"];
			option.dataset.source = this.result;
			this.chart.setOption(option);
			if (option?.legend?.selected) {
				delete option.legend.selected;
			}
		},
		dataPreRenderer() {
			switch (this.current.type) {
				case "学科":
					this.result = this.subjects[this.current.subject].marks.filter(mark => {
						return mark.grade == this.user.grade;
					});
					break;
				case "考试":
					this.result = this.exams[this.current.exam].marks;
					break;
			}
		},
		createExam() {
			this.confirm(
				"新建考试",
				`
		    <div id="exam-table"></div>
		    <span>名称</span>
		    <input id="exam-name" placeholder="月考" />
		  `,
				choice => {
					if (!choice) return;
					const name = $("#exam-name").value;
					const marks = table.getSelectedData();
					let res = true;
					if (name && marks.length > 0) {
						this.exams.push(new Exam(this.user.grade, Date.now(), marks, name));
					}
					if (!name) {
						$("#exam-name").style.border = warn;
						res = false;
					} else {
						$("#exam-name").style.border = "";
					}
					if (marks.length < 1) {
						$("#exam-table").style.border = warn;
						res = false;
					} else {
						$("#exam-table").style.border = "";
					}
					return res;
				}
			);
			const table = new Tabulator("#exam-table", {
				data: this.marks,
				columns: [
					{
						title: "选择",
						formatter: "rowSelection",
						headerSort: false,
						resizable: false,
						cellClick(e, cell) {
							cell.getRow().toggleSelect();
						},
						selectable: true,
						selectableRangeMode: "click"
					},

					{
						title: "学科",
						field: "subject",
						formatter(cell) {
							let v = cell.getValue();
							return app.subjects[v].name;
						},
						resizable: false
					},
					{
						title: "分数",
						field: "mark",
						resizable: false
					},
					{
						title: "信息",
						field: "info",
						resizable: false
					},
					{
						title: "日期",
						field: "date",
						formatter(cell) {
							let v = cell.getValue();
							const date = new Date(v);
							return app.dateFormatter(date);
						},
						resizable: false
					}
				]
			});
		},
		moreAboutMark(index) {
			const mark = this.result[index];
			const currentSubject = this.subjects[mark.subject];
			const com = this.confirm(
				"更多",
				`
		    <span>分数</span>
		    <input type="number" value="${mark.mark}" id="mark-mark" />
		    <br />
		    
		    <button class="fully" id="mark-delete">删除</button>
		  `,
				choice => {
					if (!choice) return;
					this.loadChart();
				}
			);
			$("#mark-delete").addEventListener("touchstart", e => {
				this.start(
					"mark",
					() => {
						this.$delete(currentSubject.marks, currentSubject.marks.indexOf(mark));
						com.cancel();
						this.loadChart();
					},
					15,
					() => {
						$("#mark-delete").style.filter = "brightness(" + (this.time.mark / 10 + 1) + ")";
						return false;
					}
				);
			});
			$("#mark-delete").addEventListener("touchend", () => {
				this.stop("mark", () => {
					$("#mark-delete").style.filter = "";
				});
			});
		},
		checkEmpty(arr, more = "value") {
			let res = true;
			arr.map(e => {
				if (!e[more]) {
					e.style.border = warn;
					res = false;
				} else {
					e.style.border = "";
				}
			});
			return res;
		}
	},
	watch: {
		"user.theme"(nv, ov) {
			if (ov == nv) return;
			this.changeTheme(nv);
		},
		"user.grade"() {
			this.loadChart();
		},
		"current.subject"() {
			this.loadChart();
		},
		"current.type"() {
			this.loadChart();
		},
		"current.exam"() {
			this.loadChart();
		},
		"pages.datas"(nv, ov) {
			if (nv) this.loadChart();
		}
	}
});
