Zeddemore
=========

A file-conf wrapper around Winston

### Motivation

I'm used to handle configuration of logging with text file, but could not find a way to do it with Winston: so I wrote this module.

### How does it works

At startup the module reads the specified file in the main directory of the project, reads it (synchromously, as this should happen only on startup and we want everything setup before running anything else) and instantiate winston loggers according to configuration. Loggers can then be retrieved with `zeddemore.get('<loggerName>')`


### Configuration Example


        {

            "colors": {
                "foo": "blue",
                "bar": "green",
                "baz": "yellow",
                "foobar": "red"
            },
            "loggers": {
                "myLogger": {
                    "transports": {
                        "file": {
                            "filename": "somefile.log",
                            "level": "foo",
                            "label": "foo"
                            "handleExceptions": true
                        },
                        "console": {
                            "colorize": true
                        }
                    },
                    "levels": {
                        "foo": 0,
                        "bar": 1,
                        "baz": 2,
                        "foobar": 3
                    },
                    "exitOnError": false
                }
            }
        }

### Usage example

        var logMgr   = require('zeddemore')(__dirname + '/logging.conf');
        var myLogger = logMgr.get('myLogger');

        // after setting level foo, as in above config
        myLogger.foo("Can you see the fnord?");

