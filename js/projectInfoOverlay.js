class AuditInfoOverlay {
    constructor() {
        this.initOverlay();
        this.bindEvents();
        this.loadState();
    }

    initOverlay() {
        this.auditOverlay = $(this.getOverlayTemplate());
        $('body').append(this.auditOverlay);
    }

    bindEvents() {
        const events = [
            { selector: '#addAuditInfo', event: 'click', handler: this.showAddAuditOverlay },
            { selector: '#startAudit', event: 'click', handler: this.showAddAuditOverlay },
            { selector: '#editAuditInfo', event: 'click', handler: this.showAddAuditOverlay },
            { selector: '#deleteAuditInfo', event: 'click', handler: this.deleteAuditInfo },
            { selector: '#save-audit-info', event: 'click', handler: this.saveAuditInfo },
            { selector: '#cancel-audit-info', event: 'click', handler: this.hideOverlay },
            { selector: '#audit-image-upload-area', event: 'click', handler: () => $('#audit-image-upload-input').click() },
            { selector: '#audit-image-upload-input', event: 'change', handler: this.handleImageUpload },
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
                <div id="audit-overlay" class="ws10-overlay ws10-fade ws10-overlay--slide ws10-overlay--spacing ws10-overlay--align-left ws10-in" style="display: none;">
                    <div class="ws10-overlay__container">
                        <div class="ws10-overlay__close">
                            <button id="cancel-audit-info" aria-label="Cancel audit info" class="ws10-button-icon-only ws10-button-icon-only--tertiary ws10-button-icon-only--floating ws10-button-icon-only--standard close overlayKeyOn" tabindex="1">
                                <svg id="close-icon" class="ws10-button-icon-only__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
                                    <line class="st0" x1="44" y1="148" x2="148" y2="44" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8.67"></line>
                                    <line class="st0" x1="148" y1="148" x2="44" y2="44" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8.67"></line>
                                </svg>
                            </button>
                        </div>
                        <div class="audit-overlay-content ws10-overlay__content">
                            <h5>Audit info</h5>
                            ${this.getAuditFormTemplate()}
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

    getAuditFormTemplate() {
        return `
            <div class="ws10-form-element-block ws10-form-element-block--text-input">
                <div class="ws10-form-element-block__label-container">
                    <label for="audit-name" class="ws10-form-label">Audit name</label>
                </div>
                <div class="ws10-form-element-block__input-container">
                    <input type="text" id="audit-name" name="audit-name" class="form-text-input"/>
                </div>
            </div>
            <div class="ws10-form-element-block ws10-form-element-block--text-input">
                <div class="ws10-form-element-block__label-container">
                    <label for="audited-by" class="ws10-form-label">Audited by</label>
                </div>
                <div class="ws10-form-element-block__input-container">
                    <input type="text" id="audited-by" name="audited-by" class="form-text-input"/>
                </div>
            </div>
            <div class="ws10-form-element-block ws10-form-element-block--text-input">
                <div class="ws10-form-element-block__label-container">
                    <label for="email-address" class="ws10-form-label">E-mail address</label>
                </div>
                <div class="ws10-form-element-block__input-container">
                    <input type="email" id="email-address" name="email-address" class="form-text-input"/>
                </div>
            </div>
            <div class="ws10-form-element-block ws10-form-element-block--select">
                <div class="ws10-form-element-block__label-container">
                    <label for="audit-object" class="ws10-form-label">Audit object</label>
                </div>
                <div class="ws10-form-element-block__input-container">
                    <select id="audit-object" class="ws10-form-select ws10-form-select__select">
                        <option value="web-page">Web page</option>
                        <option value="pattern">Pattern</option>
                        <option value="app">App</option>
                        <option value="email">E-mail</option>
                    </select>
                    <span class="ws10-form-select__notification_icon-container"><svg aria-hidden="true" class="ws10-form-select__chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><polyline class="st0" points="164 62 96 130 28 62" fill="none" stroke-linecap="round" stroke-miterlimit="10" stroke-width="8"></polyline></svg></span>
                </div>
            </div>
            <div class="ws10-form-element-block ws10-form-element-block--text-input">
                <div class="ws10-form-element-block__label-container">
                    <label for="url" class="ws10-form-label">URL</label>
                </div>
                <div class="ws10-form-element-block__input-container">
                    <input type="url" id="url" name="url" class="form-text-input"/>
                </div>
            </div>
            <div class="ws10-form-element-block ws10-form-element-block--textarea">
                <div class="ws10-form-element-block__label-container">
                    <label for="further-info" class="ws10-form-label">Further information</label>
                </div>
                <div class="ws10-form-element-block__input-container">
                <div class="ws10-form-textarea">
                        <textarea id="further-info" rows="5" class="ws10-form-textarea__textarea"></textarea>
                    </div>
                   
                </div>
            </div>
        `;
    }

    getImageUploadTemplate() {
        return `
            <div class="ws10-form-element-block__label-container">
                <label class="ws10-form-label">Sample screenshot (jpg/png)</label>
            </div>
            <div id="audit-image-upload-container">
                <input type="file" id="audit-image-upload-input" accept=".jpg,.png" style="display: none;">
                <div id="audit-image-upload-area"><span>add jpg/png</span></div>
            </div>
            <div id="audit-image-thumbnails" class="image-thumbnails"></div>
        `;
    }

    getButtonsTemplate() {
        return `
            <div class="overlayButtonsContainer">
                <button id="save-audit-info" class="ws10-secondary-button element50percentwidth">Save & Close</button>
                <button id="cancel-audit-info" class="ws10-alt-button element50percentwidth">Cancel</button>
            </div>
        `;
    }

    getBackdropTemplate() {
        return `<div class="ws10-overlay__backdropAudit ws10-fade ws10-in"></div>`;
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

    showAddAuditOverlay(e) {
        e.stopPropagation();
        const auditData = this.loadAuditData();
        if (auditData) {
            $('#audit-name').val(auditData.auditName);
            $('#audited-by').val(auditData.auditedBy);
            $('#email-address').val(auditData.emailAddress);
            $('#audit-object').val(auditData.auditObject);
            $('#url').val(auditData.url);
            $('#further-info').val(auditData.furtherInfo);
            $('#audit-image-thumbnails').empty();
            auditData.images.forEach(src => {
                $('#audit-image-thumbnails').append(this.createImageThumbnail(src));
            });
        } else {
            $('#audit-name').val('');
            $('#audited-by').val('');
            $('#email-address').val('');
            $('#audit-object').val('web-page');
            $('#url').val('');
            $('#further-info').val('');
            $('#audit-image-upload-area').html('<a class="imageUploadLink" href="#/"><div><svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path class="iconRed" d="M3.15753 14.6153C3.01548 14.8521 3.0923 15.1592 3.3291 15.3013C3.56591 15.4433 3.87303 15.3665 4.01508 15.1297L3.15753 14.6153ZM7.5288 8.29998L7.88236 7.94643C7.77348 7.83755 7.62051 7.78491 7.46768 7.80373C7.31486 7.82255 7.17923 7.91074 7.10003 8.04278L7.5288 8.29998ZM13.6763 14.4475L13.3227 14.801C13.518 14.9963 13.8346 14.9963 14.0299 14.801L13.6763 14.4475ZM15.9113 12.2125L16.2648 11.8589C16.0695 11.6637 15.753 11.6637 15.5577 11.8589L15.9113 12.2125ZM20.1465 17.1536C20.3418 17.3488 20.6584 17.3488 20.8537 17.1535C21.0489 16.9582 21.0488 16.6416 20.8536 16.4464L20.1465 17.1536ZM5.5 3.5V3V3.5ZM20.5 3.5H21C21 3.22386 20.7761 3 20.5 3V3.5ZM3.5 18.5H3H3.5ZM4.01508 15.1297L7.95758 8.55718L7.10003 8.04278L3.15753 14.6153L4.01508 15.1297ZM7.17525 8.65353L13.3227 14.801L14.0299 14.0939L7.88236 7.94643L7.17525 8.65353ZM14.0299 14.801L16.2649 12.566L15.5577 11.8589L13.3227 14.0939L14.0299 14.801ZM15.5578 12.5661L20.1465 17.1536L20.8536 16.4464L16.2648 11.8589L15.5578 12.5661ZM16.0625 8C16.0625 8.5868 15.5868 9.0625 15 9.0625V10.0625C16.1391 10.0625 17.0625 9.13909 17.0625 8H16.0625ZM15 9.0625C14.4132 9.0625 13.9375 8.5868 13.9375 8H12.9375C12.9375 9.13909 13.8609 10.0625 15 10.0625V9.0625ZM13.9375 8C13.9375 7.4132 14.4132 6.9375 15 6.9375V5.9375C13.8609 5.9375 12.9375 6.86091 12.9375 8H13.9375ZM15 6.9375C15.5868 6.9375 16.0625 7.4132 16.0625 8H17.0625C17.0625 6.86091 16.1391 5.9375 15 5.9375V6.9375ZM5.5 4H20.5V3H5.5V4ZM20 3.5V18.5H21V3.5H20ZM20 18.5C20 18.8978 19.842 19.2794 19.5607 19.5607L20.2678 20.2678C20.7366 19.7989 21 19.163 21 18.5H20ZM19.5607 19.5607C19.2794 19.842 18.8978 20 18.5 20V21C19.163 21 19.7989 20.7366 20.2678 20.2678L19.5607 19.5607ZM18.5 20H5.5V21H18.5V20ZM5.5 20C5.10218 20 4.72064 19.842 4.43934 19.5607L3.73223 20.2678C4.20107 20.7366 4.83696 21 5.5 21V20ZM4.43934 19.5607C4.15804 19.2794 4 18.8978 4 18.5H3C3 19.163 3.26339 19.7989 3.73223 20.2678L4.43934 19.5607ZM4 18.5V5.5H3V18.5H4ZM4 5.5C4 5.10218 4.15804 4.72064 4.43934 4.43934L3.73223 3.73223C3.26339 4.20107 3 4.83696 3 5.5H4ZM4.43934 4.43934C4.72064 4.15804 5.10218 4 5.5 4V3C4.83696 3 4.20107 3.26339 3.73223 3.73223L4.43934 4.43934Z" fill="#0D0D0D"/><circle class="iconRed" cx="20.5" cy="3.5" r="3.5" fill="#0D0D0D"/><path class="iconRed" d="M19 3.5H22M20.5 2V5" stroke="white" stroke-linecap="round" stroke-linejoin="round"/></svg></div>Browse to add jpg/png</a>');
            $('#audit-image-thumbnails').empty();
        }
        $('#audit-overlay').show();
        this.toggleBackdrop(true);
    }

    saveAuditInfo(e) {
        e.stopPropagation();
        const auditData = {
            auditName: $('#audit-name').val().trim(),
            auditedBy: $('#audited-by').val().trim(),
            emailAddress: $('#email-address').val().trim(),
            auditObject: $('#audit-object').val(),
            url: $('#url').val().trim(),
            furtherInfo: $('#further-info').val().trim(),
            images: this.getUploadedImages(),
        };
        $('#addAuditInfo').text('Edit audit info');
        $('#startAudit').replaceWith('<div class="auditTitle">' + auditData.auditName + '</div>');
        localStorage.setItem('auditInfo', JSON.stringify(auditData));
        this.displayAuditInfo(auditData);
        this.hideOverlay();
    }
    

    displayAuditInfo(data) {
        const container = $('#audit-info-container');
        container.html(`
            <div class="projectInfo cardFlat">
                <div class="infoContainer">
                    <h4>Audit Information</h4>
                    <p><strong>Audit name:</strong> ${data.auditName}</p>
                    <p><strong>Audited by:</strong> ${data.auditedBy}</p>
                    <p><strong>E-mail address:</strong> ${data.emailAddress}</p>
                    <p><strong>Audit object:</strong> ${data.auditObject}</p>
                    <p><strong>URL:</strong> <a href="${data.url}" target="_blank">${data.url}</a></p>
                    <p><strong>Further information:</strong> ${data.furtherInfo}</p>
                    <div class="audit-images">
                    ${data.images.map(src => `<img src="${src}" class="audit-image-thumbnail">`).join('')}
                    </div>
                </div>
                <div class="infoTools">
                <button id="editAuditInfo" class="overlayKeyOff commentFunctionsButtons">
                <svg class="icon24" id="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
                    <polyline class="st0" points="147.38 70.11 121.57 44.02 36.49 129.1 27.77 164 62.67 155.27 147.38 70.11" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"></polyline>
                    <path class="st0" d="M121.57,44l12.79-12.79a11,11,0,0,1,15.63,0l18,18.22L147.38,70.11" fill="none" stroke-linecap="round" stroke-miterlimit="10" stroke-width="8"></path>
                    <line class="st0" x1="39.55" y1="126.1" x2="65.73" y2="152.28" fill="none" stroke-miterlimit="10" stroke-width="8"></line>
                </svg>
            </button>
            <button id="deleteAuditInfo" class="overlayKeyOff commentFunctionsButtons">
                <svg id="icon" class="icon24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
                    <line class="st0" x1="112.01" y1="144" x2="112.01" y2="72" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"></line>
                    <line class="st0" x1="80.01" y1="144" x2="80.01" y2="72" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"></line>
                    <line class="st0" x1="36" y1="44" x2="156" y2="44" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="8"></line>
                    <path class="st0" d="M120,44V36a16,16,0,0,0-16-16H88A16,16,0,0,0,72,36v8" fill="none" stroke-linejoin="round" stroke-width="8"></path>
                    <path class="st0" d="M148,44V156a16,16,0,0,1-16,16H60a16,16,0,0,1-16-16V44" fill="none" stroke-linejoin="round" stroke-width="8"></path>
                </svg>
            </button>
                </div>
            </div>
        `);
        console.log('Displayed Audit Info:', data); // Debug-Ausgabe
    }

    getUploadedImages() {
        const images = [];
        $('#audit-image-thumbnails img').each(function () {
            images.push($(this).attr('src'));
        });
        return images;
    }

    hideOverlay() {
        $('#audit-overlay').hide();
        this.toggleBackdrop(false);
    }

    handleImageUpload(e) {
        const files = e.target.files;
        if (files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                $('#audit-image-thumbnails').append(this.createImageThumbnail(event.target.result));
            };
            reader.readAsDataURL(file);
        }
    }

    createImageThumbnail(src) {
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

    deleteImage(e) {
        e.stopPropagation();
        $(e.currentTarget).closest('.image-thumbnail-container').remove();
    }

    deleteAuditInfo(e) {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete the Audit information?')) {
            const AuditInfoItem = $(e.currentTarget).closest('.projectInfo');
            AuditInfoItem.remove();
            localStorage.removeItem('auditInfo');
            $('#addAuditInfo').text('Add audit info');
            $('#startAudit').replaceWith('<button class="ws10-secondary-button overlayKeyOff" id="startAudit">Start new Audit</button>');
        }
    }
    

    openLightbox(e) {
        const src = $(e.currentTarget).attr('src');
        $('.lightbox-image').attr('src', src);
        $('#lightbox').show();
    }

    closeLightbox() {
        $('#lightbox').hide();
    }

    toggleBackdrop(show) {
        const display = show ? 'block' : 'none';
        $('.ws10-overlay__backdropAudit').css('display', display);
        $('body').toggleClass('ws10-no-scroll', show);
    }

    loadState() {
        const auditData = this.loadAuditData();
        if (auditData) {
            this.displayAuditInfo(auditData);
            $('#addAuditInfo').text('Edit audit info');
            $('#startAudit').replaceWith('<div class="auditTitle">' + auditData.auditName + '</div>');
        }
    }

    loadAuditData() {
        return JSON.parse(localStorage.getItem('auditInfo'));
    }
}

$(document).ready(() => {
    new AuditInfoOverlay();
});
