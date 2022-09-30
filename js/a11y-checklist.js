const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
$(function() {
if (prefersDark) {
  $('body').addClass('dark');
  $('.dark-mode-switcher').text('ON');
}
$('.dark-mode-switcher').on('click', function(e) {
  $('body').toggleClass('dark');

if ($('body').hasClass('dark')) {
    $('.dark-mode-switcher').text('ON'); }
    else {
        $('.dark-mode-switcher').text('OFF');
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


    if ($('.progress-bar').prop("style")["width"] !== '100%') { 
      
    }
    else {
      
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



/**
 * Checks that an element has a non-empty `name` and `value` property.
 * @param  {Element} element  the element to check
 * @return {Bool}             true if the element is an input, false if not
 */
 var isValidElement = function isValidElement(element) {
  return element.name && element.value;
};

/**
 * Checks if an element’s value can be saved (e.g. not an unselected checkbox).
 * @param  {Element} element  the element to check
 * @return {Boolean}          true if the value should be added, false if not
 */
var isValidValue = function isValidValue(element) {
  return !['checkbox', 'radio'].includes(element.type) || element.checked;
};

/**
 * Checks if an input is a checkbox, because checkboxes allow multiple values.
 * @param  {Element} element  the element to check
 * @return {Boolean}          true if the element is a checkbox, false if not
 */
var isCheckbox = function isCheckbox(element) {
  return element.type === 'checkbox';
};

/**
 * Checks if an input is a `select` with the `multiple` attribute.
 * @param  {Element} element  the element to check
 * @return {Boolean}          true if the element is a multiselect, false if not
 */
var isMultiSelect = function isMultiSelect(element) {
  return element.options && element.multiple;
};

/**
 * Retrieves the selected options from a multi-select as an array.
 * @param  {HTMLOptionsCollection} options  the options for the select
 * @return {Array}                          an array of selected option values
 */
var getSelectValues = function getSelectValues(options) {
  return [].reduce.call(options, function (values, option) {
    return option.selected ? values.concat(option.value) : values;
  }, []);
};

/**
 * A more verbose implementation of `formToJSON()` to explain how it works.
 *
 * NOTE: This function is unused, and is only here for the purpose of explaining how
 * reducing form elements works.
 *
 * @param  {HTMLFormControlsCollection} elements  the form elements
 * @return {Object}                               form data as an object literal
 */
var formToJSON_deconstructed = function formToJSON_deconstructed(elements) {

  // This is the function that is called on each element of the array.
  var reducerFunction = function reducerFunction(data, element) {

    // Add the current field to the object.
    data[element.name] = element.value;

    // For the demo only: show each step in the reducer’s progress.
    console.log(JSON.stringify(data));

    return data;
  };

  // This is used as the initial value of `data` in `reducerFunction()`.
  var reducerInitialValue = {};

  // To help visualize what happens, log the inital value, which we know is `{}`.
  console.log('Initial `data` value:', JSON.stringify(reducerInitialValue));

  // Now we reduce by `call`-ing `Array.prototype.reduce()` on `elements`.
  var formData = [].reduce.call(elements, reducerFunction, reducerInitialValue);

  // The result is then returned for use elsewhere.
  return formData;
};

/**
 * Retrieves input data from a form and returns it as a JSON object.
 * @param  {HTMLFormControlsCollection} elements  the form elements
 * @return {Object}                               form data as an object literal
 */
var formToJSON = function formToJSON(elements) {
  return [].reduce.call(elements, function (data, element) {

    // Make sure the element has the required properties and should be added.
    if (isValidElement(element) && isValidValue(element)) {

      /*
       * Some fields allow for more than one value, so we need to check if this
       * is one of those fields and, if so, store the values as an array.
       */
      if (isCheckbox(element)) {
        data[element.name] = (data[element.name] || []).concat(element.value);
      } else if (isMultiSelect(element)) {
        data[element.name] = getSelectValues(element);
      } else {
        data[element.name] = element.value;
      }
    }

    return data;
  }, {});
};

/**
 * A handler function to prevent default submission and run our custom script.
 * @param  {Event} event  the submit event triggered by the user
 * @return {void}
 */
var handleFormSubmit = function handleFormSubmit(event) {

  // Stop the form from submitting since we’re handling that with AJAX.
  event.preventDefault();

  // Call our function to get the form data.
  var data = formToJSON(form.elements);

  // Demo only: print the form data onscreen as a formatted JSON object.
  var dataContainer = document.getElementsByClassName('results__display')[0];

  // Use `JSON.stringify()` to make the output valid, human-readable JSON.
  dataContainer.textContent = JSON.stringify(data, null, "  ");



  // ...this is where we’d actually do something with the form data...
  downloadInnerHtml(fileName, 'JsonCompiled','text/html');



};

/*
 * This is where things actually get started. We find the form element using
 * its class name, then attach the `handleFormSubmit()` function to the 
 * `submit` event.
 */
var form = document.getElementsByClassName('contact-form')[0];
form.addEventListener('submit', handleFormSubmit);

function downloadInnerHtml(filename, elId, mimeType) {
    var elHtml = document.getElementById(elId).innerHTML;
    var link = document.createElement('a');
    mimeType = mimeType || 'text/plain';

    link.setAttribute('download', filename);
    link.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(elHtml));
    link.click(); 
}

var fileName =  'WebValues.json'; // You can use the .txt extension if you want

$('#downloadLink').click(function(){
    downloadInnerHtml(fileName, 'JsonCompiled','text/html');
});




$('.dropbtn').keypress(function (e) {
    var key = e.which;
    if(key == 13)  // the enter key code
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

});


var KEYCODE_ESC = 27;

$(document).keyup(function(e) {
  if (e.keyCode == KEYCODE_ESC) {
    $(".dropdown-content").css("display","");
    $(".dropbtn").removeClass("dropbtn-key");
    $(".ws10-accordion-item__chevron--drop").removeClass("ws10-accordion-item__chevron--drop-key");


  } 
});



    $('a[href^="#"]').click(function(){
        $($(this).attr("href")).addClass("highlight")
        setTimeout(function() {
            $(this).removeClass('highlight');
        }, 1000);
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



    $(".result").on("click", function() {

      var rule = $('[name="a11y-rule"]');

      var chtml = "<h4>Passed</h4><ul class='checkmark'>";
      var uchtml = "<h4>Failed</h4><ul class='fail'>";
      var dchtml = "<h4>Disabled</h4><ul class='fail'>";

      $.each(rule, function() {
        var $this = $(this);

        if($this.is(":checked")) {
          $("#resultchecked").show();
          chtml += "<li>"+$this.val()+" </li>";
        $("#resultchecked").html(chtml);
        }
        
        else if (!$this.is(":checked"))  {
          $("#resultchecked").hide();
          uchtml += "<li class='error-circle'><span class='ect'>" + $this.val() + " </span></li>";
          $("#resultunchecked").html(uchtml);
  
        }

        else if ($this.prop('disabled'))  {
          
          dchtml += "<li class='error-circle'><span class='ect'>" + $this.val() + " </span></li>";
          $("#resultdchecked").html(dchtml);
  
        }
        


      });	

      chtml += "</ul>";


    });





  


   