const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
$(function() {
if (prefersDark) {
  $('body').addClass('dark');
  $('.dark-mode-switcher').text('Dark mode OFF');
}
$('.dark-mode-switcher').on('click', function(e) {
  $('body').toggleClass('dark');

if ($('body').hasClass('dark')) {
    $('.dark-mode-switcher').text('Dark mode OFF'); }
    else {
        $('.dark-mode-switcher').text('Dark mode ON');
    }
  e.preventDefault();
});
}); 



// Big thanks to Bastian Pertz for help with the following function

var numberOfRelevantCheckboxes = 0;
var numberOfUnrelevantCheckboxes = 0;
var numberOfCheckedRelevantCheckboxes = 0;


var updateStatus = function(){

  
  
  
    $('#count-checked-checkboxes').text(numberOfCheckedRelevantCheckboxes);
    $('#count-total-checkboxes').text(numberOfRelevantCheckboxes);
    $('#percentage-checked-checkboxes').text(
      Math.round(
        numberOfCheckedRelevantCheckboxes / 
        numberOfRelevantCheckboxes 
        * 100
      )
    );
    $('#result-percentage').text(
      Math.round(
        numberOfCheckedRelevantCheckboxes / 
        numberOfRelevantCheckboxes 
        * 100
      )
    );
    $('#result-percentage-rest').text(
      Math.round(
        (-numberOfCheckedRelevantCheckboxes 
         / numberOfRelevantCheckboxes 
        * 100) + 100
      )
    );
    $('#count-disabled-checkboxes').text(numberOfUnrelevantCheckboxes);
    $('.progress-bar').css('width', Math.round(numberOfCheckedRelevantCheckboxes / numberOfRelevantCheckboxes * 100)+'%').attr('aria-valuenow', numberOfCheckedRelevantCheckboxes);
    $('.progress-bar-result').css('width', Math.round(numberOfCheckedRelevantCheckboxes / numberOfRelevantCheckboxes * 100)+'%').attr('aria-valuenow', numberOfCheckedRelevantCheckboxes);


    if ($('.progress-bar-result').prop("style")["width"] == '0%') { 

      $('#result-percentage').hide();
      
    }
    else {

      $('#result-percentage').show();
      
    }


    if ($('.progress-bar-result').prop("style")["width"] == '100%') { 

      $('#error-circle-progress').hide();
      $('#result-percentage-rest').hide();
      
    }
    else {

      $('#error-circle-progress').show();
      $('#result-percentage-rest').show();
      
    }
    
};


var $checkboxes = $('input:checkbox');

    $checkboxes.each(function(){

      if('relevant' !== $(this).attr('data-dis')){
        numberOfRelevantCheckboxes += 1;       
      }
    });

    updateStatus();

    $checkboxes.change(function(){

        var $checkbox = $(this);

        var isRelevant = true;
        
        if('relevant' === $checkbox.attr('data-dis')){
          isRelevant = false;
        
          
        }

      

        var isChecked = $checkbox.is(':checked');

        localStorage.setItem("checked", isChecked);

        // an dem punkt weißt du:
        // eine checkbox hat sich geändert
        // ob die checkbox "relevant" is
        // ob die checkbox angehackt ist oder nicht
        // d.h. du hast vier fälle
        // bei denen passiert im prinzip immer dassgleiche
        // zahlen updaten
        // elemente updaten
        // im anschluss den gelbe statzs updaten

        // ist relavant und gecheckt
        if(isRelevant=== true && isChecked === true){

          numberOfCheckedRelevantCheckboxes += 1;

          var ruledis = $(this).data('ruledis');
          $("[data-ruletog='" + ruledis + "']").attr("disabled", "disabled");
          
        
          
        }

        // ist relavant und nicht gecheckt
        if(isRelevant === true && isChecked === false){

          numberOfCheckedRelevantCheckboxes -= 1;

          var ruledis = $(this).data('ruledis');
          $("[data-ruletog='" + ruledis + "']").attr("disabled", null);
          
        }

        // ist nicht relavant und gecheckt
        if(isRelevant === false && isChecked === true){
          
          numberOfRelevantCheckboxes -= 1;
          numberOfUnrelevantCheckboxes += 1

          var ruletog = $(this).data('ruletog');
          $("[data-ruledis='" + ruletog + "']").attr("disabled", "disabled");
         
        }

        // ist nicht relavant und nicht gecheckt (Dann weißt Du auch, dass die mal gecheckt war)
        if(isRelevant === false && isChecked === false){
          
          numberOfRelevantCheckboxes += 1;
          numberOfUnrelevantCheckboxes -= 1

          var ruletog = $(this).data('ruletog');
          $("[data-ruledis='" + ruletog + "']").attr("disabled", null);
          

        }


        updateStatus();

    
       

    });


    $(".result").click(function(e) {
      e.preventDefault();
      $("#overlay").fadeIn();
      $(".overlay_container").css({top:1000,position:'absolute'}).animate({top: '50%'}, 800, function() {
          return false;
      });
      
      $('main').attr('aria-hidden', 'true').attr("tabindex", -1).addClass('ws10-no-scroll');
      $('button').attr("tabindex", -1);
      $('footer').css('display', 'none');
      $('a').attr("tabindex", -1);
      $('input').attr("tabindex", -1);
      $('.toggle-link').attr("tabindex", -1);
      $('.close').attr("tabindex", 1);
      $('.tabenable').attr("tabindex", 1);


      var rule = $('input[name="a11y-rule"]');
      var chtml = "<h4>Considered (" + numberOfCheckedRelevantCheckboxes + ")</h4><ul class='checkmark'>";
      var uchtml = "<h4>Needs to be improved (" + (numberOfRelevantCheckboxes-numberOfCheckedRelevantCheckboxes) + ")</h4><ul class='fail'>";
      var dischtml = "<h4>Not relevant (" + numberOfUnrelevantCheckboxes + ")</h4><ul class='fail'>";
    
      $.each(rule, function() {
        var $this = $(this);
    
        if ($this.is(":checked") && !$($this).prop('disabled')) {
          
          chtml += "<li>"+$this.val()+" </li>";
         
        }

        
        if (!$this.is(":checked") && !$($this).prop('disabled')) {
         
          uchtml += "<li><span class='error-circle'></span><span class='ect'>" + $this.val() + " </span></li>";
          
          
        }
    
        if (!$this.is(":checked") && $($this).prop('disabled')) {
        dischtml += "<li><span class='disable-circle'></span><span class='ect'>" + $this.val() + " </span></li>";
         
        }
    
    });
    
    
    
    chtml += "</ul>";
    

    
    $("#resultchecked").html(chtml);
     $("#resultunchecked").html(uchtml);
     $("#rulesdisabled").html(dischtml);
    
     return false;
    
    });
    
    
    $(".close").click(function() {
      $("#overlay").fadeOut();
      $(".overlay_container").css({top:'50%',position:'absolute'}).animate({top: 1000}, 800, function() {
          //callback
      });
      $('main').removeAttr('aria-hidden', 'true').removeAttr("tabindex", -1).removeClass('ws10-no-scroll');
      $('button').attr("tabindex", 1);
      $('footer').css('display', 'flex');
      $('a').attr("tabindex", 1);
      $('input').attr("tabindex", 1);
      $('.toggle-link').attr("tabindex", 1);
      $('.close').removeAttr("tabindex", 1);
      $('.tabenable').removeAttr("tabindex", 1);
      
    });
 

var monthNames = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];

var newDate = new Date();
newDate.setDate(newDate.getDate());    
$('#Date').html(newDate.getDate() + ' ' + monthNames[newDate.getMonth()] + ' ' + newDate.getFullYear());



  $(function(){
  $('.toggle-link').on('click', function() {
   var linkId = $(this).attr('data-div-id');
   var linkId2 = $(this).attr('data-label-id')
    $('#' + linkId).slideToggle();
    $(this).toggleClass("ws10-accordion-item__checked");
    $(".rule-description" + "[data-acc='" + linkId2 + "']").toggleClass("rule-description-highlight");
 });

 $('.toggle-link').keypress(function (e) {
 var key = e.which;
 if(key == 13)  // the enter key code
  {
    var linkId = $(this).attr('data-div-id');
    var linkId2 = $(this).attr('data-label-id')
    $('#' + linkId).slideToggle();
    $(this).toggleClass("ws10-accordion-item__checked");
    $(".rule-description" + "[data-acc='" + linkId2 + "']").toggleClass("rule-description-highlight");
    return false;  
  }
});  
 
});


/**
$('.reset-form').click(function(event) {
    $('input[type=checkbox]').prop('checked',false);
    $('input[type=checkbox]').prop('disabled',false);

  });
 */



$('.dropbtn').keypress(function (e) {
    var key = e.which;
    if(key == 13) 
    {

        if ($(".dropdown-content").css("display") == "none") {
            $(".dropdown-content").css("display","block");
            $(".dropbtn").addClass("dropbtn-key");
            $(".ws10-accordion-item__chevron--drop").addClass("ws10-accordion-item__chevron--drop-key");
            
        } else {    
            $(".dropdown-content").css("display","");
            $(".dropbtn").removeClass("dropbtn-key");
            $(".ws10-accordion-item__chevron--drop").removeClass("ws10-accordion-item__chevron--drop-key");
        }
    }
    return false; 
});


var KEYCODE_ESC = 27;

$(document).keyup(function(e) {
  if (e.keyCode == KEYCODE_ESC) {
    $(".dropdown-content").css("display","");
    $(".dropbtn").removeClass("dropbtn-key");
    $(".ws10-accordion-item__chevron--drop").removeClass("ws10-accordion-item__chevron--drop-key");

    $("#overlay").fadeOut();
      $(".overlay_container").css({top:'50%',position:'absolute'}).animate({top: 1000}, 800, function() {
          //callback
      });
      $('main').removeAttr('aria-hidden', 'true').removeAttr("tabindex", -1).removeClass('ws10-no-scroll');
      $('button').attr("tabindex", 1);
      $('footer').css('display', 'flex');
      $('a').attr("tabindex", 1);
      $('input').attr("tabindex", 1);
      $('.toggle-link').attr("tabindex", 1);
      $('.close').removeAttr("tabindex", 1);
      $('.tabenable').removeAttr("tabindex", 1);
    

  } 
});





    


    $('#search_field').on('keyup', function() {
      var value = $(this).val();
      var patt = new RegExp(value, "i");
    
      $('#a11y-checklist').find('tr').each(function() {
        var $table = $(this);
        
        if (!($table.find('label').text().search(patt) >= 0)) {
          $table.not('.heading div.dropdown td.heading').hide();
        }
        if (($table.find('label').text().search(patt) >= 0)) {
          $(this).show();
        }
        
        
      });

      
    });





$("#spec-brix-element").on("input", function(){
  $("#spectitle").text($(this).val());
});

$("#design-concept-title").on("input", function(){
  $("#designtitle").text($(this).val());
});

$("#cms-page-tite").on("input", function(){
  $("#cms-page-report").text($(this).val());
});

$("#reporter").on("input", function(){
  $("#reporter-report").text($(this).val());
});

$("#reporter-email").on("input", function(){
  $("#reporter-email-report").text($(this).val());
});


$("#project-detail").on("input", function(){
  $("#project-detail-report").text($(this).val());
});

$("#page-url").on("input", function(){
  $("#page-url-report").text($(this).val());
});





    function downloadInnerHtml(filename, elId, mimeType) {
      var elHtml = document.getElementById(elId).innerHTML;
      var link = document.createElement('a');
      mimeType = mimeType || 'data:text/html;base64';
  
      link.setAttribute('download', filename);
      link.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + (encodeURIComponent(elHtml)));
      link.click(); 
  }

  var fileNameSpec = 'vf-a11y-report-ui-spec-'; 
  var fileNameDesign = 'vf-a11y-report-design-concept-'; 
  var fileNameCms = 'vf-a11y-report-cms-page-';
  
  $('#save-spec-report').click(function(){

      downloadInnerHtml(fileNameSpec + ($("#spectitle").text().replace(/\s+/gim, '-').replace(/[àèìáéíóúàèìòùâêîôûãõç.!?="'()§$%&/#*;+^¡“¶¢[]{}≠¿']+/gim, '').replace(/[ä]+/gim, 'ae').replace(/[ü]+/gim, 'ue').replace(/[ö]+/gim, 'oe').replace(/[ß]+/gim, 'ss').replace(/[:]+/gim, '-').replace(/[,]+/gim, '')).toLowerCase() + '.html', 'export-inner','text/html');
  
    });
  

    $('#save-design-report').click(function(){

      downloadInnerHtml(fileNameDesign + ($("#designtitle").text().replace(/\s+/gim, '-').replace(/[àèìáéíóúàèìòùâêîôûãõç.!?="'()§$%&/#*;+^¡“¶¢[]{}≠¿']+/gim, '').replace(/[ä]+/gim, 'ae').replace(/[ü]+/gim, 'ue').replace(/[ö]+/gim, 'oe').replace(/[ß]+/gim, 'ss').replace(/[:]+/gim, '-').replace(/[,]+/gim, '')).toLowerCase() + '.html', 'export','text/html');
  
    });
  

    $('#save-cms-report').click(function(){

      downloadInnerHtml(fileNameCms + ($("#cms-page-report").text().replace(/\s+/gim, '-').replace(/[àèìáéíóúàèìòùâêîôûãõç.!?="'()§$%&/#*;+^¡“¶¢[]{}≠¿']+/gim, '').replace(/[ä]+/gim, 'ae').replace(/[ü]+/gim, 'ue').replace(/[ö]+/gim, 'oe').replace(/[ß]+/gim, 'ss').replace(/[:]+/gim, '-').replace(/[,]+/gim, '')).toLowerCase() + '.html', 'export','text/html');
  
    });
  

    var tabIndexService = function (glHtml) {
      var itemsRearangeForBurgerViewport = [glHtml.getElementsByClassName('brix-gn__logo')[0]];
      var iconNavLinks = glHtml.getElementsByClassName('brix-gn__icon-nav-link');
      Array.from(iconNavLinks).forEach(function (el, index) {
          itemsRearangeForBurgerViewport[index + 1] = el;
      });
      var itemsRearangeForDesktopViewport = [];
      var metaNavLinks = glHtml.getElementsByClassName('brix-gn__meta-nav-link');
      Array.from(metaNavLinks).forEach(function (el, index) {
          itemsRearangeForDesktopViewport[index + 1] = el;
      });
      var setTabIndices = function (arr01, arr02) {
          glHtml.getElementsByClassName('brix-gn__skip-to-content')[0].getElementsByTagName('a')[0].setAttribute('tabindex', '1');
          glHtml.getElementsByClassName('brix-gn__skip-to-content')[0].getElementsByTagName('a')[1].setAttribute('tabindex', '2');
          arr01.forEach(function (elm, index) {
              elm.setAttribute('tabindex', "" + (index + 2));
          });
          arr02.forEach(function (elm, index) {
              elm.setAttribute('tabindex', "0");
          });
      };
      // listen to viewport changes
      var handleViewPortChange = function () {
          glHtml.getElementsByClassName('brix-gn__skip-to-content')[0].getElementsByTagName('a')[0].setAttribute('tabindex', '1');
          checkIfBurgerViewport() ? setTabIndices(itemsRearangeForBurgerViewport, itemsRearangeForDesktopViewport) : setTabIndices(itemsRearangeForDesktopViewport, itemsRearangeForBurgerViewport);
      };
      handleViewPortChange();
      return handleViewPortChange;
  };



    var skipToService = function (glHtml) {
      // const links = glHtml.querySSelectorAll('.brix-gn__skip-to-content a');
      var skipToContainer = glHtml.getElementsByClassName('brix-gn__skip-to-content')[0];
      Array.from(skipToContainer.children).forEach(function (link) {
          link.addEventListener('keydown', function (e) {
              // open submenu
              if ((e.code === 'Space' || e.code === 'Enter')) {
                  e.preventDefault();
                  openLink(link);
              }
          });
      });
  };


 


    $('.brix-gn__burger-label').on('click', function() {
      $('.burger-icon-show').toggleClass("burger-icon-hide");
      $('.burger-close-icon-hide').toggleClass("burger-close-icon-show");
      $('#mobile-nav').toggleClass("show");
   });

   $('.brix-gn__burger-label').keypress(function (e) {
    var key = e.which;
    if(key == 13)  // the enter key code
     {
      $('.burger-icon-show').toggleClass("burger-icon-hide");
      $('.burger-close-icon-hide').toggleClass("burger-close-icon-show");
      $('#mobile-nav').toggleClass("show");
       return false;  
     }
   });