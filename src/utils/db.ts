import dbData from "../db.json";

interface Guild {
  id: number;
  name: string;
  urlName: string;
  imageUrl: string;
}

export const getGuilds = async (): Promise<Guild[]> => {
  try {
    const response = await fetch("http://localhost:3001/guilds");

    if (!response.ok) {
      throw new Error("Failed to fetch guilds");
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("Invalid response format");
    }

    return data;
  } catch (error) {
    console.error("Error fetching guilds:", error);
    throw error;
  }
};

export const addGuild = async (guild: Guild): Promise<void> => {
  try {
    const response = await fetch("http://localhost:3001/guilds", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(guild),
    });

    if (!response.ok) {
      throw new Error("Failed to add guild");
    }
  } catch (error) {
    console.error("Error adding guild:", error);
    throw error;
  }
};
