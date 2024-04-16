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

$.ajaxSetup({
  async: false
  });

$.getJSON("https://vodafone-de.github.io/accessibility-checklist/data.json",  
function (data) { 

  
  var bitvlist1 = '';
  var bitvlist2 = '';
  var bitvlist3 = '';
  var bitvlist4 = '';
  var bitvlist5 = '';
  var bitvlist6 = '';
  var bitvlist7 = '';
  var bitvlist8 = '';
  var bitvlist9 = '';
  var bitvlist10 = '';
  var bitvlist11 = '';
  var bitvlist12 = '';
  var bitvlist13 = '';
  var bitvlist14 = '';
  var bitvlist15 = '';
  var bitvlist16 = '';
  var bitvlist17 = '';
  var bitvlist18 = '';
  var bitvlist19 = '';

  
  var list1 = data.filter(function (entry1) {
    return entry1.applicable === 'yes' && entry1.category === 'Allgemeine Anforderungen';
});
  
  var list2 = data.filter(function (entry2) {
    return entry2.applicable === 'yes' && entry2.category === 'Zwei-Wege-Sprachkommunikation';
});

var list3 = data.filter(function (entry3) {
    return entry3.applicable === 'yes' && entry3.category === 'Videofähigkeiten';
});

var list4 = data.filter(function (entry4) {
    return entry4.applicable === 'yes' && entry4.category === 'Textalternativen';
});

var list5 = data.filter(function (entry5) {
    return entry5.applicable === 'yes' && entry5.category === 'Zeitbasierte Medien';
});

var list6 = data.filter(function (entry6) {
    return entry6.applicable === 'yes' && entry6.category === 'Anpassbar';
});

var list7 = data.filter(function (entry7) {
    return entry7.applicable === 'yes' && entry7.category === 'Unterscheidbar';
});

var list8 = data.filter(function (entry8) {
    return entry8.applicable === 'yes' && entry8.category === 'Per Tastatur zugänglich';
});

var list9 = data.filter(function (entry9) {
    return entry9.applicable === 'yes' && entry9.category === 'Ausreichend Zeit';
});

var list10 = data.filter(function (entry10) {
    return entry10.applicable === 'yes' && entry10.category === 'Anfälle';
});

var list11 = data.filter(function (entry11) {
    return entry11.applicable === 'yes' && entry11.category === 'Navigierbar';
});

var list12 = data.filter(function (entry12) {
    return entry12.applicable === 'yes' && entry12.category === 'Eingabemodalitäten';
});

var list13 = data.filter(function (entry13) {
    return entry13.applicable === 'yes' && entry13.category === 'Lesbar';
});

var list14 = data.filter(function (entry14) {
    return entry14.applicable === 'yes' && entry14.category === 'Vorhersehbar';
});

var list15 = data.filter(function (entry15) {
    return entry15.applicable === 'yes' && entry15.category === 'Hilfestellung bei der Eingabe';
});

var list16 = data.filter(function (entry16) {
    return entry16.applicable === 'yes' && entry16.category === 'Kompatibel';
});

var list17 = data.filter(function (entry17) {
    return entry17.applicable === 'yes' && entry17.category === 'Benutzerdefinierte Einstellungen';
});

var list18 = data.filter(function (entry18) {
    return entry18.applicable === 'yes' && entry18.category === 'Autorenwerkzeuge';
});

var list19 = data.filter(function (entry19) {
    return entry19.applicable === 'yes' && entry19.category === 'Dokumentation und Support';
});



  $.each(list1, function (key, value) { 

    bitvlist1 += '<li class="bitvlist acc-list">'; 

  

    bitvlist1 += '<span class="ws10-highlight-badge ws10-highlight-badge--gray ws10-highlight-badge--standard" aria-label="' + value.roles + '"><span class="ws10-highlight-badge__text">' + value.roles + '</span></span>';


    bitvlist1 += '<p class="bitv-step-number">' +  
    value.bitv + '</p>'; 


 bitvlist1 += '<div class="grid_item_checkbox"><input type="checkbox" id="a11y-rule-03-06" name="a11y-rule" data-ruledis="r-increase-text-200" data-disenable="a11y-rule-03-06" value="' + value.title +  '" class="rel-check ws10-form-selection-control__input" /><label class="rule-description" id="a11y-rule-03-06" data-acc="a11y-rule-03-06-acc">' +
 value.title + '</label></div>'; 



        


  bitvlist1 += '</li>'; 
                        });

  
  $('#list1').append(bitvlist1); 

  
  $.each(list2, function (key, value) { 

  bitvlist2 += '<li>'; 

  bitvlist2 += '<p>' +  
  value.bitv + '</p>'; 

  bitvlist2 += '</li>'; 
                        });

  $('#list2').append(bitvlist2);




$.each(list3, function (key, value) { 


bitvlist3 += '<li>'; 

bitvlist3 += '<p>' +  
value.bitv + '</p>'; 

bitvlist3 += '</li>'; 



                      });

$('#list3').append(bitvlist3); 

$.each(list4, function (key, value) { 

bitvlist4 += '<li>'; 

bitvlist4 += '<p>' +  
value.bitv + '</p>'; 

bitvlist4 += '</li>'; 
                      });

$('#list4').append(bitvlist4); 

$.each(list5, function (key, value) { 

bitvlist5 += '<li>'; 

bitvlist5 += '<p>' +  
value.bitv + '</p>'; 

bitvlist5 += '</li>'; 
                      });

$('#list5').append(bitvlist5); 

$.each(list6, function (key, value) { 

bitvlist6 += '<li>'; 

bitvlist6 += '<p>' +  
value.bitv + '</p>'; 

bitvlist6 += '</li>'; 
                      });

$('#list6').append(bitvlist6); 

                    
  
$.each(list7, function (key, value) { 

bitvlist7 += '<li>'; 

bitvlist7 += '<p>' +  
value.bitv + '</p>'; 

bitvlist7 += '</li>'; 
                      });

$('#list7').append(bitvlist7);    

$.each(list8, function (key, value) { 

bitvlist8 += '<li>'; 

bitvlist8 += '<p>' +  
value.bitv + '</p>'; 

bitvlist8 += '</li>'; 
                      });

$('#list8').append(bitvlist8);   
  
$.each(list9, function (key, value) { 

bitvlist9 += '<li>'; 

bitvlist9 += '<p>' +  
value.bitv + '</p>'; 

bitvlist9 += '</li>'; 
                      });

$('#list9').append(bitvlist9); 

$.each(list10, function (key, value) { 

bitvlist10 += '<li>'; 

bitvlist10 += '<p>' +  
value.bitv + '</p>'; 

bitvlist10 += '</li>'; 
                      });

$('#list10').append(bitvlist10); 

$.each(list11, function (key, value) { 

bitvlist11 += '<li>'; 

bitvlist11 += '<p>' +  
value.bitv + '</p>'; 

bitvlist11 += '</li>'; 
                      });

$('#list11').append(bitvlist11); 

$.each(list12, function (key, value) { 

bitvlist12 += '<li>'; 

bitvlist12 += '<p>' +  
value.bitv + '</p>'; 

bitvlist12 += '</li>'; 
                      });

$('#list12').append(bitvlist12); 

$.each(list13, function (key, value) { 

bitvlist13 += '<li>'; 

bitvlist13 += '<p>' +  
value.bitv + '</p>'; 

bitvlist13 += '</li>'; 
                      });

$('#list13').append(bitvlist13); 

$.each(list14, function (key, value) { 

bitvlist14 += '<li>'; 

bitvlist14 += '<p>' +  
value.bitv + '</p>'; 

bitvlist14 += '</li>'; 
                      });

$('#list14').append(bitvlist14); 

$.each(list15, function (key, value) { 

bitvlist15 += '<li>'; 

bitvlist15 += '<p>' +  
value.bitv + '</p>'; 

bitvlist15 += '</li>'; 
                      });

$('#list15').append(bitvlist15); 

$.each(list16, function (key, value) { 

bitvlist16 += '<li>'; 

bitvlist16 += '<p>' +  
value.bitv + '</p>'; 

bitvlist16 += '</li>'; 
                      });

$('#list16').append(bitvlist16); 

$.each(list17, function (key, value) { 

bitvlist17 += '<li>'; 

bitvlist17 += '<p>' +  
value.bitv + '</p>'; 

bitvlist17 += '</li>'; 
                      });

$('#list17').append(bitvlist17); 

$.each(list18, function (key, value) { 

bitvlist18 += '<li>'; 

bitvlist18 += '<p>' +  
value.bitv + '</p>'; 

bitvlist18 += '</li>'; 
                      });

$('#list18').append(bitvlist18); 

$.each(list19, function (key, value) { 

bitvlist19 += '<li>'; 

bitvlist19 += '<p>' +  
value.bitv + '</p>'; 

bitvlist19 += '</li>'; 
                      });

$('#list19').append(bitvlist19); 

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
  var fileNameDev = 'vf-a11y-report-frontend-dev-'; 
  var fileNameDesign = 'vf-a11y-report-design-concept-'; 
  var fileNameCms = 'vf-a11y-report-cms-page-';
  
  $('#save-spec-report').click(function(){

      downloadInnerHtml(fileNameSpec + ($("#spectitle").text().replace(/\s+/gim, '-').replace(/[àèìáéíóúàèìòùâêîôûãõç.!?="'()§$%&/#*;+^¡“¶¢[]{}≠¿']+/gim, '').replace(/[ä]+/gim, 'ae').replace(/[ü]+/gim, 'ue').replace(/[ö]+/gim, 'oe').replace(/[ß]+/gim, 'ss').replace(/[:]+/gim, '-').replace(/[,]+/gim, '')).toLowerCase() + '.html', 'export-inner','text/html');
  
    });

    $('#save-dev-report').click(function(){

      downloadInnerHtml(fileNameDev + ($("#spectitle").text().replace(/\s+/gim, '-').replace(/[àèìáéíóúàèìòùâêîôûãõç.!?="'()§$%&/#*;+^¡“¶¢[]{}≠¿']+/gim, '').replace(/[ä]+/gim, 'ae').replace(/[ü]+/gim, 'ue').replace(/[ö]+/gim, 'oe').replace(/[ß]+/gim, 'ss').replace(/[:]+/gim, '-').replace(/[,]+/gim, '')).toLowerCase() + '.html', 'export-inner','text/html');
  
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




