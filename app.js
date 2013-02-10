var express = require('express');
var http = require('http');
var path = require('path');
var request = require('request');
var jsdom = require('jsdom');
var async = require('async');
var _ = require('underscore');
var _s = require('underscore.string');

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
    url: req.body.url,
    image: req.body.image,
    price: req.body.price,
    name: req.body.name,
    logo: req.body.logo
  }

  if (!req.session.bag) {
    req.session.bag = [];
  }

  req.session.bag.push(item);
  console.log(req.session.bag);
  res.end();
});

app.del('/bag', function(req, res) {
  var item = req.body.item;

  // pull item from bag
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

  var type = req.query.type || '';
  var category = req.query.category || '';
  var store_array = req.query.stores;
  var sortPrice = req.query.price;


  console.log(type, category, store_array);
  // when a single store is selected, it is passed a string
  if (typeof store_array === 'string') {
    var temp = store_array;
    var store_array = [];
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


            if($('div.cat-cat-item').length > 0) {
              var container = 'div.cat-cat-item';
            } else {
              var container = 'div.cat-thu-product';
            }

            console.log(container);
            $(container).each(function(index, productElement) {
              console.log('inside loop');

              if($('div.cat-cat-item').length > 0) {
                var img = '.cat-cat-prod-img';
              } else {
                console.log('cat-thu-p-ima');
                var img = '.cat-thu-p-ima';
              }

              var product = {
                id: 'express_' + index,
                url: 'http://www.express.com' + $('li.cat-thu-name a', productElement).attr('href'),
                name: $('li.cat-thu-name a', productElement).text().trim(),
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
    function gap(callback) {
      if (_.contains(store_array, 'gap  ')) {
        jsdom.env({
          html: stores.gap[type][category],
          scripts: ["http://code.jquery.com/jquery.js"],
          done: function (errors, window) {
            var $ = window.$;
            var items = [];
            $('.brand1.productCatItem').each(function(index, productElement) {
              console.log('w');
              /*
              var product = {
                id: 'gap_' + index,
                url: 'http://www.gap.com' + $('.productItemName', productElement).attr('href'),
                name: $('li.cat-thu-name a', productElement).text().trim(),
                price: $('ul li strong', productElement).text(),
                image: $('.cat-thu-p-ima', productElement).attr('src'),
                colors: [],
                store: { logo: stores.express.logo, name: stores.express.name }
              };

              $('.cat-cat-more-colors div img', productElement).each(function(index, colorElement) {
                product.colors.push({name: $(colorElement).attr('alt'), imageUrl: $(colorElement).attr('src')});
              });
              items.push(product);
               */
              i=0
              console.log(i++)
            });
            callback(null, items);
          }
        });
      } else {
        callback(null, []);
      }
    },
    function armani_exchange(callback) {
      if (_.contains(store_array, 'armani_exchange  ')) {
        jsdom.env({
          html: stores.gap[type][category],
          scripts: ["http://code.jquery.com/jquery.js"],
          done: function (errors, window) {
            var $ = window.$;
            var items = [];
            $('.brand1.productCatItem').each(function(index, productElement) {
              console.log('w');
              /*
               var product = {
               id: 'gap_' + index,
               url: 'http://www.gap.com' + $('.productItemName', productElement).attr('href'),
               name: $('li.cat-thu-name a', productElement).text().trim(),
               price: $('ul li strong', productElement).text(),
               image: $('.cat-thu-p-ima', productElement).attr('src'),
               colors: [],
               store: { logo: stores.express.logo, name: stores.express.name }
               };

               $('.cat-cat-more-colors div img', productElement).each(function(index, colorElement) {
               product.colors.push({name: $(colorElement).attr('alt'), imageUrl: $(colorElement).attr('src')});
               });
               items.push(product);
               */
              i=0
              console.log(i++)
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
              console.log(index);
              if (index > 1) {
                console.log(index, 'inside if');
                var product = {
                  id: 'handm_' + index,
                  url: $('span.details', productElement).parent().attr('href'),
                  name: $('span.details', productElement).text(),
                  price: $('span.price', productElement).text(),
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
    }
  ],
  function(err, results) {
    if (err) {
      res.send(500, err);
    } else {

    var items = _.flatten(results, true);

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
      items: items,
      bag: req.session.bag,
      bagCount: req.session.bag.length
    });
    }
  });
});

app.post('/search', function(req, res) {
  //async all stores
  /*
  pass search query to each store's search
  webscrape those results similar to categories scraping
  return those results
   */
  async.parallel([
    function express(callback) {
      callback(null, items);
    },
    function handm(callback) {
      callback(null, items);
    },
    function gap(callback) {
      callback(null, items);
    },
    function aldo(callback) {
      callback(null, items);
    },
    function uniqlo(callback) {
      callback(null, items);
    },
    function armani_exchange(callback) {
      callback(null, items);
    },
    function zara(callback) {
      callback(null, items);
    },
    function andf(callback) {
      callback(null, items);
    },
    function macys(callback) {
      callback(null, items);
    }
  ],
    function(err, results) {
      if (err) {
        res.send(500, err);
      } else {
        console.log(_.flatten(results))
        res.render('results', { items: _.flatten(results, true) });
      }
    });
  var items = {};
  res.render('results', {items: items });
});



/**
 * Get /gilt
 */
 app.get('/gilt', function(req, res){

    var gilt_api_key = '0fabb99b24a4ffbf826c077c3008859b';

    /*
     * Gilt.com is divided into stores. Currently there are four stores exposed by the API: 
     * Women, Men, Baby & Kids and Home.
     */
    var stores = ["women", "men", "Kids", "home"];

    /*
     * Sales are curated collections of purchasable products. 
     * Most sales exposed via the API are flash sales, meaning 
     * that the sales begin and end at particular times and that 
     * inventory is limited to a specific pre-determined amount. 
     * The particular amount of items available is not disclosed.
     */
     var sales = '';

     /*
      * Products are named items available for purchase. 
      * For the purposes of the API, a product encompasses 
      * a number of SKUs
     */ 
     var product = '';
     var product_categories = "products/categories.json";

     var api_param = "?apikey=";
     var upcoming_sales_params = "sales/upcoming.json";
     var active_sales_params = "sales/active.json"
     var sale_detail = ""
     var affiliate_id = "";

     /* 
      * 
      */ 
     var base_url = 'https://api.gilt.com/v1/';

    var upcoming_sales_url = base_url + upcoming_sales_params + api_param + gilt_api_key;
    //var upcoming_sales_url = "https://api.gilt.com/v1/sales/upcoming.json?apikey=" + gilt_api_key;

    var upcoming_sales = request.get({url:upcoming_sales_url, json:true}, function(e, r, body) {
        
        //x = JSON.parse(body)

        console.log(body.sales);

        res.render('gilt', {
        //title: 'Gilt API'
        sales: body.sales
      });
    });

    //console.log(upcoming_sales);


  //request.get(upcoming_sales_url).pipe(res);

    
    /*
    res.render('gilt', {
      //title: 'Gilt API'
      sales: upcoming_sales
    });
    
    */
    
    
/*
    request('https://api.gilt.com/v1/sales/upcoming.json?apikey=0fabb99b24a4ffbf826c077c3008859b', function (error, response, body) {
      if (!error && response.statusCode ==200) {
        console.log(body) //Print page
      }
    })

 */
/*
    var body = "Gilt Data";
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Length', body.length);
    res.end(body);

    */
 });

 app.use(express.directory('lib/gilt.js'));



 app.use(function(req, res, next){
    var ua = req.headers['user-agent'];

    //var api = new GiltApi('');
 });


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
