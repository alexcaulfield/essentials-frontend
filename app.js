var spotifyApi;

function getAuth() {
	$.get("http://localhost:5000/", function(data) {

        authorization_window = window.open(
            data,
            '_blank'
        );
	});
}

function createPlaylist() {
    var artistName = document.getElementById('artist').value;
    var playlistName = document.getElementById('playlist').value;
    $.get("http://localhost:5000/findArtist", {artistName: artistName, playlistName: playlistName})
     .done(function(data) {
        console.log(data);
    });
}


var topTracks = [];
var topTracksInfo = [];
var trackDanceability = [];
var trackValence = [];
var dps = [];

/*
 * Pick song moods -> take happy dancy song (jam out song), happy not dancy (relaxed song), not happy dancy (workout), not happy not dancy (lol)
 */

makeChart = function(danceability, valence) {
    var chart = new CanvasJS.Chart("chartContainer", {
            title: {
                text: "Your Listening Preferences"
            },
            data: [{
                type: "scatter",
                dataPoints: dps
            }]
        });
    for (var j = 0; j < danceability.length; j++) {
        xVal = danceability[j];
        yVal = valence[j];
        console.log(danceability);
        dps.push({
            x: xVal,
            y: yVal
        });
    }
    console.log(dps);
    chart.render();
};

function userInfo() {
    $.get("http://localhost:5000/", function(data) {
        $.get("http://localhost:5000/userInfo", function(accessToken) {
              $.ajax({
                url: 'https://api.spotify.com/v1/me/top/tracks',
                headers: {
                  'Authorization': 'Bearer ' + accessToken
                },
                success: function (response) {
                    topTracks = response.items;
                    for (var i = 0; i < topTracks.length; i++) {
                        $.get("http://localhost:5000/trackInfo", {id: topTracks[i].id} )
                            .done(function(response) {
                                topTracksInfo.push(response);
                                // dps.push({
                                //     x: Math.round(response.danceability * 100),
                                //     y: Math.round(response.valence * 100)
                                // });
                                trackDanceability.push(Math.round(response.danceability * 100));
                                trackValence.push(Math.round(response.valence * 100));
                            });
                    }
                    // console.log(topTracks);
                    // console.log(topTracksInfo);
                    console.log(trackDanceability);
                    console.log(trackValence);
                    makeChart(trackDanceability, trackValence);
                },
                error: function (response) {
                  console.log("ERROR: could not get top tracks");
                }
              });
        });
    });
}