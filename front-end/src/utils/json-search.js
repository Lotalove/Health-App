const data = require('./exercises/exercises.json')

export function search(name){
    function similar_to(exercise){
        if (exercise.name.toLowerCase().includes(name)) return true
    }
    var results = data.filter(similar_to)
    return results
}

export function searchByID(id){
    return data[id]
}

export function searchByMuscleGroup(muscleGroup){
    
    return data.filter((exercise)=>{if(exercise.primaryMuscles.includes(muscleGroup) ) return true})
}

//filters a list given by the searchByMuscleGroup function for equiptment available to user
export function searchByEquipment(equipmentList, list) {
    return list.filter((exercise) => equipmentList.includes(exercise.equipment));
}
