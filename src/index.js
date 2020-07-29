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
            // If next floor is the requested one, assign this elevator to that request
            if (this.pendingElevatorRequests[currentFloor + direction]) {
                this.assignElevator(this.elevators.find(elevator => elevator.id === elevatorId), currentFloor + direction);
            }
        } else {
            // If any of the elevators comes to stationary, assign it to the the pending request
            const firstPendingRequestFloor = Number(Object.keys(this.pendingElevatorRequests)[0]);
            if (firstPendingRequestFloor) {
                this.assignElevator(this.elevators.find(elevator => elevator.id === elevatorId), firstPendingRequestFloor);
                delete this.pendingElevatorRequests[firstPendingRequestFloor];
            }
        }
    }

    handleElevatorRequest(requestedAtFloor, direction) {
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
            if (minDistanceElevator) {
                this.assignElevator(minDistanceElevator, requestedAtFloor);
                return;
            }
        }
        // add to elevator request from a floor and in the expected direction
        if (!this.pendingElevatorRequests[requestedAtFloor]) {
            this.pendingElevatorRequests[requestedAtFloor] = {};
        }
        this.pendingElevatorRequests[requestedAtFloor][direction] = 1;
    }

    getElevatorById(id) {
        const elevator = this.elevators.find(elevator => elevator.id === id);
        return elevator || 'Invalid Elevator Id';
    }

    getAllElevatorsState() {
        if (!this.elevators.length) {
            console.log('No Elevator Installed...'); // return 'No Elevator Installed...';
        } else {
            for (let i = 0, len = this.elevators.length; i < len; i++) {
                const { id, currentFloor, isStationary } = this.elevators[i];
                console.log(`Elevator ${id} is ${isStationary ? 'stationed' : 'moving'} and at floor ${currentFloor}`);
            }
        }
    }

}

class Elevator {
    constructor(id, elevatorManager) {
        this.id = id;
        this.currentFloor = Math.floor(Math.random() * 6); // Install elevator at a random floor between floor 0 & 5
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

    moveLift() {
        if (!this.destinationFloors.length) {
            console.log('No destination floor is pending in queue for this elevator');
        } else {
            if (this.currentFloor < this.destinationFloors[0]) {
                this.currentFloor = this.currentFloor + 1; // Move it a floor up if the direction  is upwards (+1)
            } else if (this.currentFloor > this.destinationFloors[0]) {
                this.currentFloor = this.currentFloor - 1; // Move it a floor down if the direction  is downwards (-1)
            }
            if (this.currentFloor === this.destinationFloors[0]) {
                this.reachedNextDestination();     
            }
            // Update Elevator Manager about the state change
            this.elevatorManager.handleElevatorEvent({
                elevatorId: this.id,
                isStationary: this.isStationary,
                currentFloor: this.currentFloor,
                direction: this.direction
            })
        }
    }

    reachedNextDestination() {
        this.destinationFloors.shift();
        this.isStationary = !this.destinationFloors.length;
    }

}

var em = new ElevatorManager();
em.addElevator(1);
em.addElevator(2);
em.addElevator(3);
em.handleElevatorRequest(3, 1);
em.handleElevatorRequest(4, 1);
em.handleElevatorRequest(8, -1)
