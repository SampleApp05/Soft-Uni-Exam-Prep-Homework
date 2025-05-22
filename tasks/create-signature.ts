import { task } from "hardhat/config";
import { IPayrollContract } from "../typechain-types";

task("createTSignature", "Create a typed testnet signature for payroll")
  .addParam("employee", "The address allowed to withdraw")
  .addParam("amount", "The amount to withdraw")
  .addParam("salaryPeriod", "The period (e.g. 202505)")
  .addParam("payrollContract", "The deployed payroll contract address")
  .setAction(
    async ({ employee, amount, salaryPeriod, payrollContract }, hre) => {
      const [, benefactor] = await hre.ethers.getSigners();

      let contract = payrollContract as IPayrollContract;

      const domain = {
        name: await contract.departmentName(),
        version: await contract.version(),
        chainId: 11155111, // Sepolia
        verifyingContract: payrollContract,
      };

      const types = {
        Withdraw: [
          { name: "employee", type: "address" },
          { name: "amount", type: "uint256" },
          { name: "salaryPeriod", type: "uint256" },
        ],
      };

      const value = {
        employee,
        amount: parseInt(amount),
        salaryPeriod: parseInt(salaryPeriod),
      };

      const signature = await benefactor.signTypedData(domain, types, value);
      console.log("Signature:", signature);
    }
  );
