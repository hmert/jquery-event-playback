
// EventPlayback - Copyright (c) 2009 TJ Holowaychuk <tj@vision-media.ca> (MIT Licensed)

(function($){
  
  EventRecorder = function(dom, options) {
    this.dom = dom
    this.options = $.extend({
      recordMouseEvents : true
    }, options || {})
  }
  
  EventRecorder.prototype = {
    startRecordingMouseEvents : function() {
      
    },
    
    start : function() {
      this.startRecordingMouseEvents()
      return this
    }
  }
 
  $.recordEvents = function(options) {
    return (new EventRecorder(document, options)).start()
  } 
  
})(jQuery)