export const fetchGuild = async (guildId: number) => {
  const guildResponse = await fetch(`https://api.guild.xyz/v2/guilds/guild-page/${guildId}`);
  const guildData = await guildResponse.json();

  const formsResponse = await fetch(`https://api.guild.xyz/v2/guilds/${guildId}/forms`);
  const formsData = await formsResponse.json();
  const filteredForms = formsData.filter((form: any) => form.fields);
  
  return {
    ...guildData,
    form: filteredForms,
  };
};