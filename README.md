# Elevator-System


Problem Statement:

Design a Building Elevator System. The system must be capable of handling the requests being raised from a floor to go in upward or downward direction. The request must be fulfilled based on the availability of the elevators in that building.



Notes & Assumptions:

1. The implementation has been done for one building only. So there will be a Elevator Manager managing all the elevators installed in the building.
2. For the sake of testing the flow, the elevator movement can be triggered manually by the elevator instance which can be fetched from the manager instance.
3. The main focus of the implementation was around serving the requests, so the movement of an elevator from inside the elevator is not considered with the current implementation.
4. The active or dead state of an elevator is also not considered with the current implementation.



Steps to Get Started:

1. Execute ElevatorSystem.js code on any of the js console like browser console or https://jsconsole.com/
2. A global instance of elevatorManager will be initialized after Step 1 with 3 elevators pre installed.
3. To add an elevator, execute elevatorManager.addElevator(id). id must be unique.
4. To request for an elevator, execute handleElevatorRequest(floor, direction). floor can be any number and direction can be 1 (for upward movement) and -1 (for downward movement).
5. To see the current state of all the installed elevators, execute elevatorManager.getAllElevatorsState()
6. To fetch an elevator based on it id, execute elevatorManager.getElevatorById(id)
7. To see all unassigned/pending requests, execute elevatorManager.getAllPendingRequests()
8. To move an elevator, get the elevator instance from the manager and trigger move as below
    var elevatorL1 = elevatorManager.getElevatorById(1);
    elevatorL1.move();



System Behaviour:

1. Initially, an instance of ElevatorManager will be created and multiple elevators will be installed with the manager instance.
2. All the installed elevators will be initially stationed at 0th Floor.
3. When a request has been raised for an elevatior from floor X. The ElevatorManager will receive it via handleElevatorRequest(requestedAtFloor, direction) function. The request will contain the floor from where the request has been inititated and the direction where the passenger wants to move.
4. ElevatorManager will see if there is already a moving elevator towards the requested floor and going in the requested direction.
a) If yes, then it will add this request in the pending request along with the floor and direction. Once any of the floor reaches to X - 1 (or X + 1 based on the direction) floor and moving towards the expected direction, that elevator is supposed to serve that request. The requested floor will be added to the destinationFloors list of that elevator in the sorted order of floor occurence and movement direction.
b) If no, the ElevatorManager will check for nearest elevator in the stationary position and assign that elevator to the request.
c) Else it will wait for any of the elevator to be available either being stationed or moving towards the request floor and then assin the elevator to the request.
5. On every movement of the elevator, an event will be sent to the ElevatorManager, and the manager will see if this elevator can now be to any of the pending request.



System Components:

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



System Analysis:

N -> No. of elevators installed in the building
M -> No. of floors in the building
K -> No. of requests - This can go maximum till 2M (one per each direction from every floor)

Time complexity
a) to serve a new request, will be O(N). For K requests, it will be O(N x K).
b) for the elevator movement - O(K)
c) to get an elevator instance - O(N)
d) to get all the pending requests - O(K)
e) to get all the elevator states - O(K)



Future Work or Enhancements:

1. The sytem can be extended to support multiple buildings and managers per building.
2. Improvements can be done around event based implementation.
3. Elevators can be improved to have floors numbers so that a request can be made by the users inside the elevator.
4. Health check mechanism can be implemented which will help the manager to keep a track of active or dead elevators.