$(document).ready(function(){
//   chrome.storage.sync.clear(function() {
//     var error = chrome.runtime.lastError;
//     if (error) {
//         console.error(error);
//     }
// });
  new Clipboard('.btn')

  showAllStorage() //debugging function only
  showStoredList()
  saveFormInput()
  toggleOnHover()
  removeRecord()
  

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

function toggleOnHover(){
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
};

  function showAllStorage(){
    chrome.storage.sync.get(null, function(result){
      debugger
      console.log("all storage= " + JSON.stringify(result))
    })

  }


  function showStoredList(){
    
    chrome.storage.sync.get('savedLinks', callback)
    
    function callback(result){
      var myLinks = result.savedLinks;
      console.log("myLinks = " + JSON.stringify(myLinks))
      
      for (link in myLinks){
        $('ul#my-list').append("<div class='link-container'><li><span id='" + link + "'><a href='https://" + 
          myLinks[link] + 
          "'>" + link + "</a>" +
          "<i class='btn fa fa-clipboard fa-lg' data-clipboard-target='#" + link + "' aria-hidden='true'></i></li><li class='list-url'>" + 
          "<a href='https://"+ 
          myLinks[link] + 
          "'>"+ 
          myLinks[link] + "</a>" + 
          "  <i class='fa fa-pencil fa-lg' aria-hidden='true'></i> <i class='fa fa-trash fa-lg' aria-hidden='true'></i></li></div>")
      };
      removeRecord()
    }
    
  };


  function saveFormInput (){
    
    $("body").on("submit", '#add-link', function(e){
      e.preventDefault();
    
    chrome.storage.sync.get('savedLinks', callback)
    
      function callback(result){

      var myLinks = result.savedLinks;
      
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
          "<i class='btn fa fa-clipboard fa-lg' data-clipboard-target='#" + linkTitle + "' aria-hidden='true'></i></li><li class='list-url'>" + 
          "<a href='https://"+ 
          linkUrl + 
          "'>"+ 
          linkUrl + "</a>" + 
          "   <i class='fa fa-pencil fa-lg' aria-hidden='true'></i> <i class='fa fa-trash fa-lg' aria-hidden='true'></i></li></div>")
      }
    });   
  };
  
  function removeRecord(){
      var itemToRemove;
      var divToRemove;
      $('#listarea').on('click', 'i.fa-trash', function(){
        divToRemove = $(this).parent().parent();
        itemToRemove = $(this).parent().siblings().text();
        console.log("removeitem = " + itemToRemove)
        debugger
        chrome.storage.sync.get('savedLinks', removal)
        })

        function removal(result){
          // console.log("before removal= " + JSON.stringify(result.savedLinks));
          // console.log("removeitem inside remove = " + itemToRemove)
          
          // console.log("result.savedLinks[itemToRemove]= " + result.savedLinks.itemToRemove)
          delete result.savedLinks[itemToRemove]
          // console.log("after removal= " + JSON.stringify(result.savedLinks));
          $(divToRemove).remove()
          chrome.storage.sync.set({savedLinks:result.savedLinks}, function(){alert ("item deleted!")})

        };
    };



