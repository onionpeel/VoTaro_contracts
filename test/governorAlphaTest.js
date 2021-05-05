const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('GovernorAlpha', () => {
  let GovernorAlpha, governorAlpha, Taro, taro, Timelock, timelock, SafeMath, safeMath, deployer;

  beforeEach(async () => {
    [deployer] = await ethers.getSigners();

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

  it('compiles properly', () => {
    console.log('this has compiled')
  });
});
