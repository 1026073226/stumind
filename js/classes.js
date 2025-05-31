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