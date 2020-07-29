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


System Behaviour:

1. Initially, an instance of ElevatorManager will be created and multiple elevators will be installed with the manager instance.
2. All the installed elevators will be initially stationed at 0th Floor.
3. When a request has been raised for an elevatior from floor X. The ElevatorManager will receive it via handleElevatorRequest(requestedAtFloor, direction) function. The request will contain the floor from where the request has been inititated and the direction where the passenger wants to move.
4. ElevatorManager will see if there is already a moving elevator towards the requested floor and going in the requested direction.
a) If yes, then it will add this request in the pending request along with the floor and direction. Once any of the floor reaches to X - 1 (or X + 1 based on the direction) floor and moving towards the expected direction, that elevator is supposed to serve that request. The requested floor will be added to the destinationFloors list of that elevator.
b) If no, the ElevatorManager will check for nearest elevator in the stationary position and assign that elevator to the request.
c) Else it will wait for any of the elevator to be available either being stationed or moving towards the request floor and then assin the elevator to the request.
5. On every movement of the elevator, an event will be sent to the ElevatorManager, and the manager will see if this elevator can now be to any of the pending request.