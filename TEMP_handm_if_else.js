     function sortSearchString(searchString){

          var searchUrl;

          var result = searchString.match(/pants/i);
          console.log(result);
          if (searchString.match(/shirt/i) != null){
             searchUrl = "http://www.hm.com/us/subdepartment/MEN?Nr=4294956433";
          }
          else if (searchString.match(/tie/i) != null) {
             searchUrl = "http://www.hm.com/us/subdepartment/MEN?Nr=4294956433";
          }
          else if (searchString.match(/polo/i) != null) {
             searchUrl = "http://www.hm.com/us/subdepartment/MEN?Nr=4294927206";
          }
          else if (searchString.match(/sweatshirt/i) != null) {
             searchUrl = "http://www.hm.com/us/subdepartment/MEN?Nr=4294924882";
          }
          else if (searchString.match(/blazer/i) != null) {
             searchUrl = "http://www.hm.com/us/subdepartment/MEN?Nr=4294924830";
          }
          else if (searchString.match(/jacket/i) != null) {
             searchUrl = "http://www.hm.com/us/subdepartment/MEN?Nr=4294924830";
          }
          else if (searchString.match(/sweater/i) != null) {
             searchUrl = "http://www.hm.com/us/subdepartment/MEN?Nr=4294927521";
          }
          else if (searchString.match(/coat/i) != null) {
             searchUrl = "http://www.hm.com/us/subdepartment/MEN?Nr=4294927833";
          }
          else if (searchString.match(/shorts/i) != null) {
             searchUrl = "http://www.hm.com/us/subdepartment/MEN?Nr=4294952162";
          }
          else if (searchString.match(/jeans/i) != null) {
             searchUrl = "http://www.hm.com/us/subdepartment/MEN?Nr=4294956231";
          }
          else if (searchString.match(/pants/i) != null) {
             searchUrl = "http://www.hm.com/us/subdepartment/MEN?Nr=4294956231";
          }
          else if (searchString.match(/underwear/i) != null) {
             searchUrl = "http://www.hm.com/us/subdepartment/MEN?Nr=4294923978";
          }
          else if (searchString.match(/bathingsuit/i) != null) {
             searchUrl = "http://www.hm.com/us/subdepartment/MEN?Nr=4294952307";
          }
          else if (searchString.match(/shoes/i) != null) {
             searchUrl = "http://www.hm.com/us/subdepartment/MEN?Nr=4294957721";
          }
          else if (searchString.match(/socks/i) != null) {
             searchUrl = "http://www.hm.com/us/subdepartment/MEN?Nr=4294958404";
          }
          else if (searchString.match(/watch/i) != null) {
             searchUrl = "http://www.hm.com/us/subdepartment/MEN?Nr=4294926526";
          }
          else if (searchString.match(/belt/i) != null) {
             searchUrl = "http://www.hm.com/us/subdepartment/MEN?Nr=4294927569";
          }
          else if (searchString.match(/hat/i) != null) {
             searchUrl = "http://www.hm.com/us/subdepartment/MEN?Nr=4294923718";
          }
          else if (searchString.match(/sunglasses/i) != null) {
             searchUrl = "http://www.hm.com/us/subdepartment/MEN?Nr=4294919597";
          }
          else if (searchString.match(/dress/i) != null) {
             searchUrl = "http://www.hm.com/us/subdepartment/LADIES?Nr=4294960648";
          }
          else if (searchString.match(/top/i) != null) {
             searchUrl = "http://www.hm.com/us/subdepartment/LADIES?Nr=4294956943";
          }
          else if (searchString.match(/leggings/i) != null) {
             searchUrl = "http://www.hm.com/us/subdepartment/LADIES?Nr=4294960522";
          }
          else if (searchString.match(/skirt/i) != null) {
             searchUrl = "http://www.hm.com/us/subdepartment/LADIES?Nr=4294962650";
          }
          else if (searchString.match(/handbag/i) != null) {
             searchUrl = "http://www.hm.com/us/subdepartment/LADIES?Nr=4294926110";
          }
          else if (searchString.match(/lingerie/i) != null) {
             searchUrl = "http://www.hm.com/us/subdepartment/LADIES?Nr=4294929212";
          }
          else if (searchString.match(/swimwear/i) != null) {
             searchUrl = "http://www.hm.com/us/subdepartment/LADIES?Nr=4294956943";
          }
          else {
             //searchUrl = "nothing found";
          }


          return searchUrl;
        }
        var searchString = "pants";
        searchUrl = sortSearchString(searchString);
        console.log(searchUrl);

