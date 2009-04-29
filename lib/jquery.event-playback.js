
// EventPlayback - Copyright (c) 2009 TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

(function($){
  
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
  
  /**
   * EventRecorder constructor.
   * 
   * Options:
   *   - dom                 dom element for context
   *   - delay               duration to delay before starting recording
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
      delay : 500
    }, options || {})
  }
  
  // --- EventRecorder
  
  EventRecorder.prototype = {
    
    /**
     * Encode _input_ as JSON.
     *
     * @param  {mixed} input
     * @return {string}
     * @api public
     */
    
    encodeJSON : function(input) {
      if (!input) return 'null'
      switch (input.constructor) {
        case String: return '"' + input.replace(/"/gm, '\\"') + '"'
        case Number: return input.toString()
        case Array :
          var buf = []
          for (i in input)
            buf.push(this.encodeJSON(input[i]))
              return '[' + buf.join(',') + ']'
        case Object:
          var buf = []
          for (k in input)
            buf.push(k + ':' + this.encodeJSON(input[k]))
              return '{' + buf.join(', ') + '}'
        default:
          return 'null'
      }
    },
    
    /**
     * Export to a string of JSON.
     *
     * @return {string}
     * @api public
     */
    
    exportJSON : function() {
      if (this.running) throw 'EventRecorder: cannot export while running'
      return '(' + this.encodeJSON({ frames : this.frames }) + ')'
    },
    
    /**
     * Pack a frame.
     *
     * This method compresses a frame, ensuring that it 
     * will be light enough to be exported.
     *
     * @param  {event} e
     * @return {hash}
     * @api private
     */
    
    packFrame : function(e) {
      return {
        x : e.pageX,
        y : e.pageY,
        type : e.type,
        target : this.getElementXPath(e.target),
        value : e.type == 'change' ? $(e.target).val() : null
      }
    },
    
    /**
     * Return XPath for _elm_.
     *
     * @param  {object} elm
     * @return {string}
     * @api public
     */
    
     getElementXPath : function(elm) {
       for (segs = []; elm && elm.nodeType == 1; elm = elm.parentNode) {
         if (elm.hasAttribute('id')) {
           segs.unshift('id("' + elm.getAttribute('id') + '")')
           return segs.join('/')
         }
         else if (elm.hasAttribute('class'))
           segs.unshift(elm.localName.toLowerCase() + '[@class="' + elm.getAttribute('class') + '"]')
         else {
           for (i = 1, sib = elm.previousSibling; sib; sib = sib.previousSibling)
             if (sib.localName == elm.localName) i++
           segs.unshift(elm.localName.toLowerCase() + '[' + i + ']')
         }
       }
       return segs.length ? '/' + segs.join('/') : null
     },
    
    /**
     * Start recording events.
     *
     * @return {EventRecorder} this
     * @api private
     */
    
    startRecording : function() {
      var self = this
      $.each(['click', 'mousemove', 'change'], function(i, type){
        self.options.dom.bind(type, function(e){
          if (self.running) self.frames.push(self.packFrame(e))
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
      setTimeout(function(){
        self.running = true
        self.startRecording()
        if (self.options.duration)
          setTimeout(function(){ self.stop() }, self.options.duration)
      }, this.options.delay)
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
     * Unpack a frame which has been packed by EventRecorder#packFrame().
     *
     * @param  {hash} frame
     * @return {hash}
     * @api public
     */
    
    unpackFrame : function(frame) {
      frame.xpath = frame.target
      frame.target = $(this.getElementByXPath(frame.target))
      return frame
    },
    
    /**
     * Return an element by XPath of _path_.
     *
     * @param  {string} path
     * @return {object}
     * @api public
     */
    
    getElementByXPath : function(path) {
      result = document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
      return result.singleNodeValue
    },
    
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
      var self = this
      newPath = this.lastPath != frame.xpath
      
      // Position
      
      this.cursor.css({
        left : frame.x,
        top  : frame.y
      })
      
      // Utilities
      
      trigger = function(type) {
        self.trigger(type, frame.target)
      }
      
      triggerLast = function(type) {
        self.trigger(type, $(self.getElementByXPath(self.lastPath)))
      }
      
      // Event emulation
      
      switch (frame.type) {
        case 'click': 
          this.cursor.addClass('clicking')
          this.showDisc()
          trigger('click')
          break
        
        case 'mousemove':
          trigger('mouseover')
          if (newPath) triggerLast('mouseout')
          break
          
        case 'change':
          trigger('change')
          frame.target.val(frame.value)
          break
      }
      
      // GC
      
      if (this.cursor.hasClass('clicking')) {
        this.cursor.removeClass('clicking')
        this.hideDisc()
      }
      
      this.lastPath = frame.xpath
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
      if (this.options.trigger && target) target.trigger(type)
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
        if (frame = self.session.frames.shift()) self.playFrame(self.unpackFrame(frame))
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