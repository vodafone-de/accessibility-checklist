$(document).ready(function() {

    function createSummaryOverlay() {
        const overlay = $(`
            <div class="slide-in-overlay-container">
                <div id="summary-overlay" class="ws10-overlay ws10-fade ws10-overlay--spacing ws10-overlay--align-left" style="display: none;">
                    <div class="ws10-overlay__container">
                        <div class="ws10-overlay__close">
                            <button id="close-summary-overlay" aria-label="Close" class="ws10-button-icon-only ws10-button-icon-only--tertiary ws10-button-icon-only--floating ws10-button-icon-only--standard close">
                                <svg id="close-icon" class="ws10-button-icon-only__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
                                    <line class="st0" x1="44" y1="148" x2="148" y2="44" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8.67"></line>
                                    <line class="st0" x1="148" y1="148" x2="44" y2="44" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8.67"></line>
                                </svg>
                            </button>
                        </div>
                        <div class="summary-overlay-content ws10-overlay__content"></div>
                    </div>
                </div>
                <div class="ws10-overlay__backdrop-white ws10-fade ws10-in" style="display: none;"></div>
            </div>
        `);
        
        $('body').append(overlay);
    }

    function openSummaryOverlay() {
        const state = JSON.parse(localStorage.getItem('filterState'));
        const jsonArray = JSON.parse(localStorage.getItem('jsonArray')); // Abrufen der JSON-Daten
        const summaryContent = $('.summary-overlay-content');

        console.log("State: ", state); // Debug-Ausgabe
        console.log("JSON Array from localStorage: ", jsonArray); // Debug-Ausgabe

        if (state && jsonArray) {
            let contentHtml = '<h5>Summary Overview</h5>';
            
            // Liste der anwendbaren Prüfschritte
            contentHtml += '<h6>Applicable:</h6>';
            contentHtml += '<ul>';
            
            console.log("Selected Radios: ", state.selectedRadios); // Debug-Ausgabe
            console.log("Applicable Checkboxes: ", state.applicableCheckboxes); // Debug-Ausgabe

            for (const [key, value] of Object.entries(state.selectedRadios)) {
                if (state.applicableCheckboxes[key]) {
                    const taskDetails = getTaskDetails(key, jsonArray);
                    console.log("Task Details for key ", key, ": ", taskDetails); // Debug-Ausgabe
                    contentHtml += `<li>${taskDetails.title} - ${value === 'pass' ? 'pass' : 'fail'}</li>`;
                    contentHtml += `<ul>`;
                    contentHtml += `<li>Roles: ${taskDetails.roles.join(', ')}</li>`;
                    contentHtml += `<li>Description: ${taskDetails.taskdesc}</li>`;
                    contentHtml += `</ul>`;
                }
            }
            contentHtml += '</ul>';

            // Liste der nicht anwendbaren Prüfschritte
            contentHtml += '<h6>Not applicable:</h6>';
            contentHtml += '<ul>';
            for (const [key, value] of Object.entries(state.applicableCheckboxes)) {
                if (!value) {
                    const taskDetails = getTaskDetails(key, jsonArray);
                    console.log("Task Details for non-applicable key ", key, ": ", taskDetails); // Debug-Ausgabe
                    contentHtml += `<li>${taskDetails.title}</li>`;
                    contentHtml += `<ul>`;
                    contentHtml += `<li>Roles: ${taskDetails.roles.join(', ')}</li>`;
                    contentHtml += `<li>Description: ${taskDetails.taskdesc}</li>`;
                    contentHtml += `</ul>`;
                }
            }
            contentHtml += '</ul>';

            console.log("Generated HTML: ", contentHtml); // Debug-Ausgabe

            summaryContent.html(contentHtml);
            $('#summary-overlay').css('display', 'block').addClass('ws10-in');
            $('.ws10-overlay__backdrop-white').css('display', 'block').addClass('ws10-in');
            $('.ws10-overlay__container').css('transform', 'translateX(-50%) translateY(-50%)');
            $('body').addClass('ws10-no-scroll');
        } else {
            summaryContent.html('<p>No summary available.</p>');
        }
    }

    function getTaskDetails(taskId, jsonArray) {
        console.log("Looking for Task ID: ", taskId); // Debug-Ausgabe
        for (const item of jsonArray) {
            if (item.id === taskId) {
                const roles = item.roles ? item.roles : [];
                const taskdesc = item.dods && item.dods.audittasks ? item.dods.audittasks[0].taskdesc : '';
                console.log("Task Details Found: ", {
                    title: item.title,
                    roles: roles,
                    taskdesc: taskdesc
                }); // Debug-Ausgabe
                return {
                    title: item.title,
                    roles: roles,
                    taskdesc: taskdesc
                };
            }
        }
        console.log("Task Details Not Found for ID: ", taskId); // Debug-Ausgabe
        return {
            title: '',
            roles: [],
            taskdesc: ''
        };
    }
    
    

    function closeSummaryOverlay() {
        $('#summary-overlay').removeClass('ws10-in').css('display', 'none');
        $('.ws10-overlay__backdrop-white').removeClass('ws10-in').css('display', 'none');
        $('body').removeClass('ws10-no-scroll');
        $('.ws10-overlay__container').css('transform', 'translateX(0) translateY(0)');
    }

    $(document).on('click', '#open-summary-overlay', function() {
        openSummaryOverlay();
    });

    $(document).on('click', '#close-summary-overlay', function() {
        closeSummaryOverlay();
    });

    $(document).on('click', '.ws10-overlay__backdrop', function() {
        closeSummaryOverlay();
    });

    createSummaryOverlay();
});
