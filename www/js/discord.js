var response_type="code";
var scope="identify%20guilds";
var state="1";
var redirect_uri="http://localhost:8000/";

var storage = window.localStorage;

//storage.setItem(key, value) // Pass a key name and its value to add or update that key.
//storage.removeItem("token"); // Pass a key name to remove that key from storage.

function DiscordLogin() {

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const code = urlParams.get('code');

  const token = storage.getItem("token");
  if (token!=null) {
    var auth_token=JSON.parse(token);

    fetch('https://discord.com/api/users/@me', {
			headers: {
				authorization: `${auth_token.token_type} ${auth_token.access_token}`,
			},
		})
    .then(result => {
      console.log(result);
      return result.json();
    })
    .then(response => {
      console.log (response);
    })
    
    return;
  }

  if (code!=null) {
    console.log(code);

    var details={
      'client_id': Discord_App.client_id,
      'client_secret': Discord_App.client_secret,
      'grant_type': 'authorization_code',
      'code': code,
      'redirect_uri': redirect_uri
    };
    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      body: formBody,
      headers: {
        "Content-type": "application/x-www-form-urlencoded"
      }
    })
    .then((response) => response.json())
    .then((json) =>  {
      storage.setItem("token", JSON.stringify(json));
      location.href=redirect_uri;
    });

    return;
  }


  // New Login:
  var url="https://discord.com/oauth2/authorize";
  url=url + "?response_type="+response_type;
  url=url + "&client_id="+Discord_App.client_id;
  url=url + "&scope="+scope;
  url=url + "&state="+state;
  url=url + "&redirect_uri="+redirect_uri;
  location.href=url;
}
