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
            queryString += `category=${selectedTaskFilters.join(',')}`;
        }
    
        console.log('Query String:', queryString); // Debug-Ausgabe
    
        history.replaceState(null, '', `${location.pathname}${queryString}`);
    }
    
    function setFiltersFromQueryString() {
        const params = new URLSearchParams(window.location.search);
        const filters = params.get('role');
        const taskfilters = params.get('category');
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
            comments: {}
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
                    images: $(this).data('images') || []
                };
            }).get();
            if (comments.length > 0) {
                state.comments[taskId] = comments;
            }
        });

        localStorage.setItem('filterState', JSON.stringify(state));
    }

    function loadState() {
        const state = JSON.parse(localStorage.getItem('filterState'));

        if (state) {
            for (const [key, value] of Object.entries(state.selectedRadios)) {
                $(`#${key}`).prop('checked', value);
            }

            for (const [key, value] of Object.entries(state.applicableCheckboxes)) {
                $(`#${key}`).prop('checked', value).trigger('change');
            }

            for (const [taskId, comments] of Object.entries(state.comments)) {
                const container = $(`li.taskContainer#${taskId}`);
                comments.forEach(comment => {
                    container.find('.comments').append(`
                        <div class="comment-item" data-comment-text="${comment.text}" data-images='${JSON.stringify(comment.images)}'>
                            <div class="comment-title">${comment.title}</div>
                            <button class="edit-comment-button">Edit</button>
                            <button class="delete-comment-button">Delete</button>
                        </div>
                    `);
                });
            }
        }
        console.log("loadState " + selectedRadioCount);
    }

    function clearState() {
        if (confirm('All checked elements will be reset. This can not be undone. Are you sure you want to proceed?')) {
            localStorage.removeItem('filterState');
            location.reload();
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
                <button id="close-overlay" aria-label="Close" class="tabenable ws10-button-icon-only ws10-button-icon-only--tertiary ws10-button-icon-only--floating ws10-button-icon-only--standard close">
                <svg id="close-icon" class="ws10-button-icon-only__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
            
                        <line class="st0" x1="44" y1="148" x2="148" y2="44" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8.67"/>
                        <line class="st0" x1="148" y1="148" x2="44" y2="44" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8.67"/>
                  </svg>
                  
            </button>
                </div>
                <div class="ws10-overlay__content"></div>
            </div>
        </div>
        <div class="ws10-overlay__backdrop ws10-fade ws10-in" style="display: none;">
    </div>`);
    
    $('body').append(overlay);
    
    $('#content-wrapper').on('click', '.open-overlay', function() {
        const li = $(this).closest('li');
        const head5 = li.closest('.bitvcontainer').find('h5'); // li in der Nähe der .bitvcontainer suchen
        const taskDesc = li.find('.taskdesc').html();
        const itemTitle = head5.html(); // Den Inhalt des <h5> Elements holen
        const testTool = li.find('.testtool').html();
        const testMethod = li.find('.testmethod').html();
        const testToolLink = li.find('.testtoollink').html();
    
        const overlayContent = $('.ws10-overlay__content');
    
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
        console.log("Backdrop clicked"); // Debug-Ausgabe
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
        }
    });

    class CommentOverlay {
        constructor() {
            this.initOverlay();
            this.bindEvents();
            this.loadState();
        }
    
        initOverlay() {
            this.commentOverlay = $(`
                <div id="comment-overlay" class="comment-overlay" style="display: none;">
                    <div class="comment-overlay-content">
                        <h3>Add/Edit Comment</h3>
                        <label for="comment-title">Title:</label>
                        <input type="text" id="comment-title">
                        <label for="comment-text">Comment:</label>
                        <textarea id="comment-text"></textarea>
                        <h4>Upload screenshots</h4>
                        <div id="image-upload-container">
                            <input type="file" id="image-upload-input" accept=".jpg,.png" style="display: none;">
                            <div id="image-upload-area">
                                <span>+</span>
                            </div>
                        </div>
                        <div id="image-thumbnails" class="image-thumbnails"></div>
                        <button id="save-comment">Save</button>
                        <button id="cancel-comment">Cancel</button>
                    </div>
                </div>
            `);
            $('body').append(this.commentOverlay);
        }
    
        bindEvents() {
            $(document).on('click', '.add-comment-button', (e) => this.showAddCommentOverlay(e));
            $(document).on('click', '.edit-comment-button', (e) => this.showEditCommentOverlay(e));
            $(document).on('click', '#save-comment', (e) => this.saveComment(e));
            $(document).on('click', '#cancel-comment', (e) => this.hideOverlay(e));
            $(document).on('click', '.delete-comment-button', (e) => this.deleteComment(e));
            $(document).on('keydown', (e) => this.handleEscapeKey(e));
            $(document).on('click', '#image-upload-area', () => $('#image-upload-input').click());
            $(document).on('change', '#image-upload-input', (e) => this.handleImageUpload(e));
            $(document).on('click', '.delete-image-button', (e) => this.deleteImage(e));
        }
    
        showAddCommentOverlay(e) {
            e.stopPropagation();
            this.currentTaskContainer = $(e.currentTarget).closest('li.taskContainer');
            this.currentCommentItem = null;
            $('#comment-title').val('');
            $('#comment-text').val('');
            $('#image-upload-area').empty().append('<span>+</span>');
            $('#image-thumbnails').empty();
            $('#comment-overlay').show();
        }
    
        showEditCommentOverlay(e) {
            e.stopPropagation();
            this.currentTaskContainer = $(e.currentTarget).closest('li.taskContainer');
            this.currentCommentItem = $(e.currentTarget).closest('.comment-item');
            const title = this.currentCommentItem.find('.comment-title').text();
            const text = this.currentCommentItem.data('comment-text');
            $('#comment-title').val(title);
            $('#comment-text').val(text);
            $('#image-upload-area').empty().append('<span>+</span>');
            $('#image-thumbnails').empty();
            const images = this.currentCommentItem.data('images') || [];
            images.forEach((src) => {
                $('#image-thumbnails').append(this.createImageThumbnail(src));
            });
            $('#comment-overlay').show();
        }
    
        saveComment(e) {
            e.stopPropagation();
            const title = $('#comment-title').val().trim();
            const text = $('#comment-text').val().trim();
            const images = [];
            $('#image-thumbnails img').each(function() {
                images.push($(this).attr('src'));
            });
    
            if (title && text) {
                if (this.currentCommentItem) {
                    this.currentCommentItem.find('.comment-title').text(title);
                    this.currentCommentItem.data('comment-text', text);
                    this.currentCommentItem.data('images', images);
                } else {
                    this.currentTaskContainer.find('.comments').append(`
                        <div class="comment-item" data-comment-text="${text}" data-images='${JSON.stringify(images)}'>
                            <div class="comment-title">${title}</div>
                            <button class="edit-comment-button">Edit</button>
                            <button class="delete-comment-button">Delete</button>
                        </div>
                    `);
                }
                this.adjustAccordionHeight(this.currentTaskContainer);
                this.saveState();
                $('#comment-overlay').hide();
            } else {
                alert('Both title and comment text are required.');
            }
        }
    
        hideOverlay(e) {
            e.stopPropagation();
            $('#comment-overlay').hide();
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
                $('#comment-overlay').hide();
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
    
        createImageThumbnail(src) {
            return `
                <div class="image-thumbnail-container">
                    <img src="${src}" class="uploaded-image-thumbnail">
                    <button class="delete-image-button">Delete</button>
                </div>
            `;
        }
    
        deleteImage(e) {
            e.stopPropagation();
            $(e.currentTarget).closest('.image-thumbnail-container').remove();
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
                        images: $(this).data('images') || []
                    };
                }).get();
                if (comments.length > 0) {
                    state.comments[taskId] = comments;
                }
            });
    
            localStorage.setItem('filterState', JSON.stringify(state));
        }
    
        loadState() {
            const state = JSON.parse(localStorage.getItem('filterState'));
    
            if (state) {
                for (const [key, value] of Object.entries(state.selectedRadios)) {
                    $(`#${key}`).prop('checked', value);
                }
    
                for (const [key, value] of Object.entries(state.applicableCheckboxes)) {
                    $(`#${key}`).prop('checked', value).trigger('change');
                }
    
                for (const [taskId, comments] of Object.entries(state.comments)) {
                    const container = $(`li.taskContainer#${taskId}`);
                    comments.forEach(comment => {
                        const commentItem = $(`
                            <div class="comment-item" data-comment-text="${comment.text}" data-images='${JSON.stringify(comment.images)}'>
                                <div class="comment-title">${comment.title}</div>
                                <button class="edit-comment-button">Edit</button>
                                <button class="delete-comment-button">Delete</button>
                            </div>
                        `);
                        container.find('.comments').append(commentItem);
                        comment.images.forEach((src) => {
                            commentItem.append(this.createImageThumbnail(src));
                        });
                    });
                }
            }
        }
    }
    
    $(document).ready(() => {
        new CommentOverlay();
    });
    



    $.getJSON('https://vodafone-de.github.io/accessibility-checklist/data/data.json', function(jsonArray) {
        const groupedByCategory = {};
        const taskCategories = new Set();

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
                <li><div class="cat action" tabindex="0">
                    <label><input type="checkbox" value="filter_testingwftooltasks" data-filter_id="testingwftooltasks"><span class="ws10-text">WF Testing: Tool supported</span></label>
                </div></li>
                <li><div class="cat action" tabindex="0">
                <label><input type="checkbox" value="filter_testingwfmantasks" data-filter_id="testingwfmantasks"><span class="ws10-text">WF Testing: Manual without additional info</span></label>
            </div></li>
            <li><div class="cat action" tabindex="0">
            <label><input type="checkbox" value="filter_testingwfmanexttasks" data-filter_id="testingwfmanexttasks"><span class="ws10-text">WF Testing: Manual with additional info</span></label>
        </div></li>
                </ul>
                <ul>
                <li>
                <div class="dropdown">
                <button class="dropdown-button">Select Categories <svg aria-hidden="true" class="dropdown-item__chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><polyline class="st0" points="164 62 96 130 28 62" fill="none" stroke-linecap="round" stroke-miterlimit="10" stroke-width="8"></polyline></svg></button>
                <div class="dropdown-content">
                    <ul id="taskcat-dropdown">
                    ${[...sortedTaskCategories].map(cat => `
                    <li>
                        <label>
                            <input type="checkbox" value="${cat}" data-filter_id="${cat}">
                            <span class="ws10-text">${cat}</span>
                        </label>
                    </li>`).join('')}
                    </ul>
                </div>
            </div>
            </li>
            <li><button class="ws10-secondary-button" id="reset-filters">Reset Filters</button></li>
            </ul>
            
            <div style="clear:both"></div>
        </div>
        <div id="selected-filters"></div>
        `;

        $('#content-wrapper').prepend(filterHtml);

        $('.dropdown-button').click(function() {
            $('.dropdown-content').toggle().toggleClass('open');
        });

        $(document).keydown(function(e) {
            if (e.key === "Escape" && $('.dropdown-content').hasClass('open')) {
                $('.dropdown-content').hide().removeClass('open');
                $('.dropdown-button').focus();
            }
        });

        $(document).click(function(e) {
            if (!$(e.target).closest('.dropdown-button, .dropdown-content').length) {
                $('.dropdown-content').hide().removeClass('open');
            }
        });

        $('#filter-options input[type="checkbox"], #taskcat-dropdown input[type="checkbox"]').change(function() {
            applyFilters();
            updateFilterNumberBadge();
        });

        $('#reset-filters').click(function() {
            resetFilters();
        });

        $('#clear-state').click(function() {
            clearState();
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
                                taskCatDiv.append($('<div>').html('<strong>Tags:</strong>').addClass('roles'));
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
                                        saveState();
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

                                const openButton = $('<button class="open-overlay ws10-button-link ws10-button-link--color-primary-200" style="margin-top: 10px;grid-column-start: 1;">test instructions<svg id="icon" class="ws10-button-link__icon ws10-button-link__icon--right ws10-system-icon ws10-system-icon--size-150 ws10-system-icon--color-primary-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><polyline class="st0" points="62 28 130 96 62 164" fill="none" stroke-linecap="round" stroke-miterlimit="10" stroke-width="8"/></svg></button>');
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
                                });

                                switchWrapper.on('click', function() {
                                    applicableCheckbox.prop('checked', !applicableCheckbox.prop('checked')).trigger('change');
                                });

                              // Kommentarfunktion
                              const commentsDiv = $('<div>').addClass('comments');
                              const addCommentButton = $('<button>add comment<svg id="icon" class="ws10-button-link__icon ws10-button-link__icon--right ws10-system-icon ws10-system-icon--size-150 ws10-system-icon--color-primary-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><polyline class="st0" points="62 28 130 96 62 164" fill="none" stroke-linecap="round" stroke-miterlimit="10" stroke-width="8"/></svg></button>').addClass('add-comment-button ws10-button-link ws10-button-link--color-primary-200');
                              li.append(commentsDiv).append(addCommentButton);
                                
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
