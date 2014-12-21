# hexo-generator-api

Generate json api for your awesome hexo site

### Installation

```
$ npm install hexo-generator-api --save
```










### API Generation

##### List
A list of posts of the blog. Generated in `public/api/list`. Lists are by default paginated. You can set the number of posts in a page via setting `api_posts_per_page`.

The first list page will be generated to `public/api/list/list.json`, the following pages will be generated to `public/api/list/list-${pageNumber}.json`.

An example list page will be

```json
{
    "prev": "http://yoursite.com/api/list/list.json",   // previous list page (null if not exists)
    "next": "http://yoursite.com/api/list/list-3.json", // next list page (null if not exists)
    "posts": [{
        "title": "test",
        "permalink": "http://yoursite.com/2014/11/14/test/",
        "date": 1415928246000,
        "url": "http://yoursite.com/api/posts/51lslnjeqrtdxf3k.json"
    }, {
        "title": "test",
        "permalink": "http://yoursite.com/2014/11/14/test-3/",
        "date": 1415929901000,
        "url": "http://yoursite.com/api/posts/7qdz6o08kjizb7zs.json"
    }, {
        "title": "test",
        "permalink": "http://yoursite.com/2014/11/14/test-4/",
        "date": 1415929902000,
        "url": "http://yoursite.com/api/posts/3hevgb4ty7txp68c.json"
    }, {
        "title": "test",
        "permalink": "http://yoursite.com/2014/11/14/test-5/",
        "date": 1415929903000,
        "url": "http://yoursite.com/api/posts/1jmthulquk4e9sum.json"
    }, {
        "title": "test",
        "permalink": "http://yoursite.com/2014/11/14/test-6/",
        "date": 1415929904000,
        "url": "http://yoursite.com/api/posts/e20vj4gx5pcd14s3.json"
    }]
}
```

##### Recent
A list of the most recent posts of the blog. Generated in `public/api/list`. The number of recent posts is defined by default paginated. You can set the number of posts via the `api_posts_per_page` setting.

The api end point will be to `public/api/list/recent.json`.

An example list page will be the same as above, but in the reverse order they were published *newest to oldest*

```json
{
    "posts": [{
        "title": "test",
        "permalink": "http://yoursite.com/2014/11/14/test/",
        "date": 1415929904000,
        "url": "http://yoursite.com/api/posts/51lslnjeqrtdxf3k.json"
    }, {
        "title": "test",
        "permalink": "http://yoursite.com/2014/11/14/test-3/",
        "date": 1415929903000,
        "url": "http://yoursite.com/api/posts/7qdz6o08kjizb7zs.json"
    }, {
        "title": "test",
        "permalink": "http://yoursite.com/2014/11/14/test-4/",
        "date": 1415929902000,
        "url": "http://yoursite.com/api/posts/3hevgb4ty7txp68c.json"
    }, {
        "title": "test",
        "permalink": "http://yoursite.com/2014/11/14/test-5/",
        "date": 1415929901000,
        "url": "http://yoursite.com/api/posts/1jmthulquk4e9sum.json"
    }, {
        "title": "test",
        "permalink": "http://yoursite.com/2014/11/14/test-6/",
        "date": 1415928246000,
        "url": "http://yoursite.com/api/posts/e20vj4gx5pcd14s3.json"
    }]
}
```

##### Post
Every post will have a single JSON file to hold the result located in `public/api/posts`.

An example post will be

```json
{
    "title": "test",
    "permalink": "http://yoursite.com/2014/11/14/test-4/",
    "date": 1415929902000,
    "raw": "title: test\ndate: 2014-11-14 09:51:42\ntags:\n---\n This is a very good post."
}
```

For real world example, here are some of them:

- [Sample list api](http://blog.leapoahead.com/api/list/list.json)
- [Sample post api](http://blog.leapoahead.com/api/posts/e5e19bowadlm6rh3.json)





### Options
Set options in `_config.yml`.

```yml
# Posts displayed per page in list
api_posts_per_page: 5
```




### Contribute

Your contributions will be welcomed! Just :

- fork
- submit issue
- propose pull request




### LICENSE
MIT