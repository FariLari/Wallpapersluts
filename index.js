let prog = require('./package.json');

// name this slutty programm
let outname=prog.name + " " + prog.version
console.log(outname);
console.log("=".repeat(outname.length));
console.log();

// some things you need to set fix
const DATA_FOLDER = "data";
const CONFIG_FILE = "settings.json";
const SERVER_URL  = "www.yours-mine.com";
const SERVER_PATH = "wallpapersluts.json"
// yeah i know there is some server magic :-P

// oh this bloody modules we need
const fs = require('fs');
const https = require('https');
const path = require('path');
const dayjs = require('dayjs');
const wallpaper = require('wallpaper');
const robotjs = require('robotjs');
const jimp = require('jimp');

async function doRequest() {
  var p = new Promise(function (resolve, reject) {

    const options = {
      hostname: SERVER_URL,
      port: 443,
      path: '/'+SERVER_PATH,
      method: 'GET',
    };

    var req = https.request(options, (response) => {
        response.on('data', async (body) => {
          var json = JSON.parse(body.toString());
          resolve(json);
        });
      }
    );
    req.on('error', function (e) {
      console.error('downloadJSON: ' + e);
      reject();
    });
    req.end();
  });
  
  return p;
}

function checkSettings(data) {

  // Create fucking new Config Lines!
  // And delete all excluded Things!
  var config = {}
  if (fs.existsSync(CONFIG_FILE)) {
    var file = fs.readFileSync(CONFIG_FILE)
    config = JSON.parse(file);
  }
  var projects = Object.keys(data);
  for (var i = 0; i < projects.length ; i++) {
    if (typeof config[projects[i]] == "undefined") {
      config[projects[i]]={};
    }
    var categories = Object.keys(data[projects[i]]);
    for (var j = 0; j < categories.length ; j++) {
      
      if (typeof config[projects[i]][categories[j]] == "undefined") {
        config[projects[i]][categories[j]]=1;
      }

      if (config[projects[i]][categories[j]]==0) {
        delete(data[projects[i]][categories[j]]);
      }
    }
  }
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
  return data;
}

function getNewest(data) {
  var return_value="";
  var check_date;
  var info_cat="";
  //dayjs

  var projects = Object.keys(data);
  for (var i = 0; i < projects.length ; i++) {
    var categories = Object.keys(data[projects[i]]);
    for (var j = 0; j < categories.length ; j++) {
      if (return_value=="") {
        return_value = data[projects[i]][categories[j]].path;
        check_date = dayjs(data[projects[i]][categories[j]].date);
        info_cat=categories[j];
      } else {
        if (dayjs(data[projects[i]][categories[j]].date)>check_date) {
          return_value = data[projects[i]][categories[j]].path;
          check_date = dayjs(data[projects[i]][categories[j]].date);
          info_cat=categories[j];
        }
      }
    }
  }
  return {path: return_value, categorie: info_cat};
}

async function checkOrDownloadFile(image) {
  var newFilename=path.join(process.cwd(), DATA_FOLDER, image.path.replace('/','_'));

  if (!fs.existsSync(DATA_FOLDER)) {
    fs.mkdirSync(DATA_FOLDER, { recursive: true });
  }

  var p = new Promise(function (resolve, reject) {
    if (fs.existsSync(newFilename)) {
      resolve(newFilename);
      return;
    }
    
    const file = fs.createWriteStream(newFilename);
    const options = {
      hostname: SERVER_URL,
      port: 443,
      path: '/'+image.path,
      method: 'GET',
    };

    var req = https.get(options, (response) => {
      response.pipe(file);
      file.on('finish', async() => {
        file.close();

        var screen =robotjs.getScreenSize();
        new jimp(screen.width, screen.height, '#000000' , async (err, bg) => {          
          await bg.background(0x000000);    

          var image = await jimp.read(newFilename);
          await image.scaleToFit(screen.width, screen.height);
          await bg.composite(image, (screen.width/2-image.bitmap.width/2), (screen.height/2-image.bitmap.height/2))
          await bg.write(newFilename);

          resolve(newFilename);
        });
        
      });
      }
    );
    req.on('error', function (e) {
      console.error('download: ' + e);
      reject();
    });
    req.end();
  });
  
  return p;
}

// do your thing bitch
async function main() {
  console.log();
  console.log("Checking for new Images...");
  var data = await doRequest();
  data = checkSettings(data);
  var image = getNewest(data);
  var wall=await checkOrDownloadFile(image);

  //if (process.platform!="win32") {
    var wall2 = await wallpaper.get();
    if (wall2!=wall) {
      await wallpaper.set(wall);
      console.log("Setting Wallpaper to " + image.categorie+ " - " + wall);
    }
  /*} else {
    // FU pkg for not getting the windows-wallpaper.exe into the package!
    //var exe=path.join(__dirname,"node_modules","wallpaper","source","windows-wallpaper.exe");
    var exe=path.join(process.cwd(),"windows-wallpaper.exe");
    var wall2=require('child_process').execSync(exe);

    // Without that trim there is something wrong?!?
    wall=wall.trim();
    var wall2=wall2.toString().trim();

    if (wall2!=wall) {
      require('child_process').execSync(exe + ' "' + wall + '"');
      console.log("Setting Wallpaper to " + image.categorie+ " - " + wall);
    }
  }*/
  
  setTimeout(main, 10000)
}

main();