async function SetUser(user_json) {
  Application_Data.User=await SendData(user_json, Server_App.url + "user");

  doHandelbars(Application_Data.User, "user-template", "header_user");
  setMain("main");
  
  //DiscordGuilds();
}

function SetGuild(guild_json) {
  SendData(guild_json, Server_App.url + "server");
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
    setTimeout(() => { window.location.href = window.location.href; }, 5000);
    return {};
  });
}