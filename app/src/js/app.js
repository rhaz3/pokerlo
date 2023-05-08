App = {
  web3: null,
  contracts: {},
  address: "0xE1535915Fa488fe676F2CD458E84F5519C9438a7",
  network_id: 5777, // 5777 for local
  handler: null,
  value: 1000000000000000000,
  index: 0,
  margin: 10,
  left: 15,
  init: function () {
    return App.initWeb3();
  },

  initWeb3: function () {
    if (typeof web3 !== "undefined") {
      App.web3 = new Web3(Web3.givenProvider);
    } else {
      App.web3 = new Web3(App.url);
    }
    ethereum.request({ method: "eth_requestAccounts" });
    return App.initContract();
  },

  initContract: function () {
    App.contracts.PokerLO = new App.web3.eth.Contract(App.abi, App.address, {});
    return App.bindEvents();
  },

  bindEvents: function () {
        $(document).on("click", "#addPlayer_btn", function () {
          App.handleAddPlayer(jQuery("#aP_player").val(),jQuery("#aP_elo").val());
        });
        $(document).on("click", "#addELO_btn", function () {
          App.handleAddELO(jQuery("#as_id").val(),jQuery("#a_elo").val());
        });
        $(document).on("click", "#subELO_btn", function () {
          App.handleSubELO(jQuery("#as_id").val(),jQuery("#s_elo").val());
        });
        $(document).on("click", "#findPlayerID_btn", function () {
          App.handleFindPlayerID(jQuery("#fp_name").val());
        });
        $(document).on("click", "#findPlayerName_btn", function () {
          App.handleFindPlayerName(jQuery("#fp_id").val());
        });
        $(document).on("click", "#getELO_btn", function () {
          App.handleGetELO(jQuery("#ge_id").val());
        });
        $(document).on("click", "#getTopFive_btn", function () {
          App.handleTopFive();
        });
        $(document).on("click", "#updateELO_btn", function () {
          App.handleUpdateELO(jQuery("#ue_buyin").val(),jQuery("#ue_totplayer").val(),jQuery("#ue_id").val(),jQuery("#ue_place").val());
        });
        App.populateAddress();
  },

  populateAddress: async function () {
    const accounts = await App.web3.eth.getAccounts();
    App.handler = accounts[0];
  },

  handleInitialization: function (counterValue) {
    if (counterValue === "") {
      console.log("Please enter a valid initializing value.", "Reverted!");
      return false;
    }
    var option = { from: App.handler };
    App.contracts.Counter.methods
      .initialize(counterValue)
      .send(option);
  },

  handleDummy: function () {
    var option = { from: App.handler };
    App.contracts.PokerLO.methods
      .dummy()
      .send(option)
      .on('receipt', (r) => {
        App.contracts.PokerLO.methods
          .dummy()
          .call()
          .then((r) => {
            jQuery("#dummyR").text(r);
          });
      });
  },

  handleAddPlayer: function (player, elo) {
    var newP = player.toUpperCase();
    var option = { from: App.handler };
    App.contracts.PokerLO.methods
      .addPlayer(newP, elo)
      .send(option)
      .on('receipt', (r) => {
        App.contracts.PokerLO.methods
          .findPlayerID(newP)
          .call()
          .then((r) => {
            var newM = newP + " added with ID: " + r
            jQuery("#aP_r").text(newM);
          });
      });
  },

  handleAddELO: function (player, elo) {
    var option = { from: App.handler };
    App.contracts.PokerLO.methods
      .addELO(player, elo)
      .send(option)
      .on('receipt', (r) => {
        App.contracts.PokerLO.methods
          .getELO(player)
          .call()
          .then((r) => {
            var newM = player + "\'s new ELO is " + r
            jQuery("#as_r").text(newM);
          });
      });
  },

  handleSubELO: function (player, elo) {
    var option = { from: App.handler };
    App.contracts.PokerLO.methods
      .subELO(player, elo)
      .send(option)
      .on('receipt', (r) => {
        App.contracts.PokerLO.methods
          .getELO(player)
          .call()
          .then((r) => {
            var newM = player + "\'s new ELO is " + r
            jQuery("#as_r").text(newM);
          });
      });
  },

  handleFindPlayerID: function (name) {
    var newN = name.toUpperCase();
    var option = { from: App.handler };
    App.contracts.PokerLO.methods
      .findPlayerID(newN)
      .send(option)
      .on('receipt', (r) => {
        App.contracts.PokerLO.methods
          .findPlayerID(newN)
          .call()
          .then((r) => {
            var newM = newN + "\'s ID is " + r
            jQuery("#findID_r").text(newM);
          });
      });
  },

  handleFindPlayerName: function (id) {
    var option = { from: App.handler };
    App.contracts.PokerLO.methods
      .findPlayerName(id)
      .send(option)
      .on('receipt', (r) => {
        App.contracts.PokerLO.methods
          .findPlayerName(id)
          .call()
          .then((r) => {
            var newM = id + "\'s name is " + r
            jQuery("#findName_r").text(newM);
          });
      });
  },

  handleGetELO: function (id) {
    var option = { from: App.handler };
    App.contracts.PokerLO.methods
      .getELO(id)
      .call()
      .then((r) => {
        var newM = id + "\'s ELO is " + r
        jQuery("#gELO_r").text(newM);
      });
  },

  handleTopFive: function (player, elo) {
      var option = { from: App.handler };
      App.contracts.PokerLO.methods
      .topFiveName()
      .call()
      .then((r) =>{
        jQuery("#topFiveName_R").text(r);
      })
      App.contracts.PokerLO.methods
      .topFiveELO()
      .call()
      .then((r) =>{
        jQuery("#topFiveELO_R").text(r);
      })
    },

  handleUpdateELO: function (buyin, totplayer, id, place) {
    var idList = id.split(',');
    var placeList = place.split(',');
        var option = { from: App.handler };
        App.contracts.PokerLO.methods
          .updateELO(buyin, totplayer, idList, placeList)
          .send(option)
        },

  abi: [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "playerID",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newELO",
          "type": "uint256"
        }
      ],
      "name": "tournamentWinner",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "totalPlayers",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "ELO",
          "type": "uint256"
        }
      ],
      "name": "addPlayer",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "dummy",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "n",
          "type": "uint256"
        }
      ],
      "name": "subELO",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "n",
          "type": "uint256"
        }
      ],
      "name": "addELO",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "getELO",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        }
      ],
      "name": "findPlayerID",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "findPlayerName",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "findPlayerIndex",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getPlayers",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "buyIn",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totPlayers",
          "type": "uint256"
        }
      ],
      "name": "calculateELO",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "buyIn",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totPlayers",
          "type": "uint256"
        },
        {
          "internalType": "uint256[]",
          "name": "id",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256[]",
          "name": "place",
          "type": "uint256[]"
        }
      ],
      "name": "updateELO",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "ownerPage",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "topFiveELO",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "topFiveName",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ],
};


$(function () {
  $(window).load(function () {
    App.init();
  });
});

/* Detect when the account on metamask is changed */
window.ethereum.on("accountsChanged", () => {
  App.populateAddress();
});

/* Detect when the network on metamask is changed */
window.ethereum.on("chainChanged", () => {
  App.populateAddress();
});
