$(document).ready(function() {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
        $('body').addClass('dark');
        $('.dark-mode-switcher').text('Dark mode OFF');
    }

    $('.dark-mode-switcher').on('click', function(e) {
        $('body').toggleClass('dark');
        $('.dark-mode-switcher').text($('body').hasClass('dark') ? 'Dark mode OFF' : 'Dark mode ON');
        e.preventDefault();
    });

    function updateQueryString() {
        const selectedFilters = $('#filter-options input[type="checkbox"]:checked').map(function() {
            return $(this).data('filter_id');
        }).get();
        const queryString = selectedFilters.length > 0 ? `?filters=${selectedFilters.join(',')}` : '';
        history.replaceState(null, '', `${location.pathname}${queryString}`);
    }

    function setFiltersFromQueryString() {
        const params = new URLSearchParams(window.location.search);
        const filters = params.get('filters');
        if (filters) {
            const filterArray = filters.split(',');
            filterArray.forEach(filterId => {
                $(`#filter-options input[data-filter_id="${filterId}"]`).prop('checked', true);
            });
        }
    }


        let fieldsetCount = 0;
        let selectedRadioCount = 0;
        let passCount = 0;
        let failCount = 0;
    
        function updateCounter() {
            const totalSelected = passCount + failCount;
            const passPercentage = totalSelected > 0 ? (passCount / totalSelected * 100).toFixed(2) : 0;
            const failPercentage = totalSelected > 0 ? (failCount / totalSelected * 100).toFixed(2) : 0;
            $('#counter').html(`
                <p>${selectedRadioCount} tasks done | ${Math.max(fieldsetCount, 0)} tasks left</p>
                <div class="progress">
                    <div class="progress-bar pass" style="width: ${passPercentage}%;">${passPercentage}%</div>
                    <div class="progress-bar fail" style="width: ${failPercentage}%;">${failPercentage}%</div>
                </div>
                <p>Pass checked: ${passCount} | Fail checked: ${failCount}</p>
              
            `);
        }
    
        function updateFieldsetCountAfterFiltering() {
            const visibleFieldsets = $('.accordion-content .dods ul li:visible');
            const newFieldsetCount = visibleFieldsets.length;
            fieldsetCount = newFieldsetCount;
            updateCounter();
        }
    
        function applyFilters() {
            const filters = $('#filter-options input[type="checkbox"]:checked').map(function() {
                return $(this).data('filter_id');
            }).get();
        
            $('.badgegroup span').hide();
            $('.accordion-content .dods ul').hide();
            $('.accordion-content .dods ul li').hide();
            $('.ws10-card').hide();
            $('div.roletitle').hide();  // Hier wird das div.roletitle versteckt
            $('div.roletitle + ul').hide();  // Hier wird das ul unterhalb von div.roletitle versteckt
        
            if (filters.length > 0) {
                filters.forEach(filter => {
                    $(`.badgegroup .${filter}_filter`).addClass("filteractive").show();
                    $(`.accordion-content .dods ul[class*="${filter}tasks"]`).each(function() {
                        $(this).show().find('li').show();
                    });
        
                    // Open the accordions that contain the filtered items
                    $(`.accordion-content:has(.dods ul[class*="${filter}tasks"])`).each(function() {
                        const accordionContent = $(this);
                        const accordionHeader = accordionContent.prev('.accordion-header');
                        accordionContent.addClass('open').css('max-height', accordionContent[0].scrollHeight + 'px');
                        accordionHeader.find('.ws10-accordion-item__chevron').addClass('rotate');
                    });
        
                    // Show the ul under div.roletitle if it contains filtered items
                    $(`div.roletitle + ul[class*="${filter}tasks"]`).each(function() {
                        $(this).show();
                        $(this).prev('div.roletitle').show();  // Hier wird das div.roletitle angezeigt, wenn das ul gezeigt wird
                    });
                });
        
                $('.ws10-card').each(function() {
                    const card = $(this);
                    let showCard = false;
        
                    filters.forEach(filter => {
                        if (card.find(`.badgegroup .${filter}_filter`).length > 0 || card.find(`.dods ul[class*="${filter}tasks"]`).length > 0) {
                            showCard = true;
                        }
                    });
        
                    if (showCard) {
                        card.show();
                    }
                });
            } else {
                $('.badgegroup span').removeClass("filteractive").show();
                $('.accordion-content .dods ul').show().find('li').show();
                $('.ws10-card').show();
                $('div.roletitle').show();  // Hier wird das div.roletitle angezeigt
                $('div.roletitle + ul').show();  // Hier wird das ul unterhalb von div.roletitle angezeigt
                // Close all accordions when no filters are applied
                $('.accordion-content').removeClass('open').css('max-height', '0');
                $('.accordion-header .ws10-accordion-item__chevron').removeClass('rotate');
            }
        
            adjustAccordionHeights();
            updateQueryString();
            updateFieldsetCountAfterFiltering();
        }
        
    
        function adjustAccordionHeights() {
            $('.accordion-content.open').each(function() {
                $(this).css('max-height', this.scrollHeight + 'px');
            });
        }
    
        // Function to reset all filters
        function resetFilters() {
            $('#filter-options input[type="checkbox"]').prop('checked', false);
            applyFilters();
        }
    
        // Initialize filters from the query string
        setFiltersFromQueryString();
    
        $.getJSON('https://vodafone-de.github.io/accessibility-checklist/data/data.json', function(jsonArray) {
            const groupedByCategory = {};
            jsonArray.forEach(item => {
                const category = item.category;
                if (!groupedByCategory[category]) {
                    groupedByCategory[category] = [];
                }
                groupedByCategory[category].push(item);
            });
    
            const filterHtml = `
            <div class="filter">
                <h4>Filter:</h4>
                <ul id="filter-options">
                    <li><div class="cat action" tabindex="0">
                        <label><input type="checkbox" value="filter_cm" data-filter_id="cm"><span class="ws10-text">Channel Management</span></label>
                    </div></li>
                    <li><div class="cat action" tabindex="0">
                        <label><input type="checkbox" value="filter_ux" data-filter_id="ux"><span class="ws10-text">User Experience</span></label>
                    </div></li>
                    <li><div class="cat action" tabindex="0">
                        <label><input type="checkbox" value="filter_dev" data-filter_id="dev"><span class="ws10-text">Frontend Development</span></label>
                    </div></li>
                    <li><div class="cat action" tabindex="0">
                        <label><input type="checkbox" value="filter_edt" data-filter_id="edt"><span class="ws10-text">Editorial</span></label>
                    </div></li>
                    <li><div class="cat action" tabindex="0">
                        <label><input type="checkbox" value="filter_testing" data-filter_id="testing"><span class="ws10-text">Testing</span></label>
                    </div></li>
                </ul>
                <button class="ws10-secondary-button" id="reset-filters">Filter zurücksetzen</button>
                <div style="clear:both"></div>
            </div>`;
            
            $('#content-wrapper').prepend(filterHtml);
    
            $('#filter-options input[type="checkbox"]').change(function() {
                applyFilters();
            });
    
            $('#reset-filters').click(function() {
                resetFilters();
            });
    
            Object.keys(groupedByCategory).forEach(category => {
                const container = $('<div>').addClass('ws10-card');
    
                const accordionHeader = $('<div>').addClass('accordion-header');
                const accordionTitle = $('<h4>').text(category).addClass('accordion-title');
    
                const accordionToggle = $('<div>').addClass('accordion-toggle');
                const svg = $('<svg aria-hidden="true" class="ws10-accordion-item__chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><polyline class="st0" points="164 62 96 130 28 62" fill="none" stroke-linecap="round" stroke-miterlimit="10" stroke-width="8"></polyline></svg>');
                accordionToggle.append(svg);
    
                accordionHeader.append(accordionTitle).append(accordionToggle);
                container.append(accordionHeader);
    
                const accordionContent = $('<div>').addClass('accordion-content').css('max-height', '0');
                groupedByCategory[category].forEach(item => {
                    const innerDiv = $('<div>').attr('id', item.id).addClass('bitvcontainer');
                    innerDiv.append(`<span class="bitvnr">${item.bitv}</span>`);
                    innerDiv.append(`<h5>${item.title}</h5>`);
    
                    const badgeGroup = $('<div>').addClass('badgegroup');
                    if (item.dods) {
                        const dodsKeys = Object.keys(item.dods);
                        const uniqueRoles = new Set(dodsKeys.map(key => key.replace('tasks', '')));
                        badgeGroup.append(`<div class="roles">Roles:</div>`);
                        uniqueRoles.forEach(role => {
                            badgeGroup.append(`<span class="${role}_filter">${role}</span>`);
                        });
                    }
                    innerDiv.append(badgeGroup);
    
                    if (item.dods) {
                        const dodsDiv = $('<div>').addClass('dods');
                        Object.keys(item.dods).forEach(taskType => {
                            const tasks = item.dods[taskType];
        
                            // Find the roletitle for the current task type
                            let roletitle = '';
                            if (tasks.length > 0 && tasks[0].roletitle) {
                                roletitle = tasks[0].roletitle;
                            }
        
                            // Create a div for the roletitle and append it to dodsDiv
                            if (roletitle) {
                                const roletitleDiv = $('<div>').addClass('roletitle').text(roletitle);
                                dodsDiv.append(roletitleDiv);
                            }
                            
                            const ul = $('<ul>').addClass(taskType + 'tasks');
                            tasks.forEach(task => {
                                // Skip the roletitle object
                                if (task.taskid) {
                                    const li = $('<li>').attr('id', task.taskid).addClass('taskContainer');
                                    li.append($('<div>').addClass('taskdesc').html(task.taskdesc));
                                    li.append($('<div>Type:</div>').addClass('tasktype-desc'));
                                    li.append($('<div>').addClass('tasktype').text(task.tasktype));
                                    const taskCatDiv = $('<div>').addClass('taskcat');
                                    taskCatDiv.append($('<div>').text('Tags:').addClass('roles'));
                                    task.taskcat.forEach(cat => {
                                        taskCatDiv.append($('<div>').text(cat).addClass('taglistitems'));
                                    });
                                    taskCatDiv.append($('<div style="clear:both"></div>'));
                                    li.append(taskCatDiv);
                                    li.append($('<div>').addClass('testtool').text(task.testtool));
                                    li.append($('<div>').addClass('testmethod').text(task.testmethod));
                                   
                                   
                                    const fieldset = $('<fieldset>').addClass('status-options');
                                    const radioLegend = $('<legend>').text('compliance').addClass('status-optionslegend');
                                    const passRadio = $('<input>').attr({ type: 'radio', name: 'status_' + task.taskid, id: 'pass_' + task.taskid, value: 'pass' }).addClass('ws10-form-selection-control__input');
                                    const passLabel = $('<label>').attr('for', 'pass_' + task.taskid).addClass('ws10-form-selection-control__label');
                                    passLabel.append($('<span>').addClass('ws10-form-selection-control__text').html('<p>pass</p>'));
                                    const failRadio = $('<input>').attr({ type: 'radio', name: 'status_' + task.taskid, id: 'fail_' + task.taskid, value: 'fail' }).addClass('ws10-form-selection-control__input');
                                    const failLabel = $('<label>').attr('for', 'fail_' + task.taskid).addClass('ws10-form-selection-control__label');
                                    failLabel.append($('<span>').addClass('ws10-form-selection-control__text').html('<p>fail</p>'));
                                    
        
                                    passRadio.on('change', function() {
                                        const fieldset = $(this).closest('fieldset');
                                        const previousValue = fieldset.data('previousValue');
                                        if (!fieldset.data('isChecked')) {
                                            selectedRadioCount++;
                                            fieldsetCount = Math.max(fieldsetCount - 1, 0);
                                            fieldset.data('isChecked', true);
                                        }
                                        if (previousValue === 'fail') {
                                            failCount--;
                                            passCount++;
                                        } else if (previousValue !== 'pass') {
                                            passCount++;
                                        }
                                        fieldset.data('previousValue', 'pass');
                                        updateCounter();
                                    });
        
                                    failRadio.on('change', function() {
                                        const fieldset = $(this).closest('fieldset');
                                        const previousValue = fieldset.data('previousValue');
                                        if (!fieldset.data('isChecked')) {
                                            selectedRadioCount++;
                                            fieldsetCount = Math.max(fieldsetCount - 1, 0);
                                            fieldset.data('isChecked', true);
                                        }
                                        if (previousValue === 'pass') {
                                            passCount--;
                                            failCount++;
                                        } else if (previousValue !== 'fail') {
                                            failCount++;
                                        }
                                        fieldset.data('previousValue', 'fail');
                                        updateCounter();
                                    });
                                    
                                    const resetButton = $('<div class="reset-button-container"><button class="reset-button"><svg class="reset-button-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><path class="st0" d="M108.84,155.75a60,60,0,0,0,1.72-120l-1.88,0a60,60,0,0,0-59.92,60v27.36" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/><polyline class="st0" points="77.44 95.6 48.76 123.11 20.86 95.6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/></svg></button></div>');                                    

                                   

                                    resetButton.on('click', function() {
                                        if (passRadio.is(':checked') || failRadio.is(':checked')) {
                                            if (passRadio.is(':checked')) {
                                                passCount--;
                                            } else {
                                                failCount--;
                                            }
                                            selectedRadioCount--;
                                            fieldsetCount++;
                                            passRadio.prop('checked', false);
                                            failRadio.prop('checked', false);
                                            fieldset.data('isChecked', false);
                                            fieldset.data('previousValue', null);
                                            updateCounter();
                                        }
                                    });
        
                                    fieldset.append(radioLegend, passRadio, passLabel, failRadio, failLabel, resetButton);
                                    li.append(fieldset);
        
                                    const applicableCheckbox = $('<input>').attr({ type: 'checkbox', id: 'applicable_' + task.taskid, name: 'applicable_' + task.taskid, checked: true });
                                    const applicableLabel = $('<label>').attr('for', 'applicable_' + task.taskid).text('applicable');
        
                                    const switchWrapper = $('<div>').addClass('switch');
                                    const slider = $('<span>').addClass('slider');
                                    switchWrapper.append(applicableCheckbox, slider, applicableLabel);
                                    li.append(switchWrapper);
                                    
        
                                    applicableCheckbox.on('change', function() {
                                        const isChecked = $(this).is(':checked');
                                        const fieldset = $(this).closest('li').find('fieldset');
                                        const selectedRadio = fieldset.find('input[type="radio"]:checked').val();
        
                                        if (isChecked) {
                                            fieldset.prop('disabled', false);
                                            resetButton.removeClass('reset-button-icon-disabled');
                                            if (!fieldset.data('isChecked')) {
                                                fieldsetCount++;
                                            }
                                            if (selectedRadio) {
                                                selectedRadioCount++;
                                                if (selectedRadio === 'pass') {
                                                    passCount++;
                                                } else if (selectedRadio === 'fail') {
                                                    failCount++;
                                                }
                                            }
                                        } else {
                                            fieldset.prop('disabled', true);
                                            resetButton.addClass('reset-button-icon-disabled');
                                            if (!fieldset.data('isChecked')) {
                                                fieldsetCount = Math.max(fieldsetCount - 1, 0);
                                            }
                                            if (selectedRadio) {
                                                selectedRadioCount--;
                                                if (selectedRadio === 'pass') {
                                                    passCount--;
                                                } else if (selectedRadio === 'fail') {
                                                    failCount--;
                                                }
                                            }
                                        }
                                        updateCounter();
                                    });
        
                                    switchWrapper.on('click', function() {
                                        applicableCheckbox.prop('checked', !applicableCheckbox.prop('checked')).trigger('change');
                                    });
        
                                    ul.append(li);
                                    fieldsetCount++;
                                }
                            });
                            dodsDiv.append(ul);
                        });
                        innerDiv.append(dodsDiv);
                    }
                    accordionContent.append(innerDiv);
                });
                container.append(accordionContent);
    
                accordionHeader.click(function() {
                    const chevron = $(this).find('.ws10-accordion-item__chevron');
                    chevron.toggleClass('rotate');
                    accordionContent.toggleClass('open');
    
                    if (accordionContent.hasClass('open')) {
                        accordionContent.css('max-height', accordionContent[0].scrollHeight + 'px');
                    } else {
                        accordionContent.css('max-height', '0');
                    }
                });
    
                $('#content-wrapper').append(container);
            });
    
            $('#content-wrapper').append($('<div>').attr('id', 'counter'));
            updateCounter();
    
            // Apply filters after JSON is loaded and DOM is updated
            setFiltersFromQueryString();
            applyFilters();
        });

    
});
