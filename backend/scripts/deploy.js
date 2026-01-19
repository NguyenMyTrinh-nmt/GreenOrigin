const hre = require('hardhat');

async function main() {
  const Traceability = await hre.ethers.getContractFactory('GreenOriginTraceability');
  const contract = await Traceability.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log('✅ GreenOriginTraceability deployed at:', address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
