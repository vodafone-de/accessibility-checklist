 function exportSummaryToPDF() {
            const summaryOverlayContent = $('#simplepdf').html();
            $.ajax({
                type: 'POST',
                url: 'https://onlinedepartment.de/pdf/generate_pdf.php',
                data: { html: summaryOverlayContent },
                success: function(response, status, xhr) {
                    const blob = new Blob([response], { type: 'application/pdf' });
                    const link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = 'summary.pdf';
                    link.click();
                },
                error: function(xhr, status, error) {
                    console.error('PDF generation failed:', error);
                }
            });
        }
        
        $(document).on('click', '#export-pdf', function() {
            exportSummaryToPDF();
        });