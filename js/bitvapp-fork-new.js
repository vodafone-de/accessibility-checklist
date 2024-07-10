$(document).ready(function() {

        function updateQueryString() {
        const selectedFilters = $('#filter-options input[type="checkbox"]:checked').map(function() {
            return $(this).data('filter_id');
        }).get();
        console.log('Selected Filters:', selectedFilters); // Debug-Ausgabe
    
        const selectedTaskFilters = $('#taskcat-dropdown input[type="checkbox"]:checked').map(function() {
            return $(this).data('filter_id');
        }).get();
        console.log('Selected Task Filters:', selectedTaskFilters); // Debug-Ausgabe
    
        let queryString = '';
    
        if (selectedFilters.length > 0) {
            queryString += `?role=${selectedFilters.join(',')}`;
        }
    
        if (selectedTaskFilters.length > 0) {
            if (queryString) {
                queryString += '&';
            } else {
                queryString += '?';
            }
            queryString += `tag=${selectedTaskFilters.join(',')}`;
        }
    
        console.log('Query String:', queryString); // Debug-Ausgabe
    
        history.replaceState(null, '', `${location.pathname}${queryString}`);
    }
    
    function setFiltersFromQueryString() {
        const params = new URLSearchParams(window.location.search);
        const filters = params.get('role');
        const taskfilters = params.get('tag');
        if (filters) {
            const filterArray = filters.split(',');
            filterArray.forEach(filterId => {
                $(`#filter-options input[data-filter_id="${filterId}"]`).prop('checked', true);
            });
        }
        if (taskfilters) {
            const taskfilterArray = taskfilters.split(',');
            taskfilterArray.forEach(taskfilterId => {
                $(`#taskcat-dropdown input[data-filter_id="${taskfilterId}"]`).prop('checked', true);
            });
        }
    }
    

    function saveState() {
        const state = {
            selectedRadios: {},
            applicableCheckboxes: {},
            comments: {},
            images: [], // Ensure this line is properly separated by a comma
            commentType: $('#comment-type').val() // Save the selected comment type
        };
    
        $('input[type="radio"]:checked').each(function() {
            state.selectedRadios[this.id] = this.checked;
        });
    
        $('input[type="checkbox"][id^="applicable_"]').each(function() {
            state.applicableCheckboxes[this.id] = this.checked;
        });
    
        $('li.taskContainer').each(function() {
            const taskId = $(this).attr('id');
            const comments = $(this).find('.comment-item').map(function() {
                return {
                    title: $(this).find('.comment-title').text().trim(),
                    text: $(this).data('comment-text'),
                    type: $(this).data('comment-type'),
                    images: $(this).data('images') || []
                };
            }).get();
            if (comments.length > 0) {
                state.comments[taskId] = comments;
            }
        });
    
        // Add this block to save images
        $('.uploaded-image-thumbnail').each(function() {
            const src = $(this).attr('src');
            if (src) {
                state.images.push(src);
            }
        });

       
        localStorage.setItem('filterState', JSON.stringify(state));

    }
    
    function loadState() {
        const auditInfo = JSON.parse(localStorage.getItem('auditInfo'));
        const state = JSON.parse(localStorage.getItem('filterState'));
        const savedText = localStorage.getItem('comment-title');
    
        if (state) {
            for (const [key, value] of Object.entries(state.selectedRadios)) {
                $(`#${key}`).prop('checked', value);
            }
    
            for (const [key, value] of Object.entries(state.applicableCheckboxes)) {
                $(`#${key}`).prop('checked', value).trigger('change');
            }
    
            for (const [taskId, comments] of Object.entries(state.comments)) {
                const container = $(`li.taskContainer#${taskId}`);
                const commentsContainer = container.find('.comments');
                comments.forEach(comment => {
                    const commentItem = $(`
                        <div class="comment-item" data-comment-text="${comment.text}" data-comment-type="${comment.type}" data-images='${JSON.stringify(comment.images)}'>
                            <div class="comment-title">${comment.title}</div>
                            <span class="comment-type-display">${comment.type}</span>
                            <button class="edit-comment-button overlayKeyOff commentFunctionsButtons">
                                <svg class="icon24" id="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
                                    <polyline class="st0" points="147.38 70.11 121.57 44.02 36.49 129.1 27.77 164 62.67 155.27 147.38 70.11" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
                                    <path class="st0" d="M121.57,44l12.79-12.79a11,11,0,0,1,15.63,0l18,18.22L147.38,70.11" fill="none" stroke-linecap="round" stroke-miterlimit="10" stroke-width="8"/>
                                    <line class="st0" x1="39.55" y1="126.1" x2="65.73" y2="152.28" fill="none" stroke-miterlimit="10" stroke-width="8"/>
                                </svg>
                            </button>
                            <button class="delete-comment-button overlayKeyOff commentFunctionsButtons">
                                <svg id="icon" class="icon24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
                                    <line class="st0" x1="112.01" y1="144" x2="112.01" y2="72" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
                                    <line class="st0" x1="80.01" y1="144" x2="80.01" y2="72" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
                                    <line class="st0" x1="36" y1="44" x2="156" y2="44" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
                                    <path class="st0" d="M120,44V36a16,16,0,0,0-16-16H88A16,16,0,0,0,72,36v8" fill="none" stroke-linejoin="round" stroke-width="8"/>
                                    <path class="st0" d="M148,44V156a16,16,0,0,1-16,16H60a16,16,0,0,1-16-16V44" fill="none" stroke-linejoin="round" stroke-width="8"/>
                                </svg>
                            </button>
                        </div>
                    `);
                    if (comment.images.length > 0) {
                        const imageThumbnailsContainer = $('<div class="comment-images-container"></div>');
                        comment.images.forEach(src => {
                            imageThumbnailsContainer.append(createImageThumbnail(src, true));
                        });
                        commentItem.append(imageThumbnailsContainer);
                    }
                    commentsContainer.append(commentItem);
                });
    
                if (comments.length > 0) {
                    commentsContainer.show();
                } else {
                    commentsContainer.hide();
                }
            }
    
            if (state.images && state.images.length > 0) {
                state.images.forEach(src => {
                    $('#image-thumbnails').append(createImageThumbnail(src));
                });
            }
    
            // Restore the saved comment type
            if (state.commentType) {
                $('#comment-type').val(state.commentType);
            }
        }
    }
          
    

    function clearState() {
        if (confirm('All checked elements will be reset. This can not be undone. Are you sure you want to proceed?')) {
            localStorage.removeItem('auditInfo');
            localStorage.removeItem('filterState');
            location.reload();
        }
    }

   // Anpassung für Dropdown-Menü in der Toolbar
  
    const dropdownButton = document.getElementById('toolBarDropdownButton');
    const dropdownMenu = document.getElementById('toolBarDropdownMenu');

    dropdownButton.addEventListener('click', () => {
        const isExpanded = dropdownButton.getAttribute('aria-expanded') === 'true';
        dropdownButton.setAttribute('aria-expanded', !isExpanded);
        dropdownMenu.style.display = isExpanded ? 'none' : 'block';
        dropdownMenu.setAttribute('aria-hidden', isExpanded);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeDropdown();
        }
    });

    document.addEventListener('click', (event) => {
        if (!dropdownButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
            closeDropdown();
        }
    });

    function closeDropdown() {
        dropdownButton.setAttribute('aria-expanded', 'false');
        dropdownMenu.style.display = 'none';
        dropdownMenu.setAttribute('aria-hidden', 'true');
    }

    // Keyboard accessibility for dropdown items
    const menuItems = dropdownMenu.querySelectorAll('button');
    let currentIndex = -1;

    dropdownButton.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            currentIndex = (currentIndex + 1) % menuItems.length;
            menuItems[currentIndex].focus();
        }
    });

    menuItems.forEach((item, index) => {
        item.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                currentIndex = (index + 1) % menuItems.length;
                menuItems[currentIndex].focus();
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                currentIndex = (index - 1 + menuItems.length) % menuItems.length;
                menuItems[currentIndex].focus();
            }
        });
    });

    

    function createImageThumbnail(src, forComment = false) {
        if (forComment) {
            return `<div class="imageThumbnail"><img src="${src}" class="uploadedImageThumbnail" tabindex="0" aria-label="View image in lightbox"></div>`;
        } else {
            return `
                <div class="image-thumbnail-container">
                    <img src="${src}" class="uploaded-image-thumbnail" tabindex="0" aria-label="View image in lightbox">
                    <button aria-label="Delete image" class="delete-image-button">
                        <svg id="icon" class="reset-button-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
                            <line class="st0" x1="112.01" y1="144" x2="112.01" y2="72" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
                            <line class="st0" x1="80.01" y1="144" x2="80.01" y2="72" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
                            <line class="st0" x1="36" y1="44" x2="156" y2="44" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
                            <path class="st0" d="M120,44V36a16,16,0,0,0-16-16H88A16,16,0,0,0,72,36v8" fill="none" stroke-linejoin="round" stroke-width="8"/>
                            <path class="st0" d="M148,44V156a16,16,0,0,1-16,16H60a16,16,0,0,1-16-16V44" fill="none" stroke-linejoin="round" stroke-width="8"/>
                        </svg>
                    </button>
                </div>
            `;
        }
    }
    





    function adjustAccordionHeight(element) {
        const accordionContent = element.closest('.accordion-content');
        if (accordionContent.hasClass('open')) {
            accordionContent.css('max-height', accordionContent[0].scrollHeight + 'px');
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
        const counterContent = `
            <p>${selectedRadioCount} tasks done | ${Math.max(fieldsetCount, 0)} tasks left</p>
           
            <div class="progress">
                <div class="progress-bar pass" style="width: ${passPercentage}%;">${passPercentage}%</div>
                <div class="progress-bar fail" style="width: ${failPercentage}%;">${failPercentage}%</div>
            </div>
            <p>Pass checked: ${passCount} | Fail checked: ${failCount}</p>
        `;
    
        $('#counter').html(counterContent);
       // Klone den Inhalt von #counter und füge ihn in #summaryOverlay-content ein
    const clonedContent = $('#counter').clone();
    $('#summaryOverlay-content').html(clonedContent.html());
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
    
        const taskCatFilters = $('#taskcat-dropdown input[type="checkbox"]:checked').map(function() {
            return $(this).val();
        }).get();
    
        $('.badgegroup span').removeClass("filteractive").show();
        $('.taglistitems').removeClass("categoryfilteractive").show();
        $('.accordion-content .dods ul').hide();
        $('.accordion-content .dods ul li').hide();
        $('.ws10-card').hide();
        $('div.roletitle').hide();
        $('div.roletitle + ul').hide();
        $('.bitvcontainer').hide();  // Hide all bitvcontainer elements initially
    
        const bothFiltersSelected = filters.length > 0 && taskCatFilters.length > 0;
    
        if (filters.length > 0 || taskCatFilters.length > 0) {
            filters.forEach(filter => {
                $(`.badgegroup .${filter}_filter`).addClass("filteractive").show();
                $(`.accordion-content .dods ul[class*="${filter}tasks"]`).each(function() {
                    $(this).show().find('li').show();
                });
    
                $(`.accordion-content:has(.dods ul[class*="${filter}tasks"])`).each(function() {
                    const accordionContent = $(this);
                    const accordionHeader = accordionContent.prev('.accordion-header');
                    accordionContent.addClass('open').css('max-height', accordionContent[0].scrollHeight + 'px');
                    accordionHeader.find('.ws10-accordion-item__chevron').addClass('rotate');
                });
    
                $(`div.roletitle + ul[class*="${filter}tasks"]`).each(function() {
                    $(this).show();
                    $(this).prev('div.roletitle').show();
                });
            });
    
            // Show ws10-card elements based on combined filters
            $('.ws10-card').each(function() {
                const card = $(this);
                let showCard = true;
    
                if (filters.length > 0) {
                    let hasFilter = false;
                    filters.forEach(filter => {
                        if (card.find(`.badgegroup .${filter}_filter`).length > 0 || card.find(`.dods ul[class*="${filter}tasks"]`).length > 0) {
                            hasFilter = true;
                        }
                    });
                    showCard = hasFilter;
                }
    
                if (taskCatFilters.length > 0) {
                    let hasTaskCatFilter = false;
                    taskCatFilters.forEach(taskCat => {
                        const containsExactText = card.find(`.taglistitems`).filter(function() {
                            return $(this).text().trim() === taskCat;
                        }).each(function() {
                            $(this).addClass("categoryfilteractive");
                        }).length > 0;
                        if (containsExactText) {
                            hasTaskCatFilter = true;
                        }
                    });
                    if (bothFiltersSelected) {
                        showCard = showCard && hasTaskCatFilter; // AND logic
                    } else {
                        showCard = hasTaskCatFilter; // OR logic if only taskCatFilters are selected
                    }
                }
    
                if (showCard) {
                    card.show();
                }
            });
    
            // Additional filtering for task containers inside cards
            $('li.taskContainer').each(function() {
                const li = $(this);
                let showLi = true;
    
                if (filters.length > 0) {
                    let hasFilter = false;
                    filters.forEach(filter => {
                        if (li.closest(`ul[class*="${filter}tasks"]`).length > 0) {
                            hasFilter = true;
                        }
                    });
                    showLi = hasFilter;
                }
    
                if (taskCatFilters.length > 0) {
                    let hasTaskCatFilter = false;
                    taskCatFilters.forEach(taskCat => {
                        const containsExactText = li.find(`.taglistitems`).filter(function() {
                            return $(this).text().trim() === taskCat;
                        }).length > 0;
                        if (containsExactText) {
                            hasTaskCatFilter = true;
                        }
                    });
                    if (bothFiltersSelected) {
                        showLi = showLi && hasTaskCatFilter; // AND logic
                    } else {
                        showLi = hasTaskCatFilter; // OR logic if only taskCatFilters are selected
                    }
                }
    
                if (showLi) {
                    li.show();
                    li.closest('ul').show();
                    li.closest('.dods').show();
                    li.closest('.ws10-card').show();
                    li.closest('ul').prev('div.roletitle').show();
                    li.closest('.bitvcontainer').show(); // Show the bitvcontainer containing the li
                } else {
                    li.hide();
                }
            });
    
            // Ensure bitvcontainer visibility is updated based on filters and taskCatFilters
            $('.bitvcontainer').each(function() {
                const container = $(this);
                let showContainer = false;
    
                container.find('li.taskContainer').each(function() {
                    const li = $(this);
                    let showLi = true;
    
                    if (filters.length > 0) {
                        let hasFilter = false;
                        filters.forEach(filter => {
                            if (li.closest(`ul[class*="${filter}tasks"]`).length > 0) {
                                hasFilter = true;
                            }
                        });
                        showLi = hasFilter;
                    }
    
                    if (taskCatFilters.length > 0) {
                        let hasTaskCatFilter = false;
                        taskCatFilters.forEach(taskCat => {
                            const containsExactText = li.find(`.taglistitems`).filter(function() {
                                return $(this).text().trim() === taskCat;
                            }).length > 0;
                            if (containsExactText) {
                                hasTaskCatFilter = true;
                            }
                        });
                        if (bothFiltersSelected) {
                            showLi = showLi && hasTaskCatFilter; // AND logic
                        } else {
                            showLi = hasTaskCatFilter; // OR logic if only taskCatFilters are selected
                        }
                    }
    
                    if (showLi) {
                        showContainer = true;
                    }
                });
    
                if (showContainer) {
                    container.show();
                } else {
                    container.hide();
                }
            });
    
        } else {
            // If no filters are selected, show all elements
            $('.badgegroup span').removeClass("filteractive").show();
            $('.accordion-content .dods ul').show().find('li').show();
            $('.ws10-card').show();
            $('div.roletitle').show();
            $('div.roletitle + ul').show();
            $('.accordion-content').removeClass('open').css('max-height', '0');
            $('.accordion-header .ws10-accordion-item__chevron').removeClass('rotate');
            $('.bitvcontainer').show();  // Show all bitvcontainer elements when no filters are selected
        }
    
        // Additional functions to update UI
        updateFilterNumberBadge();
        updateFilterNumberBadgeRoles();
        adjustAccordionHeights();
        updateQueryString();
        updateFieldsetCountAfterFiltering();
        saveState();
        updateDisplayedFilters();
        console.log("applyFilters " + selectedRadioCount);
    }
    
    /**Ende Filterlogik */
    
    function updateFilterNumberBadge() {
        $('.dropdown').each(function() {
            const dropdown = $(this);
            const checkedCount = dropdown.find('.dropdown-content input[type="checkbox"]:checked').length;
            let badge = dropdown.find('.filter-number-badge');
    
            if (checkedCount > 0) {
                if (badge.length === 0) {
                    badge = $('<div class="filter-number-badge" aria-label="amount of active tag-filter: ' + checkedCount + '" aria-live="polite"></div>');
                    dropdown.append(badge);
                }
                badge.text(checkedCount).show();
            } else {
                badge.hide();
            }
        });
    }

    function updateFilterNumberBadgeRoles() {
        $('.dropdown').each(function() {
            const dropdown = $(this);
            const checkedCount = dropdown.find('.dropdown-content-roles input[type="checkbox"]:checked').length;
            let badge = dropdown.find('.filter-number-badge-roles');
    
            if (checkedCount > 0) {
                if (badge.length === 0) {
                    badge = $('<div class="filter-number-badge-roles" aria-label="amount of active tag-filter: ' + checkedCount + '" aria-live="polite"></div>');
                    dropdown.append(badge);
                }
                badge.text(checkedCount).show();
            } else {
                badge.hide();
            }
        });
    }

    function updateDisplayedFilters() {
        const filterDiv = $('.filter');
        const selectedFilters = $('#filter-options input[type="checkbox"]:checked').map(function() {
            return { id: $(this).data('filter_id'), label: $(this).next('span').text() };
        }).get();
        const taskCatFilters = $('#taskcat-dropdown input[type="checkbox"]:checked').map(function() {
            return { id: $(this).val(), label: $(this).next('span').text() };
        }).get();

        const allSelectedFilters = [...new Map(selectedFilters.concat(taskCatFilters).map(filter => [filter.id, filter])).values()];

        const filterButtonsHtml = allSelectedFilters.map(filter => `
            <button aria-label="delete filter ${filter.label}" class="filter-button" data-filter_id="${filter.id}" aria-live="polite">
            <span class="remove-filter"><svg aria-hidden="true" id="filter-del-icon" class="ws10-button-icon-only__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
            <line class="st0" x1="44" y1="148" x2="148" y2="44" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8.67"></line>
            <line class="st0" x1="148" y1="148" x2="44" y2="44" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8.67"></line></svg>
            </span>   ${filter.label} 
            </button>
        `).join('');

        $('#selected-filters').html(filterButtonsHtml);

        $('.filter-button').click(function() {
            const filterId = $(this).data('filter_id');
            $(`#filter-options input[data-filter_id="${filterId}"], #taskcat-dropdown input[value="${filterId}"]`).prop('checked', false);
            applyFilters();
        });
    }

    function adjustAccordionHeights() {
        $('.accordion-content.open').each(function() {
            $(this).css('max-height', this.scrollHeight + 'px');
        });
    }


    

    function resetFilters() {
        $('#filter-options input[type="checkbox"]').prop('checked', false);
        $('#taskcat-dropdown input[type="checkbox"]').prop('checked', false);
        applyFilters();
    }

    setFiltersFromQueryString();


        
       
    const overlay = $(`<div class="slide-in-overlay-container">
        
        <div id="slide-in-overlay" aria-modal="true" role="dialog" class="ws10-overlay ws10-fade ws10-overlay--slide ws10-overlay--spacing ws10-overlay--align-left" style="display: none;"> //transform: translateX(100%);
            <div class="ws10-overlay__container">
                <div class="ws10-overlay__close">
                <button id="close-overlay" aria-label="Close" class="tabenable overlayKeyOn ws10-button-icon-only ws10-button-icon-only--tertiary ws10-button-icon-only--floating ws10-button-icon-only--standard close">
                <svg id="close-icon" class="ws10-button-icon-only__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
            
                        <line class="st0" x1="44" y1="148" x2="148" y2="44" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8.67"/>
                        <line class="st0" x1="148" y1="148" x2="44" y2="44" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8.67"/>
                  </svg>
                  
            </button>
                </div>
                <div class="testingOverlay-content ws10-overlay__content"></div>
            </div>
        </div>
        <div class="ws10-overlay__backdrop ws10-fade ws10-in" style="display: none;">
    </div>`);
    
    $('body').append(overlay);
    
    $('#content-wrapper').on('click', '#open-overlay', function() {
        const li = $(this).closest('li');
        const head5 = li.closest('.bitvcontainer').find('h5'); // li in der Nähe der .bitvcontainer suchen
        const taskDesc = li.find('.taskdesc').html();
        const itemTitle = head5.html(); // Den Inhalt des <h5> Elements holen
        const testTool = li.find('.testtool').html();
        const testMethod = li.find('.testmethod').html();
        const testToolLink = li.find('.testtoollink').html();
    
        const overlayContent = $('.testingOverlay-content');
    
        if (itemTitle) {
            overlayContent.html(`
                <div>
                    <h5>${itemTitle}</h5>
                    <p>${taskDesc}</p>
                    <p>Test Tool: ${testTool}</p>
                    <p>Test Method: ${testMethod}</p>
                    <p>Test Tool Link: ${testToolLink}</p>
                </div>
            `);
            $('#slide-in-overlay').css('display', 'block').addClass('ws10-in'); /*.css('transform', 'translateX(0)')*/
            $('.ws10-overlay__backdrop').css('display', 'block').addClass('ws10-in').css('transform', 'translateX(0)');
            $('body').attr('aria-hidden', 'true').attr("tabindex", -1).addClass('ws10-no-scroll');
            $('footer').css('display', 'none');
            $('#close-overlay').attr("tabindex", 1);
            $('.tabenable').attr("tabindex", 1);
            $('.toolBarItem').attr("tabindex", -1);
            $('.action').attr("tabindex", -1);
            $('.dropdown-button').attr("tabindex", -1);
            $('.reset-button').attr("tabindex", -1);
            $('.open-overlay').attr("tabindex", -1);
            $('#reset-filters').attr("tabindex", -1);
            $('a').attr("tabindex", -1);
            $('input').attr("tabindex", -1);
        } else {
            console.error('No content found for overlay.');
        }
    });
    
    

    $('.slide-in-overlay-container').on('click', '.ws10-overlay__backdrop', function() {
        $('#slide-in-overlay').removeClass('ws10-in').css('display', 'none'); /*.css('transform', 'translateX(100%)') */
        $('.ws10-overlay__backdrop').css('transform', 'translateX(100%)').removeClass('ws10-in').css('display', 'none');
        $('body').removeAttr('aria-hidden', 'true').removeAttr("tabindex", -1).removeClass('ws10-no-scroll');
        $('footer').css('display', 'flex');
        $('#close-overlay').removeAttr("tabindex", 1);
        $('.tabenable').removeAttr("tabindex", 1);
        $('.toolBarItem').removeAttr("tabindex", -1);
            $('.action').removeAttr("tabindex", -1);
            $('.dropdown-button').removeAttr("tabindex", -1);
            $('.reset-button').removeAttr("tabindex", -1);
            $('.open-overlay').removeAttr("tabindex", -1);
            $('#reset-filters').removeAttr("tabindex", -1);
            $('a').removeAttr("tabindex", -1);
            $('input').removeAttr("tabindex", -1);
    });
    
    $('#slide-in-overlay').on('click', '#close-overlay', function() {
        $('#slide-in-overlay').removeClass('ws10-in').css('display', 'none');
        $('.ws10-overlay__backdrop').css('transform', 'translateX(100%)').removeClass('ws10-in').css('display', 'none');
        $('body').removeAttr('aria-hidden', 'true').removeAttr("tabindex", -1).removeClass('ws10-no-scroll');
        $('footer').css('display', 'flex');
        $('#close-overlay').removeAttr("tabindex", 1);
        $('.tabenable').removeAttr("tabindex", 1);
        $('.toolBarItem').removeAttr("tabindex", -1);
        $('.action').removeAttr("tabindex", -1);
        $('.dropdown-button').removeAttr("tabindex", -1);
        $('.reset-button').removeAttr("tabindex", -1);
        $('.open-overlay').removeAttr("tabindex", -1);
        $('#reset-filters').removeAttr("tabindex", -1);
        $('a').removeAttr("tabindex", -1);
        $('input').removeAttr("tabindex", -1);
    });
    
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape') {
            $('#slide-in-overlay').css('transform', 'translateX(100%)').removeClass('ws10-in').css('display', 'none');
            $('.ws10-overlay__backdrop').css('transform', 'translateX(100%)').removeClass('ws10-in').css('display', 'none');
            $('body').removeAttr('aria-hidden', 'true').removeAttr("tabindex", -1).removeClass('ws10-no-scroll');
            $('footer').css('display', 'flex');
            $('#close-overlay').removeAttr("tabindex", 1);
            $('.tabenable').removeAttr("tabindex", 1);
            $('.toolBarItem').removeAttr("tabindex", -1);
            $('.action').removeAttr("tabindex", -1);
            $('.dropdown-button').removeAttr("tabindex", -1);
            $('.reset-button').removeAttr("tabindex", -1);
            $('.open-overlay').removeAttr("tabindex", -1);
            $('#reset-filters').removeAttr("tabindex", -1);
            $('a').removeAttr("tabindex", -1);
            $('input').removeAttr("tabindex", -1);
            adjustAccordionHeights(); // Adjust heights after closing the overlay
        }
    });



/** Kommentar overlay */
class CommentOverlay {
    constructor() {
        this.initOverlay();
        this.bindEvents();
        this.loadState();
        this.initializeTextarea();
        this.initializeSelect();
    }

    initOverlay() {
        this.commentOverlay = $(this.getOverlayTemplate());
        $('body').append(this.commentOverlay);
    }

    bindEvents() {
        const events = [
            { selector: '.add-comment-button', event: 'click', handler: this.showAddCommentOverlay },
            { selector: '.edit-comment-button', event: 'click', handler: this.showEditCommentOverlay },
            { selector: '#save-comment', event: 'click', handler: this.saveComment },
            { selector: '#cancel-comment', event: 'click', handler: this.hideOverlay },
            { selector: '.delete-comment-button', event: 'click', handler: this.deleteComment },
            { selector: document, event: 'keydown', handler: this.handleEscapeKey },
            { selector: '#image-upload-area', event: 'click', handler: () => $('#image-upload-input').click() },
            { selector: '#image-upload-input', event: 'change', handler: this.handleImageUpload },
            { selector: '.uploadedImageThumbnail', event: 'click', handler: this.openLightbox },
            { selector: '.close-lightbox', event: 'click', handler: this.closeLightbox },
            { selector: '.delete-image-button', event: 'click', handler: this.deleteImage },
        ];

        events.forEach(({ selector, event, handler }) => {
            $(document).on(event, selector, (e) => handler.call(this, e));
        });
    }

    getOverlayTemplate() {
        return `
            <div class="slide-in-overlay-container">
                <div id="comment-overlay" class="ws10-overlay ws10-fade ws10-overlay--slide ws10-overlay--spacing ws10-overlay--align-left ws10-in" style="display: none;">
                    <div class="ws10-overlay__container">
                        <div class="ws10-overlay__close">
                            <button id="cancel-comment" aria-label="Cancel comment" class="ws10-button-icon-only ws10-button-icon-only--tertiary ws10-button-icon-only--floating ws10-button-icon-only--standard close overlayKeyOn" tabindex="1">
                                <svg id="close-icon" class="ws10-button-icon-only__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
                                    <line class="st0" x1="44" y1="148" x2="148" y2="44" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8.67"></line>
                                    <line class="st0" x1="148" y1="148" x2="44" y2="44" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8.67"></line>
                                </svg>
                            </button>
                        </div>
                        <div class="comment-overlay-content ws10-overlay__content">
                            ${this.getCommentFormTemplate()}
                            ${this.getImageUploadTemplate()}
                        </div>
                        ${this.getButtonsTemplate()}
                    </div>
                </div>
                ${this.getBackdropTemplate()}
            </div>
            ${this.getLightboxTemplate()}
        `;
    }

    getCommentFormTemplate() {
        return `
            <h5>Add or edit comment</h5>
            <div class="ws10-form-element-block ws10-form-element-block--text-input">
                <div class="ws10-form-element-block__label-container">
                    <label for="comment-title" class="ws10-form-label">Comment</label>
                </div>
                <div class="ws10-form-element-block__input-container">
                    <div class="ws10-form-text-input">
                        <textarea id="comment-title" name="text"></textarea>
                        <span class="ws10-form-text-input__notification_icon-container" style="display:none;">
                            <svg class="ws10-notification-icon ws10-notification-icon-- "></svg>
                        </span>
                        <span class="ws10-form-text-input__system_icon-container" style="display:none;">
                            <svg class="ws10-system-icon ws10-system-icon--size-inherit ws10-system-icon--color-monochrome-600"></svg>
                        </span>
                    </div>
                </div>
                <span class="ws10-form-element-block__helper-text ws10-text-smaller" aria-label="Helper text">Required</span>
                <span class="ws10-form-element-block__error-message ws10-text-smaller"></span>
            </div>
            <div class="ws10-form-element-block ws10-form-element-block--select">
                <div class="ws10-form-element-block__label-container">
                    <label for="comment-type" class="ws10-form-label">Comment Type</label>
                </div>
                <div class="ws10-form-element-block__input-container">
                    <select id="comment-type" class="ws10-form-select ws10-form-select__select">
                        <option value="violation" data-icon="violation-icon">Violation</option>
                        <option value="recommendation" data-icon="recommendation-icon">Recommendation</option>
                        <option value="info" data-icon="info-icon">Info</option>
                    </select>
                    <span class="ws10-form-select__notification_icon-container"><svg aria-hidden="true" class="ws10-form-select__chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><polyline class="st0" points="164 62 96 130 28 62" fill="none" stroke-linecap="round" stroke-miterlimit="10" stroke-width="8"></polyline></svg></span>
                    </div>
                <span class="ws10-form-element-block__helper-text ws10-text-smaller" aria-label="Helper text">Required</span>
                <span class="ws10-form-element-block__error-message ws10-text-smaller"></span>
            </div>
            <div class="ws10-form-element-block ws10-form-element-block--textarea">
                <div class="ws10-form-element-block__label-container">
                    <label for="textarea-1" class="ws10-form-label">Description:</label>
                </div>
                <div class="ws10-form-element-block__input-container">
                    <div class="ws10-form-textarea">
                        <textarea rows="5" id="comment-text" class="ws10-form-textarea__textarea" name=""></textarea>
                        <span class="ws10-form-textarea__notification_icon-container"><svg class="ws10-notification-icon ws10-notification-icon-- "></svg></span>
                    </div>
                </div>
                <span class="ws10-form-element-block__helper-text ws10-text-smaller" aria-label="Helper text">Required</span>
                <span class="ws10-form-element-block__error-message ws10-text-smaller"></span>
            </div>
        `;
    }

    getImageUploadTemplate() {
        return `
            <div class="ws10-form-element-block__label-container">
                <label class="ws10-form-label">Add screenshots (jpg/png)</label>
            </div>
            <div id="image-upload-container">
                <input type="file" id="image-upload-input" accept=".jpg,.png" style="display: none;">
                <div id="image-upload-area"><span>add jpg/png</span></div>
            </div>
            <div id="image-thumbnails" class="image-thumbnails"></div>
        `;
    }

    getButtonsTemplate() {
        return `
            <div class="overlayButtonsContainer">
                <button id="save-comment" class="ws10-secondary-button element50percentwidth">Save & Close</button>
                <button id="cancel-comment" class="ws10-alt-button element50percentwidth">Cancel</button>
            </div>
        `;
    }

    getBackdropTemplate() {
        return `
            <div class="ws10-overlay__backdrop ws10-fade ws10-in" style="display: none;"></div>
        `;
    }

    getLightboxTemplate() {
        return `
            <div id="lightbox" class="lightbox" style="display: none;">
                <div class="lightbox-content">
                    <span class="close-lightbox" aria-label="Close lightbox">&times;</span>
                    <img class="lightbox-image">
                </div>
            </div>
        `;
    }

    initializeTextarea() {
        const textarea = document.getElementById('comment-title');
        if (textarea) {
            const storedValue = localStorage.getItem('comment-title');
            textarea.value = storedValue || '';
            this.adjustTextareaHeight(textarea); // Adjust height after setting the value
            textarea.addEventListener('input', () => this.adjustTextareaHeight(textarea));
        }
    }

    initializeSelect() {
        const select = document.getElementById('comment-type');
        if (select) {
            const storedValue = localStorage.getItem('comment-type');
            select.value = storedValue || 'violation';
            select.addEventListener('change', () => {
                localStorage.setItem('comment-type', select.value);
            });
        }
    }

    adjustTextareaHeight(textarea) {
        console.log('Adjusting textarea height');
        const minHeight = 48;
        textarea.style.height = `${minHeight}px`;
        textarea.style.height = `${Math.max(textarea.scrollHeight, minHeight)}px`;
    }

    showAddCommentOverlay(e) {
        e.stopPropagation();
        this.currentTaskContainer = $(e.currentTarget).closest('li.taskContainer');
        this.currentCommentItem = null;
        $('#comment-title').val('');
        $('#comment-text').val('');
        $('#comment-type').val('violation');
        $('#image-upload-area').html('<a class="imageUploadLink" href="#/"><div><svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path class="iconRed" d="M3.15753 14.6153C3.01548 14.8521 3.0923 15.1592 3.3291 15.3013C3.56591 15.4433 3.87303 15.3665 4.01508 15.1297L3.15753 14.6153ZM7.5288 8.29998L7.88236 7.94643C7.77348 7.83755 7.62051 7.78491 7.46768 7.80373C7.31486 7.82255 7.17923 7.91074 7.10003 8.04278L7.5288 8.29998ZM13.6763 14.4475L13.3227 14.801C13.518 14.9963 13.8346 14.9963 14.0299 14.801L13.6763 14.4475ZM15.9113 12.2125L16.2648 11.8589C16.0695 11.6637 15.753 11.6637 15.5577 11.8589L15.9113 12.2125ZM20.1465 17.1536C20.3418 17.3488 20.6584 17.3488 20.8537 17.1535C21.0489 16.9582 21.0488 16.6416 20.8536 16.4464L20.1465 17.1536ZM5.5 3.5V3V3.5ZM20.5 3.5H21C21 3.22386 20.7761 3 20.5 3V3.5ZM3.5 18.5H3H3.5ZM4.01508 15.1297L7.95758 8.55718L7.10003 8.04278L3.15753 14.6153L4.01508 15.1297ZM7.17525 8.65353L13.3227 14.801L14.0299 14.0939L7.88236 7.94643L7.17525 8.65353ZM14.0299 14.801L16.2649 12.566L15.5577 11.8589L13.3227 14.0939L14.0299 14.801ZM15.5578 12.5661L20.1465 17.1536L20.8536 16.4464L16.2648 11.8589L15.5578 12.5661ZM16.0625 8C16.0625 8.5868 15.5868 9.0625 15 9.0625V10.0625C16.1391 10.0625 17.0625 9.13909 17.0625 8H16.0625ZM15 9.0625C14.4132 9.0625 13.9375 8.5868 13.9375 8H12.9375C12.9375 9.13909 13.8609 10.0625 15 10.0625V9.0625ZM13.9375 8C13.9375 7.4132 14.4132 6.9375 15 6.9375V5.9375C13.8609 5.9375 12.9375 6.86091 12.9375 8H13.9375ZM15 6.9375C15.5868 6.9375 16.0625 7.4132 16.0625 8H17.0625C17.0625 6.86091 16.1391 5.9375 15 5.9375V6.9375ZM5.5 4H20.5V3H5.5V4ZM20 3.5V18.5H21V3.5H20ZM20 18.5C20 18.8978 19.842 19.2794 19.5607 19.5607L20.2678 20.2678C20.7366 19.7989 21 19.163 21 18.5H20ZM19.5607 19.5607C19.2794 19.842 18.8978 20 18.5 20V21C19.163 21 19.7989 20.7366 20.2678 20.2678L19.5607 19.5607ZM18.5 20H5.5V21H18.5V20ZM5.5 20C5.10218 20 4.72064 19.842 4.43934 19.5607L3.73223 20.2678C4.20107 20.7366 4.83696 21 5.5 21V20ZM4.43934 19.5607C4.15804 19.2794 4 18.8978 4 18.5H3C3 19.163 3.26339 19.7989 3.73223 20.2678L4.43934 19.5607ZM4 18.5V5.5H3V18.5H4ZM4 5.5C4 5.10218 4.15804 4.72064 4.43934 4.43934L3.73223 3.73223C3.26339 4.20107 3 4.83696 3 5.5H4ZM4.43934 4.43934C4.72064 4.15804 5.10218 4 5.5 4V3C4.83696 3 4.20107 3.26339 3.73223 3.73223L4.43934 4.43934Z" fill="#0D0D0D"/><circle class="iconRed" cx="20.5" cy="3.5" r="3.5" fill="#0D0D0D"/><path class="iconRed" d="M19 3.5H22M20.5 2V5" stroke="white" stroke-linecap="round" stroke-linejoin="round"/></svg></div>Browse to add jpg/png</a>');
        $('#image-thumbnails').empty();
        $('#comment-overlay').show();
        this.toggleBackdrop(true);
    }

    showEditCommentOverlay(e) {
        e.stopPropagation();
        this.currentTaskContainer = $(e.currentTarget).closest('li.taskContainer');
        this.currentCommentItem = $(e.currentTarget).closest('.comment-item');
        const title = this.currentCommentItem.find('.comment-title').text();
        const text = this.currentCommentItem.data('comment-text');
        const type = this.currentCommentItem.data('comment-type');
        $('#comment-title').val(title);
        $('#comment-text').val(text);
        $('#comment-type').val(type);
        $('#image-upload-area').html('<a class="imageUploadLink" href="#/"><div><svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path class="iconRed" d="M3.15753 14.6153C3.01548 14.8521 3.0923 15.1592 3.3291 15.3013C3.56591 15.4433 3.87303 15.3665 4.01508 15.1297L3.15753 14.6153ZM7.5288 8.29998L7.88236 7.94643C7.77348 7.83755 7.62051 7.78491 7.46768 7.80373C7.31486 7.82255 7.17923 7.91074 7.10003 8.04278L7.5288 8.29998ZM13.6763 14.4475L13.3227 14.801C13.518 14.9963 13.8346 14.9963 14.0299 14.801L13.6763 14.4475ZM15.9113 12.2125L16.2648 11.8589C16.0695 11.6637 15.753 11.6637 15.5577 11.8589L15.9113 12.2125ZM20.1465 17.1536C20.3418 17.3488 20.6584 17.3488 20.8537 17.1535C21.0489 16.9582 21.0488 16.6416 20.8536 16.4464L20.1465 17.1536ZM5.5 3.5V3V3.5ZM20.5 3.5H21C21 3.22386 20.7761 3 20.5 3V3.5ZM3.5 18.5H3H3.5ZM4.01508 15.1297L7.95758 8.55718L7.10003 8.04278L3.15753 14.6153L4.01508 15.1297ZM7.17525 8.65353L13.3227 14.801L14.0299 14.0939L7.88236 7.94643L7.17525 8.65353ZM14.0299 14.801L16.2649 12.566L15.5577 11.8589L13.3227 14.0939L14.0299 14.801ZM15.5578 12.5661L20.1465 17.1536L20.8536 16.4464L16.2648 11.8589L15.5578 12.5661ZM16.0625 8C16.0625 8.5868 15.5868 9.0625 15 9.0625V10.0625C16.1391 10.0625 17.0625 9.13909 17.0625 8H16.0625ZM15 9.0625C14.4132 9.0625 13.9375 8.5868 13.9375 8H12.9375C12.9375 9.13909 13.8609 10.0625 15 10.0625V9.0625ZM13.9375 8C13.9375 7.4132 14.4132 6.9375 15 6.9375V5.9375C13.8609 5.9375 12.9375 6.86091 12.9375 8H13.9375ZM15 6.9375C15.5868 6.9375 16.0625 7.4132 16.0625 8H17.0625C17.0625 6.86091 16.1391 5.9375 15 5.9375V6.9375ZM5.5 4H20.5V3H5.5V4ZM20 3.5V18.5H21V3.5H20ZM20 18.5C20 18.8978 19.842 19.2794 19.5607 19.5607L20.2678 20.2678C20.7366 19.7989 21 19.163 21 18.5H20ZM19.5607 19.5607C19.2794 19.842 18.8978 20 18.5 20V21C19.163 21 19.7989 20.7366 20.2678 20.2678L19.5607 19.5607ZM18.5 20H5.5V21H18.5V20ZM5.5 20C5.10218 20 4.72064 19.842 4.43934 19.5607L3.73223 20.2678C4.20107 20.7366 4.83696 21 5.5 21V20ZM4.43934 19.5607C4.15804 19.2794 4 18.8978 4 18.5H3C3 19.163 3.26339 19.7989 3.73223 20.2678L4.43934 19.5607ZM4 18.5V5.5H3V18.5H4ZM4 5.5C4 5.10218 4.15804 4.72064 4.43934 4.43934L3.73223 3.73223C3.26339 4.20107 3 4.83696 3 5.5H4ZM4.43934 4.43934C4.72064 4.15804 5.10218 4 5.5 4V3C4.83696 3 4.20107 3.26339 3.73223 3.73223L4.43934 4.43934Z" fill="#0D0D0D"/><circle class="iconRed" cx="20.5" cy="3.5" r="3.5" fill="#0D0D0D"/><path class="iconRed" d="M19 3.5H22M20.5 2V5" stroke="white" stroke-linecap="round" stroke-linejoin="round"/></svg></div>Browse to add jpg/png</a>');
        $('#image-thumbnails').empty();
        const images = this.currentCommentItem.data('images') || [];
        images.forEach((src) => {
            $('#image-thumbnails').append(this.createImageThumbnail(src));
        });
        $('#comment-overlay').show();
        this.toggleBackdrop(true);
    }

/*     saveComment(e) {
        e.stopPropagation();
        const title = $('#comment-title').val().trim();
        const text = $('#comment-text').val().trim();
        const type = $('#comment-type').val();
        const images = this.getUploadedImages();

        if (title && text) {
            localStorage.setItem('comment-title', title);
            localStorage.setItem('comment-type', type);
            if (this.currentCommentItem) {
                this.updateExistingComment(title, text, type, images);
            } else {
                this.addNewComment(title, text, type, images);
            }
            this.adjustAccordionHeight(this.currentTaskContainer);
            this.saveState();
            this.hideOverlay();
        } else {
            alert('Both title and comment text are required.');
        }
    } */

        saveComment(e) {
            e.stopPropagation();
            const title = $('#comment-title').val().trim();
            const text = $('#comment-text').val().trim();
            const type = $('#comment-type').val();
            const images = this.getUploadedImages();
        
            if (title && text) {
                localStorage.setItem('comment-title', title);
                localStorage.setItem('comment-type', type);
                if (this.currentCommentItem) {
                    this.updateExistingComment(title, text, type, images);
                } else {
                    this.addNewComment(title, text, type, images);
                }
                this.adjustAccordionHeight(this.currentTaskContainer);
                adjustAccordionHeights(); // Adjust heights after saving the comment
                this.saveState();
                this.hideOverlay();
            } else {
                alert('Both title and comment text are required.');
            }
        }
/* 
    updateExistingComment(title, text, type, images) {
        this.currentCommentItem.find('.comment-title').text(title);
        this.currentCommentItem.find('.comment-type-display').text(type).attr('class', `comment-type-display ${type}`);
        this.currentCommentItem.data('comment-text', text);
        this.currentCommentItem.data('comment-type', type);
        this.currentCommentItem.data('images', images);
        this.currentCommentItem.find('.comment-images-container').remove();
        if (images.length > 0) {
            const imageThumbnailsContainer = $('<div class="comment-images-container"></div>');
            images.forEach(src => {
                imageThumbnailsContainer.append(this.createImageThumbnail(src, true));
            });
            this.currentCommentItem.append(imageThumbnailsContainer);
        }
    } */

        updateExistingComment(title, text, type, images) {
            this.currentCommentItem.find('.comment-title').text(title);
            this.currentCommentItem.find('.comment-type-display').text(type).attr('class', `comment-type-display ${type}`);
            this.currentCommentItem.data('comment-text', text);
            this.currentCommentItem.data('comment-type', type);
            this.currentCommentItem.data('images', images);
            this.currentCommentItem.find('.comment-images-container').remove();
            if (images.length > 0) {
                const imageThumbnailsContainer = $('<div class="comment-images-container"></div>');
                images.forEach(src => {
                    imageThumbnailsContainer.append(this.createImageThumbnail(src, true));
                });
                this.currentCommentItem.append(imageThumbnailsContainer);
            }
            adjustAccordionHeights(); // Adjust heights after updating the comment
        }

    /* addNewComment(title, text, type, images) {
        const commentItem = $(`
            <div class="comment-item" data-comment-text="${text}" data-comment-type="${type}" data-images='${JSON.stringify(images)}'>
                <div class="comment-title">${title}</div>
                <span class="comment-type-display ${type}">${type}</span>
                ${this.getCommentButtonsTemplate()}
            </div>
        `);
        if (images.length > 0) {
            const imageThumbnailsContainer = $('<div class="comment-images-container"></div>');
            images.forEach(src => {
                imageThumbnailsContainer.append(this.createImageThumbnail(src, true));
            });
            commentItem.append(imageThumbnailsContainer);
        }
        this.currentTaskContainer.find('.comments').append(commentItem);
    } */

        addNewComment(title, text, type, images) {
            const commentItem = $(`
                <div class="comment-item" data-comment-text="${text}" data-comment-type="${type}" data-images='${JSON.stringify(images)}'>
                    <div class="comment-title">${title}</div>
                    <span class="comment-type-display ${type}">${type}</span>
                    ${this.getCommentButtonsTemplate()}
                </div>
            `);
            if (images.length > 0) {
                const imageThumbnailsContainer = $('<div class="comment-images-container"></div>');
                images.forEach(src => {
                    imageThumbnailsContainer.append(this.createImageThumbnail(src, true));
                });
                commentItem.append(imageThumbnailsContainer);
            }
            this.currentTaskContainer.find('.comments').append(commentItem);
            adjustAccordionHeights(); // Adjust heights after adding the comment
        }

    getUploadedImages() {
        const images = [];
        $('#image-thumbnails img').each(function () {
            images.push($(this).attr('src'));
        });
        return images;
    }

    hideOverlay() {
        $('#comment-overlay').hide();
        this.toggleBackdrop(false);
    }

    deleteComment(e) {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this comment?')) {
            const commentItem = $(e.currentTarget).closest('.comment-item');
            const taskContainer = commentItem.closest('li.taskContainer');
            commentItem.remove();
            this.adjustAccordionHeight(taskContainer);
            this.saveState();
        }
    }

    handleEscapeKey(e) {
        if (e.key === 'Escape' && $('#comment-overlay').is(':visible')) {
            this.hideOverlay();
        }
    }

    handleImageUpload(e) {
        const files = e.target.files;
        if (files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                $('#image-thumbnails').append(this.createImageThumbnail(event.target.result));
            };
            reader.readAsDataURL(file);
        }
    }

    createImageThumbnail(src, forComment = false) {
        if (forComment) {
            return `<div class="imageThumbnail"><img src="${src}" class="uploadedImageThumbnail" tabindex="0" aria-label="View image in lightbox"></div>`;
        } else {
            return `
                <div class="image-thumbnail-container">
                    <img src="${src}" class="uploaded-image-thumbnail" tabindex="0" aria-label="View image in lightbox">
                    <button aria-label="Delete image" class="delete-image-button">
                        <svg id="icon" class="reset-button-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
                            <line class="st0" x1="112.01" y1="144" x2="112.01" y2="72" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
                            <line class="st0" x1="80.01" y1="144" x2="80.01" y2="72" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
                            <line class="st0" x1="36" y1="44" x2="156" y2="44" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
                            <path class="st0" d="M120,44V36a16,16,0,0,0-16-16H88A16,16,0,0,0,72,36v8" fill="none" stroke-linejoin="round" stroke-width="8"/>
                            <path class="st0" d="M148,44V156a16,16,0,0,1-16,16H60a16,16,0,0,1-16-16V44" fill="none" stroke-linejoin="round" stroke-width="8"/>
                        </svg>
                    </button>
                </div>
            `;
        }
    }

    deleteImage(e) {
        e.stopPropagation();
        $(e.currentTarget).closest('.image-thumbnail-container').remove();
    }

    openLightbox(e) {
        const src = $(e.currentTarget).attr('src');
        $('.lightbox-image').attr('src', src);
        $('#lightbox').show();
    }

    closeLightbox() {
        $('#lightbox').hide();
    }

    adjustAccordionHeight(taskContainer) {
        const commentsContainer = taskContainer.find('.comments');
        const height = commentsContainer.prop('scrollHeight');
        commentsContainer.height(height);
    }

    saveState() {
        const state = {
            selectedRadios: {},
            applicableCheckboxes: {},
            comments: {}
        };

        $('input[type="radio"]:checked').each(function () {
            state.selectedRadios[this.id] = this.checked;
        });

        $('input[type="checkbox"][id^="applicable_"]').each(function () {
            state.applicableCheckboxes[this.id] = this.checked;
        });

        $('li.taskContainer').each(function () {
            const taskId = $(this).attr('id');
            const commentsContainer = $(this).find('.comments');
            const comments = $(this).find('.comment-item').map(function () {
                return {
                    title: $(this).find('.comment-title').text().trim(),
                    text: $(this).data('comment-text'),
                    type: $(this).data('comment-type'),
                    images: $(this).data('images') || []
                };
            }).get();
            if (comments.length > 0) {
                state.comments[taskId] = comments;
                commentsContainer.show();
            } else {
                commentsContainer.hide();
            }
            adjustAccordionHeight(commentsContainer);
        });

        localStorage.setItem('filterState', JSON.stringify(state));
    }

    loadState() {
        const state = JSON.parse(localStorage.getItem('filterState'));
        const savedText = localStorage.getItem('comment-title');

        if (state) {
            for (const [key, value] of Object.entries(state.selectedRadios)) {
                $(`#${key}`).prop('checked', value);
            }

            for (const [key, value] of Object.entries(state.applicableCheckboxes)) {
                $(`#${key}`).prop('checked', value).trigger('change');
            }

            for (const [taskId, comments] of Object.entries(state.comments)) {
                const container = $(`li.taskContainer#${taskId}`);
                const commentsContainer = container.find('.comments');
                comments.forEach(comment => {
                    const commentItem = $(`
                        <div class="comment-item" data-comment-text="${comment.text}" data-comment-type="${comment.type}" data-images='${JSON.stringify(comment.images)}'>
                            <div class="comment-title">${comment.title}</div>
                            <span class="comment-type-display ${comment.type}">${comment.type}</span>
                            <button class="edit-comment-button overlayKeyOff commentFunctionsButtons">
                                <svg class="icon24" id="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
                                    <polyline class="st0" points="147.38 70.11 121.57 44.02 36.49 129.1 27.77 164 62.67 155.27 147.38 70.11" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
                                    <path class="st0" d="M121.57,44l12.79-12.79a11,11,0,0,1,15.63,0l18,18.22L147.38,70.11" fill="none" stroke-linecap="round" stroke-miterlimit="10" stroke-width="8"/>
                                    <line class="st0" x1="39.55" y1="126.1" x2="65.73" y2="152.28" fill="none" stroke-miterlimit="10" stroke-width="8"/>
                                </svg>
                            </button>
                            <button class="delete-comment-button overlayKeyOff commentFunctionsButtons">
                                <svg id="icon" class="icon24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
                                    <line class="st0" x1="112.01" y1="144" x2="112.01" y2="72" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
                                    <line class="st0" x1="80.01" y1="144" x2="80.01" y2="72" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
                                    <line class="st0" x1="36" y1="44" x2="156" y2="44" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
                                    <path class="st0" d="M120,44V36a16,16,0,0,0-16-16H88A16,16,0,0,0,72,36v8" fill="none" stroke-linejoin="round" stroke-width="8"/>
                                    <path class="st0" d="M148,44V156a16,16,0,0,1-16,16H60a16,16,0,0,1-16-16V44" fill="none" stroke-linejoin="round" stroke-width="8"/>
                                </svg>
                            </button>
                        </div>
                    `);
                    if (comment.images.length > 0) {
                        const imageThumbnailsContainer = $('<div class="comment-images-container"></div>');
                        comment.images.forEach(src => {
                            imageThumbnailsContainer.append(createImageThumbnail(src, true));
                        });
                        commentItem.append(imageThumbnailsContainer);
                    }
                    commentsContainer.append(commentItem);
                });

                if (comments.length > 0) {
                    commentsContainer.show();
                } else {
                    commentsContainer.hide();
                }
            }

            if (state.images && state.images.length > 0) {
                state.images.forEach(src => {
                    $('#image-thumbnails').append(createImageThumbnail(src));
                });
            }

            // Restore the saved comment type
            if (state.commentType) {
                $('#comment-type').val(state.commentType);
            }
        }
    }

    getCommentButtonsTemplate() {
        return `
            <button class="edit-comment-button overlayKeyOff commentFunctionsButtons">
                <svg class="icon24" id="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
                    <polyline class="st0" points="147.38 70.11 121.57 44.02 36.49 129.1 27.77 164 62.67 155.27 147.38 70.11" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
                    <path class="st0" d="M121.57,44l12.79-12.79a11,11,0,0,1,15.63,0l18,18.22L147.38,70.11" fill="none" stroke-linecap="round" stroke-miterlimit="10" stroke-width="8"/>
                    <line class="st0" x1="39.55" y1="126.1" x2="65.73" y2="152.28" fill="none" stroke-miterlimit="10" stroke-width="8"/>
                </svg>
            </button>
            <button class="delete-comment-button overlayKeyOff commentFunctionsButtons">
                <svg id="icon" class="icon24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
                    <line class="st0" x1="112.01" y1="144" x2="112.01" y2="72" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
                    <line class="st0" x1="80.01" y1="144" x2="80.01" y2="72" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
                    <line class="st0" x1="36" y1="44" x2="156" y2="44" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
                    <path class="st0" d="M120,44V36a16,16,0,0,0-16-16H88A16,16,0,0,0,72,36v8" fill="none" stroke-linejoin="round" stroke-width="8"/>
                    <path class="st0" d="M148,44V156a16,16,0,0,1-16,16H60a16,16,0,0,1-16-16V44" fill="none" stroke-linejoin="round" stroke-width="8"/>
                </svg>
            </button>
        `;
    }

    toggleBackdrop(show) {
        const display = show ? 'block' : 'none';
        const transform = show ? 'translateX(0)' : 'translateX(100%)';
        const backdropClass = show ? 'addClass' : 'removeClass';
        $('.ws10-overlay__backdrop').css('display', display).css('transform', transform)[backdropClass]('ws10-in');
        $('body').attr('aria-hidden', show).attr("tabindex", show ? -1 : null).toggleClass('ws10-no-scroll', show);
        $('footer').css('display', show ? 'none' : 'flex');
        $('.overlayKeyOn').attr("tabindex", show ? 1 : -1);
        $('.overlayKeyOff').attr("tabindex", show ? -1 : 1);
    }
}

function loadState() {
    const state = JSON.parse(localStorage.getItem('filterState'));
    const savedText = localStorage.getItem('comment-title');

    if (state) {
        for (const [key, value] of Object.entries(state.selectedRadios)) {
            $(`#${key}`).prop('checked', value);
        }

        for (const [key, value] of Object.entries(state.applicableCheckboxes)) {
            $(`#${key}`).prop('checked', value).trigger('change');
        }

        for (const [taskId, comments] of Object.entries(state.comments)) {
            const container = $(`li.taskContainer#${taskId}`);
            const commentsContainer = container.find('.comments');
            comments.forEach(comment => {
                const commentItem = $(`
                    <div class="comment-item" data-comment-text="${comment.text}" data-comment-type="${comment.type}" data-images='${JSON.stringify(comment.images)}'>
                        <div class="comment-title">${comment.title}</div>
                        <span class="comment-type-display ${comment.type}">${comment.type}</span>
                        <button class="edit-comment-button overlayKeyOff commentFunctionsButtons">
                            <svg class="icon24" id="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
                                <polyline class="st0" points="147.38 70.11 121.57 44.02 36.49 129.1 27.77 164 62.67 155.27 147.38 70.11" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
                                <path class="st0" d="M121.57,44l12.79-12.79a11,11,0,0,1,15.63,0l18,18.22L147.38,70.11" fill="none" stroke-linecap="round" stroke-miterlimit="10" stroke-width="8"/>
                                <line class="st0" x1="39.55" y1="126.1" x2="65.73" y2="152.28" fill="none" stroke-miterlimit="10" stroke-width="8"/>
                            </svg>
                        </button>
                        <button class="delete-comment-button overlayKeyOff commentFunctionsButtons">
                            <svg id="icon" class="icon24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
                                <line class="st0" x1="112.01" y1="144" x2="112.01" y2="72" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
                                <line class="st0" x1="80.01" y1="144" x2="80.01" y2="72" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
                                <line class="st0" x1="36" y1="44" x2="156" y2="44" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/>
                                <path class="st0" d="M120,44V36a16,16,0,0,0-16-16H88A16,16,0,0,0,72,36v8" fill="none" stroke-linejoin="round" stroke-width="8"/>
                                <path class="st0" d="M148,44V156a16,16,0,0,1-16,16H60a16,16,0,0,1-16-16V44" fill="none" stroke-linejoin="round" stroke-width="8"/>
                            </svg>
                        </button>
                    </div>
                `);
                if (comment.images.length > 0) {
                    const imageThumbnailsContainer = $('<div class="comment-images-container"></div>');
                    comment.images.forEach(src => {
                        imageThumbnailsContainer.append(createImageThumbnail(src, true));
                    });
                    commentItem.append(imageThumbnailsContainer);
                }
                commentsContainer.append(commentItem);
            });

            if (comments.length > 0) {
                commentsContainer.show();
            } else {
                commentsContainer.hide();
            }
        }

        if (state.images && state.images.length > 0) {
            state.images.forEach(src => {
                $('#image-thumbnails').append(createImageThumbnail(src));
            });
        }

        // Restore the saved comment type
        if (state.commentType) {
            $('#comment-type').val(state.commentType);
        }
    }
}



$(document).ready(() => {
    new CommentOverlay();
});




    $.getJSON('https://vodafone-de.github.io/accessibility-checklist/data/data.json', function(jsonArray) {
        const groupedByCategory = {};
        const groupedByCategorySummary = {};
        const taskCategories = new Set();

        localStorage.setItem('jsonArray', JSON.stringify(jsonArray));

        jsonArray.forEach(item => {
            const category = item.category;
            if (!groupedByCategory[category]) {
                groupedByCategory[category] = [];
            }
            groupedByCategory[category].push(item);

            if (item.dods) {
                Object.values(item.dods).forEach(tasks => {
                    tasks.forEach(task => {
                        if (task.taskcat) {
                            task.taskcat.forEach(cat => taskCategories.add(cat));
                        }
                    });
                });
            }
        });

        // Konvertiere das Set in ein Array und sortiere es alphabetisch
        const sortedTaskCategories = [...taskCategories].sort((a, b) => {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        });

        const filterHtml = `
        <div class="filter">
            <h4>Filter:</h4>
            <ul>
                <li>
                <div class="dropdown">
                <button class="dropdown-button-roles overlayKeyOff">Select Roles <svg aria-hidden="true" class="dropdown-item__chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><polyline class="st0" points="164 62 96 130 28 62" fill="none" stroke-linecap="round" stroke-miterlimit="10" stroke-width="8"></polyline></svg></button>
                <div class="dropdown-content-roles">
                    <ul id="filter-options" class="dropdownContainer">
                    <li>
                            <label>
                            <input type="checkbox" value="filter_audit" data-filter_id="audit">
                            <span class="ws10-text">Accessibility Audit</span>
                            </label>
                        </li>
                        <li>
                            <label>
                            <input type="checkbox" value="filter_cm" data-filter_id="cm">
                            <span class="ws10-text">Channel Management</span>
                            </label>
                        </li>
                        <li>
                            <label>
                            <input type="checkbox" value="filter_ux" data-filter_id="ux">
                            <span class="ws10-text">User Experience</span>
                            </label>
                        </li>
                        <li>
                            <label>
                            <input type="checkbox" value="filter_dev" data-filter_id="dev">
                            <span class="ws10-text">Frontend Development</span>
                            </label>
                        </li>
                        <li>
                            <label>
                            <input type="checkbox" value="filter_edt" data-filter_id="edt">
                            <span class="ws10-text">Editorial</span>
                            </label>
                        </li>
                        <li>
                            <label>
                            <input type="checkbox" value="filter_testing" data-filter_id="testing">
                            <span class="ws10-text">Testing</span>
                            </label>
                        </li>
                        <li>
                            <label>
                            <input type="checkbox" value="filter_testingwftooltasks" data-filter_id="testingwftooltasks">
                            <span class="ws10-text">WF Testing: Tool supported</span>
                            </label>
                        </li>
                        <li>
                            <label>
                            <input type="checkbox" value="filter_testingwfmantasks" data-filter_id="testingwfmantasks">
                            <span class="ws10-text">WF Testing: Manual without additional info</span>
                            </label>
                        </li>
                        <li>
                            <label>
                            <input type="checkbox" class="overlayKeyOff" value="filter_testingwfmanexttasks" data-filter_id="testingwfmanexttasks">
                            <span class="ws10-text">WF Testing: Manual with additional info</span>
                            </label>
                        </li>
                    </ul>
                  <!--  <div class="scroll-arrow">↓</div> -->
                    </div>
                    
                </div>
                
                </li>
                
                <li>
                <div class="dropdown">
                    <button class="dropdown-button overlayKeyOff">Select Tags <svg aria-hidden="true" class="dropdown-item__chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><polyline class="st0" points="164 62 96 130 28 62" fill="none" stroke-linecap="round" stroke-miterlimit="10" stroke-width="8"></polyline></svg></button>
                        <div class="dropdown-content">
                            <ul id="taskcat-dropdown" class="dropdownContainer">
                            ${[...sortedTaskCategories].map(cat => `
                                <li>
                                    <label>
                                    <input class="overlayKeyOff" type="checkbox" value="${cat}" data-filter_id="${cat}">
                                    <span class="ws10-text">${cat}</span>
                                    </label>
                                </li>`).join('')}
            </ul>
                        </div>
                </div>
            </li>
            <li><button class="ws10-secondary-button overlayKeyOff" id="reset-filters">Reset all filters</button></li>
            </ul>
            
            <div style="clear:both"></div>
        </div>
        <div id="selected-filters"></div>
        `;

        $('#content-wrapper').prepend(filterHtml);

        $('.dropdown-button').click(function() {
            $('.dropdown-content').toggle().toggleClass('open');
        });

        $('.dropdown-button-roles').click(function() {
            $('.dropdown-content-roles').toggle().toggleClass('open');
        });

        $(document).keydown(function(e) {
            if (e.key === "Escape" && $('.dropdown-content').hasClass('open')) {
                $('.dropdown-content').hide().removeClass('open');
                $('.dropdown-button').focus();
            }
        });

        $(document).keydown(function(e) {
            if (e.key === "Escape" && $('.dropdown-content-roles').hasClass('open')) {
                $('.dropdown-content-roles').hide().removeClass('open');
                $('.dropdown-button-roles').focus();
            }
        });

        $(document).click(function(e) {
            if (!$(e.target).closest('.dropdown-button, .dropdown-content').length) {
                $('.dropdown-content').hide().removeClass('open');
            }
        });

        $(document).click(function(e) {
            if (!$(e.target).closest('.dropdown-button-roles, .dropdown-content-roles').length) {
                $('.dropdown-content-roles').hide().removeClass('open');
            }
        });

        $('#filter-options input[type="checkbox"], #taskcat-dropdown input[type="checkbox"]').change(function() {
            applyFilters();
            updateFilterNumberBadge();
            updateFilterNumberBadgeRoles();
            adjustAccordionHeights();
        });

        $('#reset-filters').click(function() {
            resetFilters();
            adjustAccordionHeights();
        });

        $('#clear-state').click(function() {
            clearState();
            adjustAccordionHeights();
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
                innerDiv.append(`<h5>${item.title}</h5>`).addClass('itemtitle');

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

                        let roletitle = '';
                        if (tasks.length > 0 && tasks[0].roletitle) {
                            roletitle = tasks[0].roletitle;
                        }

                        if (roletitle) {
                            const roletitleDiv = $('<div>').addClass('roletitle').text(roletitle);
                            dodsDiv.append(roletitleDiv);
                        }
                        
                        const ul = $('<ul>').addClass(taskType + 'tasks');
                        tasks.forEach(task => {
                            if (task.taskid) {
                                const li = $('<li>').attr('id', task.taskid).addClass('taskContainer');
                                li.append($('<div>').addClass('taskdesc').html(task.taskdesc));
                                li.append($('<div><strong>Type:</strong></div>').addClass('tasktype-desc'));
                                li.append($('<div>').addClass('tasktype').text(task.tasktype));
                                const taskCatDiv = $('<div>').addClass('taskcat');
                                taskCatDiv.append($('<div>').text('Tags:').addClass('filterTextCat'));
                                if (task.taskcat) {
                                    task.taskcat.forEach(cat => {
                                        taskCatDiv.append($('<div>').text(cat).addClass('taglistitems'));
                                    });
                                }
                                taskCatDiv.append($('<div style="clear:both"></div>'));
                                li.append(taskCatDiv);
                                li.append($('<div>').addClass('testtool').html(task.testtool).hide());
                                li.append($('<div>').addClass('testmethod').html(task.testmethod).hide());
                                li.append($('<div>').addClass('testtoollink').html(task.testtoollink).hide());
                               
                                const fieldset = $('<fieldset>').addClass('status-options');
                                const radioLegend = $('<legend>').text('compliance').addClass('status-optionslegend');
                                const passRadio = $('<input>').attr({ type: 'radio', name: 'status_' + task.taskid, id: 'pass_' + task.taskid, value: 'pass' }).addClass('ws10-form-selection-control__input overlayKeyOff');
                                const passLabel = $('<label>').attr('for', 'pass_' + task.taskid).addClass('ws10-form-selection-control__label');
                                passLabel.append($('<span>').addClass('ws10-form-selection-control__text').html('<p>pass</p>'));
                                const failRadio = $('<input>').attr({ type: 'radio', name: 'status_' + task.taskid, id: 'fail_' + task.taskid, value: 'fail' }).addClass('ws10-form-selection-control__input overlayKeyOff');
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
                                        failCount = failCount > 0 ? failCount - 1 : 0;
                                        passCount++;
                                    } else if (previousValue !== 'pass') {
                                        passCount++;
                                    }
                                    fieldset.data('previousValue', 'pass');
                                    updateCounter();
                                    saveState();
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
                                        passCount = passCount > 0 ? passCount - 1 : 0;
                                        failCount++;
                                    } else if (previousValue !== 'fail') {
                                        failCount++;
                                    }
                                    fieldset.data('previousValue', 'fail');
                                    updateCounter();
                                    saveState();
                                });
                                
                                const resetButton = $('<div class="reset-button-container"><button class="reset-button overlayKeyOff"><svg class="reset-button-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><path class="st0" d="M108.84,155.75a60,60,0,0,0,1.72-120l-1.88,0a60,60,0,0,0-59.92,60v27.36" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/><polyline class="st0" points="77.44 95.6 48.76 123.11 20.86 95.6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"/></svg></button></div>');

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
                                        saveState();
                                    }
                                });

                                

                                const applicableCheckbox = $('<input>').attr({ type: 'checkbox', id: 'applicable_' + task.taskid, name: 'applicable_' + task.taskid, checked: true }).addClass("overlayKeyOff");
                                const applicableLabel = $('<label>').attr('for', 'applicable_' + task.taskid).text('applicable').addClass("applicableLabel");

                                const switchWrapper = $('<div>').addClass('switch');
                                const slider = $('<span>').addClass('slider');
                                switchWrapper.append(applicableCheckbox, slider);
                                
                                const rightColumn = $('<div>').addClass('right-column');

                                fieldset.append(radioLegend, passRadio, passLabel, failRadio, failLabel, resetButton, switchWrapper, applicableLabel);
                                

                                rightColumn.append(fieldset);

                                li.append(rightColumn);

                                const openButton = $('<button id="open-overlay" class="ws10-button-link ws10-button-link--color-primary-200 overlayKeyOff" style="grid-column-start: 1;">test instructions<svg id="icon" class="ws10-button-link__icon ws10-button-link__icon--right ws10-system-icon ws10-system-icon--size-150 ws10-system-icon--color-primary-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><polyline class="st0" points="62 28 130 96 62 164" fill="none" stroke-linecap="round" stroke-miterlimit="10" stroke-width="8"/></svg></button>');
                                li.append(openButton);
                                
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
                                            selectedRadioCount = selectedRadioCount > 0 ? selectedRadioCount - 1 : 0;
                                            if (selectedRadio === 'pass') {
                                                passCount = passCount > 0 ? passCount - 1 : 0;
                                            } else if (selectedRadio === 'fail') {
                                                failCount = failCount > 0 ? failCount - 1 : 0;
                                            }
                                        }
                                    }
                                    updateCounter();
                                    saveState();
                                    adjustAccordionHeights();
                                });

                                switchWrapper.on('click', function() {
                                    applicableCheckbox.prop('checked', !applicableCheckbox.prop('checked')).trigger('change');
                                });

                              // Kommentarfunktion
                              
                              const addCommentButton = $('<button id="addComment" class="overlayKeyOff">add comment<svg id="icon" class="ws10-button-link__icon ws10-button-link__icon--right ws10-system-icon ws10-system-icon--size-150 ws10-system-icon--color-primary-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><polyline class="st0" points="62 28 130 96 62 164" fill="none" stroke-linecap="round" stroke-miterlimit="10" stroke-width="8"/></svg></button>').addClass('add-comment-button ws10-button-link ws10-button-link--color-primary-200');
                              const commentsDiv = $('<div><h5 class="comment-optionslegend">comments</h5>').addClass('comments').hide();
                              li.append(addCommentButton).append(commentsDiv);

                              rightColumn.append(commentsDiv);
            
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


        // SummaryOverlay (start)
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
                            <div id="summaryOverlay-content" class="summary-overlay-content ws10-overlay__content"></div>
                        </div>
                    </div>
                    <div class="ws10-overlay__backdrop-white ws10-fade ws10-in" style="display: none;"></div>
                </div>
            `);
        
            $('body').append(overlay);
        }
        
        function updateSummaryOverlay() {
            const summaryOverlayContent = $('#summaryOverlay-content');
            summaryOverlayContent.empty();

            const counterContent = $('#counter').clone();
            const summaryHead = $('<div class="summaryHead"><h2>Test results according to test criteria</h2></div>');
            summaryOverlayContent.append(summaryHead);

        
            // Load Audit Information
            const auditData = JSON.parse(localStorage.getItem('auditInfo'));
            if (auditData) {
                const auditInfoSection = $(`
                    <div class="projectInfo summaryCardFlat">
                        <div class="infoContainer">
                            <h4>Audit Information</h4>
                            <p><strong>Audit name:</strong> ${auditData.auditName}</p>
                            <p><strong>Audited by:</strong> ${auditData.auditedBy}</p>
                            <p><strong>E-mail address:</strong> ${auditData.emailAddress}</p>
                            <p><strong>Audit object:</strong> ${auditData.auditObject}</p>
                            <p><strong>URL:</strong> <a href="${auditData.url}" target="_blank">${auditData.url}</a></p>
                            <p><strong>Further information:</strong> ${auditData.furtherInfo}</p>
                            <div class="audit-images">
                            ${auditData.images.map(src => `<img src="${src}" class="audit-image-thumbnail">`).join('')}
                            </div>
                        </div>
                    </div>
                `);
                summaryOverlayContent.append(auditInfoSection);
            }
        
            summaryOverlayContent.append(counterContent.html());
            
            const summaryComments = $('<div class="summaryCommentsHead"><h4>Comments/issues</h4></div>');
        
            const violations = $('<div class="summary"><h5>Violation:</h5></div>');
            const recommendations = $('<div class="summary"><h5>Recommendation:</h5></div>');
            const infos = $('<div class="summary"><h5>Info:</h5></div>');
        
           
            summaryComments.append(violations).append(recommendations).append(infos);
            summaryOverlayContent.append(summaryComments);

            const notReviewed = $('<div class="summary"><h4>Nicht bearbeitet:</h4><ul id="not-reviewed-list"></ul></div>');
            const reviewed = $('<div class="summary"><h4>Geprüft:</h4><ul id="reviewed-list"></ul></div>');
            const notApplicable = $('<div class="summary"><h4>Nicht anwendbar:</h4><ul id="not-applicable-list"></ul></div>');
        
            summaryOverlayContent.append(reviewed).append(notApplicable).append(notReviewed);
            
        
            const groupedComments = {
                violation: {},
                recommendation: {},
                info: {}
            };
        
            Object.keys(groupedByCategory).forEach(category => {
                groupedByCategory[category].forEach(item => {
                    if (item.dods) {
                        Object.keys(item.dods).forEach(taskType => {
                            const tasks = item.dods[taskType];
                            tasks.forEach(task => {
                                const li = $('<li>').text(item.title);
                                if (task.taskid) {
                                    li.attr('id', task.taskid);
                                    const applicableCheckbox = $(`#applicable_${task.taskid}`);
                                    if (!applicableCheckbox.is(':checked')) {
                                        // Nicht anwendbar
                                        li.append(`<div>Role: ${task.roletitle}</div>`);
                                        li.append(`<div>Task: ${task.taskdesc}</div>`);
                                        $('#not-applicable-list').append(li);
                                    } else {
                                        const passRadio = $(`#pass_${task.taskid}`);
                                        const failRadio = $(`#fail_${task.taskid}`);
                                        if (passRadio.is(':checked')) {
                                            // Geprüft: pass
                                            li.append(': pass');
                                            li.append(`<div>Role: ${task.roletitle}</div>`);
                                            li.append(`<div>Task: ${task.taskdesc}</div>`);
                                            $('#reviewed-list').append(li);
                                        } else if (failRadio.is(':checked')) {
                                            // Geprüft: fail
                                            li.append(': fail');
                                            li.append(`<div>Role: ${task.roletitle}</div>`);
                                            li.append(`<div>Task: ${task.taskdesc}</div>`);
                                            $('#reviewed-list').append(li);
                                        } else {
                                            // Nicht bearbeitet
                                            li.append(`<div>Role: ${task.roletitle}</div>`);
                                            li.append(`<div>Task: ${task.taskdesc}</div>`);
                                            $('#not-reviewed-list').append(li);

                                    
                                        }
                                        
                                    
                                    
         
        
                                    
                                        // Kommentare hinzufügen, unabhängig vom Radio-Button-Status
                                        const comments = JSON.parse(localStorage.getItem('filterState')).comments[task.taskid] || [];
                                        comments.forEach(comment => {
                                            if (!groupedComments[comment.type][item.bitv + item.title]) {
                                                groupedComments[comment.type][item.bitv + item.title] = {
                                                    bitv: item.bitv,
                                                    title: item.title,
                                                    comments: []
                                                };
                                            }
                                            groupedComments[comment.type][item.bitv + item.title].comments.push({
                                                title: comment.title,
                                                text: comment.text,
                                                type: comment.type,
                                                images: comment.images
                                            });
                                        });
                                    }
                                }
                            });
                        });
                    }
                });
            });
        
            // Anpassung der groupedComments für Anker und Links
            Object.keys(groupedComments).forEach(commentType => {
                Object.keys(groupedComments[commentType]).forEach(key => {
                    const group = groupedComments[commentType][key];
                    const header = $(`<div>${group.bitv} - ${group.title}</div>`);
                    const ul = $('<ul>');
                    group.comments.forEach(comment => {
                        const anchorId = `${group.bitv}-${comment.type}-${comment.title}`.replace(/\s+/g, '-');
                        ul.append($('<li>').append(`<a href="#${anchorId}">${comment.title}</a>`));
                    });
                    if (commentType === 'violation') {
                        violations.append(header).append(ul);
                    } else if (commentType === 'recommendation') {
                        recommendations.append(header).append(ul);
                    } else if (commentType === 'info') {
                        infos.append(header).append(ul);
                    }
                });
            });
        
            // Detailed Comments Section
            const detailedCommentsSection = $('<div class="summarySectionDetailed"><h4>Detailed Comments:</h4></div>');
        
            Object.keys(groupedComments).forEach(commentType => {
                Object.keys(groupedComments[commentType]).forEach(key => {
                    const group = groupedComments[commentType][key];
                    group.comments.forEach(comment => {
                        const anchorId = `${group.bitv}-${comment.type}-${comment.title}`.replace(/\s+/g, '-');
                        const commentBlock = $(`
                            <div id="${anchorId}">
                                <strong>${comment.title}</strong>
                                <div>Prüfschritt: ${group.bitv} - ${group.title}</div>
                                <div>Art des Issues: ${comment.type}</div>
                                <div>${comment.text}</div>
                                <div class="comment-images">${comment.images.map(src => `<img src="${src}" class="comment-image-thumbnail">`).join('')}</div>
                            </div>
                        `);
                        detailedCommentsSection.append(commentBlock);
                    });
                });
            });
        
            summaryComments.append(detailedCommentsSection);
            
            
        }
        
        function openSummaryOverlay() {
            updateSummaryOverlay();
            $('#summary-overlay').css('display', 'block').addClass('ws10-in');
            $('.ws10-overlay__backdrop-white').css('display', 'block').addClass('ws10-in');
            $('.ws10-overlay__container').css('transform', 'translateX(-50%) translateY(-50%)');
            $('body').addClass('ws10-no-scroll');
        }
        
        $(document).on('click', '#open-summary-overlay', function() {
            openSummaryOverlay();
        });
        
        function closeSummaryOverlay() {
            $('#summary-overlay').removeClass('ws10-in').css('display', 'none');
            $('.ws10-overlay__backdrop-white').removeClass('ws10-in').css('display', 'none');
            $('body').removeClass('ws10-no-scroll');
            $('.ws10-overlay__container').css('transform', 'translateX(0) translateY(0)');
        }
        
        $(document).on('click', '#close-summary-overlay', function() {
            closeSummaryOverlay();
        });
        
        $(document).on('click', '.ws10-overlay__backdrop-white', function() {
            closeSummaryOverlay();
        });
        
        createSummaryOverlay();
        
        

        // SummaryOverlay (end)


        $('#content-wrapper').append($('<div>').attr('id', 'counter'));
        updateCounter();
        adjustAccordionHeights();
        setFiltersFromQueryString();
        loadState();
        applyFilters();

        $('input[type="radio"]:checked').each(function() {
            const fieldset = $(this).closest('fieldset');
            if ($(this).val() === 'pass') {
                // passCount++;
            } else if ($(this).val() === 'fail') {
                // failCount++;
            }
            if (!fieldset.data('isChecked')) {
                // selectedRadioCount++;
                fieldsetCount = Math.max(fieldsetCount - 1, 0);
                fieldset.data('isChecked', true);
            }
        });
        

        $('input[type="checkbox"][id^="applicable_"]:not(:checked)').each(function() {
            const fieldset = $(this).closest('li').find('fieldset');
            if (!fieldset.data('isChecked')) {
                fieldsetCount = Math.max(fieldsetCount - 1, 0);
            }
        });

        updateCounter();
        console.log("Am Ende " + fieldsetCount);
    }).fail(function(jqxhr, textStatus, error) {
        console.error("Request Failed: " + textStatus + ", " + error);

  
        



    
     
        


    });
});