# Elevator-System


Entity: ElevatorManager

Properties:
1. elevators: List of installed elevators
2. pendingElevatorRequests: Object containing all the pending requests

Methods:
1. addElevator(elevatorId) - (elevatorId: Number) -Create a new elevator by passing identifier. elevatorId is Number.
2. assignElevator(elevator, floor) - (elevator: Elevator, floor: Number) - Assigns an elevator to serve a request initiated from a floor.
3. handleElevatorEvent(event) - (event: Object) - Handler for the elevator events received from any of the elevator instance
4. handleElevatorRequest(requestedAtFloor, direction) - (requestedAtFloor: Number, direction: 1 or -1) - Handler for the requests being made from a floor for the upward(1) or downward(-1) direction
5. getElevatorById(id) - (id: Number) - Returns the elevator instance with the given identifier
6. getAllElevatorsState() - Returns the Moving/Stationary state of every elevator along with the current floor
7. getAllPendingRequests() - Returns all the pending requests which needs to be assigned an elevator


Entity: Elevator

Properties:
1. id: Number - Identifier to be used by the ElevatorManager
2. currentFloor: Number - The floor at which the elevator is currently at, either moving or stationed
3. destinationFloors: List - Set of floors at which the elevator is supposed to stop
4. direction: Number - The direction in which the elevation is moving, 1 or -1
5. isStationary: Boolean - Specifies whether the elevator is moving or stationed.

Methods:
1. addDestination(floor) - (floor: Number) - Adds a floor to the destnationFloors list of the elevator
2. move() - Moves the elevator one floor up or down based on the moving direction