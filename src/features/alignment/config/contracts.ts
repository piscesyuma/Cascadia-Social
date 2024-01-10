export const VOTINESCROW = {
  abi: require("./abis/votingescrow.json"),
  address:
    process.env.NEXT_PUBLIC_VOTINGESCROW_ADDRESS ||
    "0xd7de9Fa557E99C42201690C444F98Da058329F9A",
};

export const FEEDISTRIBUTOR = {
  abi: require("./abis/feedistributor.json"),
  address:
    process.env.NEXT_PUBLIC_FEEDISTRIBUTOR_ADDRESS ||
    "0xAFc284d417292D386CdC4780bFDD0b3637476F0a",
};
