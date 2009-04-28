
$(function(){
  var step = 0
  $('.example').hide()
  $('input[type=button]').click(function() {
    switch (++step) {
      case 1:
        $('.e1').show()
        $('.main').slideDown('slow')
        $(this).attr('value', 'Continue')
        break
        
      case 2:
        $('.e1').slideUp('slow')
        $('.e2').slideDown('slow')
        $(this).attr('value', 'Continue.')
        break
        
      case 3:
        $('.e2').slideUp('slow')
        $('.e3').slideDown('slow')
        $(this).attr('value', 'Continue..')
        break

      case 4:
        $('.e3').slideUp('slow')
        $('.e4').slideDown('slow')
        $(this).attr('value', 'Continue...')
        break
        
      case 5:
        $('.e4').hide('slow')
        $('.main').slideUp('slow')
        $(this).attr('value', 'Start Demo')
        step = 0
    }
  })
  
  $.recordEvents({ duration: 8000, finished : function(){
    $.playbackEvents(this, { interval : 15, finished : function() {
    }})
  }})
  
})