export default {
	validateThenInsert: async () => {
		if (!FilePicker1.files?.length) {
			showAlert("No file selected", "error");
			return;
		}

		try {
			const newRows = await ValidateFileType.dirtyCSV();
			if (!newRows.length) {
				showAlert("No new data to insert", "info");
				return;
			}

			storeValue("csvDataToUpload", newRows);
			storeValue(
				"productIdsToLog",
				newRows.map(r => `${r.product_id}`).filter(Boolean).join(",")
			);


			const workbook = new ExcelJS.Workbook();
			const sheet = workbook.addWorksheet("Insert Data");

			const headers = Object.keys(newRows[0]);
			sheet.addRow(headers);
			newRows.forEach(row => {
				sheet.addRow(headers.map(h => row[h]));
			});

			const buffer = await workbook.csv.writeBuffer();

			storeValue("fileToUpload", {
				data: buffer,
				name: "insert_data.csv",
				type: "text/csv"
			});

			await Validate.run();
			showAlert("Validation successful", "success");

			await Upload.run(); 
			showAlert("Insert successful", "success");

			await SetLog.run({ logActivity: "INSERT" });
			showAlert("Log recorded", "success");

		} catch (err) {
			showAlert("Insert failed: " + err.message, "error");
		}
	}
}
