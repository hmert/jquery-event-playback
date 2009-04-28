
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
      dom : $(document),
      recordMouseEvents : true
    }, options || {})
  }
  
  EventRecorder.prototype = {
    supportedEvents : ['click', 'mousemove'],
    
    startRecordingMouseEvents : function() {
      var self = this
      $.each(this.supportedEvents, function(i, type){
        self.options.dom.bind(type, function(e){
          if (!self.running) return
          self.frames.push(e)
        })
      })
    },
    
    stop : function() {
      this.running = false
      if (this.options.finished instanceof Function)
        this.options.finished.call(this)
    },
    
    start : function() {
      var self = this
      this.running = true
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
      interval : 25
    }, options || {})
  }
  
  EventPlayer.prototype = {
    
    /**
     * Play a single frame.
     *
     * This method does several things:
     *   - reposition cursor
     *   - emulate clicks by showing the indication disk
     *
     * @param  {event} frame
     * @api private
     */
    
    playFrame : function(frame) {
      this.cursor.css({
        left : frame.pageX,
        top  : frame.pageY
      })
      
      switch (frame.type) {
        case 'click': 
          this.cursor.addClass('clicking')
          this.showDisc()
          break
          
        default:
          if (this.cursor.hasClass('clicking')) {
            this.cursor.removeClass('clicking')
            this.hideDisc()
          }
      }
    },
    
    /**
     * Show the indication disc with optional
     * _color_ which defaults to blue.
     *
     * @param  {string} color
     * @api public
     */
    
    showDisc : function(color) {
      this.disc.addClass(color || 'blue').fadeIn(150)
    },
    
    /**
     * Hide the indication disc.
     *
     * @api public
     */
    
    hideDisc : function() {
      this.disc.fadeOut(150, function(){
        $(this).
          removeClass('yellow').
          removeClass('blue').
          removeClass('red')
      })
    },
    
    /**
     * Step through the frames, playing each one
     * until the duration or end of frames has been
     * reached.
     *
     * @api private
     */
    
    play : function() {
      var self = this
      this.intervalID = setInterval(function(){
        if (frame = self.session.frames.shift()) self.playFrame(frame)
        else self.stop()
      }, this.options.interval)
    },
    
    /**
     * Hide and remove the cursor.
     *
     * @api private
     */
    
    removeCursor : function() {
      $('#event-playback-cursor', this.dom).fadeOut('slow', function(){
        $(this).remove()
      })
    },
    
    /**
     * Generate and display cursor element.
     *
     * @api private
     */
    
    displayCursor : function() {
      this.cursor = $('<div id="event-playback-cursor"><div class="disc"></div></div>')
      this.disc = $('.disc', this.cursor)
      this.options.dom.prepend(this.cursor)
      this.cursor.fadeIn('slow');
    },
    
    /**
     * Stop playback.
     *
     * This method removes the cursor and calls
     * the finished callback if present.
     *
     * @api public
     */
    
    stop : function() {
      this.running = false
      clearInterval(this.intervalID)
      this.removeCursor()
      if (this.options.finished instanceof Function)
        this.options.finished.call(this)
    },
        
    /**
     * Start playback.
     *
     * @return {EventPlayer}
     * @api public
     */
    
    start : function() {
      var self = this
      this.running = true
      this.play()
      this.displayCursor()
      if (this.options.duration)
        setTimeout(function(){ self.stop() }, this.options.duration)
      return this
    }
  }
  
})(jQuery)
