
$(function(){
  $('input[type=button]').click(function() {
    $(this).attr('value', $(this).attr('value') + '.')
  })
  
  $('#start').click(function(){
    duration = parseInt($('#seconds').val()) * 1000
    $.recordEvents({ duration: duration, finished : function(){
      $('#export').val(this.export())
      $.playbackEvents(this, { interval : 25, finished : function() {
        
      }})
    }})
  })
  
})