class ElevatorManager {
    constructor() {
        this.elevators = [];
        this.pendingElevatorRequests = {};
    }

    addElevator(elevatorId) {
        this.elevators.push(new Elevator(elevatorId, this));
    }

    removeElevator(elevatorId) {
        const index = this.elevators.findIndex(elevator => elevator.id === elevatorId);
        if (index < 0) {
            console.log('Invalid Elevator Id...');
        } else {
            this.elevators.splice(index, 1);
            console.log(`Elevator with id ${elevatorId} has been removed successfully`);
        }
    }

    assignElevator(elevator, floor) {
        elevator.addDestination(floor, true);
    }

    handleElevatorEvent(event) {
        const { elevatorId, isStationary, currentFloor, direction } = event;
        if (!isStationary) {
            // If next floor is the requested one, assign this elevator to that request
            const nextFloor = currentFloor + direction;
            const pendingNextFloor = this.pendingElevatorRequests[nextFloor];
            if (pendingNextFloor && pendingNextFloor[direction]) {
                this.assignElevator(this.elevators.find(elevator => elevator.id === elevatorId), nextFloor);
                delete pendingNextFloor[direction];
                if (!Object.keys(pendingNextFloor).length) {
                    delete this.pendingElevatorRequests[nextFloor];
                }
            }
        } else {
            // If any of the elevators comes to stationary, assign it to the the pending request
            const firstPendingRequestFloor = Number(Object.keys(this.pendingElevatorRequests)[0]);
            if (firstPendingRequestFloor) {
                this.assignElevator(this.elevators.find(elevator => elevator.id === elevatorId), firstPendingRequestFloor);
                const requestedFloor = this.pendingElevatorRequests[firstPendingRequestFloor];
                delete requestedFloor[requestedFloor[1] ? 1 : -1];
                if (!Object.keys(requestedFloor).length) {
                    delete this.pendingElevatorRequests[firstPendingRequestFloor];
                }
            }
        }
    }

    handleElevatorRequest(requestedAtFloor, direction) {
        // Ignore if a similar request is already pending
        if (this.pendingElevatorRequests[requestedAtFloor] && this.pendingElevatorRequests[requestedAtFloor][direction]) {
            return;
        }
        // check if any elevator already in motion towards the requested direction
        const elevatorTowardsTheFloor = this.elevators.find(elevator => !elevator.isStationary && elevator.direction === direction && (direction ? elevator.currentFloor <= requestedAtFloor : elevator.currentFloor >= requestedAtFloor));
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
        this.pendingElevatorRequests[requestedAtFloor][direction] = true;
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

    getAllPendingRequests() {
        const floorsRequested = Object.keys(this.pendingElevatorRequests);
        if (!floorsRequested.length) {
            console.log('No pending request to be served...');
        } else {
            for (let requestedFloor in this.pendingElevatorRequests) {
                for (let direction in requestedFloor) {
                    console.log(`Request pending from floor ${requestedFloor} for ${direction ? 'upward' : 'downward'} direction`);
                }
            }
        }
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

    addDestination(floor, isSystemAction = false) {
        this.destinationFloors.push({ floor, isSystemAction });
        if (this.destinationFloors.length > 1) {
            const sortAsc = this.currentFloor < this.destinationFloors[0].floor;
            this.destinationFloors.sort((f1, f2) => sortAsc ? f1.floor - f2.floor : f2.floor - f1.floor);
        }
        this.direction = this.currentFloor < this.destinationFloors[0].floor ? 1 : -1;
        this.isStationary = false;
    }

    move() {
        if (!this.destinationFloors.length) {
            console.log('No destination floor is pending in queue for this elevator');
        } else {
            // Move it a floor up if the direction  is upwards (+1) and a floor down if the direction  is downwards (-1)
            this.currentFloor = this.currentFloor < this.destinationFloors[0].floor ? this.currentFloor + 1 : this.currentFloor - 1;
            if (this.currentFloor === this.destinationFloors[0].floor) {
                // reached the next stop
                const { isSystemAction } = this.destinationFloors[0];
                this.destinationFloors.shift();
                this.isStationary = isSystemAction ? false : !this.destinationFloors.length;
            }
            // Update Elevator Manager about the state change
            this.elevatorManager.handleElevatorEvent({
                elevatorId: this.id,
                isStationary: this.isStationary,
                currentFloor: this.currentFloor,
                direction: this.direction
            });
        }
    }

}

var elevatorManager = (function installElevatorsWithInitialRequests() {
    var em = new ElevatorManager();
    for (let i = 0; i < 3; i++) {
        em.addElevator(i + 1);
    }
    return em;
})();
