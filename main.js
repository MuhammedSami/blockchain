
const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
    }
}

class Block{
    constructor(timestamp, transactions, previousHash = ''){
        this.timestamp = timestamp
        this.transactions = transactions
        this.previousHash = previousHash
        this.hash = this.calculateHash()
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined:" + this.hash )
    }
}

class BlockChain{
    constructor(){
        this.pendingTransactions = []
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.miningReward = 100;
    }

    createGenesisBlock(){
        return new Block('01/01/2021', "Genesis block", "0")
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1]
    }

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty)

        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ]
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction)
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount
                }

                if(trans.toAddress === address){
                    balance += trans.amount
                }
            }
        }

        return balance
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i]
            const previousBlock = this.chain[i - 1]

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(previousBlock.hash !== currentBlock.previousHash){
                return false;
            }
        }

        return true;
    }
}

let samiCoin = new BlockChain();
samiCoin.createTransaction(new Transaction('address1', 'sami-address' , 1000))
samiCoin.createTransaction(new Transaction('address4', 'address1' , 500))

console.log('Starting the miner...');

samiCoin.minePendingTransactions('sami-address')
console.log('Balance of sami is ', samiCoin.getBalanceOfAddress('sami-address'))