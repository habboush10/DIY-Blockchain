'use strict';

const { createHash } = require('crypto');
const signing = require('./signing');

/**
 * A simple validation function for transactions. Accepts a transaction
 * and returns true or false. It should reject transactions that:
 *   - have negative amounts
 *   - were improperly signed
 *   - have been modified since signing
 */
const isValidTransaction = transaction => {
  // Enter your solution here

  if (transaction.amount < 0) {
    return false;
  }
  return signing.verify(transaction.source, transaction.source + transaction.recipient + transaction.amount, transaction.signature);
};

/**
 * Validation function for blocks. Accepts a block and returns true or false.
 * It should reject blocks if:
 *   - their hash or any other properties were altered
 *   - they contain any invalid transactions
 */
const isValidBlock = block => {
  // Your code here
  const hashedBlock = createHash('sha512').update((block.transactions + block.previousHash + block.nonce).toString()).digest('hex');

  if (block.hash != hashedBlock) {
    return false;

  }

  const trx = block.transactions;
  for (let j = 0; j < trx.length; j++) {
    const trn = trx[j];
    if (!isValidTransaction(trn)) {
      return false;
    }
  }
  return true;

};

/**
 * One more validation function. Accepts a blockchain, and returns true
 * or false. It should reject any blockchain that:
 *   - is a missing genesis block
 *   - has any block besides genesis with a null hash
 *   - has any block besides genesis with a previousHash that does not match
 *     the previous hash
 *   - contains any invalid blocks
 *   - contains any invalid transactions
 */
const isValidChain = blockchain => {
  // Your code here

  // init data
  const blocks = blockchain.blocks;
  const genesis = blocks[0];

  // is a missing genesis block
  if (genesis.previousHash != null) {
    return false;
  }

  // transactions empty or does not exist
  if (genesis.transactions === undefined || genesis.transactions.length != 0) {
    return false;
  }

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (!isValidBlock(block)) {
      return false;
    }
    if (i != 0) {
      const prvBlock = blocks[i - 1];
      if (block.previousHash != prvBlock.hash || block.previousHash == null) {
        return false;
      }
    }
  }
  return true;
};

/**
 * This last one is just for fun. Become a hacker and tamper with the passed in
 * blockchain, mutating it for your own nefarious purposes. This should
 * (in theory) make the blockchain fail later validation checks;
 */
const breakChain = blockchain => {
  // Your code here
  const blocks = blockchain.blocks;
  blocks[0].previousHash = createHash('sha512').update('shere').digest('hex');
  blockchain.blocks = blocks;
  return blockchain;
};


module.exports = {
  isValidTransaction,
  isValidBlock,
  isValidChain,
  breakChain
};