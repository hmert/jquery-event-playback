
$(function(){
  $.recordEvents({ duration: 2000, finished : function(){
    console.log('finished recording');
    $.playbackEvents(this, { duration : 3000, finished : function() {
      console.log('finished playback');
    }})
  }})
})

describe 'jQuery'
  describe '.recordEvents()'
    it 'should should responsd to recordEvents'
      jQuery.should.respond_to 'recordEvents'
    end
  end
end