function doHandelbars(data, source, target) {
  var tmp = document.getElementById(source).innerHTML;
  var template = Handlebars.compile(tmp);
  var html = template(data);
  document.getElementById(target).innerHTML=html;
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
    default:
      place="main";
      break;
  }
  doHandelbars(data, place+"-template", "main");

  switch (place) {
    case 'friends':
      doHandelbars(Application_Data.Friend_List, "userlist-template", "friend_list");
      doHandelbars(Application_Data.Friend_Request, "userlist-template", "friend_request");
      doHandelbars(Application_Data.Friend_Pending, "userlist-template", "friend_pending");
      break;
    default:
      break;
  }
}