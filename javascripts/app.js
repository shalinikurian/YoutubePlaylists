define([
  'jQuery', 
  'jQueryUi',
  'underscore',
  'backbone',
  'eventBus',
  'views/YoutubePlayerView'
], function($, $ui, _, Backbone,vent, YoutubePlayer) {
  var initialize = function() {
    YoutubePlayer.initialize();
  };
  
  return {
    initialize: initialize
  };
});
