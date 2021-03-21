// SPDX-License-Identifier: MIT
pragma solidity ^0.7.4;

import "@openzeppelin/contracts/token/ERC721/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract NftStore is ERC721Burnable, AccessControl {
    using Counters for Counters.Counter;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    Counters.Counter private _tokenIdCounter;
    event Mint(uint256 indexed tokenId, string tokenUri);

    constructor() ERC721("NftStore", "NFT") {
        _setupRole(MINTER_ROLE, _msgSender());
    }

    function mint(string calldata tokenUri) external {
        require(hasRole(MINTER_ROLE, _msgSender()), "Must have MINTER role to mint");

        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();

        super._safeMint(_msgSender(), tokenId);

        super._setTokenURI(tokenId, tokenUri);

        emit Mint(tokenId, tokenUri);
    }

}
