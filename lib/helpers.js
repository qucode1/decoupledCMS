export const cleanName = name => name.split(" -- ")[0];

export const removeTimefromDates = obj => {
  return Object.entries(obj)
    .map(([key, value]) => {
      if (
        typeof value === "string" &&
        value.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T.*/)
      ) {
        return [key, value.split("T")[0]];
      } else return [key, value];
    })
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
};
