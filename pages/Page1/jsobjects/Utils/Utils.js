export default {
	generateCSVString: (data) => {
		if (!data || data.length === 0) return "";

		const headers = Object.keys(data[0]);
		const csv = [
			headers.join(","),
			...data.map(row => headers.map(h => `"${row[h] ?? ""}"`).join(","))
		].join("\n");

		return csv;
	}
}
