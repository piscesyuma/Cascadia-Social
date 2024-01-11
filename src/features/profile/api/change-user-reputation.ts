import axios from "axios";

export const changeUserReputation = async (
  user_id: string | undefined,
  session_owner_id: string,
  reputation_status: string,
) => {
  try {
    const { data } = await axios.post("/api/users/reputation", {
      user_id,
      session_owner_id,
      reputation_status,
    });

    return data;
  } catch (error: any) {
    return error.message;
  }
};
