import axios from "axios";

import { MetadataType } from "../types";

export const getMetadata = async (
  ipfs: string,
  metadata: {
    title: string;
    summary: string;
    details: string;
    authors: string;
  },
): Promise<MetadataType> => {
  if (!ipfs || !ipfs.includes("ipfs://")) return metadata;

  const url = ipfs.replace("ipfs://", "https://ipfs.io/ipfs/");

  try {
    const result = await axios.get(url, {
      timeout: 2000,
    });
    if (result.status === 200 && Object.keys(result.data).length > 0) {
      return {
        title: result.data.title,
        summary: result.data.summary,
        details: result.data.details,
        authors: result.data.authors.join(", "),
      };
    }
    return metadata;
  } catch (error) {
    return metadata;
  }
};
