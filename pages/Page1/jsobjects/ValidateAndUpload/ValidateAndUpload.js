export default {
	validateThenUpload: async () => {
		if (!FilePicker1.files?.length) {
			showAlert("No file selected", "error");
			return;
		}

		try {
			await Validate.run();
			showAlert("Validation successful", "success");

			// Now trigger upload
			await Upload.run();
			showAlert("Upload successful", "success");
		} catch (err) {
			showAlert("Failed: " + err.message, "error");
		}
	}
};
