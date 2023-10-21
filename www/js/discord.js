var storage = window.localStorage;

//storage.setItem(key, value) // Pass a key name and its value to add or update that key.

var response_type="code";
var scope="identify%20guilds";
var state="1";
var redirect_uri="https://yours-mine.com/test";

var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var code = urlParams.get('code');

var token = storage.getItem("token");

window.addEventListener('message', async function(event) {
  if (event.data.match(/^oauth::/)) {
    var data = JSON.parse(event.data.substring(7));
    await SendData({data}, Server_App.url + "debug");
  }
});


function DiscordGuilds() {
  if (token!=null) {
    var auth_token=JSON.parse(token);

    fetch('https://discord.com/api/users/@me/guilds', {
			headers: {
				authorization: `${auth_token.token_type} ${auth_token.access_token}`,
			},
		})
    .then(result => {
      if (result.status==401) {
        storage.removeItem("token"); // Pass a key name to remove that key from storage.
        DiscordLogin();
        return;
      }
      return result.json();
    })
    .then(response => {
      //SetGuild(JSON.parse(JSON.stringify(response)));
      //console.log(response);
    })
    
    return;
  }

}

function DiscordLogin() {
  
  if (token!=null) {
    var auth_token=JSON.parse(token);

    fetch('https://discord.com/api/users/@me', {
			headers: {
				authorization: `${auth_token.token_type} ${auth_token.access_token}`,
			},
		})
    .then(result => {
      if (result.status==401) {
        storage.removeItem("token"); // Pass a key name to remove that key from storage.
        alert("Remove Token 1");
        if (window.usingCordova==true) {
          DiscordLogin();
        } else {
          location.href=redirect_uri;
        }
        return;
      }
      return result.json();
    })
    .then(response => {
      if (typeof response == "undefined") {
        storage.removeItem("token"); // Pass a key name to remove that key from storage.
        if (window.usingCordova==true) {
          alert("Remove Token 2");
          DiscordLogin();
        } else {
          location.href=redirect_uri;
        }
        return;
      }
      SetUser(JSON.parse(JSON.stringify(response)));
    })
    
    return;
  }

  if (code!=null) {
    console.log(code);

    if (window.usingCordova==true) {
      var details={
        'client_id': Discord_App.client_id,
        'client_secret': Discord_App.client_secret,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': "http://localhost"
      };
    } else {
      var details={
        'client_id': Discord_App.client_id,
        'client_secret': Discord_App.client_secret,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': redirect_uri
      };
    }

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
      token = JSON.stringify(json);
      DiscordLogin();
    });

    return;
  }


  // New Login:
  var url="https://discord.com/oauth2/authorize";
  url=url + "?response_type="+response_type;
  url=url + "&client_id="+Discord_App.client_id;
  url=url + "&scope="+scope;
  url=url + "&state="+state;
  

  if (window.usingCordova==true) {
    //url=url + "&redirect_uri="+"com.lewdclaimer.app"+"://oauth_callback";
    url=url + "&redirect_uri="+"http://localhost";
    //url=url + "&redirect_uri="+window.location.origin;
    //window.open(url, 'oauth:discord', '');
    //window.cordova.InAppBrowser.open(url, "_blank");
    var authWindow = window.cordova.InAppBrowser.open(url, "_blank");
    
    authWindow.addEventListener('loadstop', function(e) {
      var loc = e.url;
      
      if (loc.search("discord") >= 0) {
        return;
      }

      if (loc.search("http://localhost") >= 0) {
        queryString = loc.replace("http://localhost/","");
        urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code');
        authWindow.close();
        DiscordLogin();
      }
      
    });
    
  } else {
    url=url + "&redirect_uri="+redirect_uri;
    location.href=url;
  }
}
