const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('GovernorAlpha', () => {
  let GovernorAlpha, governorAlpha, Taro, taro, Timelock, timelock, SafeMath, safeMath, deployer, user1;

  beforeEach(async () => {
    [deployer, user1] = await ethers.getSigners();

  Timelock = await ethers.getContractFactory('Timelock');
  timelock = await Timelock.deploy(deployer.address, 259200);
  await timelock.deployed();
  // console.log('Timelock address: ', timelock.address);

  SafeMath = await ethers.getContractFactory('SafeMath');
  safeMath = await SafeMath.deploy();
  await safeMath.deployed();
  // console.log('SafeMath address: ', safeMath.address);

  Taro = await ethers.getContractFactory('Taro');
  taro = await Taro.deploy(deployer.address);
  await taro.deployed();
  // console.log('Taro address: ', taro.address);


  //
  GovernorAlpha = await ethers.getContractFactory('contracts/GovernorAlpha.sol:GovernorAlpha');
  governorAlpha = await GovernorAlpha.deploy(timelock.address, taro.address, deployer.address);
  await governorAlpha.deployed();
  // console.log('GovernorAlpha address: ', governorAlpha.address);

  //The initial balance was transfered from the Taro contract to the deployer.  Now it gets transfered to the governorAlpha address so that governorAlpha can transfer tokens to individual users when they get validated.
  let deployerBalance = await taro.balanceOf(deployer.address);
  await taro.connect(deployer).transfer(governorAlpha.address, deployerBalance);
  let governorAlphaBalance = await taro.balanceOf(governorAlpha.address);
  // console.log('governorAlphaBalance: ', governorAlphaBalance.toString());
  });

  xit('New user receives tokens for validating', async () => {
    let user1Validate = await governorAlpha.connect(user1).validate(ethers.BigNumber.from('100'));
    let user1ValidateReceipt = await user1Validate.wait();

    let user1NewBalance = await taro.balanceOf(user1.address);
    console.log('user1NewBalance: ', user1NewBalance.toString());
  });

  it('Only a valid user can make a proposal', async () => {
    let user1Validate = await governorAlpha.connect(user1).validate(ethers.BigNumber.from('100'));
    await user1Validate.wait(1);

    //This delay function is used to test the modifier checkValidity().  When using this, set the expiration time to block.timestamp + 3 so that the attempt to call propose() is made after the validation has expired. 
    // const delay = () => new Promise(res => setTimeout(res, 5000));
    // await delay();

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
    let tx = await governorAlpha.connect(user1).propose(proposalObj);
    let txReceipt = await tx.wait(1);
    console.log(txReceipt);
  });

});
