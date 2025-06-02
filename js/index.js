const app = new Vue({
	el: "#app",
	data: {
		today: "",
		check: {},
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
		user: {
			name: "default",
			grade: "0",
			checked: [],
			theme: "green",
			img: "appIcon.png"
		},
		time: {},
		itv: {}
	},
	created() {
		this.today = this.dateFormatter(new Date());
		this.load();
		window.addEventListener("beforeunload", this.save);
		this.itv.DATA_SAVER = setInterval(this.save, 1000);
		this.initCheck();
	},
	mounted() {
		window.addEventListener(
			"load",
			() => {
				this.initAnima();
			},
			{
				once: true
			}
		);
	},
	computed: {
		marksLength() {
			let n = 0;
			Object.values(this.subjects).map(value => {
				if (value.marks) n += value.marks.length;
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

		dateFormatter(date) {
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
		},

		load() {
			if(localStorage.current_USER) this.user.name = localStorage.current_USER;
			if (localStorage[this.user.name + "_USER"]) {
				this.user = JSON.parse(localStorage[this.user.name + "_USER"]);
			}
			if (localStorage[this.user.name]) {
				this.subjects = JSON.parse(localStorage[this.user.name]);
			}
		},

		newSubject(key, name) {
			this.$set(this.subjects, key, this.subjectObj(name));
		},

		newMark(subject, mark, info = "") {
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
					let info = $("#mark-info").value;
					if (!mark) {
						$("#mark-mark").style.border = warn;
					} else {
						$("#mark-mark").style.border = "";
					}
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
			for (let key in this.subjects) {
				const button = document.createElement("button");
				button.className = "mark-subject-button";
				button.innerText = this.subjects[key].name;
				$("#mark-subject")
					.appendChild(button)
					.addEventListener("click", e => {
						subject = key;
						e.target.style.backgroundColor = "rgb(232,232,100)";
						if (lastone) {
							lastone.style.backgroundColor = "";
						}
						lastone = e.target;
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
      <button class="menuBtn" style="background-color: #AFA;width: calc(50% - 8px)">${ym}</button>
      <button class="menuBtn" style="background-color: #FAA;width: calc(50% - 8px)">${nm}</button>
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
		    <span>满分</span>
		    <input type="number" id="subject-full-score" value="${value.full}" />
		    <button id="subject-delete" class="fully">删除</button>
		  `,
				choice => {
					if (!choice) return;
					let nk = $("#subject-id").value;
					if (nk != key && !Object.keys(this.subjects).includes(nk)) {
						this.subjects[nk] = this.subjects[key];
						this.$delete(this.subjects, key);
					} else if(nk != key) {
						$("#subject-id").style.border = warn;
						return false;
					}
					return (value.full = $("#subject-full-score").value);
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
			this.confirm(
				"查看详情",
				`
		    <span>时间</span>
		    <input value="${key}" disabled="true" />
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
		    if(choice) {
		      clearInterval(this.itv.DATA_SAVER);
		      window.removeEventListener("beforeunload", this.save);
		      localStorage[this.user.name] = "";
		      localStorage[this.user.name + "_USER"] = "";
		      this.user.name = "default";
		      location = location;
		    }
		  })
		},
	},
	watch: {
		"user.theme"(nv, ov) {
			if (ov == nv) return;
			this.changeTheme(nv);
		}
	}
});
