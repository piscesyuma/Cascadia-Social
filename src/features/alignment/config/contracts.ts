export const VOTINESCROW = {
  abi: require("./abis/votingescrow.json"),
  address: process.env.NEXT_PUBLIC_VOTINGESCROW_ADDRESS,
};

export const FEEDISTRIBUTOR = {
  abi: require("./abis/feedistributor.json"),
  address: process.env.NEXT_PUBLIC_FEEDISTRIBUTOR_ADDRESS,
};
