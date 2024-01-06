import axios from "axios";
export const getTweets = async ({
  pageParam = "",
  limit = 20,
  type,
  id,
  sortByVote,
}: {
  pageParam?: string | unknown;
  limit?: number;
  type?: string;
  id?: string;
  sortByVote?: string;
}) => {
  try {
    const { data } = await axios.get(
      `/api/tweets?cursor=${pageParam}&limit=${limit}${
        type ? `&type=${type}` : ""
      }${id ? `&id=${id}` : ""}${
        sortByVote ? `&sortByVote=${sortByVote}` : ""
      }`,
    );
    return data;
  } catch (error: any) {
    return error.response.data;
  }
};
