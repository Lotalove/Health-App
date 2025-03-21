export function getCardioType(exercise){
    const timedExercises = ['Running','Running, Treadmill','Trail Running/Walking','Walking, Treadmill','Bicycling','Bicycling, Stationary']
    for(let i=0;i<timedExercises.length;i++){
    if(exercise.name == timedExercises[i]) return 'distance'
    }
    return 'timed'
}