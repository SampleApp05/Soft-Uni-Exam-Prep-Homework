// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract PayrollLogic is Initializable {
    address public benefactor;
    string public departmentName;
    address priceFeedContract;

    constructor() {
        _disableInitializers();
    }

    function initialize(
        address _benefactor,
        string calldata _departmentName,
        address _priceFeedContract
    ) external initializer {
        benefactor = _benefactor;
        departmentName = _departmentName;
        priceFeedContract = _priceFeedContract;
    }
}
