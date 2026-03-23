import axios from "axios";

export const fetchRemoteJobs = async () => {
  try {
    const response = await axios.get("https://remoteok.com/api");

    return response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
};