var last_download="";

function downloadFile(url, url_type) {
  var url_split = url.split("/");
  var filename = url_split[url_split.length-1];

  if (last_download==url) {
    alert("No Download " + url);
    DownloadedFile(last_download);
  } else {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = function() {
      if (this.status == 200) {
        last_download=url;
        var tmp_blob = new Blob([this.response], { type: url_type });
        saveFile(tmp_blob, filename);
      }
    };
    xhr.send();
  }
}

function saveFile(fileData, fileName) {
  var storageLocation = cordova.file.cacheDirectory;//externalRootDirectory;//'file:///storage/emulated/0/';

  window.resolveLocalFileSystemURL(storageLocation , function (directoryEntry) {
    directoryEntry.getDirectory("Lewdclaimer", { create: true, exclusive: false }, function (directoryEntry) {
      directoryEntry.getFile(fileName, { create: true }, function (fileEntry) {
        alert("Should Write File: " + fileName);
        writeFile(fileEntry, fileData);
      }, (e) => {alert("1: " + JSON.stringify(e));});
    }, (e) => {alert("2: " + JSON.stringify(e));});
  }, (e) => {alert("3: " + JSON.stringify(e));});
}

function writeFile(fileEntry, dataObj) {
  alert("Write File ");
  fileEntry.createWriter(function (fileWriter) {
    fileWriter.onwriteend = function() {
      alert("Successful file write...");
      window.plugins.wallpaper.setImage(fileEntry.fullPath);

      alert(fileEntry.toURI());
      DownloadedFile(fileEntry);
      
    };

    fileWriter.onerror = function(e) {
      alert("Failed file write: " + e.toString());
    };

    fileWriter.write(dataObj);
  });
}

function DownloadedFile(file) {
  alert("Download Successfull " + file);
}
