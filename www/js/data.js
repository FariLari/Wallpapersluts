async function SetUser(user_json) {
  Application_Data.User=await SendData(user_json, Server_App.url + "user");

  doHandelbars(Application_Data.User, "user-template", "header_user");
  setMain("main");
  
  //DiscordGuilds();
}

function SetGuild(guild_json) {
  SendData(guild_json, Server_App.url + "server");
}

async function SearchUser(string) {
  var user_json={ "search": string };
  
  Application_Data.Friend_Search=await SendData(user_json, Server_App.url + "list_user");
  doHandelbars(Application_Data.Friend_Search, "search-template", "friend_search");
}

async function SendData(json_data, url) {
  json_data.service=Application_Data.Service; //!

  if (typeof Application_Data.User != "undefined") {
    json_data.jid=Application_Data.User.jid;
  }
  
  var formBody = [];
  for (var property in json_data) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(json_data[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");

  return await fetch(url, {
    method: "POST",
    body: formBody,
    headers: {
      "Content-type": "application/x-www-form-urlencoded"
    }
  })
  .then((response) => response.json())
  .then((json) =>  {
    return json;
  })
  .catch(err => {
    console.log(url, err);
    //setTimeout(() => { window.location.href = window.location.href; }, 5000);
    return {};
  });
}

async function SendFriendRequest(element, jid) {
  element.parentNode.style.display='none';

  await SendData({jid2:jid}, Server_App.url + "add_request");
  Application_Data.Friend_Pending=await SendData({}, Server_App.url + "list_pending");
  doHandelbars(Application_Data.Friend_Pending, "pending-template", "friend_pending");
}

async function RemoveFriendRequest(element, jid) {
  element.parentNode.style.display='none';

  await SendData({jid2:jid}, Server_App.url + "remove_pending");
  Application_Data.Friend_Pending=await SendData({}, Server_App.url + "list_pending");
  doHandelbars(Application_Data.Friend_Pending, "pending-template", "friend_pending");
}

async function Friend_Positive(element, jid) {
  element.parentNode.style.display='none';

  await SendData({jid2:jid}, Server_App.url + "add_friend");
  Application_Data.Friend_List=await SendData({}, Server_App.url + "list_friends");
  doHandelbars(Application_Data.Friend_List, "friend-template", "friend_list");
}

async function Friend_Negative(element, jid) {
  element.parentNode.style.display='none';

  await SendData({jid2:jid}, Server_App.url + "remove_request");
}

async function Friend_Remove(element, jid) {
  element.parentNode.style.display='none';

  await SendData({jid2:jid}, Server_App.url + "remove_friend");
}

async function SendForm(e, form) {
  setMain('waiting');
  await fetch(form.action,{method:'post', body: new FormData(form)});
  setMain('main');
}
