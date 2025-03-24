import { searchByMuscleGroup,searchByEquipment} from "./json-search"
import Routine from "./routine.js"

let numSets = 3
let numReps = 10

export function generateWorkout(settings){
    var muscleGroups = settings.muscle_groups
    var equiptment = settings.equiptment
    

    var routine = new Routine([])
    for(let i = 0 ; i< muscleGroups.length;i++){
        var exercises_in_cat = searchByMuscleGroup(muscleGroups[i])
        if(equiptment != "full gym") exercises_in_cat = searchByEquipment(equiptment,exercises_in_cat)
        console.log(exercises_in_cat)
        let numExerises = 3

        /* if there is not enough exercises or just enough
         exercises within this criteria the return all available
        */
        if(exercises_in_cat.length <= numExerises){
    
            routine.addExercises(exercises_in_cat,[numReps,numReps,numReps])
        }
        else{
        // finds numExercises random exercises from the list of exercises and adds them to the routne with 

        let indexOfExercies = getRandomNums(numExerises,exercises_in_cat.length)
        for(let j = 0 ;j<indexOfExercies.length;j++){
            routine.add_exercise(exercises_in_cat[indexOfExercies[j]])
            routine.setReps(routine.getList().length-1 ,[numReps,numReps,numReps])
        }
    }
    }
    
    return routine
}

// there is a bug that can happen here. IF the are not enough numbers to choose the desired quantity we will have an infinate loop!
function getRandomNums(quantity,max){
    let randNums= [];
    while(randNums.length<quantity){
        let randNum =Math.floor(Math.random()*max) 
        while(randNums.includes(randNum)){
            randNum = Math.floor(Math.random()*max)
            console.log("finding exercises from list")
        }
        randNums.push(randNum)
    }
    return randNums
}

export function findNewEx(routine,index){
    var IDList = routine.map(exercise=>{return exercise.id})
    var replaced = routine[index]
    var exercises_in_cat = searchByMuscleGroup(replaced.primaryMuscles[0])
    exercises_in_cat = searchByEquipment([replaced.equipment],exercises_in_cat)
    console.log(exercises_in_cat)
    exercises_in_cat = exercises_in_cat.filter(exercise=>{return !IDList.includes(exercise.id)})
    var newIndex = getRandomNums(1,exercises_in_cat.length)[0]
    //console.log("new index: " + newIndex + " vs len of list: " + exercises_in_cat.length)
    exercises_in_cat[newIndex].reps = replaced.reps
    return exercises_in_cat[newIndex]
}
/* list of muscles goes as follows
biceps, triceps, shoulders, abdominals, lower back, lats, glutes, hamstrings, quadriceps, forearms, middle back

*/