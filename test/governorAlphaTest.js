// const { expect } = require('chai');
// const { ethers } = require('hardhat');
//
// describe('GovernorAlpha', () => {
//   let GovernorAlpha, governorAlpha, Taro, taro, Timelock, timelock, SafeMath, safeMath, Holder, holder, deployer;
//
//   beforeEach(async () => {
//     [deployer, user1] = await ethers.getSigners();
//
//   Timelock = await ethers.getContractFactory('Timelock');
//   timelock = await Timelock.deploy(deployer.address, 259200);
//   await timelock.deployed();
//   // console.log('Timelock address: ', timelock.address);
//
//   SafeMath = await ethers.getContractFactory('SafeMath');
//   safeMath = await SafeMath.deploy();
//   await safeMath.deployed();
//   // console.log('SafeMath address: ', safeMath.address);
//
//   // Holder = await ethers.getContractFactory('Holder');
//   // holder = await Holder.deploy();
//   // await holder.deployed();
//   //console.log('Holder address: ', holder.address);
//
//   Taro = await ethers.getContractFactory('Taro');
//   taro = await Taro.deploy(deployer.address);
//   await taro.deployed();
//   // console.log('Taro address: ', taro.address);
//   //
//   GovernorAlpha = await ethers.getContractFactory('contracts/GovernorAlpha.sol:GovernorAlpha');
//   governorAlpha = await GovernorAlpha.deploy(timelock.address, taro.address, deployer.address);
//   await governorAlpha.deployed();
//   // console.log('GovernorAlpha address: ', governorAlpha.address);
//   });
//
//   xit('Calls propose()', async () => {
//     let proposalObj = {
//       title: "This is the title",
//       typeOfAction: "This is typeOfAction",
//       neighborhood: "This is neighborhood",
//       personInCharge: "This is personInCharge",
//       description: "This is the description",
//       expiration: ethers.BigNumber.from('50'),
//       budget: ethers.BigNumber.from('100'),
//       requiredTaroToVote: ethers.BigNumber.from('200')
//     };
//
//     let tx = await governorAlpha.connect(deployer).propose(proposalObj);
//     let txReceipt = await tx.wait(1);
//     // console.log(tx1);
//     // console.log(tx1.events[0].args[2].toString())
//
//     expect(txReceipt.events[0].args[0].toString()).to.equal('1');
//   });
//
//   xit('Votes for a proposal', async () => {
//     //retrieves deployer's Taro token balance
//     let deployerBalance = await taro.balanceOf(deployer.address);
//     deployerBalance = ethers.utils.formatUnits(deployerBalance, 'ether');
//     // console.log('deployer taro token balance: ', deployerBalance);
//
//     //transfer 100 tokens from deployer to user1
//     //Note: If a user wants to vote on a proposal, that user must have Taro tokens BEFORE the proposal is made.  It does not work if a proposal already exists and then a user gets their first Taro tokens.  They cannot vote for that proposal; they can only vote on proposals that come after they got their Taro tokens.
//     let transferToUser1 = await taro.connect(deployer).transfer(user1.address, ethers.utils.parseUnits('100', 18));
//     let transferToUser1Receipt = await transferToUser1.wait(1);
//     // console.log(transferToUser1Receipt);
//
//     let proposalObj = {
//       title: "This is the title",
//       typeOfAction: "This is typeOfAction",
//       neighborhood: "This is neighborhood",
//       personInCharge: "This is personInCharge",
//       description: "This is the description",
//       expiration: ethers.BigNumber.from('50'),
//       budget: ethers.BigNumber.from('100'),
//       requiredTaroToVote: ethers.BigNumber.from('200')
//     };
//     //deploy governorAlpha contract with deployer as signer
//     let tx = await governorAlpha.connect(deployer).propose(proposalObj);
//     await tx.wait(1);
//
//     //retrieves user1's balance
//     let user1Balance = await taro.balanceOf(user1.address);
//     user1Balance = ethers.utils.formatUnits(user1Balance, 'ether');
//     // console.log('user1 taro token balance: ', user1Balance);
//
//     //user1 delegates votes to itself.
//     let delegateUser1ToSelf = await taro.connect(user1).delegate(user1.address);
//     let delegateUser1ToSelfReceipt = await delegateUser1ToSelf.wait(1);
//     // console.log(delegateUser1ToSelfReceipt);
//
//     //retrieves the current votes for user1
//     let user1VoteBalance = await taro.getCurrentVotes(user1.address);
//     // console.log('user1 available votes: ', ethers.utils.formatUnits(user1VoteBalance));
//
//     // user1 votes for proposal 1, which was made above by deployer
//     let vote = await governorAlpha.connect(user1).castVote(ethers.BigNumber.from('1'), true);
//     let voteReceipt = await vote.wait(1);
//     // console.log(voteReceipt);
//
//     //Retrieves the number of votes in support of proposal 1
//     let proposal = await governorAlpha.proposals(ethers.BigNumber.from('1'));
//     let support = proposal.forVotes;
//     // console.log('votes in support: ', ethers.utils.formatUnits(support));
//   });
//
//   xit('Retrieve all active proposals', async () => {
//     // let proposalObj1 = {
//     //   title: "This is the title 1",
//     //   typeOfAction: "This is typeOfAction 1",
//     //   neighborhood: "This is neighborhood 1",
//     //   personInCharge: "This is personInCharge 1",
//     //   description: "This is the description 1",
//     //   expiration: ethers.BigNumber.from('50'),
//     //   budget: ethers.BigNumber.from('100'),
//     //   requiredTaroToVote: ethers.BigNumber.from('200')
//     // };
//     // //deploy governorAlpha contract with deployer as signer
//     // let tx1 = await governorAlpha.connect(deployer).propose(proposalObj1);
//     // await tx1.wait(1);
//     //
//     // let proposalObj2 = {
//     //   title: "This is the title 2",
//     //   typeOfAction: "This is typeOfAction 2",
//     //   neighborhood: "This is neighborhood 2",
//     //   personInCharge: "This is personInCharge 2",
//     //   description: "This is the description 2",
//     //   expiration: ethers.BigNumber.from('50'),
//     //   budget: ethers.BigNumber.from('100'),
//     //   requiredTaroToVote: ethers.BigNumber.from('200')
//     // };
//     // //deploy governorAlpha contract with deployer as signer
//     // let tx2 = await governorAlpha.connect(deployer).propose(proposalObj2);
//     // await tx2.wait(1);
//     //
//     // let proposalObj3 = {
//     //   title: "This is the title 3",
//     //   typeOfAction: "This is typeOfAction 3",
//     //   neighborhood: "This is neighborhood 3",
//     //   personInCharge: "This is personInCharge 3",
//     //   description: "This is the description 3",
//     //   expiration: ethers.BigNumber.from('50'),
//     //   budget: ethers.BigNumber.from('100'),
//     //   requiredTaroToVote: ethers.BigNumber.from('200')
//     // };
//     // //deploy governorAlpha contract with deployer as signer
//     // let tx3 = await governorAlpha.connect(deployer).propose(proposalObj3);
//     // await tx3.wait(1);
//
//     //this function does not work properly in the test runner because the getBlockNumber() is off.
//     const getActiveProposals = async () => {
//       let proposalCount = await governorAlpha.proposalCount();
//       proposalCount = proposalCount.toString();
//
//       let activeProposals = [];
//       let proposal, currentBlockNumber;
//       for(let i = 1; i <= proposalCount; i++) {
//         proposal = await governorAlpha.proposals(ethers.BigNumber.from(i));
//         currentBlockNumber = await ethers.provider.getBlockNumber();
//         console.log('block number: ', currentBlockNumber)
//         console.log('proposal:', proposal.endBlock.toNumber());
//
//         if(proposal.endBlock.toNumber() > currentBlockNumber) {
//           activeProposals.push(proposal);
//         };
//       };
//       return activeProposals;
//     };
//
//     let currentlyActiveProposals = await getActiveProposals();
//     console.log(currentlyActiveProposals);
//   });
//
//   xit('Retrieve inactive proposals', async () => {
//     //This will need to be tested by changing the expiration time in GovernorAlpha
//     const getInactiveProposals = async () => {
//       let proposalCount = await governorAlpha.proposalCount();
//       proposalCount = proposalCount.toString();
//
//       let inactiveProposals = [];
//       let proposal, currentBlockNumber;
//       for(let i = 1; i <= proposalCount; i++) {
//         proposal = await governorAlpha.proposals(ethers.BigNumber.from(i));
//         currentBlockNumber = await ethers.provider.getBlockNumber();
//         console.log('block number: ', currentBlockNumber)
//         console.log('proposal:', proposal.endBlock.toNumber());
//
//         if(proposal.endBlock.toNumber() > currentBlockNumber) {
//           inactiveProposals.push(proposal);
//         };
//       };
//       return inactiveProposals;
//     };
//
//     let currentlyInactiveProposals = await getInactiveProposals();
//     console.log(currentlyInactiveProposals);
//   });
//
//   it()
//
// });
