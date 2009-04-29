
$(function(){
  $('input[type=button]').click(function() {
    $(this).attr('value', $(this).attr('value') + '.')
  })
  .hover(function(){
    $(this).css('font-weight', 'bold')
  }, function(){
    $(this).css('font-weight', 'normal')
  })
  
  log = function(message) {
    $('#log').val($('#log').val() + "\n" + message)
  }
  
  $('#start').click(function(){
    $('#log').val('')
    $('#export').val('')
    duration = parseInt($('#seconds').val()) * 1000
    log('Started recording: ' + duration + 'ms')
    $.recordEvents({ duration: duration, finished : function(){
      $('#export').val(this.export())
      log('Finished recording')
      $.playbackEvents(this, { interval : 25, finished : function() {
        log('Playback finished')
      }})
    }})
  })
  
})