zeddemore = require(__dirname + '/../lib/zeddemore')(__dirname + '/test.conf')
chai      = require 'chai'
expect    = chai.expect
fs        = require 'fs'
_         = require 'underscore'


describe('zeddemore', () =>

    it('loads config from file', (done) =>
        fs.readFile(__dirname + '/test.conf', (err, data) =>
            if (err)
                throw err
            else
                expect(zeddemore.getConfig()).to.be.eql(JSON.parse(data))
            done())
    )

    it('instantiate loggers as singletons', () =>
        logger  = zeddemore.get('myLogger')
        logger2 = zeddemore.get('myLogger')
        expect(logger).to.be.an('object')
        expect(logger).to.be.equal(logger2)
    )

    it('logs according to configuration', (done) =>
        logger = zeddemore.get('myLogger')
        logger.foo("This is a blue foo message prefixed with date, labeled MSG")
        originalException = process.listeners('uncaughtException').pop()
        process.removeListener('uncaughtException', originalException);
        process.nextTick => throw new Error "Error handled by logger"
        process.nextTick =>
                process.listeners('uncaughtException').push(originalException)
                done()
    )
)