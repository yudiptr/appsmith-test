export default {
  async dirtyCSV() {
    const csvData = FilePicker1.files?.[0]?.data;
    const dbData = Query1.data;

    if (!csvData || !dbData) {
      showAlert("Missing CSV or DB data", "error");
      return [];
    }

    const dbMap = {};
    for (let item of dbData) {
      dbMap[item.product_id] = item;
    }

    // Filter hanya yang tidak ada di DB
    const result = csvData.filter(csvItem => !dbMap[csvItem.product_id]);

    return result;
  }
};
