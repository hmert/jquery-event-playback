
// EventPlayback - Copyright (c) 2009 TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

(function($){
  
  $.recordEvents = function(options) {
    return (new EventRecorder(options)).start()
  }
  
  $.playbackEvents = function(session, options) {
    return (new EventPlayer(session, options)).start()
  }
    
  EventRecorder = function(options) {
    this.frames = []
    this.options = $.extend({
      dom : document,
      recordMouseEvents : true
    }, options || {})
  }
  
  EventRecorder.prototype = {
    startRecordingMouseEvents : function() {
      var self = this
      $.each('click mousemove'.split(' '), function(i, type){
        $(self.options.dom).bind(type, function(e){
          self.frames.push(e)
        })
      })
    },
    
    stop : function() {
      if (this.options.finished instanceof Function)
        this.options.finished.call(this)
    },
    
    start : function() {
      var self = this
      this.startRecordingMouseEvents()
      if (this.options.duration)
        setTimeout(function(){ self.stop() }, this.options.duration)
      return this
    }
  }
  
  EventPlayer = function(session, options) {
    this.session = session
    this.options = $.extend({
      dom : $('body'),
      interval : 10
    }, options || {})
  }
  
  EventPlayer.prototype = {
    playFrame : function(frame) {
      $(this.cursor).css({
        left : frame.pageX,
        top  : frame.pageY
      })
    },
    
    play : function() {
      var self = this
      this.intervalID = setInterval(function(){
        if (frame = self.session.frames.shift())
          self.playFrame(frame)
      }, this.options.interval)
    },
    
    stop : function() {
      clearInterval(this.intervalID)
      this.removeCursor()
      if (this.options.finished instanceof Function)
        this.options.finished.call(this)
    },
    
    removeCursor : function() {
      $('#event-playback-cursor', this.dom).fadeOut('slow', function(){
        $(this).remove()
      })
    },
    
    displayCursor : function() {
      this.cursor = $('<div id="event-playback-cursor" style="position: absolute;">([o.o])</div>')
      $(this.options.dom).prepend(this.cursor)
    },
    
    start : function() {
      var self = this
      this.play()
      this.displayCursor()
      if (this.options.duration)
        setTimeout(function(){ self.stop() }, this.options.duration)
      return this
    }
  }
  
})(jQuery)

$(function(){
  $.recordEvents({ duration: 2000, finished : function(){
    $.playbackEvents(this, { duration : 2000, finished : function() {
      console.log('finished playback');
    }})
  }})
})
