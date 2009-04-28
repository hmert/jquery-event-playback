
// EventPlayback - Copyright (c) 2009 TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

(function($){
  
  EventRecorder = function(options) {
    this.events = []
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
          self.events.push(e)
        })
      })
    },
    
    finish : function() {
      if (this.options.finished instanceof Function)
        this.options.finished.call(this)
    },
    
    start : function() {
      var self = this
      this.startRecordingMouseEvents()
      if (this.options.duration)
        setTimeout(function(){ self.finish() }, this.options.duration)
      return this
    }
  }
 
  $.recordEvents = function(options) {
    return (new EventRecorder(options)).start()
  } 
  
})(jQuery)

sess = $.recordEvents({ duration: 1000, finished : function(){
  console.log(sess);
}})
