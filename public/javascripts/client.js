var stores = [];

$(function() {
  store_handler();
  category_handler();
  init_masonry();
  clear_bag();
  sortPrice();
  search_handler();


  $('#pdf').click(function() {
    window.print();
  });

  $('#print').click(function() {
     window.print();
  });
  $(".collapse").collapse()
});

function clear_bag() {
$('#clearbag').click(function() {
  $.ajax({
    type: 'post',
    url: '/clearbag',
    success: function() {
      $('#bagcount').text(0);
    }
  });
  toastr.info('Bag contents have been cleared')
});

}

function store_handler() {
  $('.store').toggle(function() {
    $(this).addClass('active');
    stores.push(slugify($(this).children('a').text()));
    console.log(stores);
  }, function() {
    $(this).removeClass('active');
    var index = stores.indexOf(slugify($(this).children('a').text()));
    stores.splice(index, 1);
    console.log(stores);
  });
}

function search_handler() {
  $('#searchBtn').click(function() {
    console.log('clicked');
    var search = $('#searchInput').val();
    search = search.replace(/[^-a-zA-Z0-9,&\s]+/ig, '');
    search = search.replace(/-/gi, '+');
    search = search.replace(/\s/gi, '+');
    search = search.replace(/&/gi, '+');
    search = search.toLowerCase();

    var stores_querystring = '';
    for (var i = 0; i < stores.length; i++) {
      stores_querystring += '&stores=' + stores[i];
    }

    var href = $('#searchBtn').attr('href') + 'q=' + search + stores_querystring;
    $('#searchBtn').attr('href', href);
  });
}

function category_handler() {
  $('.category').click(function() {
    var type = slugify($(this).parent().parent().attr('id'));
    var category = slugify($(this).text());

    var stores_querystring = '';
    for (var i = 0; i < stores.length; i++) {
      stores_querystring += '&stores=' + stores[i];
    }

    var querystring = '?' + 'type=' + type + '&category=' + category + stores_querystring;
    console.log(querystring);
    var href = $(this).attr('href') + querystring;
    $(this).attr('href', href);
  });
}


$('#item-#{item.id}').toggle(function() {
  $('#bagcount').text(parseInt($('#bagcount').text()) + 1);
  toastr.success('An item has been added to your bag.');
  $(this).removeClass('btn-primary').addClass('btn-danger').html('<i class="icon-trash"></i> Remove');
}, function() {
  $('#bagcount').text(parseInt($('#bagcount').text()) - 1);
  toastr.error('An item has been removed from your bag.');
  $(this).removeClass('btn-danger').addClass('btn-primary').html('<i class="icon-shopping-cart"></i> Add to Bag');
});

function sortPrice(){
  $('#ascending').click(function() {

    var url = window.location.href;
    if (url.match('price')) {
      url = url.replace('desc', 'asc');
      $(this).attr('href', url);
    } else {
      $(this).attr('href', url + '&price=asc');
    }

  });

  $('#descending').click(function() {
    var url = window.location.href;
    console.log(url);
    if (url.match('price')) {
      console.log('inside desc if')
      url = url.replace('asc', 'desc');
      $(this).attr('href', url);
    } else {
      console.log('inside desc else')

      $(this).attr('href', url + '&price=desc');
    }

  });
}

function init_masonry(){
  var $container = $('#content');
  var gutter = 15;
  var min_width = 175;
  $container.imagesLoaded( function(){
    $container.masonry({
      itemSelector : '.box',
      gutterWidth: gutter,
      isAnimated: true,
      columnWidth: function( containerWidth ) {
        var num_of_boxes = (containerWidth/min_width | 0);
        var box_width = (((containerWidth - (num_of_boxes-1)*gutter)/num_of_boxes) | 0) ;
        if (containerWidth < min_width) {
          box_width = containerWidth;
        }
        $('.box').width(box_width);
        return box_width;
      }
    });
  });
}


function slugify(text) {
  text = text.replace(/[^-a-zA-Z0-9,&\s]+/ig, '');
  text = text.replace(/-/gi, '_');
  text = text.replace(/\s/gi, '_');
  text = text.replace(/&/gi, 'and');
  text = text.toLowerCase();
  return text;
}

$(function() {
  $('#items').masonry({
    itemSelector : '.thumbnail'
  });
});