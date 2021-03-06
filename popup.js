$(document).ready(function(){

  new Clipboard('.copy')

  showStoredList();
  saveFormInput();
  editRecord();
  toggleOnHover();
  removeRecord();
  toggleNewLinkButton();
  formValidation();
  //opens a new tab when link is clicked
  $('body').on('click', 'a', function(){
     chrome.tabs.create({url: $(this).attr('href')});
     return false;
   });

  
});

function toggleOnHover(){
  $("#listarea").on({
      mouseenter: function () {
        $(this).addClass("selected");
        //targets clipboard in li with link name
        // $(this).children().first().find('i').css("display", "inline-block");
        //targets li with link url
        $(this).children().first().next().css("display", "block");
        //targets li with edit/delete icons
        $(this).children().last().css("display", "block");
      },
      mouseleave: function () {
        $(this).removeClass("selected");
        $(this).children().first().find('i').css("display", "none");
        $(this).children().first().next().css("display", "none");
        $(this).children().last().css("display", "none" )
      }
    }, "div.link-container");
};

  

function listItemHtml (linkName, linkUrl){
  const flatLinkName = linkName.replace(/\s+/g, '')

  return `<div class="link-container">
  <li class="link-name"><a id="${flatLinkName}" class="no-underline" href="${linkUrl}">${linkName}</a><i class="name copy fa fa-clipboard fa-lg" data-clipboard-target="#${flatLinkName}" aria-hidden="true"></i></li><li class="list-url"><a id="${flatLinkName}-link" href="${linkUrl}">${linkUrl}</a><i class="copy fa fa-clipboard fa-lg" data-clipboard-target="#${flatLinkName}-link" aria-hidden="true"></i></li><li class="edit-icons"><i class="fa fa-pencil fa-lg" aria-hidden="true"></i>
  <i class="fa fa-trash fa-lg" aria-hidden="true"></i>
  </li>
  </div>`
};

  function showStoredList(){
    
    chrome.storage.sync.get('savedLinks', callback)
    
    function callback(result){
      var myLinks = result.savedLinks;
      
      for (link in myLinks){
        let html = listItemHtml(link, myLinks[link])
        $('ul#my-list').append(html)
      };
    };
    
  };

function formValidation(){
  $("#add-link").validate({
      wrapper: "div",
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
          url: "Must be a valid url (use https:// or http://)"
        }
      }
  });
  $("#edit-link").validate({
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
          url: "Must be a valid url (use https:// or http://)"
        }
      }
  });
};


function saveFormInput (){
  
  $("#container").on("submit", '#add-link', function(e){
    e.preventDefault();
  
  let linkTitle = $('form#add-link input[name=link-name]').val();
  let linkUrl = $('form#add-link input[name=link-url]').val();

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

function editRecord(){
  let divToReplace;
  let itemToEdit;

  $('#listarea').on('click', 'i.fa-pencil', function(){ 

    itemToEdit = $(this).parent().parent().children().first().text();
    linkToEdit = $(this).parent().parent().children().first().next().text();
    divToReplace = $(this).parent().parent();
    if ($('#add-link').css('display') === 'block'){
      $('#add-link').toggle();
    }
    if ($('#edit-link').css('display') === 'none'){
      $('#edit-link').toggle('fast');
    };
    $('form#edit-link input[name=link-name]').val(itemToEdit);
    $('form#edit-link input[name=link-url]').val(linkToEdit);
  });

  chrome.storage.sync.get('savedLinks', edit)
  
  function edit (result){
    let savedLinks = result.savedLinks;
    
    $('#container').on('submit', '#edit-link', function(e) {
      e.preventDefault();
      var linkTitle = $('form#edit-link input[name=link-name]').val();
      var linkUrl = $('form#edit-link input[name=link-url]').val();
      
      delete savedLinks[itemToEdit];
      savedLinks[linkTitle]= linkUrl;
      
      chrome.storage.sync.set({savedLinks: savedLinks}, function(){
        $('form#edit-link').css("display", "none");
        let html = listItemHtml(linkTitle, linkUrl)
        $(html).insertAfter(divToReplace);
        $(divToReplace).remove();
      });

    });
  };
};

function toggleNewLinkButton (){

  $('body').on('click', '#new-link-button', function(){
    if($('#edit-link').css("display")==="block"){
    $('#edit-link').toggle();

    };
    // if($('#add-link').css("display")==="none"){
    // $('#add-link').toggle('fast');
    // };
    if($('#edit-link').css("display")!="block"){
    $('#add-link').toggle();
    };
  });
};

// debugging function only
function showAllStorage(){
    chrome.storage.sync.get(null, function(result){
      console.log("all storage= " + JSON.stringify(result))
    })

  };
