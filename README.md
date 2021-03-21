#   NFT Store

This repository contains an [ERC-721](https://eips.ethereum.org/EIPS/eip-721) smart contract implementation called `NftStore` that can be used to persist NFTs that represent items in an inventory.

The contract is an extension of OpenZeppelin's [ERC721 Contracts](https://docs.openzeppelin.com/contracts/3.x/erc721).

The contract implements simple access control using OpenZeppelin's [`Access`](https://docs.openzeppelin.com/contracts/3.x/api/access) API to ensure that only the contract deployer can mint new tokens. The reason behind that decision is that each instance of this contract could digitally represent the unique items of inventory of some kind of store, and only the store owner can add new inventory. The unique inventory items, represented as NFTs, can then be transferred to buyers. Seems like it could make sense for a diamond dealer where each stone is unique, or a horse breeder, or anyone who sells unique things where pedigree and provenance matter.

##  Compile

```sh
npm install
npm run compile
```

##  Test

The `NftStore` contract is tested using [ethers.js](https://docs.ethers.io/) and [Waffle](https://getwaffle.io/). The [tests](test/NftStore.js) are a great place to learn the functionality of the contract.

```sh
npm run test
```

##  Deploy

*TODO*

##  Interact

*TODO*

##  Thoughts

In this example, an "NFT" is just a unique identifer (it's literally a number) mapped to an Etheruem address. The address to which the number is mapped is considered the "owner" of the token identified by that number. This mapping is persisted to the blockchain as contract state each time the contract is updated, so a token will always be associated to a specific address until it's transferred to a different address, or "burned" (deleted entirely).

But the token must be more than just an identifier, right?

Not really.

This particular contract implements the "ERC-721 metadata extension" in a way that requires a minter (creator) to map an NFT to a URI. The URI is supposed to refer to a JSON document that contains three properties: `name`, `description`, and `image` (per the "ERC721 Metadata JSON Schema"). So you can create an NFT, which is really just an identifier, and associate some metadata to add some details to it.

Interestingly, only the URI of the metadata is persisted on the blockchain as contract state. You could update the contract implementation to persist the JSON itself on the blockchain as contract state, but since transaction cost is a function of data size I guess the authors of ERC-721 figured no one would put JSON data on a blockchain? So the specification calls for a URI that _points to_ JSON.

But where do you store the JSON?

In the spirit of decentralization the only "correct" answer is to put the JSON on [IPFS](https://ipfs.io/). But that isn't as easy as putting the JSON as static content on some HTTP server, and it probably costs more. So to me, the weirdest part of all of this is that when you buy an NFT, you're buying an identifier -- there's nothing manditorily enforcing that the metadata is immutable, unless the metadata is on IPFS, and even then nothing is enforcing it stays there. So one day you could have a digital pair of shoes, and the next you could have a PNG, and the next you could have a 404 Not Found. The one thing you'll always have is the identifier.

In classic finance terminology, this technology facilitates trades, but not settlement. I'm not sure how you settle an NFT trade. That is, as a buyer, how do you truly take ownership of the asset (represented by the NFT) that you bought? And of course there's no centralization of token identifiers (like CUSIPs), so the identifier of your token is only valid to the contract that minted it.

##  Stack

*   [Hardhat](https://hardhat.org/)
*   [OpenZeppelin Contracts](https://openzeppelin.com/contracts/)
*   [ethers.js](https://docs.ethers.io/)
*   [Waffle](https://getwaffle.io/)