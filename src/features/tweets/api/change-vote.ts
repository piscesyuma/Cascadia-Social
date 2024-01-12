import axios from "axios";
export const changeVote = async ({
  tweetId,
  userId,
  vote_status,
}: {
  tweetId: string | undefined;
  userId: string | undefined;
  vote_status: string;
}) => {
  try {
    const response = await axios.post("/api/tweets/vote", {
      tweet_id: tweetId,
      user_id: userId,
      vote_status,
    });
    const data = response.data;
    return data;
  } catch (error: any) {
    return error.message;
  }
};
