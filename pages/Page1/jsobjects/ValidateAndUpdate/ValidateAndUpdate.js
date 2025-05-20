export default {
	validateThenUpdate: async () => {
		if (!FilePicker1.files?.length) {
			showAlert("No file selected", "error");
			return;
		}

		try {
			const result = await CompareOldVsNew.compareCSVWithQuery();
			if (!result.length) {
				showAlert("No updates detected", "info");
				return;
			}

			const cleaned = result.map(({ product_id, ...rest }) => {
				const row = { product_id };
				for (let key in rest) {
					if (key.startsWith("new_")) {
						row[key.replace("new_", "")] = rest[key];
					}
				}
				return row;
			});

			storeValue("csvDataToUpload", cleaned);
			storeValue("productIdsToLog", cleaned.map(r => r.product_id).filter(Boolean));

			const workbook = new ExcelJS.Workbook();
			const sheet = workbook.addWorksheet("Update Data");

			const headers = Object.keys(cleaned[0]);
			sheet.addRow(headers);
			cleaned.forEach(row => {
				sheet.addRow(headers.map(h => row[h]));
			});

			const buffer = await workbook.csv.writeBuffer();

			// 📁 Simpan file ke Appsmith store
			storeValue("fileToUpload", {
				data: buffer,
				name: "update_data.csv",
				type: "text/csv"
			});

			// ✅ Run upload flow
			await Validate.run();
			showAlert("Validation successful", "success");

			await Upload.run();
			showAlert("Update successful", "success");

			await SetLog.run({ logActivity: "UPDATE" });
			showAlert("Log recorded", "success");

		} catch (err) {
			showAlert("Update failed: " + err.message, "error");
		}
	}
}
