function exportSummaryToPDF() {
    const summaryOverlayContent = $('#simplepdf').html();

    // Debugging: Überprüfe den HTML-Inhalt, der gesendet wird
    console.log("HTML content to be sent:", summaryOverlayContent);

    $.ajax({
        type: 'POST',
        url: 'https://onlinedepartment.de/pdf/generate_pdf.php',
        data: { html: summaryOverlayContent },
        success: function(response, status, xhr) {
            if (xhr.getResponseHeader('Content-Type') === 'application/pdf') {
                const blob = new Blob([response], { type: 'application/pdf' });
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'a11y-summary.pdf';
                link.click();
                console.log("PDF generated successfully");
            } else {
                console.error('Unexpected content type:', xhr.getResponseHeader('Content-Type'));
                console.error('Response:', response);
            }
        },
        error: function(xhr, status, error) {
            console.error('PDF generation failed:', error);
            console.error('Status:', status);
            console.error('XHR:', xhr);
        }
    });
    
}

$(document).on('click', '#export-pdf', function() {
    exportSummaryToPDF();
});
