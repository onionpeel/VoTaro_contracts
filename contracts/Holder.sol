pragma solidity ^0.5.16;

import './Taro.sol';

contract Holder is Taro{
  string public name;

  constructor() public {
    name = "Holder";
  }

  function getName() public returns(string memory) {
    return name;
  }
}
