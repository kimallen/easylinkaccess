$(document).ready(function(){
//   chrome.storage.sync.clear(function() {
//     var error = chrome.runtime.lastError;
//     if (error) {
//         console.error(error);
//     }
// });

  showAllStorage()
  showStoredList()
  saveFormInput()
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
      var list = '';
      var myLinks = result.savedLinks;
      console.log("myLinks = " + JSON.stringify(myLinks))
      // return myLinks
      for (link in myLinks){
        list += "<li>" + link + "   <i class='fa fa-clipboard fa-lg' aria-hidden='true'></i></li><li>" + "<a href='https://" + myLinks[link] + "'>"+ myLinks[link] + "</a>" + "   <i class='fa fa-pencil fa-lg' aria-hidden='true'></i></li><br>";
        console.log (link);
      }
      $('ul#my-list').html(list)
      
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
      
    console.log("listOfLInks= " + JSON.stringify(listOfLinks));


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
      $('ul#my-list').prepend("<li>" + linkTitle   + "</li><li>" + "<a href='https://" + linkUrl + "'>" + linkUrl + "</a>" + "</li><br>")

    }
    
      // $(this).css({'background-color': 'blue'})
      

    });
      
  };
