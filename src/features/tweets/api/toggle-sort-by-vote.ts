import axios from "axios";
export const toggleSortByVote = async ({
  userId,
  sort_by_vote,
}: {
  userId: string | undefined;
  sort_by_vote: boolean;
}) => {
  try {
    const response = await axios.put("/api/users/sortByVote", {
      user_id: userId,
      sort_by_vote: sort_by_vote,
    });
    const data = response.data;
    return data;
  } catch (error: any) {
    return error.message;
  }
};
