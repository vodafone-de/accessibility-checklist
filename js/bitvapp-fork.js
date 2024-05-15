$.ajaxSetup({
    async: false
    });

    $(document).ready(function() {
        let totalTaskIds = 0; // Variable für die Gesamtanzahl von taskid initialisieren
        let checkedCheckboxes = 0; // Variable für die angeklickten Checkboxen initialisieren
    
        // JSON von externer URL laden
        $.getJSON('https://vodafone-de.github.io/accessibility-checklist/data/data.json', function(jsonArray) {
            // Objekte nach Kategorien gruppieren
            const groupedByCategory = {};
            jsonArray.forEach(item => {
                const category = item.category;
                if (!groupedByCategory[category]) {
                    groupedByCategory[category] = [];
                }
                groupedByCategory[category].push(item);
    
                // Gesamtanzahl von taskid erhöhen
                if (item.dods) {
                    Object.keys(item.dods).forEach(taskType => {
                        totalTaskIds += item.dods[taskType].length;
                    });
                }
            });
    
            // Für jede Kategorie HTML erstellen und anhängen
            Object.keys(groupedByCategory).forEach(category => {
                const container = $('<div>').addClass('ws10-card'); // Klasse "ws10-card" hinzufügen
    
                // Accordion Header erstellen
                const accordionHeader = $('<div>').addClass('accordion-header');
                const accordionTitle = $('<div>').addClass('accordion-title');
                accordionTitle.append($('<h3>').text(category));
    
                // SVG für Accordion Toggle
                const accordionToggle = $('<div>').addClass('accordion-toggle');
                const svg = $('<svg class="ws10-accordion-item__chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><polyline class="st0" points="164 62 96 130 28 62" fill="none" stroke-linecap="round" stroke-miterlimit="10" stroke-width="8"></polyline></svg>');
                accordionToggle.append(svg);
    
                accordionHeader.append(accordionTitle, accordionToggle);
                container.append(accordionHeader);
    
                // Accordion Content erstellen
                const accordionContent = $('<div>').addClass('accordion-content');
                groupedByCategory[category].forEach(item => {
                    const innerDiv = $('<div>').attr('id', item.id);
                    innerDiv.append(`<span>${item.bitv}</span>`);
                    innerDiv.append(`<h4>${item.title}</h4>`);
                    const badgeGroup = $('<div>').addClass('badgegroup');
                    item.roles.forEach(role => {
                        badgeGroup.append(`<span class="${role}_filter">${role}</span>`);
                    });
                    innerDiv.append(badgeGroup);
                    if (item.dods) { // Überprüfen, ob dods existiert
                        const dodsDiv = $('<div>').addClass('dods');
                        Object.keys(item.dods).forEach(taskType => {
                            const ul = $('<ul>').addClass(taskType + 'tasks');
                            item.dods[taskType].forEach(task => {
                                const li = $('<li>').attr('id', task.taskid);
                                li.append($('<h5>').addClass('taskdesc').text(task.taskdesc));
    
                                // Checkboxen hinzufügen
                                const checkboxDiv = $('<div>').addClass('checkboxes');
                                const passCheckbox = $('<input>').attr({type: 'checkbox', id: 'pass_' + task.taskid});
                                const passLabel = $('<label>').attr('for', 'pass_' + task.taskid).text('pass');
                                const failCheckbox = $('<input>').attr({type: 'checkbox', id: 'fail_' + task.taskid});
                                const failLabel = $('<label>').attr('for', 'fail_' + task.taskid).text('fail');
                                const applicableCheckbox = $('<input>').attr({type: 'checkbox', id: 'applicable_' + task.taskid}).prop('checked', true); // applicable Checkbox ist standardmäßig ausgewählt
                                const applicableLabel = $('<label>').attr('for', 'applicable_' + task.taskid).text('applicable');
                                checkboxDiv.append(passCheckbox, passLabel, failCheckbox, failLabel, applicableCheckbox, applicableLabel);
    
                                // Event-Handler für Checkboxen
                                passCheckbox.change(updateCheckedCount);
                                failCheckbox.change(updateCheckedCount);
                                applicableCheckbox.change(updateApplicableCount);
                                passCheckbox.change(function() {
                                    if ($(this).prop('checked')) {
                                        failCheckbox.prop('checked', false);
                                    }
                                    updateCheckedCount(); // Call updateCheckedCount function
                                });
                                failCheckbox.change(function() {
                                    if ($(this).prop('checked')) {
                                        passCheckbox.prop('checked', false);
                                    }
                                    updateCheckedCount(); // Call updateCheckedCount function
                                });

                          
    
                                li.append(checkboxDiv);
    
                                li.append($('<span>').addClass('tasktype').text(task.tasktype));
                                const taskCatDiv = $('<div>').addClass('taskcat');
                                task.taskcat.forEach(cat => {
                                    taskCatDiv.append($('<span>').text(cat));
                                });
                                li.append(taskCatDiv);
                                li.append($('<div>').addClass('testtool').text(task.testtool));
                                li.append($('<div>').addClass('testmethod').text(task.testmethod));
                                ul.append(li);
                            });
                            dodsDiv.append(ul);
                        });
                        innerDiv.append(dodsDiv);
                    }
                    accordionContent.append(innerDiv);
                });
                container.append(accordionContent);
    
                // Accordion Header Klick-Event
                accordionHeader.click(function() {
                    $(this).find('.accordion-toggle svg').toggleClass('rotate');
                    accordionContent.toggleClass('open');
    
                    if (accordionContent.hasClass('open')) {
                        accordionContent.css('max-height', accordionContent[0].scrollHeight + 'px');
                    } else {
                        accordionContent.css('max-height', '0');
                    }
                });
    
                $('body').append(container);
            });
    
            // Container für die Gesamtzahlen am Ende der Seite erstellen und anhängen
            const summaryContainer = $('<div>').addClass('summary-container');
            summaryContainer.append(`<p>Anzahl aller category Elemente: ${Object.keys(groupedByCategory).length}</p>`);
            summaryContainer.append(`<p>Anzahl aller taskid: <span class="total-task-ids">${totalTaskIds}</span></p>`);
            summaryContainer.append(`<p>Anzahl der erledigten Tasks: <span class="checked-count">${checkedCheckboxes}</span></p>`);
            $('body').append(summaryContainer);
    
            // Funktion zur Aktualisierung der angeklickten Checkboxen
function updateCheckedCount() {
    let previousChecked = checkedCheckboxes; // Vorherige Anzahl der ausgewählten Checkboxen
    let passChecked = 0; // Anzahl der ausgewählten pass-Checkboxen
    let failChecked = 0; // Anzahl der ausgewählten fail-Checkboxen
    
    // Iteriere durch alle Kategorien und summiere die ausgewählten Checkboxen
    $('.ws10-card').each(function() {
        passChecked += $(this).find('input[type="checkbox"][id^="pass_"]:checked').length;
        failChecked += $(this).find('input[type="checkbox"][id^="fail_"]:checked').length;
    });
    
    // Die Differenz zwischen der aktuellen Anzahl und der vorherigen Anzahl berechnen
    let difference = (passChecked + failChecked) - previousChecked;
    
    // Die Anzahl der ausgewählten Checkboxen aktualisieren
    checkedCheckboxes += difference;
    $('.checked-count').text(checkedCheckboxes);
}


    
// Funktion zur Aktualisierung der Anzahl der taskid
function updateApplicableCount() {
    const checkboxDiv = $(this).closest('.checkboxes');
    const isChecked = $(this).prop('checked');
    const isApplicable = $(this).hasClass('applicable');
    const isPassFailCheckbox = $(this).hasClass('pass') || $(this).hasClass('fail');

    if (isApplicable) {
        if (isChecked) {
            // Überprüfen, ob mindestens eine Checkbox mit den Labels "pass" oder "fail" ausgewählt ist
            const passFailChecked = $('.ws10-card').find('input[type="checkbox"][id^="pass_"]:checked').length > 0 ||
                $('.ws10-card').find('input[type="checkbox"][id^="fail_"]:checked').length > 0;
            // Wenn mindestens eine Checkbox mit den Labels "pass" oder "fail" ausgewählt ist, erhöhe den Wert von checkedCheckboxes
            if (passFailChecked) {
                checkedCheckboxes++;
                totalTaskIds++;
                checkboxDiv.closest('li').find('.taskdesc').removeClass('deactivated');
            }
        } else {
            // Wenn eine "applicable" Checkbox abgewählt wird, verringere den Wert von totalTaskIds
            if (totalTaskIds > 0) {
                totalTaskIds--;
            }
            checkboxDiv.closest('li').find('.taskdesc').addClass('deactivated');
        }
    } else if (isPassFailCheckbox) {
        // Wenn eine Checkbox mit den Labels "pass" oder "fail" angeklickt oder abgewählt wird
        if (isChecked) {
            checkedCheckboxes++;
        } else if (checkedCheckboxes > 0) {
            checkedCheckboxes--;
        }

        // Stellen Sie sicher, dass die Werte nicht negativ werden
        if (checkedCheckboxes < 0) {
            checkedCheckboxes = 0;
        }
    }

    // Aktualisieren Sie die angezeigten Zähler
    $('.checked-count').text(checkedCheckboxes);
    $('.total-task-ids').text(totalTaskIds);

    // Überprüfen und aktualisieren Sie den Status der "pass" und "fail" Checkboxen basierend auf dem "applicable" Zustand
    if (!isChecked && isPassFailCheckbox) {
        checkboxDiv.closest('li').find('input[type="checkbox"][id^="pass_"]').not('.applicable').prop('disabled', true);
        checkboxDiv.closest('li').find('input[type="checkbox"][id^="fail_"]').not('.applicable').prop('disabled', true);
    } else if (isPassFailCheckbox) {
        checkboxDiv.closest('li').find('input[type="checkbox"][id^="pass_"]').not('.applicable').prop('disabled', false);
        checkboxDiv.closest('li').find('input[type="checkbox"][id^="fail_"]').not('.applicable').prop('disabled', false);
    }
}


            
            
            

        });
    });
    