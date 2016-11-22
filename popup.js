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
  console.log (listItemHtml("kims website", "kimallen.github.io"))
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
        $(this).css("background-color", "yellow")
        //targets clipboard in li with link name
        $(this).children().first().find('i').css("display", "inline-block");
        //targets li with link url
        $(this).children().first().next().css("display", "inline-block");
        //targets li with edit/delete icons
        $(this).children().last().css("display", "inline-block");
      },
      mouseleave: function () {
        $(this).css("background-color", "white")
        $(this).children().first().find('i').css("display", "none")
        $(this).children().first().next().css("display", "none");
        $(this).children().last().css("display", "none" )
      }
    }, "div.link-container");
};

  function showAllStorage(){
    chrome.storage.sync.get(null, function(result){
      console.log("all storage= " + JSON.stringify(result))
    })

  }

function listItemHtml (linkName, linkUrl){
  return `<div class="link-container">
  <li><a id="${linkName}" href="https://${linkUrl}">${linkName}</a><i class="name copy fa fa-clipboard fa-lg" data-clipboard-target="#${linkName}" aria-hidden="true"></i></li>
  <li class="list-url">
  <a id="${linkUrl}" href="https://${linkUrl}">${linkUrl}</a>
  <i class="copy fa fa-clipboard fa-lg" data-clipboard-target="#${linkUrl}" aria-hidden="true"></i></li><li class="edit-icons"><i class="fa fa-pencil fa-lg" aria-hidden="true"></i>
  <i class="fa fa-trash fa-lg" aria-hidden="true"></i>
  </li>
  </div>`
};

  function showStoredList(){
    
    chrome.storage.sync.get('savedLinks', callback)
    
    function callback(result){
      var myLinks = result.savedLinks;
      // console.log("myLinks = " + JSON.stringify(myLinks))
      
      for (link in myLinks){
        let html = listItemHtml(link, myLinks[link])
        $('ul#my-list').append(html)
      };
      // removeRecord()
    }
    
  };


  function saveFormInput (){
    
    $("#container").on("submit", '#add-link', function(e){
      e.preventDefault();
    
    chrome.storage.sync.get('savedLinks', callback)
    
      function callback(result){

      // var myLinks = result.savedLinks;
      
      // var listOfLinks = result.savedLinks;
      if (typeof result.savedLinks === "undefined"){
        var listOfLinks = {};
      }
      else {
        var listOfLinks = result.savedLinks;
      };
      
      let linkTitle = $('form#add-link input[name=link-name]').val();
      let linkUrl = $('form#add-link input[name=link-url]').val();

      if (!linkTitle || !linkUrl) {
            alert('Please fill in all fields');
            return;
          }

      listOfLinks[linkTitle] = linkUrl;
      chrome.storage.sync.set({savedLinks: listOfLinks}, function(){
        $('form#add-link input[name=link-name]').val('');
        $('form#add-link input[name=link-url]').val('');
        console.log("Saved");
        $('form#add-link').css("display", "none")
      });
      
      let html = listItemHtml(linkTitle, linkUrl);
      $('ul#my-list').prepend(html);

      }; //ends callback
    });   
  };
  
  function removeRecord(){
      var itemToRemove;
      var divToRemove;
      $('#listarea').on('click', 'i.fa-trash', function(){
        divToRemove = $(this).parent().parent();
        itemToRemove = $(this).parent().parent().children().first().text();
        // debugger
        console.log("divToRemove = " + divToRemove)
        console.log ("itemToRemove = " + itemToRemove)
        chrome.storage.sync.get('savedLinks', removal);
        });

        function removal(result){
          let savedLinks = result.savedLinks
          console.log("before removal= " +savedLinks);
          delete savedLinks[itemToRemove];
          console.log("after remove = " + savedLinks);
          $(divToRemove).remove();
          chrome.storage.sync.set({savedLinks:savedLinks});

        };
    };

  function editRecord(){
    var divToReplace;
    var itemToEdit;
    $('#listarea').on('click', 'i.fa-pencil', function(){
      itemToEdit = $(this).parent().parent().children().first().text();
      divToReplace = $(this).parent().parent();

      if ($('#add-link').css('display') === 'none'){
        $('#add-link').toggle('fast');
      }

      chrome.storage.sync.get('savedLinks', edit)

      function edit (result){
        
        let savedLinks = result.savedLinks;

        $('form#add-link input[name=link-name]').val(itemToEdit);
        $('form#add-link input[name=link-url]').val(savedLinks[itemToEdit]);
        
        $('#container').on('submit', '#add-link', function() {

          var linkTitle = $('form#add-link input[name=link-name]').val();
          var linkUrl = $('form#add-link input[name=link-url]').val();
          
          if (!linkTitle || !linkUrl) {
            alert('Please fill in all fields');
            
          }
          console.log("savedLinks[itemToEdit] = " + savedLinks[itemToEdit]);
          console.log('before ' + JSON.stringify(savedLinks));
          delete savedLinks[itemToEdit];
          savedLinks[linkTitle]= linkUrl;
          console.log('after ' + JSON.stringify(savedLinks));
          console.log('after adding edit ' + JSON.stringify(savedLinks));
          
          $(divToReplace).remove();

          chrome.storage.sync.set({savedLinks: savedLinks}, function(){
            console.log('saved new savedLinks' + JSON.stringify(savedLinks));
            console.log('link removed = ' + JSON.stringify(savedLinks[itemToEdit]))
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



