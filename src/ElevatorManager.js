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