
$(function(){
  $('input[value=Button]').click(function() {
    $(this).attr('value', 'Pressed')
  })
  
  .hover(function(){
    $(this).css('font-weight', 'bold')
  }, function(){
    $(this).css('font-weight', 'normal')
  })
  
  log = function(message) {
    $('#log').val($('#log').val() + "\n" + message)
  }

  $('#replay').click(function() {
    session = eval($('#export').val())
    interval = parseInt($('#interval').val())
    log('Started playback with interval of ' + interval + 'ms')
    $.playbackEvents(session, { interval : interval, finished : function(){
      log('Finished playback')
    }})
  })
  
  $('#start').click(function(){
    $('#log').val('')
    $('#export').val('')
    duration = parseInt($('#seconds').val()) * 1000
    log('Started recording: ' + duration + 'ms')
    $.recordEvents({ duration: duration, finished : function(){
      $('#export').val(this.exportJSON())
      log('Finished recording')
    }})
  })
  
})