function doHandelbars(data, source, target) {
  var tmp = document.getElementById(source).innerHTML;
  var template = Handlebars.compile(tmp);
  var html = template(data);
  document.getElementById(target).innerHTML=html;
}