$(document).ready(function(){
//   chrome.storage.sync.clear(function() {
//     var error = chrome.runtime.lastError;
//     if (error) {
//         console.error(error);
//     }
// });
  new Clipboard('.copy')

  showAllStorage(); //debugging function only
  showStoredList();
  saveFormInput();
  toggleOnHover();
  removeRecord();
  editRecord();
  toggleNewLinkButton();

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
          "'>" + link + "</a></span>" +
          "<i class='copy fa fa-clipboard fa-lg' data-clipboard-target='#" + link + "' aria-hidden='true'></i></li><li class='list-url'>" + 
          "<a href='https://"+ 
          myLinks[link] + 
          "'>"+ 
          myLinks[link] + "</a>" + 
          "  <i class='fa fa-pencil fa-lg' aria-hidden='true'></i> <i class='fa fa-trash fa-lg' aria-hidden='true'></i></li></div>")
      };
      // removeRecord()
    }
    
  };


  function saveFormInput (){
    
    $("#container").on("submit", '#add-link', function(e){
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
        $('form#add-link input[name=link-name]').val('');
        $('form#add-link input[name=link-url]').val('');
        console.log("Saved");
      });
      $('ul#my-list').prepend("<div class='link-container'><li><span id='" + linkTitle + "'><a href='https://" + 
          linkUrl + 
          "'>" + linkTitle + "</a></span>" +
          "<i class='copy fa fa-clipboard fa-lg' data-clipboard-target='#" + linkTitle + "' aria-hidden='true'></i></li><li class='list-url'>" + 
          "<a href='https://"+ 
          linkUrl + 
          "'>"+ 
          linkUrl + "</a>" + 
          "   <i class='fa fa-pencil fa-lg' aria-hidden='true'></i> <i class='fa fa-trash fa-lg' aria-hidden='true'></i></li></div>")

      }; //ends callback
    });   
  };
  
  function removeRecord(){
      var itemToRemove;
      var divToRemove;
      $('#listarea').on('click', 'i.fa-trash', function(){
        divToRemove = $(this).parent().parent();
        itemToRemove = $(this).parent().siblings().text();
      
        chrome.storage.sync.get('savedLinks', removal);
        });

        function removal(result){
          
          delete result.savedLinks[itemToRemove];
          $(divToRemove).remove();
          chrome.storage.sync.set({savedLinks:result.savedLinks});

        };
    };

  function editRecord(){
    var divToReplace;
    var itemToEdit;
    $('#listarea').on('click', 'i.fa-pencil', function(){
      itemToEdit = $(this).parent().siblings().text()
      divToReplace = $(this).parent().parent();

      if ($('#add-link').css('display') === 'none'){
        $('#add-link').toggle('fast');
      }

      chrome.storage.sync.get('savedLinks', edit)

      function edit (result){
        
        
        let savedLinks = result.savedLinks;

        $("input[name='link-name']").val(itemToEdit);
        $("input[name='link-url']").val(savedLinks[itemToEdit]);
        
        $('#container').on('submit', '#add-link', function() {

          var linkTitle = $('form#add-link input[name=link-name]').val();
          var linkUrl = $('form#add-link input[name=link-url]').val();
          console.log("savedLinks[itemToEdit] = " + savedLinks[itemToEdit]);
          console.log('before ' + JSON.stringify(savedLinks));
          delete savedLinks[itemToEdit];
          console.log('after ' + JSON.stringify(savedLinks));
          savedLinks[linkTitle]= linkUrl;
          console.log('after adding edit ' + JSON.stringify(savedLinks));
          
          $(divToReplace).remove();

          chrome.storage.sync.set({savedLinks: savedLinks}, function(){
            console.log('saved new savedLinks' + JSON.stringify(savedLinks))
          });
        });
      };
    });

  };

  function toggleNewLinkButton (){

    $('body').on('click', '#new-link-button', function(){
      $('#add-link').toggle('fast');
    });
  };



