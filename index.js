'use strict';


var config = hexo.config;
hexo.extend.generator.register('api', require('./lib/generator'));
