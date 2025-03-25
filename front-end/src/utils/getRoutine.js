export function getNextRoutine(routines){
if (routines == null || routines.length == 0){
    return null;
}
routines.sort((a, b) => new Date(a.date) - new Date(b.date));
for(var i =0;i<routines.length;i++){
    var today = new Date(); // Get today's date as a Date object
    // Extract YYYY-MM-DD from today to remove time component
    var todayStr = today.toISOString().split("T")[0]; 
    var todayDate = new Date(todayStr + "T00:00:00"); // Ensure it's a Date object
    
    var routineDay = new Date(routines[i].date + "T00:00:00"); // Convert routine date properly
    

    if (routineDay >= todayDate) {
        return routines[i];
    }
    
} 
return null;
}
