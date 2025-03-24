const data = require('./exercises/exercises.json')

function search(name){
    function similar_to(exercise){
        if (exercise.name.toLowerCase().includes(name)) return true
    }
    var results = data.filter(similar_to)
    return results
}

function searchByID(id){
    return data[id]
}

function searchByMuscleGroup(muscleGroup){
    
    return data.filter((exercise)=>{if(exercise.primaryMuscles.includes(muscleGroup) ) return true})
}

//filters a list given by the searchByMuscleGroup function for equiptment available to user
function searchByEquipment(equipmentList, list) {
    return list.filter((exercise) => equipmentList.includes(exercise.equipment));
}

var muscle = "triceps" 
var eq = ["bands"]

var exList = searchByEquipment(eq,searchByMuscleGroup(muscle))
for(let i = 0; i < exList.length;i++){
    if(exList[i].equipment != eq[0]){console.log("equiptment filter error. " + exList[i].equipment +" does not equal " + eq[i])}
}
// console.log(exList.map(ex=>{if (ex.equipment) return ex.name}))
// prints unique equipment values in data
console.log([...new Set(data.map(ex=>{if (ex.primaryMuscles) return ex.primaryMuscles[0]}))])

//console.log(data.map(ex=>{if (ex.equipment) return ex.equipment}))

