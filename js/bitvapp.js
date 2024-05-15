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

                            // Radio Buttons und Checkboxen hinzufügen
                            const radioFieldset = $('<fieldset>');
                            const radioLegend = $('<legend>').text('Status');
                            const passRadio = $('<input>').attr({type: 'radio', name: 'status_' + task.taskid, id: 'pass_' + task.taskid});
                            const passLabel = $('<label>').attr('for', 'pass_' + task.taskid).text('pass');
                            const failRadio = $('<input>').attr({type: 'radio', name: 'status_' + task.taskid, id: 'fail_' + task.taskid});
                            const failLabel = $('<label>').attr('for', 'fail_' + task.taskid).text('fail');
                            const applicableCheckbox = $('<input>').attr({type: 'checkbox', id: 'applicable_' + task.taskid}).prop('checked', true); // applicable Checkbox ist standardmäßig ausgewählt
                            const applicableLabel = $('<label>').attr('for', 'applicable_' + task.taskid).text('applicable');

                            li.append(radioFieldset.append(radioLegend, passRadio, passLabel, failRadio, failLabel));
                            li.append(applicableCheckbox, applicableLabel);

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
        summaryContainer.append(`<p>Prüfkategoerien: ${Object.keys(groupedByCategory).length}</p>`);
        summaryContainer.append(`<p>Zu erledigende Tasks: <span class="total-task-ids">${totalTaskIds}</span></p>`);
        summaryContainer.append(`<p>Erledigte Tasks: <span class="checked-count">${checkedCheckboxes}</span></p>`);
        $('body').append(summaryContainer);

        // Funktion zur Aktualisierung der angeklickten Checkboxen
        function updateCheckedCount() {
            let previousChecked = checkedCheckboxes; // Vorherige Anzahl der ausgewählten Checkboxen
            let passChecked = 0; // Anzahl der ausgewählten pass-Radio Buttons
            let failChecked = 0; // Anzahl der ausgewählten fail-Radio Buttons

            // Iteriere durch alle Kategorien und summiere die ausgewählten Radio Buttons
            $('.ws10-card').each(function() {
                const card = $(this);
                passChecked += card.find('input[type="radio"][id^="pass_"]:checked').length;
                failChecked += card.find('input[type="radio"][id^="fail_"]:checked').length;
            });

            // Die Differenz zwischen der aktuellen Anzahl und der vorherigen Anzahl berechnen
            let difference = (passChecked + failChecked) - previousChecked;

            // Die Anzahl der ausgewählten Radio Buttons aktualisieren
            checkedCheckboxes += difference;
            $('.checked-count').text(checkedCheckboxes);
        }

        // Event-Handler für Radio Buttons
        $('input[type="radio"]').change(updateCheckedCount);

// Event-Handler für die Checkbox mit dem Label "applicable"
$('input[type="checkbox"][id^="applicable_"]').change(function() {
    const checkbox = $(this);
    const li = checkbox.closest('li');
    const fieldset = li.find('fieldset');

    if (!checkbox.prop('checked')) {
        // Wenn die Checkbox deaktiviert wird
        if (checkedCheckboxes > 0) {
            // Wenn der Wert von checkedCheckboxes größer als 0 ist, verringere den Wert um 1
            checkedCheckboxes--;
            $('.checked-count').text(checkedCheckboxes);
        }
        // fieldset deaktivieren
        fieldset.prop('disabled', true);
    } else {
        // Wenn die Checkbox aktiviert wird
        // Überprüfe, ob ein Radio Button innerhalb des fieldset aktiviert ist
        const radiosInFieldset = fieldset.find('input[type="radio"]:checked');
        if (radiosInFieldset.length > 0 && radiosInFieldset.closest('li').is(li)) {
            checkedCheckboxes = 1;
            $('.checked-count').text(checkedCheckboxes);
        }
        // fieldset aktivieren
        fieldset.prop('disabled', false);
    }
});











    });
});
