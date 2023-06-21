function SetUser(user_json) {
  doHandelbars(user_json, "user-template", "header_user");

  SendData(user_json, Server_App.url + "user");
}

function SetGuild(guild_json) {
  console.log(guild_json);
}


function SendData(json_data, url) {
  json_data.service=Application_Data.service; //!
  
  var formBody = [];
  for (var property in json_data) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(json_data[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  console.log(formBody);

  fetch(url, {
    method: "POST",
    body: formBody,
    headers: {
      "Content-type": "application/x-www-form-urlencoded"
    }
  })
  .then((response) => response.json())
  .then((json) =>  {
    console.log(json);
  });
}