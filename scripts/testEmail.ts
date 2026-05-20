async function run() {
  // Use mock mode for safe local testing
  process.env.MAIL_MODE = "mock";

  const { sendInviteEmail } = await import("../server/services/emailService");

  const campaign = {
    id: "test-camp-1",
    ownerId: "owner-1",
    name: "Test Campaign",
    description: "A campaign for testing emails",
    status: "Setup",
    settings: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const ok = await sendInviteEmail("test@example.local", "Test User", campaign as any, "Inviter");
  console.log("sendInviteEmail returned:", ok);
}

run().catch((e) => {
  console.error("testEmail failed:", e);
  process.exitCode = 2;
});
