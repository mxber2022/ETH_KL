// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HackathonVoting {

    struct Project {
        string name;
        uint voteCount;
        address creator;
    }

    Project[] public projects;  // Array to store all projects
    mapping(string => bool) public projectExists;  // Mapping to track if a project exists
    mapping(address => Voter) public voters;  // Mapping from voter address to their details

    struct Voter {
        bool hasVoted;
        uint voteIndex;
        uint amount;  // Amount of Ether staked
        address voterAddress;  // Address of the voter
    }

    uint public totalEtherPool;  // Tracks the total Ether pool for voting

    // Function to create a new project
    function createProject(string memory projectName) internal {
        require(!projectExists[projectName], "Project already exists");

        // Add the project to the array
        projects.push(Project({
            name: projectName,
            voteCount: 0,
            creator: msg.sender
        }));

        projectExists[projectName] = true;
    }

    // Function to get the list of all project names
    function getAllProjects() public view returns (string[] memory) {
        string[] memory projectNames = new string[](projects.length);
        for (uint i = 0; i < projects.length; i++) {
            projectNames[i] = projects[i].name;
        }
        return projectNames;
    }

    // Function to vote on a project, create it if it doesn't exist
    function vote(string memory projectName) public payable {
        require(!voters[msg.sender].hasVoted, "You have already voted");
        require(msg.value > 0, "You must stake some Ether to vote");

        // If the project doesn't exist, create it
        if (!projectExists[projectName]) {
            createProject(projectName);
        }

        // Find the index of the project in the array
        uint projectIndex = findProjectIndexByName(projectName);

        // Record the voter's details
        voters[msg.sender] = Voter({
            hasVoted: true,
            voteIndex: projectIndex,
            amount: msg.value,  // Store the amount of Ether staked
            voterAddress: msg.sender  // Store the voter's address
        });

        // Increment the vote count for the project
        projects[projectIndex].voteCount += 1;

        // Add the Ether to the total pool
        totalEtherPool += msg.value;
    }

    // Function to end voting and distribute rewards
    function endVoting() public {
        require(projects.length > 0, "No projects to evaluate");

        // Find the project with the maximum votes
        uint winningProjectIndex = findWinningProject();

        // Distribute 50% of the pool to the voters who voted for the winning project
        distributeToWinningVoters(winningProjectIndex);

        // The remaining 50% can be distributed to losing participants through a separate function
    }

    // Function to distribute 50% of the Ether pool to winning voters
    function distributeToWinningVoters(uint winningProjectIndex) internal {
        uint winnerRewardPool = totalEtherPool / 2;  // 50% of the total pool
        uint totalVotesForWinner = projects[winningProjectIndex].voteCount;

        // Distribute rewards to voters who voted for the winning project
        for (uint i = 0; i < projects.length; i++) {
            // Check if the voter has voted for the winning project
            if (voters[msg.sender].voteIndex == winningProjectIndex) {
                // Calculate the proportional share of the 50% pool for each voter
                uint voterReward = (voters[msg.sender].amount * winnerRewardPool) / totalVotesForWinner;
                // Transfer the reward to the voter's address
                payable(voters[msg.sender].voterAddress).transfer(voterReward);
            }
        }

        // Reduce total Ether pool by the amount given to winners
        totalEtherPool -= winnerRewardPool;
    }

    // Function to distribute the remaining Ether pool to losing participants
    function distributeToLosingParticipants(address[] memory losingAddresses) public {
        require(totalEtherPool > 0, "No remaining funds to distribute");

        uint loserRewardPool = totalEtherPool;  // Remaining 50% of the total pool
        uint loserReward = loserRewardPool / losingAddresses.length;  // Split equally among all losing participants

        // Distribute the funds to the provided losing participants
        for (uint i = 0; i < losingAddresses.length; i++) {
            payable(losingAddresses[i]).transfer(loserReward);
        }

        // Reset the pool after distribution
        totalEtherPool = 0;
    }

    // Helper function to find the index of a project by its name
    function findProjectIndexByName(string memory projectName) internal view returns (uint) {
        for (uint i = 0; i < projects.length; i++) {
            if (keccak256(abi.encodePacked(projects[i].name)) == keccak256(abi.encodePacked(projectName))) {
                return i;
            }
        }
        revert("Project not found");
    }

    // Helper function to find the project with the most votes
    function findWinningProject() internal view returns (uint) {
        uint maxVotes = 0;
        uint winningIndex = 0;

        for (uint i = 0; i < projects.length; i++) {
            if (projects[i].voteCount > maxVotes) {
                maxVotes = projects[i].voteCount;
                winningIndex = i;
            }
        }

        return winningIndex;
    }
}
