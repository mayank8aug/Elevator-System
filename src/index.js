class ElevatorManager {
    constructor() {
        this.elevators = [];
        this.pendingElevatorRequests = {};
    }

    addElevator(elevatorId) {
        this.elevators.push(new Elevator(elevatorId, this));
    }

    assignElevator(elevator, floor) {
        elevator.addDestination(floor);
    }

    handleElevatorEvent(event) {
        const { elevatorId, isStationary, currentFloor, direction } = event;
        if (!isStationary) {
            if (this.pendingElevatorRequests[currentFloor + direction]) {
                this.assignElevator(this.elevators.find(elevatorId), currentFloor + direction);
            }
        } else {
            this.assignElevator(this.elevators.find(elevatorId), Object.keys(this.pendingElevatorRequests)[0]);
        }
    }

    handleElevatorRequest(requestedAtFloor, direction) {
        debugger;
        // check if any elevator already in motion
        const elevatorTowardsTheFloor = this.elevators.some(elevator => !elevator.isStationary && elevator.direction === direction);
        if (!elevatorTowardsTheFloor) {
            // find nearest stationed elevator
            let min = Number.MAX_VALUE;
            let minDistanceElevator;
            let elevator;
            let diff;
            for (let i = 0, len = this.elevators.length; i < len; i++) {
                elevator = this.elevators[i];
                const { currentFloor, isStationary } = elevator;
                if (isStationary) {
                    diff = Math.abs(requestedAtFloor - currentFloor);
                    if (diff < min) {
                        minDistanceElevator = elevator;
                    }
                }
            }
            this.assignElevator(minDistanceElevator, requestedAtFloor);
            return;
        }
        // add to elevator request from a floor and in the expected firection
        if (!this.pendingElevatorRequests[requestedAtFloor]) {
            this.pendingElevatorRequests[requestedAtFloor] = {};
        }
        this.pendingElevatorRequests[requestedAtFloor][direction] = 1;
    }
}

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

var em = new ElevatorManager();
em.addElevator(1);
em.addElevator(2);
em.addElevator(3);
em.handleElevatorRequest(3, 1);
em.handleElevatorRequest(4, 1);