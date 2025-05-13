export default {
  async compareCSVWithQuery() {
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

    const fields = [
      "partner_name", "partner_ref_id", "enabled", "type_enum", "product_name", "denom", "group_id", "group_name",
      "default_price", "price_after_discount", "cogs", "order_number", "margin", "margin_type", "discount",
      "discount_type", "default_fee", "fee", "tag", "description"
    ];

    const result = csvData.flatMap(csvItem => {
      const dbItem = dbMap[csvItem.product_id];
      if (!dbItem) return [];

      const output = { product_id: csvItem.product_id };
      let numChanged = 0;

      for (let key of fields) {
        let oldVal = dbItem[key];
        let newVal = csvItem[key];

        if (typeof oldVal === "boolean") oldVal = oldVal ? 1 : 0;
        if (typeof newVal === "string" && newVal.match(/^\d+(\.\d+)?$/)) newVal = Number(newVal);

        output[`old_${key}`] = oldVal;
        output[`new_${key}`] = newVal;

        if (`${oldVal}` !== `${newVal}`) numChanged++;
      }

      output.numChanged = numChanged;
      return [output];
    });

    return result.length > 0
      ? result.sort((a, b) => b.numChanged - a.numChanged)
      : [];
  }
};
