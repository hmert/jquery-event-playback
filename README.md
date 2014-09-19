# jQuery EventPlayback [![Build Status](https://secure.travis-ci.org/hmert/jquery-event-playback.svg?branch=master)](https://travis-ci.org/hmert/jquery-event-playback) ![Bower Version](https://badge.fury.io/bo/jquery-event-playback.svg)

### What is this

Record and play back events using jQuery.

### Features

* No external dependencies (jQuery only)
* Record events
* Play back recorded sessions
* Playback speed
* Export / Import JSON sessions
* Emulates:
  - mouse movement / speed
  - hovering
  - input value changes

## Usage

1. Include jQuery:

	```html
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>
	```

2. Include plugin's code:

	```html
	<script src="dist/jquery.boilerplate.min.js"></script>
	```

3. Call the plugin:
Below is a simple example which records events for 5 seconds, then automatically
plays the session back when finished.

	```javascript
	
  $.recordEvents({ duration: 5000 }, function(){
    $.playbackEvents(this, { interval : 25 })
  })
```
You may also load static sessions using jQuery's getJSON method:
```javascript
  $.getJSON('sessions/demo.json', function(session){
    $.playbackEvents(session, { interval : 20 })
  })
```
Saving a session might look similar to this:
```javascript
  $.recordEvents({ duration: 5000 }, function(){
    session = this.export()
    // Do a POST to server to save the session
  }) 

	```

## Structure

The basic structure of the project is given in the following way:

```
├── demo/
│   └── index.html
├── dist/
│   ├── jquery.boilerplate.js
│   └── jquery.boilerplate.min.js
├── src/
│   ├── jquery.boilerplate.coffee
│   └── jquery.boilerplate.js
├── .editorconfig
├── .gitignore
├── .jshintrc
├── .travis.yml
├── boilerplate.jquery.json
├── Gruntfile.js
└── package.json
```

## Contributing

Check [CONTRIBUTING](https://github.com/hmert/jquery-event-playback/blob/master/CONTRIBUTING.md) for more information.

## History

Check [releases](https://github.com/hmert/jquery-event-playback/releases) for detailed changelog.

## License

(The MIT License)

Copyright (c) 2009 TJ Holowaychuk <tj@vision-media.ca>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
