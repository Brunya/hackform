export const addFormToGuild = async (signerFunction, formPayload) => {
  console.log("form apiii", formPayload);
  // Step 1: Create Guild
  const payload = {
    guild: {
      name: formPayload.name,
      urlName: formPayload.name.toLowerCase().replace(/\s/g, "-"),
      imageUrl: "https://cdn-icons-png.flaticon.com/512/1484/1484799.png",
      theme: { backgroundImage: "https://cdn.midjourney.com/9105c1c1-56d4-49f2-8141-e490b4a28d55/0_2.png" },
      roles: [
        {
          name: "Member",
          imageUrl: "",
          description: formPayload.description,
          requirements: [
            {
              isNegated: false,
              visibility: "PUBLIC",
              type: "FREE",
              data: {},
            },
          ],
        },
      ],
      contacts: [{ type: "EMAIL", contact: "bruno@guild.xyz" }],
    },
    form: {
      name: formPayload.name,
      description: formPayload.description,
      isEditable: false,
      fields: formPayload.fields,
    },
  };

  const signedGuildPayload = await signerFunction(payload.guild);
  const guildResponse = await fetch(`https://api.guild.xyz/v2/guilds/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(signedGuildPayload),
  });

  if (!guildResponse.ok) {
    throw new Error(`Failed to create guild: ${await guildResponse.text()}`);
  }

  const guildData = await guildResponse.json();
  const guildId = guildData.id;
  const roleId = guildData.roles[0].id;

  // Step 2: Create Form
  const signedFormPayload = await signerFunction(payload.form);
  const formResponse = await fetch(`https://api.guild.xyz/v2/guilds/${guildId}/forms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(signedFormPayload),
  });

  if (!formResponse.ok) {
    throw new Error(`Failed to create form: ${await formResponse.text()}`);
  }

  const formData = await formResponse.json();
  const formId = formData.id;

  // Step 3: Create Role Platform
  const rolePlatformPayload = {
    guildPlatform: {
      platformName: "FORM",
      platformGuildId: `form-${formId}`,
      platformGuildData: { formId },
    },
    isNew: true,
    visibility: "PUBLIC",
  };

  const signedRolePlatformPayload = await signerFunction(rolePlatformPayload);
  const rolePlatformResponse = await fetch(
    `https://api.guild.xyz/v2/guilds/${guildId}/roles/${roleId}/role-platforms`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signedRolePlatformPayload),
    }
  );

  if (!rolePlatformResponse.ok) {
    throw new Error(`Failed to create role platform: ${await rolePlatformResponse.text()}`);
  }

  return guildData;
};

export const fillForm = async (guildId, formId, fieldId, value, signerFunction) => {
  const submissionPayload = {
    submissionAnswers: [
      {
        fieldId: fieldId,
        value: value,
      },
    ],
  };

  try {
    const signedSubmissionPayload = await signerFunction(submissionPayload);
    const submissionResponse = await fetch(
      `https://api.guild.xyz/v2/guilds/${guildId}/forms/${formId}/user-submissions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signedSubmissionPayload),
      }
    );

    if (!submissionResponse.ok) {
      throw new Error(`Failed to submit form: ${await submissionResponse.text()}`);
    }

    return submissionResponse.json();
  } catch (error) {
    console.error("Error in fillForm:", error);
    throw error;
  }
};
