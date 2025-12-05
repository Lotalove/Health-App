// load the JSON file
const data = require('./exercises/exercises.json');

// make sure data is an array
if (!Array.isArray(data)) {
  console.error("Expected the JSON file to contain an array of objects.");
  process.exit(1);
}

// collect unique categories
const categories = new Set();

for (const item of data) {
  if (item.category) {
    categories.add(item.category);
  }
}

// print them
console.log("Unique categories:");
for (const category of categories) {
  console.log(category);
}
