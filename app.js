var cheerio = require('cheerio');
var url = require('url');
var express = require('express');
var http = require('http');
var path = require('path');
var request = require('request');
var jsdom = require('jsdom');
var async = require('async');
var _ = require('underscore');
var _s = require('underscore.string');
var fs = require('fs');
var stores = require('./stores');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.locals.pretty = true;
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('jsrocks'));
  app.use(express.session({ secret: 'jsrocks' }));
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '//public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

/**
 * GET /index
 */
app.get('/', function(req, res) {
  if (!req.session.bag) {
    req.session.bag = [];
  }

  res.render('index', {
    bag: req.session.bag,
    bagCount: req.session.bag.length
  });
});

/**
 * POST /bag
 */
app.post('/bag', function(req, res) {
  var item = {
    id: req.body.id,
    url: req.body.url,
    image: req.body.image,
    price: req.body.price,
    name: req.body.name,
    logo: req.body.logo
  };

  if (!req.session.bag) {
    req.session.bag = [];
  }

  req.session.bag.push(item);
  console.log(req.session.bag);
  res.end();
});

app.del('/bag', function(req, res) {
  var item = req.body.item;
  var index = req.session.bag.indexOf(item);
  req.session.bag.splice(index, 1);
  res.end();
});

app.post('/clearbag', function(req, res) {
  req.session.bag = [];
  res.end();
});

/**
 * GET /shoppingbag
 */
app.get('/shoppingbag', function(req, res) {
  if (!req.session.bag) {
    req.session.bag = [];
  }

  res.render('bag', {
    bag: req.session.bag,
    bagCount: req.session.bag.length
  });
});

/**
 * GET /results
 */
app.get('/results', function(req, res) {
  if (!req.session.bag) {
    req.session.bag = [];
  }
  var search = req.query.q || '';
  var type = req.query.type || '';
  var category = req.query.category || '';
  var store_array = req.query.stores;
  var sortPrice = req.query.price;


  console.log(type, category, store_array);
  // when a single store is selected, it is passed a string
  if (typeof store_array === 'string') {
    var temp = store_array;
    store_array = [];
    store_array.push(temp);
  }

  async.parallel([
    function express(callback) {
      if (_.contains(store_array, 'express')) {
        console.log('found express');
        jsdom.env({
          html: stores.express[type][category],
          scripts: ["http://code.jquery.com/jquery.js"],
          done: function (errors, window) {
            var $ = window.$;
            var items = [];
            var container = $('div.cat-cat-item').length ? 'div.cat-cat-item' : 'div.cat-thu-product';

            $(container).each(function(index, productElement) {

              var name, img = '';
              if($('div.cat-cat-item').length > 0) {
                img = '.cat-cat-prod-img';
                name = 'li.cat-cat-prod-name a';

              } else {
                console.log('cat-thu-p-ima');
                img = '.cat-thu-p-ima';
                name = 'li.cat-thu-name a';

              }

              var product = {
                id: 'express_' + index,
                url: 'http://www.express.com' + $(name, productElement).attr('href'),
                name: $(name, productElement).text().trim(),
                price: $('ul li strong', productElement).text(),
                image: $(img, productElement).attr('src'),
                colors: [],
                store: { logo: stores.express.logo, name: stores.express.name }
              };

              $('.cat-cat-more-colors div img', productElement).each(function(index, colorElement) {
                product.colors.push({name: $(colorElement).attr('alt'), imageUrl: $(colorElement).attr('src')});
              });

              items.push(product);
            });
            callback(null, items);
          }
        });
      } else {
        callback(null, []);
      }
    },
    function uniqlo(callback) {
      if (_.contains(store_array, 'uniqlo')) {
        jsdom.env({
          html: 'http://www.uniqlo.com/us/mens-clothing/mens-tops/mens-sweatshirts-and-fleece',
          scripts: ["http://code.jquery.com/jquery.js"],
          done: function (errors, window) {
            var $ = window.$;
            var items = [];

            $('.productWrapper').each(function(index, productElement) {
              console.log('inside loop');

              var product = {
                id: 'uniqlo' + index,
                url: $('.titleWrapper a', productElement).attr('href'),
                name: $('.titleWrapper a span', productElement).text(),
                price: $('.price', productElement).text().trim(),
                image: $('.productIMG a img', productElement).attr('src'),
                colors: [],
                store: { logo: stores.uniqlo.logo, name: stores.uniqlo.name }
              };

              items.push(product);
            });
            callback(null, items);
          }
        });
      } else {
        callback(null, []);
      }
    },
    function handm(callback) {
      if (_.contains(store_array, 'handm')) {
        jsdom.env({
          html: stores.handm[type][category],
          scripts: ["http://code.jquery.com/jquery.js"],
          done: function (errors, window) {
            var $ = window.$;
            var items = [];
            $('#list-products > li').each(function(index, productElement) {
              if (index > 1) {
                var product = {
                  id: 'handm_' + index,
                  url: $('span.details', productElement).parent().attr('href'),
                  name: $('span.details', productElement).text().trim().replace(/\s{2,}/g, ' '),
                  price: $('span.price', productElement).text().trim(),
                  image: $('div.image img:nth-child(2)', productElement).attr('src'),
                  colors: [],
                  store: { logo: stores.handm.logo, name: stores.handm.name }
                };
                $('.colours li', productElement).each(function(index, colorElement) {
                  product.colors.push({ name: '', imageUrl: $(colorElement).css('background-image').slice(0,-1).slice(4).slice(0,-6)+']' });
                });
                items.push(product);
              }
            });
            callback(null, items);
          },
        });
      } else {
        callback(null, []);
      }
    },
    function hearst(callback) {
      var url = '';
      if (category) {
        var parsedCategory = category;
        parsedCategory = parsedCategory.replace(/[^-a-zA-Z0-9,&\s]+/ig, '');
        parsedCategory = parsedCategory.replace(/-/gi, '+');
        parsedCategory = parsedCategory.replace(/\s/gi, '+');
        parsedCategory = parsedCategory.replace(/&/gi, '+');
        parsedCategory = parsedCategory.toLowerCase();
        url = 'http://hearst.api.mashery.com/Article/search?keywords='+parsedCategory+'&_pretty=0&shape=full&start=0&limit=3&sort=publish_date%2Cdesc&total=0&api_key=nsuww68vv2b2yycg88bqttc3';
      } else {
        var parsedSearchQuery = search;
        parsedSearchQuery = parsedSearchQuery.replace(/[^-a-zA-Z0-9,&\s]+/ig, '');
        parsedSearchQuery = parsedSearchQuery.replace(/-/gi, '+');
        parsedSearchQuery = parsedSearchQuery.replace(/\s/gi, '+');
        parsedSearchQuery = parsedSearchQuery.replace(/&/gi, '+');
        parsedSearchQuery = parsedSearchQuery.toLowerCase();
        url = 'http://hearst.api.mashery.com/Article/search?keywords='+parsedSearchQuery+'&_pretty=0&shape=full&start=0&limit=3&sort=publish_date%2Cdesc&total=0&api_key=nsuww68vv2b2yycg88bqttc3';

      }
      request.get({ url: url, json:true }, function (e, r, body) {
        callback(null, body);
      });
    }
  ],
  function(err, results) {
    if (err) {
      res.send(500, err);
    } else {
      var hearst = results.pop();
      var items = _.flatten(results, true);
    }

    var byProperty = function(prop) {
      return function(a,b) {
        if (typeof a[prop] === "number") {
          return (a[prop] - b[prop]);
        } else {
          return ((a[prop] < b[prop]) ? -1 : ((a[prop] > b[prop]) ? 1 : 0));
        }
      };
    };
    var byPropertyReverse = function(prop) {
      return function(a,b) {
        if (typeof a[prop] === "number") {
          return (b[prop] - a[prop]);
        } else {
          return ((a[prop] > b[prop]) ? -1 : ((a[prop] < b[prop]) ? 1 : 0));
        }
      };
    };

    if (sortPrice === 'asc') {
      items.sort(byProperty('price'));
    }
    if (sortPrice === 'desc') {
      items.sort(byPropertyReverse('price'));
    }

    res.render('results', {
      hearst: hearst,
      items: items,
      bag: req.session.bag,
      bagCount: req.session.bag.length
    });
  });
});

app.get('/search', function(req, res) {
  if (!req.session.bag) {
    req.session.bag = [];
  }
  var store_array = req.query.stores;
  var sortPrice = req.query.price;

  var search_query = req.query.q;
  console.log(search_query);

  if (typeof store_array === 'string') {
    var temp = store_array;
    var store_array = [];
    store_array.push(temp);
  }

  async.parallel([
    function express(callback) {
      if (_.contains(store_array, 'express')) {
        console.log('found express');
        var search_url ='http://www.express.com/catalog/search_results.jsp?keyword='+search_query+'&form_state=searchForm&y=0&x=0&Mft='+search_query+'&Mpper=74&Mpos=1&Mpg=SEARCH%2BNAV&Mrsaa=*&Mrsavf=SIZE_NAME&Mrsavf=category&Mrsavf=Color&viewall=1'
        //var search_url = 'http://www.express.com/catalog/search.cmd?form_state=searchForm&x=0&y=0&keyword=' + search_query;
        jsdom.env({
          html: search_url,
          scripts: ["http://code.jquery.com/jquery.js"],
          done: function (errors, window) {
            var $ = window.$;
            var items = [];

            $('div.cat-luc-result-item').each(function(index, productElement) {
              var product = {
                id: 'express_' + index,
                url: 'http://www.express.com' + $('div.cat-luc-result-item ul li:nth-child(3)', productElement).attr('href'),
                name: $('div.cat-luc-result-item ul li:nth-child(3)', productElement).text().trim(),
                price: $('ul li strong', productElement).text(),
                image: $('.cat-luc-product-ima', productElement).attr('src'),
                colors: [],
                store: { logo: stores.express.logo, name: stores.express.name }
              };

              $('.cat-cat-more-colors div img', productElement).each(function(index, colorElement) {
                product.colors.push({name: $(colorElement).attr('alt'), imageUrl: $(colorElement).attr('src')});
              });

              items.push(product);
            });
            callback(null, items);
          }
        });
      } else {
        callback(null, []);
      }
    },
    function handm(callback) {
      if (_.contains(store_array, 'handm')) {
        var searchUrl;

        if (search_query.match(/shirt/i)){
          searchUrl = "http://www.hm.com/us/subdepartment/MEN?Nr=4294956433";
        }
        else if (search_query.match(/tie/i)) {
          searchUrl = "http://www.hm.com/us/subdepartment/MEN?Nr=4294956433";
        }
        else if (search_query.match(/polo/i)) {
          searchUrl = "http://www.hm.com/us/subdepartment/MEN?Nr=4294927206";
        }
        else if (search_query.match(/sweatshirt/i)) {
          searchUrl = "http://www.hm.com/us/subdepartment/MEN?Nr=4294924882";
        }
        else if (search_query.match(/blazer/i)) {
          searchUrl = "http://www.hm.com/us/subdepartment/MEN?Nr=4294924830";
        }
        else if (search_query.match(/jacket/i)) {
          searchUrl = "http://www.hm.com/us/subdepartment/MEN?Nr=4294924830";
        }
        else if (search_query.match(/sweater/i)) {
          searchUrl = "http://www.hm.com/us/subdepartment/MEN?Nr=4294927521";
        }
        else if (search_query.match(/coat/i)) {
          searchUrl = "http://www.hm.com/us/subdepartment/MEN?Nr=4294927833";
        }
        else if (search_query.match(/shorts/i)) {
          searchUrl = "http://www.hm.com/us/subdepartment/MEN?Nr=4294952162";
        }
        else if (search_query.match(/jeans/i)) {
          searchUrl = "http://www.hm.com/us/subdepartment/MEN?Nr=4294956231";
        }
        else if (search_query.match(/pants/i)) {
          searchUrl = "http://www.hm.com/us/subdepartment/MEN?Nr=4294956231";
        }
        else if (search_query.match(/underwear/i)) {
          searchUrl = "http://www.hm.com/us/subdepartment/MEN?Nr=4294923978";
        }
        else if (search_query.match(/bathingsuit/i)) {
          searchUrl = "http://www.hm.com/us/subdepartment/MEN?Nr=4294952307";
        }
        else if (search_query.match(/shoes/i)) {
          searchUrl = "http://www.hm.com/us/subdepartment/MEN?Nr=4294957721";
        }
        else if (search_query.match(/socks/i)) {
          searchUrl = "http://www.hm.com/us/subdepartment/MEN?Nr=4294958404";
        }
        else if (search_query.match(/watch/i)) {
          searchUrl = "http://www.hm.com/us/subdepartment/MEN?Nr=4294926526";
        }
        else if (search_query.match(/belt/i)) {
          searchUrl = "http://www.hm.com/us/subdepartment/MEN?Nr=4294927569";
        }
        else if (search_query.match(/hat/i)) {
          searchUrl = "http://www.hm.com/us/subdepartment/MEN?Nr=4294923718";
        }
        else if (search_query.match(/sunglasses/i)) {
          searchUrl = "http://www.hm.com/us/subdepartment/MEN?Nr=4294919597";
        }
        else if (search_query.match(/dress/i)) {
          searchUrl = "http://www.hm.com/us/subdepartment/LADIES?Nr=4294960648";
        }
        else if (search_query.match(/top/i)) {
          searchUrl = "http://www.hm.com/us/subdepartment/LADIES?Nr=4294956943";
        }
        else if (search_query.match(/leggings/i)) {
          searchUrl = "http://www.hm.com/us/subdepartment/LADIES?Nr=4294960522";
        }
        else if (search_query.match(/skirt/i)) {
          searchUrl = "http://www.hm.com/us/subdepartment/LADIES?Nr=4294962650";
        }
        else if (search_query.match(/handbag/i)) {
          searchUrl = "http://www.hm.com/us/subdepartment/LADIES?Nr=4294926110";
        }
        else if (search_query.match(/lingerie/i)) {
          searchUrl = "http://www.hm.com/us/subdepartment/LADIES?Nr=4294929212";
        }
        else if (search_query.match(/swimwear/i)) {
          searchUrl = "http://www.hm.com/us/subdepartment/LADIES?Nr=4294956943";
        }

        jsdom.env({
          html: searchUrl,
          scripts: ['http://code.jquery.com/jquery.js'],
          done: function (errors, window) {
            var $ = window.$;
            var items = [];
            $('#list-products > li').each(function(index, productElement) {
              console.log(index);
              if (index > 1) {
                console.log(index, 'inside if');
                var product = {
                  id: 'handm_' + index,
                  url: $('span.details', productElement).parent().attr('href'),
                  name: $('span.details', productElement).text().trim().replace(/\s{2,}/g, ' '),
                  price: $('span.price', productElement).text().trim(),
                  image: $('div.image img:nth-child(2)', productElement).attr('src'),
                  colors: [],
                  store: { logo: stores.handm.logo, name: stores.handm.name }
                };
                $('.colours li', productElement).each(function(index, colorElement) {
                  product.colors.push({ name: '', imageUrl: $(colorElement).css('background-image').slice(0,-1).slice(4).slice(0,-6)+']' });
                });
                items.push(product);
              }
            });
            callback(null, items);
          }
        });
      } else {
        callback(null, []);
      }
    },
    function uniqlo(callback) {
      if (_.contains(store_array, 'uniqlo')) {
        jsdom.env({
          html: 'http://www.uniqlo.com/us/mens-clothing/mens-tops/mens-sweatshirts-and-fleece',
          scripts: ["http://code.jquery.com/jquery.js"],
          done: function (errors, window) {
            var $ = window.$;
            var items = [];

            console.log('i am in uniqlo ')

            $('.productWrapper').each(function(index, productElement) {
              console.log('inside loop');

              var product = {
                id: 'uniqlo' + index,
                url: 'http://www.uniqlo.com' + $('.titleWrapper a', productElement).attr('href'),
                name: $('.titleWrapper a span', productElement).text(),
                price: $('.price', productElement).text().trim(),
                image: $('.productIMG a img', productElement).attr('src'),
                colors: [],
                store: { logo: stores.uniqlo.logo, name: stores.uniqlo.name }
              };

              console.log()
              console.log(product);
              items.push(product);
            });
            callback(null, items);
          }
        });
      } else {
        callback(null, []);
      }
    },
    function guilt(callback) {
      if (_.contains(store_array, 'guilt')) {

        var product = '';
        var product_categories = "products/categories.json";
        var categories = ["Boots", "Dresses", "Earrings", "Luggage", "Sofas"];
        var api_param = "?apikey=";
        var upcoming_sales_params = "sales/upcoming.json";
        var active_sales_params = "sales/active.json"
        var sale_detail = ""
        var affiliate_id = "";
        var base_url = 'https://api.gilt.com/v1/';
        var gilt_api_key = '0fabb99b24a4ffbf826c077c3008859b';
        var search_query = encodeURIComponent(req.query.q);
        var search_query = search_query.split(' ')[0];
        console.log(search_query);
        var gilt_search_url = base_url + 'products/josql' + api_param + gilt_api_key + "&q=name%20LIKE%20'%25" + search_query + "%25'";
        console.log(gilt_search_url);

        var gilt_search = request.get({url:gilt_search_url, json:true}, function(e, r, body) {
          console.log(body);
          callback(null, body);
        });
      } else {
        callback(null, []);
      }
    },
    function hearst(callback) {

      var parsedSearchQuery = search_query;
      parsedSearchQuery = parsedSearchQuery.replace(/[^-a-zA-Z0-9,&\s]+/ig, '');
      parsedSearchQuery = parsedSearchQuery.replace(/-/gi, '+');
      parsedSearchQuery = parsedSearchQuery.replace(/\s/gi, '+');
      parsedSearchQuery = parsedSearchQuery.replace(/&/gi, '+');
      parsedSearchQuery = parsedSearchQuery.toLowerCase();
      var url = 'http://hearst.api.mashery.com/Article/search?keywords='+parsedSearchQuery+'&_pretty=0&shape=full&start=0&limit=3&sort=publish_date%2Cdesc&total=0&api_key=nsuww68vv2b2yycg88bqttc3';

      request.get({ url:url, json:true }, function (e, r, body) {
        console.log(body);
        callback(null, body);
      });
    }
  ],
    function(err, results) {
      if (err) {
        res.send(500, err);
      } else {
        var hearst = results.pop();
        var guilt = results.pop();
        var items = _.flatten(results, true);
        console.log('guilt', guilt);
        var byProperty = function(prop) {
          return function(a,b) {
            if (typeof a[prop] == "number") {
              return (a[prop] - b[prop]);
            } else {
              return ((a[prop] < b[prop]) ? -1 : ((a[prop] > b[prop]) ? 1 : 0));
            }
          };
        };
        var byPropertyReverse = function(prop) {
          return function(a,b) {
            if (typeof a[prop] == "number") {
              return (b[prop] - a[prop]);
            } else {
              return ((a[prop] > b[prop]) ? -1 : ((a[prop] < b[prop]) ? 1 : 0));
            }
          };
        };

        if (sortPrice == 'asc') {
          items.sort(byProperty('price'));
        }
        if (sortPrice == 'desc') {
          items.sort(byPropertyReverse('price'));
        }


        res.render('results', {
          guilt: guilt,
          hearst: hearst,
          items: items,
          bag: req.session.bag,
          bagCount: req.session.bag.length
        });
      }
    });
});

/*
app.post('/pdf', function(req, res) {
  var doc = new PDFDocument();
  doc
    .fontSize(25)
    .image('uniqlo.jpg')
    .image('pdf3.jpg')
    .text('MEN PRINTED SWEAT FULL ZIP HOODIE')
    .fontSize(40)
    .text('$19.90')
  doc.addPage()
    .fontSize(25)
    .text('Here is some vector graphics...', 100, 100)
  doc.save()
    .moveTo(100, 150)
    .lineTo(100, 250)
    .lineTo(200, 250)
    .fill("#FF3300");
  doc.scale(0.6)
    .translate(470, -380)
    .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
    .fill('red', 'even-odd')
    .restore();
  doc.addPage()
    .fillColor("blue")
    .text('Here is a link!', 100, 100);
  doc.write('apparelist.pdf');
  res.download(__dirname + '/apparelist.pdf');


});

*/

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});