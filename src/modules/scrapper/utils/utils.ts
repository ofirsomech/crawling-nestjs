export function addToAllScansData(allScansData, item, type) {
  const website = item.url;
  const date = new Date(item.createdAt).toLocaleDateString('en-GB', {
    timeZone: 'UTC',
  });

  if (!allScansData[website]) {
    allScansData[website] = {};
  }

  if (!allScansData[website][date]) {
    allScansData[website][date] = {};
  }

  if (!allScansData[website][date][type]) {
    allScansData[website][date][type] = [];
  }

  allScansData[website][date][type].push(item);
}
