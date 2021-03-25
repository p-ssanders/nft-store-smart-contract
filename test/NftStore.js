const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NftStore", function() {

  const minterRole = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"));
  let storeInstance;

  beforeEach(async function() {
    const NftStore = await ethers.getContractFactory("NftStore");
    storeInstance = await NftStore.deploy();
    await storeInstance.deployed();
  });

  it("Contract should have symbol NFT", async function() {
    expect(await storeInstance.symbol()).to.equal("NFT");
  });

  it("Contract should set MINTER_ROLE role for contract owner", async function() {
    const [owner] = await ethers.getSigners();

    const hasMinterRole = await storeInstance.hasRole(minterRole, owner.address);
    
    expect(hasMinterRole).to.be.true;
  });

  it('MINTER_ROLE cannot be assigned after deployment', async function() {
    const [owner, acct1] = await ethers.getSigners();

    await expect(storeInstance.grantRole(minterRole, acct1)).to.be.reverted;

    const actualMinterCount = await storeInstance.getRoleMemberCount(minterRole);
    expect(actualMinterCount).to.equal(ethers.BigNumber.from(1));
  });

  it("Minting always assigns token to contract owner", async function() {
    const [owner] = await ethers.getSigners();

    const receipt = await storeInstance.mint("some-token-uri");

    const ownerBalance = await storeInstance.balanceOf(owner.address);
    expect(ownerBalance).to.equal(1);
  });

  it('Minting emits an event with tokenId, tokenUri', async function() {
    const tokenId = 1;

    await expect(storeInstance.mint("some-token-uri"))
      .to
      .emit(storeInstance, 'Mint')
      .withArgs(ethers.BigNumber.from(tokenId), 'some-token-uri');
  });

  it("Only contract owner can mint", async function() {
    const [owner, acct1] = await ethers.getSigners();

    await expect(
      storeInstance
      .connect(acct1)
      .mint("some-token-uri")
      ).to.be.revertedWith('Must have MINTER role to mint');
  });

  it("Token can be burned", async function() {
    const receipt = await storeInstance.mint("some-token-uri");
    const [owner] = await ethers.getSigners();
    const [event] = await storeInstance.queryFilter('Mint');

    await storeInstance.burn(event.args.tokenId);

    ownerBalance = await storeInstance.balanceOf(owner.address);
    expect(ownerBalance).to.equal(0);
  });

});