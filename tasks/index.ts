import { task } from "hardhat/config";
import { PayrollContract } from "../typechain-types";
import { PayrollProxyFactory } from "../typechain-types";

task("deployPayrollTemplate", "Deploy Payroll template contract").setAction(
  async (_, hre) => {
    const factory = await hre.ethers.getContractFactory("PayrollContract");
    const contract = await factory.deploy();
    await contract.waitForDeployment();

    console.log("PayrollContract deployed to:", contract.target);
    return contract;
  }
);

task("deployPayrollFactory", "Deploy PayrollProxyFactory contract").setAction(
  async (_, hre) => {
    let templateContract = (await hre.run(
      "deployPayrollTemplate"
    )) as PayrollContract;

    const factory = await hre.ethers.getContractFactory("PayrollProxyFactory");
    const contract = await factory.deploy(templateContract.target);
    await contract.waitForDeployment();

    console.log("PayrollProxyFactory deployed to:", contract.target);
  }
);

task("deployPayrollProxy", "Deploy PayrollContract proxy")
  .addParam("departmentName", "The name of the department")
  .addParam("version", "The version of the contract")
  .addParam("priceFeedContract", "The address of the price feed contract")
  .setAction(async (taskArgs, hre) => {
    let [, benefactor] = await hre.ethers.getSigners();

    let factory = (await hre.run(
      "deployPayrollFactory"
    )) as PayrollProxyFactory;

    let proxy = await factory.createProxy(
      benefactor.address,
      taskArgs.departmentName,
      taskArgs.version,
      taskArgs.priceFeedContract
    );

    console.log("PayrollContract proxy deployed to:", proxy);
  });
