{
    queue: [],
    idleElevators: [],

    init: function(elevators, floors) {
		var self = this;

		_.each(elevators, function(elevator, i){
			elevator.goToFloor(0, true);
	  
			elevator.on("idle", function(){
				console.log("E" + i + ":", "idling and looking at queue with length", self.queue.length);
				if (self.queue.length > 0){
					elevator.goToFloor(self.queue.pop())
				} else {
                    self.idleElevators.push(elevator);
                }
			});
	  
			elevator.on("floor_button_pressed", function(floorNum) {
				//self.stuff(elevator, floorNum);
				console.log("E" + i + ":", "passenger wants to go from floor", floorNum, "to floor", elevator.currentFloor());

                self.queue.push(floorNum);
                if (self.queue.length > 0){
                    elevator.goToFloor(self.queue.pop());
                }
			});
		});

		_.each(floors, function(floor){
			floor.on("up_button_pressed", function() {
                console.log("Adding floor", floor.floorNum(), "to queue");
                self.pushWork(floor);
			});
			
			floor.on("down_button_pressed", function(){
                console.log("Adding floor", floor.floorNum(), "to queue");
                self.pushWork(floor);
			});
		});
    },

    pushWork: function(floor){
        if (this.idleElevators.length > 0){
            console.log("Giving work directly to elevator");
            var idleElevator = this.idleElevators.pop();
            idleElevator.goToFloor(floor.floorNum());
        } else {
            console.log("Pushing to queue");
            this.queue.push(floor.floorNum());
        }
    },
		     
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }

    //stuff: function(elevator, floorNum){
	//	console.log("up button pressed on ", floorNum);
	//	var elevatorIsFull = elevator.loadFactor() == 1.0;
    //
	//	var distanceToTarget = floorNum - elevator.currentFloor();
	//	console.log("On floor", elevator.currentFloor(), "Passenger is on", floorNum, "distance is", distanceToTarget);
    //
	//	// go down
	//	if (distanceToTarget < 0){
	//		console.log('going down');
	//		//elevator.goingUpIndicator(false)
	//		//elevator.goingDownIndicator(true);
    //
	//	// go up
	//	} else if (distanceToTarget > 0) {
	//		console.log('going up');
	//		//elevator.goingDownIndicator(false)
	//		//elevator.goingUpIndicator(true)
	//
	//	// on floor already
	//	} else {
	//		console.log("already here");
	//	}
	//}
}