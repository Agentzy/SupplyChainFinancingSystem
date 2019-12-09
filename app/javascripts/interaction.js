var web3;
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
}

var abi = [
    {
        "constant": true,
        "inputs": [
            {
                "name": "addr",
                "type": "address"
            }
        ],
        "name": "getCompanyInfo",
        "outputs": [
            {
                "name": "",
                "type": "bytes32"
            },
            {
                "name": "",
                "type": "string"
            },
            {
                "name": "",
                "type": "int256"
            },
            {
                "name": "",
                "type": "int256"
            },
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "name",
                "type": "string"
            }
        ],
        "name": "getCompanyAddr",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "expiredDate",
                "type": "string"
            }
        ],
        "name": "payMoney",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            },
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "bytes32"
            }
        ],
        "name": "ReceiptMap",
        "outputs": [
            {
                "name": "ID",
                "type": "bytes32"
            },
            {
                "name": "seller",
                "type": "string"
            },
            {
                "name": "customer",
                "type": "string"
            },
            {
                "name": "signTime",
                "type": "string"
            },
            {
                "name": "expiredTime",
                "type": "string"
            },
            {
                "name": "money",
                "type": "int256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "company",
                "type": "address"
            },
            {
                "name": "Receiptid",
                "type": "bytes32"
            }
        ],
        "name": "getFinancing",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            },
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "name": "companyMap",
        "outputs": [
            {
                "name": "ID",
                "type": "bytes32"
            },
            {
                "name": "name",
                "type": "string"
            },
            {
                "name": "credit",
                "type": "int256"
            },
            {
                "name": "property",
                "type": "int256"
            },
            {
                "name": "companyType",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_addr",
                "type": "address"
            },
            {
                "name": "_id",
                "type": "bytes32"
            },
            {
                "name": "_name",
                "type": "string"
            },
            {
                "name": "_property",
                "type": "int256"
            },
            {
                "name": "_companyType",
                "type": "uint8"
            }
        ],
        "name": "CompanyAddInChain",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            },
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "transferID",
                "type": "bytes32"
            },
            {
                "name": "newid",
                "type": "bytes32"
            },
            {
                "name": "transferTo",
                "type": "address"
            },
            {
                "name": "money",
                "type": "int256"
            },
            {
                "name": "transferTime",
                "type": "string"
            }
        ],
        "name": "receiptTransfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            },
            {
                "name": "",
                "type": "string"
            },
            {
                "name": "",
                "type": "bytes32"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "id",
                "type": "bytes32"
            },
            {
                "name": "seller",
                "type": "address"
            },
            {
                "name": "sellDate",
                "type": "string"
            },
            {
                "name": "expireDate",
                "type": "string"
            },
            {
                "name": "money",
                "type": "int256"
            }
        ],
        "name": "purchaseSign",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            },
            {
                "name": "",
                "type": "string"
            },
            {
                "name": "",
                "type": "bytes32"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "addr",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "companyName",
                "type": "string"
            }
        ],
        "name": "CompanyInChain",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "seller",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "customer",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "money",
                "type": "int256"
            },
            {
                "indexed": false,
                "name": "signDate",
                "type": "string"
            },
            {
                "indexed": false,
                "name": "expireDate",
                "type": "string"
            }
        ],
        "name": "SignReceipt",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "tfrom",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "tto",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "money",
                "type": "int256"
            }
        ],
        "name": "transferReceipt",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "company",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "amount",
                "type": "int256"
            }
        ],
        "name": "Financing",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "company",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "amount",
                "type": "int256"
            }
        ],
        "name": "PayDebt",
        "type": "event"
    }
];

var address = "0x8b21035ce5dacef927b4893fc811980401618874";
var metacoin = new web3.eth.Contract(abi,address);

var companyManager = "0xc0a1279b3fd48f81c6e8512d83372e822a2bceed";
var bankAddr = "0xde9699f351af33e94852bc72b944b3347048aa55";

function searchCompany(addr) {
    return new Promise(function (resolve, reject) {
        var res;
        metacoin.methods.companyMap(addr).call(null, function (error, result) {
            console.log(result);
            res = result;
        }).then(
            function(){
                console.log(res);
                resolve(res);
            }
        )
    });
}

function searchBill(rid) {
    return new Promise(function (resolve, reject) {
        var res;
        metacoin.methods.ReceiptMap(ethers.utils.formatBytes32String(rid)).call(null, function (error, result) {
            console.log(result);
            res = result;
        }).then(
            function(){
                console.log(res);
                resolve(res);
            }
        )
    });
}


function CompanyRegister(companyAddr, companyID, companyName, companyProperty, companyType){
    return new Promise(function(resolve, reject){
        var res;
        metacoin.methods.CompanyAddInChain(companyAddr,ethers.utils.formatBytes32String(companyID),companyName, Number(companyProperty),Number(companyType)).call({
            from: companyManager,
            gas: 999999
        }, function(error, result){
            console.log(result);
            res = result;
        }).then(
            function(){
                metacoin.methods.CompanyAddInChain(companyAddr,ethers.utils.formatBytes32String(companyID),companyName, Number(companyProperty),Number(companyType)).send({
                    from: companyManager,
                    gas: 999999
                });
                resolve(res);
            });
    });
}

function purchaseSign(rid, seller, sellDate, expireData,money, purchaser) {
    return new Promise(function (resolve, reject) {
        var res;
        metacoin.methods.purchaseSign(ethers.utils.formatBytes32String(rid), seller, sellDate, expireData, Number(money)).call({
            from: purchaser,
            gas: 999999
        }, function (error, result) {
            console.log(result);
            res = result;
        }).then(
            function () {
                metacoin.methods.purchaseSign(ethers.utils.formatBytes32String(rid), seller, sellDate, expireData, Number(money)).send({
                    from: purchaser,
                    gas: 999999
                });
                resolve(res);
            });
    });
}

function receiptTransfer(transferID, newid, transferTo, money, transferTime, transferFrom) {
    return new Promise(function (resolve, reject) {
        var res;
        metacoin.methods.receiptTransfer(ethers.utils.formatBytes32String(transferID), ethers.utils.formatBytes32String(newid), transferTo, Number(money), transferTime).call({
            from: transferFrom,
            gas: 999999
        }, function (error, result) {
            console.log(result);
            res = result;
        }).then(
            function () {
                metacoin.methods.receiptTransfer(ethers.utils.formatBytes32String(transferID), ethers.utils.formatBytes32String(newid), transferTo, Number(money), transferTime).send({
                    from: transferFrom,
                    gas: 999999
                });
                resolve(res);
            });
    });
}

function getFinancing(companyAddr, rid){
    return new Promise(function (resolve, reject) {
        var res;
        metacoin.methods.getFinancing(companyAddr, ethers.utils.formatBytes32String(rid)).call({
            from: bankAddr,
            gas: 999999
        }, function (error, result) {
            console.log(result);
            res = result;
        }).then(
            function () {
                metacoin.methods.getFinancing(companyAddr, ethers.utils.formatBytes32String(rid)).send({
                    from: bankAddr,
                    gas: 999999
                });
                resolve(res);
            });
    });
}

function payMoney(expireDate, payer) {
    return new Promise(function (resolve, reject) {
        var res;
        metacoin.methods.payMoney(expireDate).call({from: payer, gas: 999999}, function (error, result) {
            console.log(result);
            res = result;
        }).then(
            function () {
                metacoin.methods.payMoney(expireDate).send({from: payer, gas: 999999});
                resolve(res);
            });
    });
}

