//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

pragma experimental ABIEncoderV2;

//import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract PokerLO{
// is ERC721
    struct Player {
        string name;
        uint ELO;
        uint tokenID;
    }

    uint counter;
    address public owner;
    uint public totalPlayers;
    uint baseELO = 1500;
    Player[] players;

    //ADDRESS MAP
    mapping(uint => Player) tokenPlayer;

    modifier onlyOwner(){
        require(msg.sender == owner, "Only owners may interact");
        _;
    }

    constructor(){
        // ERC721("PokerLO", "PKLO")
        totalPlayers = 0;
        counter = 0;
        owner = msg.sender;
    }

    //INPUT NAMES AS ALL CAPITALS
    function addPlayer(string memory name, uint ELO) public onlyOwner returns (uint) {
        if(ELO == 0){
            ELO = baseELO;
        }
        //TOKENIZATION
        uint newToken = totalPlayers;
        totalPlayers++;
        //_mint(msg.sender, newToken);
        players.push(Player(name, ELO, newToken));
        tokenPlayer[newToken] = players[newToken]; //BREAKS
        //END TOKENIZATION
        return newToken;
    }

    function dummy() public returns (uint) {
        counter++;
        return counter;
    }

    function subELO(uint id, uint n) public onlyOwner returns (uint) {
        uint i = findPlayerIndex(id);
        players[i].ELO -= n;
        return players[i].ELO;
    }

    function addELO(uint id, uint n) public onlyOwner returns (uint) {
        uint i = findPlayerIndex(id);
        players[i].ELO += n;
        return players[i].ELO;
    }

    function getELO(uint id) public view returns (uint) {
        uint i = findPlayerIndex(id);
        return players[i].ELO;
    }

    function findPlayerID(string memory name) public view returns (uint) {
        bytes32 hashName = keccak256(abi.encodePacked(name));
        for (uint i = 0; i < players.length; i++) {
            if (keccak256(abi.encodePacked(players[i].name)) == hashName) {
                return players[i].tokenID;
            }
        }
        revert("Player not found");
    }

    function findPlayerName(uint id) public view returns (string memory) {
        for (uint i = 0; i < players.length; i++) {
            if (players[i].tokenID == id) {
                return players[i].name;
            }
        }
        revert("Player not found");
    }

    function findPlayerIndex(uint id) public view returns (uint) {
        for (uint i = 0; i < players.length; i++) {
            if (players[i].tokenID == id) {
                return i;
            }
        }
        revert("Player not found");
    }

    function getPlayers() public view returns (string[] memory) {
        uint len = players.length;
        string[] memory playerNames = new string[](len);
        for (uint i = 0; i < len; i++){
            playerNames[i] = players[i].name;
        }
        return playerNames;
    }

    //HELPER FUNCTION
    function calculateELO(uint buyIn, uint totPlayers) public pure returns (uint[] memory) {
        uint[] memory placeELO = new uint[](totPlayers);
        for (uint i = 0; i < totPlayers; i++){
            placeELO[i] = ((2 * buyIn) / (totPlayers - 1)) * (totPlayers - 1 - i);
        }
        return placeELO;
    }

    event tournamentWinner(uint indexed playerID, uint newELO);

    function updateELO(uint buyIn, uint totPlayers, uint[] memory id, uint[] memory place) public onlyOwner{
        uint[] memory listELO = calculateELO(buyIn, totPlayers);
        uint winner;
        uint winnerELO;
        for(uint i = 0; i < totPlayers; i++){
            subELO(id[i], buyIn);
            uint incELO = listELO[place[i]];
            addELO(id[i], incELO);
        }
        for(uint i = 0; i < totPlayers; i++){
            if(place[i] == 0){
                winner = id[i];
                winnerELO = getELO(winner);
            }
        }
        emit tournamentWinner(winner, winnerELO);
    }

    function ownerPage() public view onlyOwner returns (bool) {
        return true;
    }

    function topFiveELO() public view returns (uint[] memory) {
        uint len = players.length;
        uint[] memory topELO = new uint[](len);
        uint[] memory topFive;
        for (uint i = 0; i < len; i++){
            topELO[i] = players[i].ELO;
        }
        for (uint i = 0; i < len-1; i++){
            for (uint j = i+1; j < len; j++){
                if(topELO[i] < topELO[j]){
                    uint x = topELO[i];
                    topELO[i] = topELO[j];
                    topELO[j] = x;
                }
            }
        }
        if (len >= 5){
            topFive = new uint[](5);
            for(uint i = 0; i < 5; i++){
                topFive[i] = topELO[i];
            }
        }else{
            return topELO;
        }
        return topFive;
    }

    function topFiveName() public view returns (string[] memory) {
        uint len = players.length;
        Player[] memory topELO = new Player[](len);
        string[] memory topFive;
        for (uint i = 0; i < len; i++){
            topELO[i] = players[i];
        }
        for (uint i = 0; i < len-1; i++){
            for (uint j = i+1; j < len; j++){
                if(topELO[i].ELO < topELO[j].ELO){
                    Player memory x = topELO[i];
                    topELO[i] = topELO[j];
                    topELO[j] = x;
                }
            }
        }
        if (len >= 5){
            topFive = new string[](5);
            for(uint i = 0; i < 5; i++){
                topFive[i] = topELO[i].name;
            }
        }else{
            topFive = new string[](len);
            for(uint i = 0; i < len; i++){
                topFive[i] = topELO[i].name;
            }
        }
        return topFive;
    }

}
