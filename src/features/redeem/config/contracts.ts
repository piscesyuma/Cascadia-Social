export const FEEDISTRIBUTOR = {
  abi: require("./abis/feedistributor.json"),
  address:
    process.env.NEXT_PUBLIC_FEEDISTRIBUTOR_ADDRESS ||
    "0xAFc284d417292D386CdC4780bFDD0b3637476F0a",
};

export const REDEEM = {
  abi: require("./abis/redeem.json"),
  address:
    process.env.NEXT_PUBLIC_REDEEM_ADDRESS ||
    "0x10A9340bf87F427696db7a7d4A1F90F6c7909771",
};

export const CCC = {
  abi: require("./abis/erc20.json"),
  address:
    process.env.NEXT_PUBLIC_CCC_ADDRESS ||
    "0x0B7f369c97982461523F331eCc9883b825ddCAd4",
};

export const WETH = {
  abi: require("./abis/erc20.json"),
  address:
    process.env.NEXT_PUBLIC_WETH_ADDRESS ||
    "0xC81d312D5E0Ab82Bc8af8270e02E2Ba169c81b99",
};
