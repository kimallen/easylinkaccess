$(document).ready(function(){
//   chrome.storage.sync.clear(function() {
//     var error = chrome.runtime.lastError;
//     if (error) {
//         console.error(error);
//     }
// });

  showAllStorage() //debugging function only
  showStoredList()
  saveFormInput()

  $("#listarea").on({
    mouseenter: function () {
      $(this).children().last().css("display", "inline-block");
      $(this).children().first().find('i').css("display", "inline-block")
    },
    mouseleave: function () {
      $(this).children().last().css("display", "none" )
      $(this).children().first().find('i').css("display", "none")
    }
  }, "div.link-container");

  new Clipboard('.btn')

  //opens a new tab when link is clicked
  $('body').on('click', 'a', function(){
     chrome.tabs.create({url: $(this).attr('href')});
     return false;
   });

  // chrome.storage.onChanged.addListener(function(changes, namespace) {
  //         for (key in changes) {
  //           var storageChange = changes[key];
  //           console.log('Storage key "%s" in namespace "%s" changed. ' +
  //                       'Old value was "%s", new value is "%s".',
  //                       key,
  //                       namespace,
  //                       storageChange.oldValue,
  //                       storageChange.newValue);
  //         }
  //       });
});

  function showAllStorage(){
    chrome.storage.sync.get(null, function(result){
      console.log("all storage= " + JSON.stringify(result))

    })

  }


  function showStoredList(){
    
    chrome.storage.sync.get('savedLinks', callback)
    
    function callback(result){
      let list = '';
      var myLinks = result.savedLinks;
      console.log("myLinks = " + JSON.stringify(myLinks))
      
      for (link in myLinks){
        $('ul#my-list').append("<div class='link-container'><li><span id='" + link + "'><a href='https://" + 
          myLinks[link] + 
          "'>" + link + "</a>" +
          "  <i class='btn fa fa-clipboard fa-lg' data-clipboard-target='#" + link + "' aria-hidden='true'></i></li><li class='list-url'>" + 
          "<a href='https://"+ 
          myLinks[link] + 
          "'>"+ 
          myLinks[link] + "</a>" + 
          "   <i class='fa fa-pencil fa-lg' aria-hidden='true'></i> <i class='fa fa-trash fa-lg' aria-hidden='true'></i></li></div>")
      };
      
    }
    
  };


  function saveFormInput (){
    
    $("body").on("submit", '#add-link', function(e){
      e.preventDefault();
    
    chrome.storage.sync.get('savedLinks', callback)
    
    function callback(result){
      var list;
      var myLinks = result.savedLinks;
      console.log("myLinks2 = " + JSON.stringify(myLinks))
      // return myLinks
      
      var listOfLinks = myLinks
      if (typeof myLinks === "undefined"){
        var listOfLinks = {};
      }
      else {
        var listOfLinks = myLinks;
      };
      

      var linkTitle = $('form#add-link input[name=link-name]').val();
      var linkUrl = $('form#add-link input[name=link-url]').val();

      if (!linkTitle || !linkUrl) {
            alert('Please fill in all fields');
            return;
          }

      listOfLinks[linkTitle] = linkUrl;
      chrome.storage.sync.set({savedLinks: listOfLinks}, function(){
        console.log("Saved")
      });
      $('ul#my-list').prepend("<div class='link-container'><li><span id='" + linkTitle + "'><a href='https://" + 
          linkUrl + 
          "'>" + linkTitle + "</a>" +
          "  <i class='btn fa fa-clipboard fa-lg' data-clipboard-target='#" + linkTitle + "' aria-hidden='true'></i></li><li class='list-url'>" + 
          "<a href='https://"+ 
          linkUrl + 
          "'>"+ 
          linkUrl + "</a>" + 
          "   <i class='fa fa-pencil fa-lg' aria-hidden='true'></i> <i class='fa fa-trash fa-lg' aria-hidden='true'></i></li></div>")

    }
    
      // $(this).css({'background-color': 'blue'})
      

    });
      
  };

