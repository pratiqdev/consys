import assert from 'assert'
import consys from '../index.js'
import { expect } from 'chai';

const heading = (text) => `${text}\n  ${'-'.repeat(text.length)}`

describe(heading('A | Basic Config / Options Tests'), () => {

  describe('required parameters', () => {
    
    it('A | 1 | should return basic callback if no config or options provided', () => {
        let options = null
        let config = null

        const testA = consys((s) => s, config, options)

        assert.equal(typeof testA, 'function')
    });

    it('A | 2 | should return basic callback with config but no options', () => {
        let options = null
        let config = {
            name:  { _type: 'string' }
        }

        const testA = consys((s) => s, config, options)

        assert.equal(typeof testA, 'function')
    });

    it('A | 3 | should return a callback with parsed settings when config provided', () => {
        let options = null
        let config = {
            name:  { _type: 'string' }
        }

        const testA = consys((s) => s, config, options)
        const result = testA({name: 'Bob'})

        assert.equal(typeof testA, 'function')
        assert.equal(typeof result.name, 'string')
        assert.equal(result.name, 'Bob')
    });

    it('A | 4 | should throw error if called without required arg', () => {
        let options = null
        let config = {
            name: 'string'
        }

        const testA = consys((s) => s, config, options)

        expect(() => testA()).to.throw('Config item "name" is required')
    });


  });


});




describe(heading('Root config types'), () => {

    describe('number parameters', () => {
      
        it('should convert string declaration into config object', () => {
            let options = null
            let config = {
              age1: 'number',
              age2: 'num',
              age3: 'n',
              age4: 'int',
              age5: 'integer',
            }
    
            const testA = consys((s) => s, config, options)
            const res = testA({
                age1: 11,
                age2: 11,
                age3: 11,
                age4: 11,
                age5: 11,
            })
    
            assert.equal(typeof testA, 'function')
            assert.equal(res.age1, 11)
            assert.equal(res.age2, 11)
            assert.equal(res.age3, 11)
            assert.equal(res.age4, 11)
            assert.equal(res.age5, 11)
      
        });

        it('Should throw if requirement not met', () => {
            const testA = consys((s) => s, {age: 'number'})
            const testB = consys((s) => s, {age: {
                _type: 'number',
                _required: true
            }})

            expect(() => testA()).to.throw('Config item "age" is required')
            expect(() => testB()).to.throw('Config item "age" is required')
        })
  
        it('Should use _max if exceeded using option: { clampRange: true }', () => {
          let options = {
              clampRange: true,
          }
          let config = {
              age: {
                  _type: 'number',
                  _max: 2
              }
          }
    
          const testA = consys((s) => s, config, options)
          const res = testA({age: 99})
  
          expect(res.age).to.equal(2)
        })

        it('Should use _min if exceeded using option: { clampRange: true }', () => {
            let options = {
                clampRange: true,
            }
            let config = {
                age: {
                    _type: 'number',
                    _min: 11
                }
            }
      
            const testA = consys((s) => s, config, options)
            const res = testA({age: 0})
    
            expect(res.age).to.equal(11)
        })

        it('Should use default value if exists', () => {
            const testA = consys((s) => s, {age: {
                _default: 7
            }})

            const res = testA()
            expect(res.age).to.equal(7)

        })

    });

    describe('string parameters', () => {
      
        it('should convert string declaration into config object', () => {
            let options = null
            let config = {
                name: 'string'
            }
    
            const testA = consys((s) => s, config, options)
            const res = testA({name: 'Bob'})
    
            assert.equal(typeof testA, 'function')
            assert.equal(res.name, 'Bob')
        
            expect(() => testA()).to.throw('Config item "name" is required')

        });

        it('Should throw if requirement not met', () => {
            const testA = consys((s) => s, {name: 'string'})
            const testB = consys((s) => s, {name: {
                _type: 'string',
                _required: true
            }})

            expect(() => testA()).to.throw('Config item "name" is required')
            expect(() => testB()).to.throw('Config item "name" is required')
        })

        it('Should limit strings longer than _max with option { trimStrings: true }', () => {
            let options = {
                trimStrings: true,
            }
            let config = {
                name: {
                    _type: 'string',
                    _max: 2
                }
            }
    
            const testA = consys((s) => s, config, options)
            const res = testA({name: 'Robert'})

            expect(res.name).to.equal('Ro')
        })

        it('Should use default value if exists', () => {
            const testA = consys((s) => s, {
                name: {
                    _type: 'string',
                    _default: 'Default'
                }
            })
            const res = testA()
            expect(res.name).to.equal('Default')

        })
  
    });
  
  
});




describe(heading('Complex Nesting'), () => {

    describe('Nested parameter defaults', () => {
      
        it('Sets default in object at depth: 1', () => {
            const test_808234943543 = consys((s) => s, {
                property: {
                    _type: 'string',
                    _default: 'Default'
                }
            })
            const res = test_808234943543()
            console.log(res)
            expect(res.property.owner).to.equal('Default')

        }) 
        
        it.skip('Sets defaults in object at depth: 2', () => {
            const testA = consys((s) => s, {
                person: {
                    name: {
                        _type: 'string',
                        _default: 'Default'
                    },
                    age: {
                        _type: 'number',
                        _default: 90
                    }
                }
            })

            const res = testA()
            expect(res.person.name).to.equal('Default')
            expect(res.person.age).to.equal(90)

            console.log([
                '\t==========================================================',
                '\t| There is currently an issue with assigning defaults to',
                '\t| nested properties when the parent does not yet exist in',
                '\t| the argStore, or is not provided in the arguments object',
                '\t==========================================================',
            ].join('\n'))

        })
     

    });

  
});
