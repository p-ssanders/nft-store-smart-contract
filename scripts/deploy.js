async function main() {
  const NftStore = await ethers.getContractFactory("NftStore");
  const nftStoreInstance = await NftStore.deploy();

  console.log("NftStore deployed to: ", nftStoreInstance.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });