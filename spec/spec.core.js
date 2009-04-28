
$(function(){
  $.recordEvents({ duration: 6000, finished : function(){
    console.log('finished recording');
    $.playbackEvents(this, { interval : 20, finished : function() {
      console.log('finished playback');
    }})
  }})
})

describe 'jQuery'
  describe '.recordEvents()'
    it 'should should respond to recordEvents'
      jQuery.should.respond_to 'recordEvents'
    end
  end
  
  describe '.playbackEvents()'
    it 'should respond to playbackEvents'
      jQuery.should.respond_to 'playbackEvents'
    end
  end
end