var path = require('path'),
  _ = require('underscore'),
  url = require('url');

var baseUrl = '/api';

hexo.extend.generator.register('api', apiGenerator);

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

// Name JSON file recent.json
function recentPath(apiPage) {
  return path.resolve(baseUrl, 'list', 'recent.json');
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
      for (i = 2; i < postRaw.length; i++) {
        // We have to append the seperator '---' before recombining since it will be
        // removed in the split
        postBody += '---' + postRaw[i]
      }
    }

    //post detail
    result.raw = postBody;
  }
  return result;
}


function generateList(allPosts) {
  // list generation
  // get all posts
  var postsPerPage = hexo.config.api_posts_per_page || 10,
    apiPage = 1, allRoutes = [],
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

    allRoutes.push({ path: listPath(apiPage), data: JSON.stringify(result) });
    apiPage ++;
  }
  return allRoutes;
}

function generatePosts(allPosts) {
  return _.collect(allPosts, function(post) {
    var result = makePost(post, false);
    return { path: postPath(post), data: JSON.stringify(result)};
  });
}

function generateRecent(allPosts) {
  var postsPerPage = hexo.config['api_posts_per_page'] || 10,
      recentPosts = [];

  // Loop thru the first 'postsPerPage' posts, in reverse order
  for (var i = allPosts.length; i-- > (allPosts.length - postsPerPage); ) {
    recentPosts.push(allPosts[i])
  }

  // Add posts into object
  result = {};
  result.posts = _.map(recentPosts, function(post) {
    return makePost(post, true);
  });

  return { path: recentPath(), data: JSON.stringify(result) };
}

function apiGenerator(locals) {
  allPosts = locals.posts.toArray();
  return _.flatten([
    generateRecent(allPosts), // Create API file for most recent posts
    generateList(allPosts),
    generatePosts(allPosts)]);
}
