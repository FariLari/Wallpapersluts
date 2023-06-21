function doHandelbars(data, source, target) {
  var tmp = document.getElementById(source).innerHTML;
  var template = Handlebars.compile(tmp);
  var html = template(data);
  document.getElementById(target).innerHTML=html;
}

function setMain(place) {
  console.log("link to " + place);

  var data={};
  switch (place) {
    case 'profile':
      data=Application_Data.User;
      break;
    default:
      place="main";
      break;
  }
  doHandelbars(data, place+"-template", "main");
}