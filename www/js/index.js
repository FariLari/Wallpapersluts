document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    //console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');

    //setTimeout( () => {
        document.getElementById("deviceready").style="display:none";
        document.getElementById("header_logo").style="display:none";

        if (window.usingCordova==true) {
            if (device.platform === "Android") {
                // request read access to the external storage if we don't have it
                /*
                cordova.plugins.diagnostic.getExternalStorageAuthorizationStatus(function (status) {
                    if (status === cordova.plugins.diagnostic.permissionStatus.GRANTED) {
                        alert("External storage use is authorized");
                    } else {
                        cordova.plugins.diagnostic.requestExternalStorageAuthorization(function (result) {
                            alert("Authorization request for external storage use was " + (result === cordova.plugins.diagnostic.permissionStatus.GRANTED ? "granted" : "denied"));
                        }, function (error) {
                            alert(error);
                        });
                    }
                }, function (error) {
                    alert("The following error occurred: " + error);
                });
                */

                // request runtime permissions if needed
                /*
                cordova.plugins.diagnostic.getPermissionsAuthorizationStatus(function(statuses){
                    for (var permission in statuses){
                        switch(statuses[permission]){
                            case cordova.plugins.diagnostic.permissionStatus.GRANTED:
                                alert("Permission granted to use "+permission);
                                break;
                            case cordova.plugins.diagnostic.permissionStatus.NOT_REQUESTED:
                                alert("Permission to use "+permission+" has not been requested yet; asking now");
                                cordova.plugins.diagnostic.requestRuntimePermission(function(status){
                                    alert("Runtime permission request result: " + status.toString());
                                }, function(error){
                                    alert("The following error occurred: "+error);
                                }, permission);
                                break;
                            case cordova.plugins.diagnostic.permissionStatus.DENIED_ONCE:
                                alert("Permission denied to use "+permission+" - ask again?");
                                break;
                            case cordova.plugins.diagnostic.permissionStatus.DENIED_ALWAYS:
                                alert("Permission permanently denied to use "+permission+" - guess we won't be using it then!");
                                break;
                        }
                    }
                }, function(error){
                    alert("The following error occurred: "+error);
                },[
                    cordova.plugins.diagnostic.permission.WRITE_EXTERNAL_STORAGE,
                    cordova.plugins.diagnostic.permission.READ_EXTERNAL_STORAGE
                ]);
                */
            }
        }
        
        DiscordLogin();
    //},1000);
}

//setTimeout(onDeviceReady, 2000);
if (window.usingCordova==false) {
    onDeviceReady();
}

function handleOpenURL(url) {
    console.log("received url: " + url);
  }