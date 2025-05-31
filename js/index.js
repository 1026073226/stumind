const app = new Vue( {
  el: "#app",
  data: {
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
    }
  },
  methods: {
    setUser() {
      
    },
    save() {
      localStorage[ this.user.name ] = JSON.stringify( this.subjects );
      localStorage.currentUser = this.user.name;
    },
    load() {
      if ( this.user.name === "default" && localStorage.currentUser ) {
        this.user.name = localStorage.currentUser;
      }
      if ( localStorage[ this.user.name ] ) {
        this.subjects = JSON.parse( localStorage[ this.user.name ] );
      }
    },
    newSubject( key, name ) {
      this.subjects[ key ] = {
        name: name,
        marks: [],
        enable: true,
      };
    }
  }
});