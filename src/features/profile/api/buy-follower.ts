import axios from "axios";

export const buyfollower = async (
  user_id: string,
  session_owner_id: string,
  amount: number,
) => {
  try {
    const { data } = await axios.put("/api/users/buyFollower", {
      user_id,
      session_owner_id,
      amount,
    });

    return data;
  } catch (error: any) {
    return error.message;
  }
};
