'use strict';
var path = require('path'),
  _ = require('underscore'),
  url = require('url');

var baseUrl =  path.sep + 'api' + path.sep,
    allPosts,
    config,
    data = [];

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
  return path.join(baseUrl, 'list', listName(apiPage));
}

// Name JSON file recent.json
function recentPath(apiPage) {
  return path.join(baseUrl, 'list', 'recent.json');
}

function listUrl(apiPage) {
  return url.resolve(config.url, listPath(apiPage));
}

function postPath(post) {
  return path.join(baseUrl, 'posts/' + post._id + '.json');
}

function postUrl(post) {
  return url.resolve(config.url, 'api/posts/' + post._id + '.json');
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
    if (config.api_raw) {
      // Set up new variables
      var postRaw = post.raw,
          postBody;

      // Split post at front matter seperator '---'
      postRaw = postRaw.split('---');

      // Set body post to second part of array, first part being only front matter
      postBody = postRaw[1];

      // Incase user has used the front matter trigger anywhere else in the post
      // recombine the rest of postRaw with postBody, still ignoring the front matter
      if (postRaw.length > 1) {
        for (var i = 2; i < postRaw.length; i++) {
          // We have to append the seperator '---' before recombining since it will be
          // removed in the split
          postBody += '---' + postRaw[i];
        }
      }
      //post detail
      result.raw = postBody;
    } else {
      result.content = post.content;
    }
  }
  return result;
}

function generateList() {
  // list generation
  // get all posts
  var postsPerPage = config.api_posts_per_page || 10,
    apiPage = 1,
    curPosts;
  while (startIdx(apiPage, postsPerPage) < allPosts.length) {
    curPosts = _.filter(allPosts, function(post, idx) {
      // pagination
      return startIdx(apiPage, postsPerPage) <= idx && endIdx(apiPage, postsPerPage) > idx;
    });
    var result = {
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
    //hexo.route.set(listPath(apiPage), JSON.stringify(result));
    data.push({
      path: listPath(apiPage),
      data: JSON.stringify(result)
    });

    apiPage ++;
  }
}


function generatePosts() {
  _.each(allPosts, function(post) {

    var result = makePost(post, false);
    data.push({
      path: postPath(post),
      data: JSON.stringify(result)
    });
  });
  //return data;
}

function generateRecent() {
  var postsPerPage = config.api_posts_per_page || 10,
      recentPosts = [];

  // Loop thru the first 'postsPerPage' posts, in reverse order
  for (var i = 0; i < postsPerPage; i++) {
    if(allPosts[i]) {
        recentPosts.push(allPosts[i]);
    }
  }

  // Add posts into object
  var result = {};

  result.posts = _.map(recentPosts, function(post) {
    if(post) {
      return makePost(post, true);
    }
  });

  data.push({
    path: recentPath(),
    data: JSON.stringify(result)
  });
}

/**
 * *****************************************************
 */
module.exports = function(locals){
  allPosts = locals.posts.sort('-date').toArray();
  config = this.config;
  generateList();
  generateRecent();
  generatePosts();

  return data;
};
