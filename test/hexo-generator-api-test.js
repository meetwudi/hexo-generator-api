var Lab = require('lab')
var Code = require('code')

var lab = exports.lab = Lab.script()
var describe = lab.describe
var it = lab.it
var expect = Code.expect;

var Hexo = require('hexo');
global.hexo = new Hexo(__dirname, {silent: true});

require('..')


describe('hexo-generator-api', function(){

    var generator = hexo.extend.generator;

    describe('should register generator', function() {
        it('register category_transform', function(done) {
            var gen = generator.get('api');
            expect(gen).to.exist()

            done()
        });
    });

});
