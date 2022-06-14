# This project has been forked from the MTV GitLab server!
# You can play the game [here](https://pr.mtv.tu-berlin.de/modysy-2021sose/markov-decision-processes-2/master).

### Short description
Evacauate the aliens as quickly as possible.

### Game description
A little dungeon crawler game, inspired by a crowd evacuation simulator that was also based on the Markov Decision Process.
The fields represent different states that the player can switch to. The probability is implemented by a logic that splits the alien groups depending on which action field youre standing on.
Action fields are marked with icons that have arrows inside.
The goal is to reach the exit with as many aliens as possible and within the limit of movements.
Mind the flames when striving through the field.

### Theoretical background
The theoretical concept that this game is based on [Markov Decision Processes (MDP)](https://en.wikipedia.org/wiki/Markov_decision_process).
The core principle of the mathematical model is to either maximize the reward or the cost by switching states.
While in one particular state, the player can change the state by performing a certain action.

### Credits

*   Alexander Steffen     - Product Owner
*   Christoph Rauchegger  - Dev
*   Georgi Kotsev         - MR Manager
*   Kevin Nguyen          - MR Manager
*   Momchil Petrov        - Dev
*   Phil Neujahr          - Dev 
*   Krutarth Parwal       - Dev
*   Dennis Korolevych     - Scrum Master
