define([
  'backbone',
  'eventBus'
], function(Backbone, vent){
  var YoutubePlayerView = Backbone.View.extend({
    initialize: function(options) {
      this.apiReady = false;
      this.panelShowing = 0;
      this.vent = vent;
      _.bindAll(this, 'youTubePlayerAPIReady', 'playSong', 'playerReady', 'stateChanged', 'videoEnded', 'apiError');
  
      // Add Youtube script.
      this.vent.bind("YouTubePlayerAPIReady", this.youTubePlayerAPIReady);
      var tag = document.createElement('script');
      tag.src = "http://www.youtube.com/player_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    },
  
    youTubePlayerAPIReady : function() {
    this.apiReady = true;
    },

    playSong: function(song) {
       var songUrl = song.get('song_id');
        if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') {
          window.onYouTubePlayerAPIReady = function() {
            this.loadPlayer(songUrl);
          };
        } else {
          this.loadPlayer(songUrl);
        }
    },

    loadPlayer: function(songUrl) {
       if (this.player) {
         this.player.loadVideoById(songUrl, 0, "large");
       } else {
         this.player = new YT.Player('video_player_container', {
           width: 400,
            height: 280,
            videoId: songUrl,
            events: {
              'onReady': this.playerReady,
              'onPlaybackQualityChange': this.playerReady,
              'onStateChange': this.stateChanged,
              'onError': this.errorz
            }
         });
       }
    },

    playerReady: function(event) {
       this.player.playVideo();
    },
  
    stateChanged: function(event) {
      if (event.data == YT.PlayerState.ENDED) {
        this.videoEnded();
      }
    },
  
    videoEnded: function() {
      // Let other parties know that a video ended.
      console.log("vide ended")
      this.vent.trigger("videoEnded")
    },

    apiError: function(error) {
      alert("Error is " + error);
    }
  });
  
  var YoutubePlayer = null;

  var initializeYoutubePlayer = function() {
    if (YoutubePlayer == null){
        YoutubePlayer = new YoutubePlayerView();
    }
  };

  var getYoutubePlayer = function() {
    console.log("getting youtube player");
    return YoutubePlayer;
  };

  return {
    initialize: initializeYoutubePlayer,
    getYoutubePlayer: getYoutubePlayer
  };
});
