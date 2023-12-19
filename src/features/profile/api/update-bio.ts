import axios from "axios";

import { IBio } from "..";

export const updateBio = async (profile: IBio, userId: string) => {
  if (!profile) return;
  try {
    const { data } = await axios.post(`/api/users/${userId}`, {
      user_id: userId,
      detail: profile?.detail,
    });

    return data;
  } catch (error: any) {
    return error.Message;
  }
};
