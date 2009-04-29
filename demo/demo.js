
$(function(){
  $('input[type=button]').click(function() {
    $(this).attr('value', $(this).attr('value') + '.')
  })
  
  $.recordEvents({ duration: 5000, finished : function(){
    console.log('Recording finished');
    $.playbackEvents(this, { interval : 25, finished : function() {
      console.log('Playback finished');
    }})
  }})
  
})