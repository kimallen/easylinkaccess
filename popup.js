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
  // saveFormInput();
  toggleOnHover();
  removeRecord();
  editRecord();
  toggleNewLinkButton();
  // toggleFormError();
  // formValidation();
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
        $(this).children().first().next().css("display", "block");
        //targets li with edit/delete icons
        $(this).children().last().css("display", "block");
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
  <li class="link-name"><a id="${linkName}" class="no-underline" href="https://${linkUrl}">${linkName}</a><i class="name copy fa fa-clipboard fa-lg" data-clipboard-target="#${linkName}" aria-hidden="true"></i></li><li class="list-url"><a id="${linkUrl}" href="https://${linkUrl}">${linkUrl}</a><i class="copy fa fa-clipboard fa-lg" data-clipboard-target="#${linkUrl}" aria-hidden="true"></i></li><li class="edit-icons"><i class="fa fa-pencil fa-lg" aria-hidden="true"></i>
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

  function formValidation(){
    $("#add-link").validate({
        rules: {
          "link-name": "required",
          "link-url": {
            required: true,
            url: true
          }
        },
        messages: {
          "link-name": "Please name your link",
          "link-url": {
            required: "Url required",
            url: "Must be a valid url"
          }
        }
    });
  };

  function modifyData(){
    //on submit, if it's edit class, remove the old record.
    //saveFormInput
    //remove edit class
    $("#container").on("submit", "#add-link",function(){
      if ($(this).hasClass("editable")){

      };
      saveFormInput();
      $('#add-link').removeClass('editable');
    })
  }

  function saveFormInput (){
    
    $("#container").on("submit", '#add-link', function(e){
      e.preventDefault();
    
    let linkTitle = $('form#add-link input[name=link-name]').val();
    let linkUrl = $('form#add-link input[name=link-url]').val();

    if (!linkTitle || !linkUrl) {
          // alert('Please fill in all fields');
          $(".error").html("please fill in all fields");
          return;
        };

    chrome.storage.sync.get('savedLinks', callback)
    
      function callback(result){

        if (typeof result.savedLinks === "undefined"){
          var listOfLinks = {};
        }
        else {
          var listOfLinks = result.savedLinks;
        };
      
        listOfLinks[linkTitle] = linkUrl;
        chrome.storage.sync.set({savedLinks: listOfLinks}, function(){
          $('form#add-link input[name=link-name]').val('');
          $('form#add-link input[name=link-url]').val('');
          console.log("Saved");
          $('form#add-link').css("display", "none");
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

        chrome.storage.sync.get('savedLinks', removal);
      });

        function removal(result){
          let savedLinks = result.savedLinks
          delete savedLinks[itemToRemove];
          $(divToRemove).remove();
          chrome.storage.sync.set({savedLinks:savedLinks});

        };
    };

  function showEditForm(){
    var divToReplace;
    var itemToEdit;
    $('#listarea').on('click', 'i.fa-pencil', function(){
      $("#edit-submit").css("display", "block");
      $("#save-submit").css("display", "none");
      itemToEdit = $(this).parent().parent().children().first().text();
      linkToEdit = $(this).parent().parent().children().first().next().text();
      divToReplace = $(this).parent().parent();

      if ($('#add-link').css('display') === 'none'){
        $('#add-link').toggle('fast');
      };
      $('form#add-link input[name=link-name]').val(itemToEdit);
      $('form#add-link input[name=link-url]').val(linkToEdit);
    });
  };

  function editRecord(){
    showEditForm();

    chrome.storage.sync.get('savedLinks', edit)

    function edit (result){
      
      let savedLinks = result.savedLinks;
      
      $('#container').on('click', '#edit-submit', function() {
        
        var linkTitle = $('form#add-link input[name=link-name]').val();
        var linkUrl = $('form#add-link input[name=link-url]').val();
        
        if (!linkTitle || !linkUrl) {
          // alert('Please fill in all fields');
          $(".error").html("please fill in all fields");

        }
        // console.log("savedLinks[itemToEdit] = " + savedLinks[itemToEdit]);
        // console.log(`before ${JSON.stringify(savedLinks)}`);
        delete savedLinks[itemToEdit];
        savedLinks[linkTitle]= linkUrl;
        // console.log('after adding edit ' + JSON.stringify(savedLinks));
        
        $(divToReplace).remove();

        chrome.storage.sync.set({savedLinks: savedLinks}, function(){
          console.log(`error = ${chrome.runtime.lastError}`)
          $("#edit-submit").css("display", "none");
          $("#save-submit").css("display", "block");
          $('form#add-link').css("display", "none");
          // console.log('saved new savedLinks' + JSON.stringify(savedLinks));
          // showAllStorage();
          // console.log("item to edit: " + itemToEdit)
          // console.log('link removed = ' + JSON.stringify(savedLinks[itemToEdit]))

        });

      });
    };
  };

  

  // function toggleFormError (){
  //   if (!$("#add-link").length){
  //     console.log("no error if form closed");
  //     $(".error").html('');
  //   }
  //   else if ($("#add-link").length){ console.log("error visible")}
  // };

  function toggleNewLinkButton (){

    $('body').on('click', '#new-link-button', function(){
      $('#add-link').toggle('fast');
    });
  };



