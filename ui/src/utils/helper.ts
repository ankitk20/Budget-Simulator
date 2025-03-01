const flattenJSON = (year: string, data: any) => {
  const flatData: any = { year: Number(year) };

  Object.entries(data).forEach(([category, categoryData]: [string, any]) => {
    if (typeof categoryData === "object") {
      Object.entries(categoryData).forEach(([type, value]) => {
        flatData[`${category}_${type}`] = value;
      });
    } else {
      flatData[category] = categoryData;
    }
  });

  return flatData;
};

export default flattenJSON;
