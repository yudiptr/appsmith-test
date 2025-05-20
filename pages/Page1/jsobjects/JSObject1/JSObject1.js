export default {
	async mbohCsv() {
		const csvData = FilePicker1.files?.[0]?.data;
		const dbData = Query1.data;

		if (!csvData || !dbData || csvData.length === 0 || dbData.length === 0) {
			showAlert("Missing or empty CSV/DB data", "error");
			return [];
		}

		// Buat map product_id dari DB
		const dbMap = {};
		dbData.forEach(item => {
			dbMap[item.product_id] = true;
		});

		// Filter data yang tidak ada di DB
		const result = csvData.filter(item => !dbMap[item.product_id]);

		if (result.length === 0) {
			showAlert("All CSV rows exist in DB. Nothing to export.", "info");
			return [];
		}

		// ----------- BUAT FILE XLSX ----------- //
		const workbook = new ExcelJS.Workbook();
		const sheet = workbook.addWorksheet("Unmatched Data");

		// Header
		const headers = Object.keys(result[0]);
		sheet.addRow(headers);

		// Data rows
		result.forEach(row => {
			sheet.addRow(headers.map(h => row[h]));
		});

		// Simpan ke buffer dan download
		// ini filenya
		const buffer = await workbook.csv.writeBuffer();

		showAlert("Exported unmatched data to Excel", "success");

		return result;
	}
};
