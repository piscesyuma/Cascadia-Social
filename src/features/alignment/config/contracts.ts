export const VOTINESCROW = {
  abi: require("./abis/votingescrow.json"),
  address:
    process.env.NEXT_PUBLIC_VOTINGESCROW_ADDRESS ||
    "0x6D7149dd7e1085F81e92d9c829A614b37309A194",
};

export const FEEDISTRIBUTOR = {
  abi: require("./abis/feedistributor.json"),
  address:
    process.env.NEXT_PUBLIC_FEEDISTRIBUTOR_ADDRESS ||
    "0xDd59e8a3c0139A962AE2b41B99c96D5C76389D76",
};
