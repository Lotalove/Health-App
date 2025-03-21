const fs = require('fs');

// Read the JSON file using require
const data = require('./exercises/exercises.json')
// Update the data
data.forEach((exercise,index)=>{
exercise.id = index
})

// Synchronously write the updated data back to the JSON file
fs.writeFileSync('./exercises/exercises.json', JSON.stringify(data, null, 2));

console.log('Data updated successfully.');