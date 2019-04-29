window.fbAsyncInit = function () {
  FB.init({
    appId: '481630479039581',
    cookie: true,
    xfbml: true,
    version: 'v2.8'
  });

  FB.getLoginStatus(function (response) {
    statusChangeCallback(response);
  });
};

(function (d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) { return; }
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function statusChangeCallback(response) {
  if (response.status === 'connected') {
    console.log('Logged in and authenticated');
    setElements(true);
    testAPI();
  } else {
    console.log('Not authenticated');
    setElements(false);
  }
}

function checkLoginState() {
  FB.getLoginStatus(function (response) {
    statusChangeCallback(response);
  });
}

let likesArray = []
let musicArray = []
let moviesArray = []
let relevantArray = []
let relevantTasteArray = []

function testAPI() {
  FB.api('/me?fields=name,email,birthday,location,likes', function (response) {
    if (response && !response.error) {
      //console.log(response);
      buildProfile(response);
      getLikes();
    }
  })
}


function getLikes() {
  FB.api('/me/likes?fields=name', function (response) {
    if (response && !response.error) {
      buildLikesFeed(response);
      likesArray = response.data;
      getMusic();
    }
  });
}

function getMusic() {
  FB.api('/me/music?fields=name', function (response) {
    if (response && !response.error) {

      musicArray = response.data;
      // likesArray.prototype.concat(moviesArray);
      getMovies();
    }
  });
}

function getMovies(relevantArray) {
  FB.api('/me/movies?fields=name', function (response, relevantArray) {
    if (response && !response.error) {
      moviesArray = response.data;
      getRelevantArray();
    }
  });
}
var getRelevantArray = function () {
  relevantArray = likesArray.concat(moviesArray, musicArray);
  cleanRelevantArray();
  return relevantArray;
}

var cleanRelevantArray = function () {
  for (var i = 0; i < relevantArray.length; i++) {
    delete relevantArray[i].id;
    console.log(relevantArray[i]);
  }
  console.log("complete array Clean");
  relevantToTastedive();
}

var relevantToTastedive = function () {
  for (let i = 0; i < relevantArray.length; i++) {
    const KEY = "333678-Relevant-XODLQ5EI"
    fetch('https://tastedive.com/api/similar?:&k=333678-Relevant-XODLQ5EI&q=' + relevantArray[i].name + '&limit=1&info=1')

      .then(response => {
        if (response.ok)
          return response.json();
        console.log(response);
        throw new Error(response.statusText);
      })

      .then(function handleData(data) {
        if (data.Similar.Results.length >= 1) {
          console.log(JSON.stringify(data.Similar.Results));
          relevantTasteArray.push(data.Similar.Results[0]);
        }
      })
      .catch(function handleError(error) {
      });

  }
}

const facebookToScreen = function () {
  for (let i = 0; i < relevantTasteArray.length; i++) {
    $("#suggestions").prepend(
      "<div>" + relevantTasteArray[i].Name + "</div>" +
      "<div>" + relevantTasteArray[i].Type + "</div>" +
      "<div>" + relevantTasteArray[i].wTeaser + "</div>" +`

      <iframe width="420" height="315"
      src="${relevantTasteArray[i].yUrl}">
      </iframe>`

      
      );

    console.log("ITS WORKING")
  }
}


$(document).ready(function(){
  $("#getSuggestionsButton").click(function(){
    document.getElementById('tastediveFeed').style.display = 'block';
    facebookToScreen()
  });
});



function buildProfile(user) {
  let profile = `
  <h3>${user.name}</h3>
  <ul class="list-group">
  <li class="list-group-item">User ID: ${user.id}</li>
  <li class="list-group-item">Email: ${user.email}</li>
  <li class="list-group-item">Birthday: ${user.birthday}</li>
  </ul>
  `;

  document.getElementById('profile').innerHTML = profile;
}

function buildLikesFeed(likes) {
  let output = '<h3>Likes</h3>';
  for (let i in likes.data) {
    if (likes.data[i].name) {
      output += `
      <div class="well">
      ${likes.data[i].name};
      </div>
      `

        ;
    }
  }
  // Array.prototype.push.apply(musicArray, moviesArray);
  // Array.prototype.push.apply(likesArray,musicArray);
  // Array.prototype.push.apply(relevantArray,likesArray);
  document.getElementById('LikesFeed').innerHTML = output;
}

function setElements(isLoggedIn) {
  if (isLoggedIn) {
    document.getElementById('logout').style.display = 'block';
    document.getElementById('profile').style.display = 'block';
    document.getElementById('LikesFeed').style.display = 'block';
    document.getElementById('fb-btn').style.display = 'none';
    document.getElementById('heading').style.display = 'none';
    document.getElementById('tastediveFeed').style.display = 'none';
  } else {
    document.getElementById('logout').style.display = 'none';
    document.getElementById('profile').style.display = 'none';
    document.getElementById('LikesFeed').style.display = 'none';
    document.getElementById('fb-btn').style.display = 'block';
    document.getElementById('heading').style.display = 'block';
  }
}

function logout() {
  FB.logout(function (response) {
    setElements(false);
  });
}




// FB.api(
  //     "me/likes",
  //     function (response) {
    //       if (response && !response.error) {
      //         /* handle the result */
      //         alert(response.data[1].name)
      //       }
      //     }
      // );





      // /MUSIC
      // /MOVIES
      // /LIKES

      // const endpointURL = 'https://tastedive.com/api/similar';
// function getDataFromTasteDive(endpointURL, likesArray, callback) {
//     const searchObject = {
//       url: endpointURL,
//       jsonp: 'callback',
//       dataType: 'jsonp',
//       data: {
//         k: '333678-Relevant-QTGONVOF',
//         q: {},
//         // type: 'shows',
//         info: 0,
//         limit: 15
//       },
//       success: callback
//     }

//     $.ajax(searchObject);
//   }




// for(let i=0;i<likesArray.length; i++) {
// fetch('https://tastedive.com/api/similar?q=' + likesArray[i])
//     .then(response => {
//       if(response.ok) return response.json();
//       throw new Error(response.statusText)  // throw an error if there's something wrong with the response
//     })
//     .then(function handleData(data) {
//         // your happy data goes here
//     }) 
//     .catch(function handleError(error) {
//         // handle errors here
//     }) 
// }

// const getDataFromTasteDiveApi = (searchFor, searchType, callback) => {
//     let query = {
//         type: searchType,
//         k: ApiKeys.TASTEDIVE,
//         q: searchFor,
//         limit: tasteDiveQueryLimit,
//         info: 1
//     };

//     $.getJSON(Urls.TASTEDIVE, query, callback);


//_____________________________________KEY_____________________
//"268947-MichaelA-E3LYSMFS&"
// 333678-Relevant-QTGONVOF
