

function doHandelbars(data, source, target) {
  var tmp = document.getElementById(source).innerHTML;

  Handlebars.registerHelper('ifCond', function(v1, v2, options) {
    if(v1 == v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  Handlebars.registerHelper('ifSameAsPrevious',  function (array, index, key, options) {
        return (array[index-1] && (array[index][key] === array[index-1][key])) ? options.fn(this) : options.inverse(this);
  });

  Handlebars.registerHelper('ifSameAsNext',  function (array, index, key, options) {
    return (array[index+1] && (array[index][key] === array[index+1][key])) ? options.fn(this) : options.inverse(this);
  });

  var template = Handlebars.compile(tmp);
  var html = template(data);
  document.getElementById(target).innerHTML=html;

  emojify.run();
}

async function setMain(place) {
  console.log("link to " + place);

  var data={};
  switch (place) {
    case 'profile':
      data=Application_Data.User;
      break;
    case 'friends':
      Application_Data.Friend_List=await SendData({}, Server_App.url + "list_friends");
      Application_Data.Friend_Request=await SendData({}, Server_App.url + "list_requests");
      Application_Data.Friend_Pending=await SendData({}, Server_App.url + "list_pending");
      break;
    case 'send':
      Application_Data.Friend_List=await SendData({}, Server_App.url + "list_friends");
      data=Application_Data;
      break;
    case 'msg':
      data=await SendData({}, Server_App.url + "msg");
      break;
    case 'waiting':
      break;
    default:
      place="main";
      break;
  }
  doHandelbars(data, place+"-template", "main");

  switch (place) {
    case 'friends':
      doHandelbars(Application_Data.Friend_List, "friend-template", "friend_list");
      doHandelbars(Application_Data.Friend_Request, "request-template", "friend_request");
      doHandelbars(Application_Data.Friend_Pending, "pending-template", "friend_pending");
      break;
    default:
      break;
  }

  topFunction();
  console.log(Application_Data);
}

function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  window.scrollTo(0,0);

  document.getElementsByClassName('contentheader')[0].animate({scrollTop: 0}, 0);
}

function loadFile (event) {
  var output = document.getElementById('output');
  output.src = URL.createObjectURL(event.target.files[0]);
  output.onload = function() {
    URL.revokeObjectURL(output.src) // free memory
  }
};

function toggle(name, value) {
  checkboxes = document.getElementsByName(name);
  for(var i=0, n=checkboxes.length;i<n;i++) {
    checkboxes[i].checked = value;
  }
}