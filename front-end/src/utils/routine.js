import { findNewEx } from "./generateWorkout"

class Routine{
    ex_list = []
    constructor(ex_list){
        this.ex_list = ex_list
    }

    setList(newList) {
        this.ex_list = newList
    }

    getList(){return this.ex_list}
    getExIDList(){
        return this.ex_list.map((ex)=>{return ex.id})
    }
    getRepsList(){
        return this.ex_list.map((ex)=>{return ex.reps})
    }
    getNumExercises(){return this.ex_list.length}
    remove_exercise(index){
        var temp = []
        for(var i = 0 ; i < this.ex_list.length ;i++){
            if( i != index) temp.push(this.ex_list[i])
        }
        this.setList(temp)
    }

    // adds an exercises in the format: {}
    addExercise(exercise){
        console.log(this.ex_list)
        var newRoutine = [...this.ex_list,exercise]
        this.setList(newRoutine)
    }
    addExercises(exerciseList,reps){
        for(var i =0; i < exerciseList.length;i++){
            exerciseList[i].reps= reps
            this.addExercise(exerciseList[i]);
        }
    }   
    setReps(index,reps){
        this.ex_list[index].reps = reps
    }
    updateRoutine(exerciseIndex,newRoutine){
        var temp = []
        for(var i = 0 ; i < this.ex_list.length ;i++){
            if( i != exerciseIndex) temp.push(this.ex_list[i])
            else temp.push(newRoutine)
        }
        this.setList(temp)
    }
    // when a routine is generated the user gets the option to swap out an exercise
    // an exercise that is not already in the list is found and replaces the swapped 
    swap(index){
        var newEX = findNewEx(this.getList(),index)
        this.ex_list[index] = newEX;
    }

    display(){
        this.ex_list.forEach(ex=>{console.log(ex)})
    }
}

export default Routine;