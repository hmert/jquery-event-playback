
$(function(){
  $('input[type=button]').click(function() {
    $(this).attr('value', $(this).attr('value') + '.')
  })
  
  $.recordEvents({ duration: 2000, finished : function(){
    console.log('Recording finished');
    $('#export').val(this.export())
    $.playbackEvents(this, { interval : 25, finished : function() {
      console.log('Playback finished');
    }})
  }})
  
})