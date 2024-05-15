$(document).ready(function() {
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
        });

        // Variablen für Zähler initialisieren
        let fieldsetCount = 0;
        let selectedRadioCount = 0;

        // Für jede Kategorie HTML erstellen und anhängen
        Object.keys(groupedByCategory).forEach(category => {
            const container = $('<div>').addClass('ws10-card'); // Klasse "ws10-card" hinzufügen
            container.append(`<h3>${category}</h3>`);
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
                            li.append($('<span>').addClass('tasktype').text(task.tasktype));
                            const taskCatDiv = $('<div>').addClass('taskcat');
                            task.taskcat.forEach(cat => {
                                taskCatDiv.append($('<span>').text(cat));
                            });
                            li.append(taskCatDiv);
                            li.append($('<div>').addClass('testtool').text(task.testtool));
                            li.append($('<div>').addClass('testmethod').text(task.testmethod));
                            const fieldset = $('<fieldset>').addClass('status-options');
                            const radioLegend = $('<legend>').text('Status');
                            const passRadio = $('<input>').attr({type: 'radio', name: 'status_' + task.taskid, id: 'pass_' + task.taskid, value: 'pass'});
                            const passLabel = $('<label>').attr('for', 'pass_' + task.taskid).text('pass');
                            const failRadio = $('<input>').attr({type: 'radio', name: 'status_' + task.taskid, id: 'fail_' + task.taskid, value: 'fail'});
                            const failLabel = $('<label>').attr('for', 'fail_' + task.taskid).text('fail');

                           // Eventlistener für Radio Buttons hinzufügen
passRadio.on('change', function() {
    if ($(this).is(':checked') && !$(this).closest('fieldset').data('isChecked')) {
        selectedRadioCount++;
        $(this).closest('fieldset').data('isChecked', true);
        updateCounter();
    }
});

failRadio.on('change', function() {
    if ($(this).is(':checked') && !$(this).closest('fieldset').data('isChecked')) {
        selectedRadioCount++;
        $(this).closest('fieldset').data('isChecked', true);
        updateCounter();
    }
});

                            fieldset.append(radioLegend, passRadio, passLabel, failRadio, failLabel);
                            li.append(fieldset);

                            const applicableCheckbox = $('<input>').attr({type: 'checkbox', id: 'applicable_' + task.taskid, name: 'applicable_' + task.taskid});
                            const applicableLabel = $('<label>').attr('for', 'applicable_' + task.taskid).text('applicable');
                            li.append(applicableCheckbox, applicableLabel);

                            ul.append(li);
                            fieldsetCount++; // Zähler für Fieldset erhöhen
                        });
                        dodsDiv.append(ul);
                    });
                    innerDiv.append(dodsDiv);
                }
                container.append(innerDiv);
            });
            $('body').append(container);
        });

        // Funktion zur Aktualisierung des Zählers aufrufen
        function updateCounter() {
            $('#counter').html(`<p>Anzahl Tasks: ${fieldsetCount} </p> <p>Anzahl erledigte Tasks: ${selectedRadioCount}</p>`);
        }

        // Separates div für Zähler hinzufügen
        $('body').append($('<div>').attr('id', 'counter'));
        updateCounter(); // Zähler initial aktualisieren
    });
});
