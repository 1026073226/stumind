const app = new Vue( {
  el: "#app",
  data: {
    pages: {
      pusher: true,
      datas: false,
    },
    subjects: {
      ch: {
        name: "语文",
        marks: [],
        enable: true,
        full: 150,
      },
      ma: {
        name: "数学",
        marks: [],
        enable: true,
        full: 150,
      },
      en: {
        name: "英语",
        marks: [],
        enable: true,
        full: 150,
      },
      ph: {
        name: "物理",
        marks: [],
        enable: true,
        full: 100,
      },
      chm: {
        name: "化学",
        marks: [],
        enable: true,
        full: 100,
      },
      bi: {
        name: "生物",
        marks: [],
        enable: true,
        full: 100,
      },
      his: {
        name: "历史",
        marks: [],
        enable: true,
        full: 100,
      },
      geo: {
        name: "地理",
        marks: [],
        enable: true,
        full: 100,
      },
      pol: {
        name: "政治",
        marks: [],
        enable: true,
        full: 100,
      },
      pe: {
        name: "体育",
        marks: [],
        enable: true,
        full: 60,
      },
    },
    user: {
      name: "default",
      grade: "0",
    }
  },
  mounted() {
    this.load();
  },
  methods: {
    setUser() {},

    save() {
      localStorage[this.user.name] = JSON.stringify(this.subjects);
      localStorage.currentUser = JSON.stringify(this.user);
    },

    load() {
      if (this.user.name === "default" && localStorage.currentUser) {
        this.user = JSON.parse(localStorage.currentUser);
      }
      if (localStorage[this.user.name]) {
        this.subjects = JSON.parse(localStorage[this.user.name]);
      }
    },

    newSubject(key, name) {
      this.subjects[key] = this.subjectObj(name);
    },

    newMark(subject, mark, info = "") {
      if (subject && mark) {
        let currentSubject;
        if (this.subjects[subject]) {
          currentSubject = this.subjects[subject];
        } else {
          currentSubject = this.createSubject();
        }
        return currentSubject.marks.push(new Mark(this.user.grade, Date.now(), subject, mark, info));
      }
      return false;
    },

    createMark() {
      let subject;
      let res;
      let lastone;
      this.confirm("创建成绩", `
        <span>科目</span>
        <div id="mark-subject"></div>
        <span>分数</span>
        <input id="mark-mark" type="number" />
        <br />
        <span>信息</span>
        <input id="mark-info" />
        `, choice => {
          if (!choice) return;
          let mark = $("#mark-mark").value;
          let info = $("#mark-info").value;
          if (!mark) {
            $("#mark-mark").style.border = "1px solid #E68";
          } else {
            $("#mark-mark").style.border = "";
          }
          if (!subject) {
            $("#mark-subject").style.border = "1px solid #E68";
          } else {
            $("#mark-subject").style.border = "";
          }
          if (mark && subject) {
            if (mark > this.subjects[subject].full) {
              $("#mark-mark").style.border = "1px solid #E68";
              return false;
            }
            res = this.newMark(subject, mark, info);
          } else {
            return false;
          }
        });
      for (let key in this.subjects) {
        const button = document.createElement("button");
        button.className = "mark-subject-button";
        button.innerText = this.subjects[key].name;
        $("#mark-subject").appendChild(button).addEventListener("click", (e) => {
          subject = key;
          e.target.style.backgroundColor = "rgb(232,232,100)";
          if(lastone) {
            lastone.style.backgroundColor = "";
          }
          lastone = e.target;
        });
      }
      return res;
    },

    createSubject() {
      let res;
      this.confirm("新学科", `
        <span>id</span>
        <input placeholder="留空以自动生成" id="subject-id" />
        <br />
        <span>名称</span>
        <input id="subject-name" />
        `, choice => {
          if (!choice) return;
          let id = $("#subject-id").value;
          let name = $("#subject-name").value;
          if (!id) {
            id = Date.now();
          }
          if (name) {
            res = this.newSubject(id, name);
          } else {
            $("#subject-id").style.borderColor = "#E68";
            return false;
          }
        });
      return res;
    },

    subjectObj(name) {
      return {
        name: name,
        marks: [],
        enable: true,
        full: 100,
      };
    },

    confirm(msg,
      innerHTML = "",
      f = function() {
        return true
      },
      ym = "确认",
      nm = "取消") {
      //this.playSound( "ta" );
      let t = $("#conf");
      t.innerHTML = `
      <p>${msg}</p>
      ${innerHTML}
      <button class="menuBtn" style="background-color: #AFA;width: calc(50% - 8px)">${ym}</button>
      <button class="menuBtn" style="background-color: #FAA;width: calc(50% - 8px)">${nm}</button>
      `;
      t.style.opacity = 0.8;
      t.style.pointerEvents = "all";
      t.querySelectorAll(".menuBtn")[0].addEventListener("click",
        function() {
          if (f(true) !== false) {
            t.style.opacity = 0;
            t.style.pointerEvents = "none";
          }
        });
      t.querySelectorAll(".menuBtn")[1].addEventListener("click",
        function() {
          f(false);
          t.style.opacity = 0;
          t.style.pointerEvents = "none";
        });
    },
    styleComputer(bool) {
      return "opacity:" + (bool ? "1": "0") + ";pointer-events:" + (bool ? "auto": "none");
    }
  }
});