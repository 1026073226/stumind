class Mark {
  
  constructor( grade, date, subject, mark, info ) {
    this.grade = grade;
    this.date = date;
    this.subject = subject;
    this.mark = mark;
    this.info = info;
    this.part = {};
  }
  
  getPartProp( name ) {
    if ( this.part[ name ] ) {
      return this.part[ name ].mark / this.mark;
    }
  }
  
  getMarkProp( full ) {
    if( this.mark ) {
      return this.mark / full;
    }
  }
  
}

function $( query ) {
  if ( query.charAt(0) === "#" ) {
    return document.querySelector( query );
  } else {
    return document.querySelectorAll( query );
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
	    shadow: "#ccc",
    },
  },
  red: {
    name: "枫林叶晚",
    style: {
      bg0: "#c39e5d",
      bg1: "#986524",
      bg2: "#ac8156",
      c: "#fff",
      shadow: "#ccc",
    }
  },
  black: {
    name: "暗夜幽冥",
    style: {
      bg0: "#333",
      bg1: "#444",
      bg2: "#888",
      c: "#fff",
      shadow: "#666",
    }
  },
  grey: {
    name: "茶韵清幽",
    style: {
      bg0: "#87723e",
      bg1: "#a28b68",
      bg2: "#867018",
      c: "#fff",
      shadow: "#ccc",
    },
  },
};

warn = "1px solid #E68";

window.icons = {
  datas: "◔",
  pusher: "☼",
  me: "⊹",
};