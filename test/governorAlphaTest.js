const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('GovernorAlpha', () => {
  let GovernorAlpha, governorAlpha, Taro, taro, Timelock, timelock, SafeMath, safeMath, deployer;

  beforeEach(async () => {
    [deployer, user1] = await ethers.getSigners();

  Timelock = await ethers.getContractFactory('Timelock');
  timelock = await Timelock.deploy(deployer.address, 259200);
  await timelock.deployed();
  console.log('Timelock address: ', timelock.address);

  SafeMath = await ethers.getContractFactory('SafeMath');
  safeMath = await SafeMath.deploy();
  await safeMath.deployed();
  console.log('SafeMath address: ', safeMath.address);
  //
  Taro = await ethers.getContractFactory('Taro');
  taro = await Taro.deploy(deployer.address);
  await taro.deployed();
  console.log('Taro address: ', taro.address);
  //
  GovernorAlpha = await ethers.getContractFactory('contracts/GovernorAlpha.sol:GovernorAlpha');
  governorAlpha = await GovernorAlpha.deploy(timelock.address, taro.address, deployer.address);
  await governorAlpha.deployed();
  console.log('GovernorAlpha address: ', governorAlpha.address);
  });

  it('Calls propose()', async () => {
    let proposalObj = {
      title: "This is the title",
      typeOfAction: "This is typeOfAction",
      neighborhood: "This is neighborhood",
      personInCharge: "This is personInCharge",
      description: "This is the description",
      expiration: ethers.BigNumber.from('50'),
      budget: ethers.BigNumber.from('100'),
      requiredTaroToVote: ethers.BigNumber.from('200')
    };

    let tx = await governorAlpha.connect(deployer).propose(proposalObj);
    let txReceipt = await tx.wait(1);
    // console.log(tx1);
    // console.log(tx1.events[0].args[2].toString())

    expect(txReceipt.events[0].args[0].toString()).to.equal('1');
  });

  it('Votes for a proposal', async () => {
    let proposalObj = {
      title: "This is the title",
      typeOfAction: "This is typeOfAction",
      neighborhood: "This is neighborhood",
      personInCharge: "This is personInCharge",
      description: "This is the description",
      expiration: ethers.BigNumber.from('50'),
      budget: ethers.BigNumber.from('100'),
      requiredTaroToVote: ethers.BigNumber.from('200')
    };
    //deploy governorAlpha contract with deployer as signer
    let tx = await governorAlpha.connect(deployer).propose(proposalObj);
    await tx.wait(1);
    //retrieves deployer's Taro token balance
    let deployerBalance = await taro.balanceOf(deployer.address);
    deployerBalance = ethers.utils.formatUnits(deployerBalance, 'ether');
    console.log('deployer taro token balance: ', deployerBalance);

    //transfer 100 tokens from deployer to user1
    let transferToUser1 = await taro.connect(deployer).transfer(user1.address, ethers.utils.parseUnits('100', 18));
    let transferToUser1Receipt = await transferToUser1.wait(1);
    // console.log(transferToUser1Receipt);

    //retrieves user1's balance
    let user1Balance = await taro.balanceOf(user1.address);
    user1Balance = ethers.utils.formatUnits(user1Balance, 'ether');
    console.log('user1 taro token balance: ', user1Balance);

    //user1 delegates votes to itself.
    let delegateUser1ToSelf = await taro.connect(user1).delegate(user1.address);
    let delegateUser1ToSelfReceipt = await delegateUser1ToSelf.wait(1);
    // console.log(delegateUser1ToSelfReceipt);

    //retrieves the current votes for user1
    let user1VoteBalance = await taro.getCurrentVotes(user1.address);
    console.log('user1 available votes: ', ethers.utils.formatUnits(user1VoteBalance));

    // user1 votes for proposal 1, which was made above by deployer
    let vote = await governorAlpha.connect(user1).castVote(ethers.BigNumber.from('1'), false);
    let voteReceipt = await vote.wait(1);
    // console.log(voteReceipt);

    //Retrieves the number of votes in support of proposal 1
    let proposal = await governorAlpha.proposals(ethers.BigNumber.from('1'));
    let support = proposal.againstVotes;
    console.log(ethers.utils.formatUnits(support));


    //retrieves the new vote count for user1
    // let user1NewVoteBalance = await taro.getCurrentVotes(user1.address);
    // console.log('user1 new available votes: ', ethers.utils.formatUnits(user1NewVoteBalance));

  });
});
