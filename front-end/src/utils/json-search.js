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
    // Back: lower back, middle back, lats ; Legs: adductors,calves, hamstrings, quadriceps,glutes
    var stengthExercises = data.filter((exercise)=>{
        const strengthTypes = ['strength', 'strongman', 'powerlifting','olympic weightlifting'];
        const isStrength = strengthTypes.includes(exercise.category)
        return isStrength
    })
    
    if(muscleGroup === 'back'){
        var backMuscles = ['lower back','middle back','lats']
        return stengthExercises.filter((ex)=>{
            return backMuscles.includes(ex.primaryMuscles[0])
        })
    }
    else if (muscleGroup === 'legs'){
        var legMuscles = ['adductors','calves','hamstrings','quadriceps','glutes']
        return stengthExercises.filter((ex)=>{
            return legMuscles.includes(ex.primaryMuscles[0])
        })
    }
    return stengthExercises.filter((exercise)=>{if(exercise.primaryMuscles.includes(muscleGroup) ) return true})
}

//filters a list given by the searchByMuscleGroup function for equiptment available to user
export function searchByEquipment(equipmentList, list) {
    return list.filter((exercise) => equipmentList.includes(exercise.equipment));
}
