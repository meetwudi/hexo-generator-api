var path = require('path'),
  _ = require('underscore'),
  url = require('url');

var baseUrl = '/api',
  allPosts;

// Utilities
function listName(apiPage) {
  if (apiPage === 1) {
    return 'list.json';
  }
  else {
    return 'list-' + apiPage + '.json';
  }
}

function listPath(apiPage) {
  return path.resolve(baseUrl, 'list', listName(apiPage));
}

function listUrl(apiPage) {
  return url.resolve(hexo.config.url, listPath(apiPage));
}

function postPath(post) {
  return path.resolve(baseUrl, 'posts/' + post._id + '.json');
}

function postUrl(post) {
  return url.resolve(hexo.config.url, 'api/posts/' + post._id + '.json');
}

function startIdx(apiPage, postsPerPage) {
  return (apiPage - 1) * postsPerPage;
}

function endIdx(apiPage, postsPerPage) {
  return apiPage * postsPerPage;
}

function makePost(post, inList) {
  var result = _.pick(post, 'title', 'permalink');
  result.date = post.date._i;
  if (inList) {
    //post in list
    result.url = postUrl(post);
  }
  else {
    //post detail
    result.raw = post.raw;
  }
  return result;
}




function generateList(locals) {
  // list generation
  // get all posts
  var postsPerPage = hexo.config['api_posts_per_page'] || 10,
    apiPage = 1,
    curPosts;
  while (startIdx(apiPage, postsPerPage) < allPosts.length) {
    curPosts = _.filter(allPosts, function(post, idx) { 
      // pagination
      return startIdx(apiPage, postsPerPage) <= idx && endIdx(apiPage, postsPerPage) > idx;
    });
    result = {
      'prev': null,
      'next': null
    };
    result.posts = _.map(curPosts, function(post) {
      return makePost(post, true);
    });
    // check for prev page 
    if (apiPage > 1) {
      result.prev = listUrl(apiPage - 1);
    }
    // check for next page
    if (startIdx(apiPage + 1, postsPerPage) < allPosts.length) {
      result.next = listUrl(apiPage + 1);
    }
    // write to file
    hexo.route.set(listPath(apiPage), JSON.stringify(result));
    apiPage ++;
  }
}

function generatePosts(locals) {
  _.each(allPosts, function(post) {
    var result = makePost(post, false);
    hexo.route.set(postPath(post), JSON.stringify(result));
  });
}

hexo.extend.generator.register('api', function(locals, render, callback) {
  allPosts = locals.posts.toArray();
  generateList(locals);
  generatePosts(locals)
  callback();
});