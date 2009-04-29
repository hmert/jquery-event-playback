
// EventPlayback - Copyright (c) 2009 TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

(function($){
  
  // TODO: record everything, playback only specified events play.mouse.all or play.mouse.mouseover
  
  this.EventPlayback = { version : '0.0.1' }
  
  /**
   * Record events with _options_.
   *
   * Examples:
   *
   *   $.recordEvents({ duration : 3000, finished : function(){
   *     $.playbackEvents(this)
   *   }})
   *
   * @param  {hash} options
   * @return {EventRecorder}
   * @api public
   */
  
  $.recordEvents = function(options) {
    return (new EventRecorder(options)).start()
  }
  
  /**
   * Playback events in _session_, with _options_.
   *
   * @param  {EventRecorder} session
   * @param  {hash} options
   * @return {EventPlayer}
   * @api public
   */
  
  $.playbackEvents = function(session, options) {
    return (new EventPlayer(session, options)).start()
  }
  
  var supportedEvents = {
    mouse : ['click', 'mousemove']
  }
  
  /**
   * EventRecorder constructor.
   * 
   * Options:
   *   - dom                 dom element for context
   *   - duration            recording duration in milliseconds
   *   - finished            callback function
   *
   * @param  {hash} options
   * @return {EventRecorder}
   * @api public
   */
       
  EventRecorder = function(options) {
    this.frames = []
    this.options = $.extend({
      dom : $(document),
      recordMouseEvents : true
    }, options || {})
  }
  
  // --- EventRecorder
  
  EventRecorder.prototype = {
    
    normalizeFrame : function(e) {
      return {
        x : e.pageX,
        y : e.pageY,
        type : e.type,
        target : this.getElementXPath(e.target)
      }
    },
    
    getElementXPath : function(elm) {
      path = ''
      for (; elm && elm.nodeType == 1; elm = elm.parentNode) {
        i = this.getElementIndex(elm)
        xname = elm.tagName
        if (i > 1) xname += '[' + i + ']'
        path = '/' + xname + path
      }
      return path
    },

    getElementIndex : function(elm) {
      i = 1
      for (sib = elm.previousSibling; sib; sib = sib.previousSibling)
        if (sib.nodeType == 1 && sib.tagName == sib.tagName) i++
      return i
    },
    
    /**
     * Start recording of mouse events.
     *
     * @return {EventRecorder} this
     * @api private
     */
    
    startRecordingMouseEvents : function() {
      var self = this
      $.each(supportedEvents.mouse, function(i, type){
        self.options.dom.bind(type, function(e){
          if (self.running) self.frames.push(self.normalizeFrame(e))
        })
      })
      return this
    },
    
    /**
     * Stop recording and call finished
     * callback when present.
     *
     * @return {EventRecorder} this
     * @api public
     */
    
    stop : function() {
      this.running = false
      if (this.options.finished instanceof Function)
        this.options.finished.call(this)
      return this
    },
    
    /**
     * Start recording.
     *
     * @return {EventRecorder} this
     * @api public
     */
    
    start : function() {
      var self = this
      this.running = true
      this.startRecordingMouseEvents()
      if (this.options.duration)
        setTimeout(function(){ self.stop() }, this.options.duration)
      return this
    }
  }
  
  // --- EventPlayer
  
  /**
   * EventPlayer constructor.
   * 
   * Options:
   *   - dom        dom element for context
   *   - interval   playback interval in milliseconds
   *   - duration   playback duration in milliseconds
   *   - trigger    should events such as clicks be triggered on their targets
   *   - finished   callback function
   *
   * @param  {EventRecorder} session
   * @param  {hash} options
   * @return {EventPlayer}
   * @api public
   */
  
  EventPlayer = function(session, options) {
    this.session = session
    this.options = $.extend({
      dom : $('body'),
      trigger : true,
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
     * @return {EventPlayer} this
     * @api private
     */
    
    playFrame : function(frame) {
      this.cursor.css({
        left : frame.x,
        top  : frame.y
      })
      
      switch (frame.type) {
        case 'click': 
          this.cursor.addClass('clicking')
          this.showDisc().trigger('click', frame.target)
          break
          
        default:
          if (this.cursor.hasClass('clicking')) {
            this.cursor.removeClass('clicking')
            this.hideDisc()
          }
      }
      
      return this
    },
    
    /**
     * Trigger event _type_ for _target_.
     *
     * This method is used to comply with the trigger
     * option, which when true will allow events to
     * actually be trigger for the associated _target_.
     *
     * @param  {string} type
     * @param  {object} target
     * @return {EventPlayer} this
     * @api private
     */
    
    trigger : function(type, target) {
      if (this.options.trigger) $(target).trigger(type)
      return this
    },
    
    /**
     * Show the indication disc with optional
     * _color_ which defaults to blue.
     *
     * @param  {string} color
     * @return {EventPlayer} this
     * @api public
     */
    
    showDisc : function(color) {
      this.disc.addClass(color || 'blue').fadeIn(150)
      return this
    },
    
    /**
     * Hide the indication disc.
     *
     * @return {EventPlayer} this
     * @api public
     */
    
    hideDisc : function() {
      this.disc.fadeOut(150, function(){
        $(this).
          removeClass('yellow').
          removeClass('blue').
          removeClass('red')
      })
      return this
    },
    
    /**
     * Step through the frames, playing each one
     * until the duration or end of frames has been
     * reached.
     *
     * @return {EventPlayer} this
     * @api private
     */
    
    play : function() {
      var self = this
      this.intervalID = setInterval(function(){
        if (frame = self.session.frames.shift()) self.playFrame(frame)
        else self.stop()
      }, this.options.interval)
      return this
    },
    
    /**
     * Hide and remove the cursor.
     *
     * @return {EventPlayer} this
     * @api private
     */
    
    removeCursor : function() {
      $('#event-playback-cursor', this.dom).fadeOut('slow', function(){
        $(this).remove()
      })
      return this
    },
    
    /**
     * Generate and display cursor element.
     *
     * @return {EventPlayer} this
     * @api private
     */
    
    displayCursor : function() {
      this.cursor = $('<div id="event-playback-cursor"><div class="disc"></div></div>')
      this.disc = $('.disc', this.cursor)
      this.options.dom.prepend(this.cursor)
      this.cursor.fadeIn('slow');
      return this
    },
    
    /**
     * Stop playback.
     *
     * This method removes the cursor and calls
     * the finished callback if present.
     *
     * @return {EventPlayer} this
     * @api public
     */
    
    stop : function() {
      this.running = false
      clearInterval(this.intervalID)
      this.removeCursor()
      if (this.options.finished instanceof Function)
        this.options.finished.call(this)
      return this
    },
        
    /**
     * Start playback.
     *
     * @return {EventPlayer} this
     * @api public
     */
    
    start : function() {
      var self = this
      this.running = true
      this.play().displayCursor()
      if (this.options.duration)
        setTimeout(function(){ self.stop() }, this.options.duration)
      return this
    }
  }
  
})(jQuery)