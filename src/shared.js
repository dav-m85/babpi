module.exports = {
  byName: (a, b) => a.name.localeCompare(b.name),
  nameNotIn: (what) => a => what.indexOf(a.name) === -1,
  notIn: (what) => a => what.indexOf(a) === -1,
  flatNames: (what) => what.map(a => a.name),
  byLocale: (a, b) => a.localeCompare(b)
}
