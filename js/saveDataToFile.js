document.addEventListener('DOMContentLoaded', function() {
    // Funktion, um einen Dateinamen mit dem aktuellen Datum zu generieren
    function generateFilename() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `audit-report_unnamed_${year}-${month}-${day}.json`;
    }

    // Speichern der Daten in einer Datei
    async function saveDataToFile() {
        const auditInfo = localStorage.getItem('auditInfo');
        const filterState = localStorage.getItem('filterState');

        const data = {
            auditInfo: auditInfo ? JSON.parse(auditInfo) : null,
            filterState: filterState ? JSON.parse(filterState) : null
        };

        const defaultFilename = generateFilename();

        if ('showSaveFilePicker' in window) {
            const options = {
                suggestedName: defaultFilename,
                types: [
                    {
                        description: 'JSON Files',
                        accept: { 'application/json': ['.json'] },
                    },
                ],
            };

            try {
                const fileHandle = await window.showSaveFilePicker(options);
                const writableStream = await fileHandle.createWritable();
                await writableStream.write(JSON.stringify(data));
                await writableStream.close();
                alert('Datei erfolgreich gespeichert.');
            } catch (error) {
                console.error('Dateispeicherung abgebrochen oder fehlgeschlagen:', error);
            }
        } else {
            // Fallback für Browser, die showSaveFilePicker nicht unterstützen
            const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const dateiname = prompt("Bitte geben Sie einen Dateinamen ein:", defaultFilename);
            a.download = dateiname || defaultFilename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }

    // Laden der Daten aus einer Datei
    function loadDataFromFile(event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function(event) {
            const data = JSON.parse(event.target.result);
            
            if (data.auditInfo) {
                localStorage.setItem('auditInfo', JSON.stringify(data.auditInfo));
            } else {
                localStorage.removeItem('auditInfo');
            }
            
            if (data.filterState) {
                localStorage.setItem('filterState', JSON.stringify(data.filterState));
            } else {
                localStorage.removeItem('filterState');
            }

            // Optional: Seite neu laden, um den neuen Zustand anzuwenden
            location.reload();
        };

        reader.readAsText(file);
    }

    // Event-Listener für das Laden von Daten
    document.getElementById('load-file-input').addEventListener('change', loadDataFromFile, false);
    document.getElementById('load-data-button').onclick = () => document.getElementById('load-file-input').click();
    document.getElementById('save-data-button').onclick = saveDataToFile;
});
