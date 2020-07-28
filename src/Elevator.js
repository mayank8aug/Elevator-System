class Elevator {
    constructor(id, elevatorManager) {
        this.id = id;
        this.currentFloor = 0;
        this.destinationFloors = [];
        this.elevatorManager = elevatorManager;
        this.direction = 0;
        this.isStationary = true;
    }

    addDestination(floor) {
        if (!this.destinationFloors.length) {
            this.destinationFloors.push(floor);
        } else {
            this.destinationFloors.push(floor);
            if (this.currentFloor < this.destinationFloors[0]) {
                this.destinationFloors.sort((f1, f2) => f1 - f2);
            } else {
                this.destinationFloors.sort((f1, f2) => f2 - f1);    
            }
        }
        this.direction = this.currentFloor < this.destinationFloors[0] ? 1 : -1;
        this.isStationary = false;
    }

    reachedNextDestination() {
        if (!this.destinationFloors.length) {
            console.log('Invalid operation');
        } else {
            this.currentFloor = this.destinationFloors.shift();
            this.isStationary = !this.destinationFloors.length;
            this.elevatorManager.handleElevatorEvent({
                elevatorId: this.id,
                isStationary: this.isStationary,
                currentFloor: this.currentFloor,
                direction: this.direction
            })
        }
    }

}