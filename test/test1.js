import assert from 'assert'
import consys from '../dist/consys.js'

const heading = (text) => `${text}\n  ${'-'.repeat(text.length)}`

describe(heading('Basic Config / Options Tests'), () => {

  describe('# consys | required parameters', () => {
    
    it('should return basic callback if no config or options provided', () => {
        let options = null
        let config = null

        const testA = consys((s) => s, config, options)

        assert.equal(typeof testA, 'function')
    });

    it('should return basic callback with config but no options', () => {
        let options = null
        let config = {
            name:  { type: 'string' }
        }

        const testA = consys((s) => s, config, options)

        assert.equal(typeof testA, 'function')
    });

    it('should return a callback with parsed settings when config provided', () => {
        let options = null
        let config = {
            name:  { type: 'string' }
        }

        const testA = consys((s) => s, config, options)
        const result = testA({name: 'Bob'})

        assert.equal(typeof testA, 'function')
        assert.equal(typeof result.name, 'string')
        assert.equal(result.name, 'Bob')
    });


  });

  describe('# consys | required parameters', () => {
    
  })

});
