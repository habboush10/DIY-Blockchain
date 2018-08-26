'use strict';

const { createHash } = require('crypto');
const signing = require('./signing');


/**
 * A simple signed Transaction class for sending funds from the signer to
 * another public key.
 */
class Transaction {
  /**
   * The constructor accepts a hex private key for the sender, a hex
   * public key for the recipient, and a number amount. It will use these
   * to set a number of properties, including a Secp256k1 signature.
   *
   * Properties:
   *   - source: the public key derived from the provided private key
   *   - recipient: the provided public key for the recipient
   *   - amount: the provided amount
   *   - signature: a unique signature generated from a combination of the
   *     other properties, signed with the provided private key
   */
  constructor(privateKey, recipient, amount) {
    // Enter your solution here
    this.source = signing.getPublicKey(privateKey);
    this.recipient = recipient;
    this.amount = amount;
    this.signature =  signing.sign(privateKey, this.source + this.recipient + this.amount);
    
  }
}

/**
 * A Block class for storing an array of transactions and the hash of a
 * previous block. Includes a method to calculate and set its own hash.
 */
class Block {
  /**
   * Accepts an array of transactions and the hash of a previous block. It
   * saves these and uses them to calculate a hash.
   *
   * Properties:
   *   - transactions: the passed in transactions
   *   - previousHash: the passed in hash
   *   - nonce: just set this to some hard-coded number for now, it will be
   *     used later when we make blocks mineable with our own PoW algorithm
   *   - hash: a unique hash string generated from the other properties
   */
  constructor(transactions, previousHash) {
    // Your code here
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.nonce = 1;
    const hashedBlock = createHash('sha512').update((transactions + previousHash + this.nonce).toString()).digest("hex");
    this.hash = this.hashedBlock

  }

  /**
   * Accepts a nonce, and generates a unique hash for the block. Updates the
   * hash and nonce properties of the block accordingly.
   *
   * Hint:
   *   The format of the hash is up to you. Remember that it needs to be
   *   unique and deterministic, and must become invalid if any of the block's
   *   properties change.
   */
  calculateHash(nonce) {
    const hashedBlock = createHash('sha512').update((this.transactions + this.previousHash + nonce).toString()).digest("hex");
    this.hash = hashedBlock;
    this.nonce = nonce;
  }
}

/**
 * A Blockchain class for storing an array of blocks, each of which is linked
 * to the previous block by their hashes. Includes methods for adding blocks,
 * fetching the head block, and checking the balances of public keys.
 */
class Blockchain {
  /**
   * Generates a new blockchain with a single "genesis" block. This is the
   * only block which may have no previous hash. It should have an empty
   * transactions array, and `null` for the previous hash.
   *
   * Properties:
   *   - blocks: an array of blocks, starting with one genesis block
   */
  constructor() {
    // Your code here
    let block = new Block([], null);
    this.blocks = [block];
  }

  /**
   * Simply returns the last block added to the chain.
   */
  getHeadBlock() {
    // Your code here

    return this.blocks.slice(-1).pop();
  }

  /**
   * Accepts an array of transactions, creating a new block with them and
   * adding it to the chain.
   */
  addBlock(transactions) {
    // Your code here
    let latesBlock = this.getHeadBlock();
    let newBlock = new Block(transactions, latesBlock)

    return this.blocks.push(newBlock);
  }

  /**
   * Accepts a public key, calculating its "balance" based on the amounts
   * transferred in all transactions stored in the chain.
   *
   * Note:
   *   There is currently no way to create new funds on the chain, so some
   *   keys will have a negative balance. That's okay, we'll address it when
   *   we make the blockchain mineable later.
   */
  getBalance(publicKey) {
    // Your code here

    let balance = 0;
    for (let i = 0; i < this.blocks.length; i++) {
      const trx = this.blocks[i].transactions;
      for (let j = 0; j < trx.length; j++) {
        const trn = trx[j];
        if (trn.source === publicKey) {
          balance = balance - trn.amount;
        } else if (trn.recipient === publicKey) {
          balance = balance + trn.amount;
        }
      }

    }
    return balance;
    
  }
}

module.exports = {
  Transaction,
  Block,
  Blockchain
};
