const hre = require('hardhat');

async function main() {
  const Traceability = await hre.ethers.getContractFactory('AgroTraceability');
  const contract = await Traceability.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log('✅ AgroTraceability deployed to Cronos at:', address);
  console.log('📝 Copy this address and update CONTRACT_ADDRESS in .env file');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
