import { createUserAccount, authenticateUser } from "../server/services/authService";
import { createForce, listForcesForUser, assignForceToCampaign } from "../server/services/forceService";
import { createCampaign, inviteParticipant, listCampaignsForUser } from "../server/services/campaignService";
import { loadStore } from "../server/services/storageService";

async function run() {
  try {
    console.log("Starting smoke test...");

    const a = await createUserAccount("smoke1@example.com", "Smoke One", "password123");
    console.log("Created user A:", a.user.id, a.user.email);

    const b = await createUserAccount("smoke2@example.com", "Smoke Two", "password123");
    console.log("Created user B:", b.user.id, b.user.email);

    const force = await createForce(a.user.id, "Alpha Strike Force", []);
    console.log("Created force:", force.id, force.name);

    const settings = {
      type: "Advanced",
      era: "Late Succession Wars",
      rulesLevel: "Standard",
      forceBVLimit: 1200,
      maxPlayers: 8,
      objectiveControlType: "Binary",
      salariesEnabled: false,
      startingResources: {},
      victoryConditions: ["Capture and Hold"],
    };

    const campaign = await createCampaign(a.user.id, "Smoke Test Campaign", "Ephemeral campaign for smoke testing", settings as any);
    console.log("Created campaign:", campaign.id, campaign.name);

    const invite = await inviteParticipant(campaign.id, a.user.id, b.user.id);
    console.log("Invited user B to campaign, invite id:", invite.id, "status:", invite.status);

    const myCampaigns = await listCampaignsForUser(a.user.id);
    console.log("User A campaigns:", myCampaigns.map((c) => c.id));

    const bCampaigns = await listCampaignsForUser(b.user.id);
    console.log("User B campaigns (should be none yet - pending invite):", bCampaigns.map((c) => c.id));

    const assigned = await assignForceToCampaign(force.id, campaign.id, b.user.id);
    console.log("Assigned force to campaign (copy id):", assigned.id, "owner:", assigned.ownerId, "campaign:", assigned.campaignId);

    const bForces = await listForcesForUser(b.user.id);
    console.log("User B forces after assignment:", bForces.map((f) => ({ id: f.id, name: f.name, origin: f.origin })));

    const store = await loadStore();
    console.log("Store summary:", {
      users: store.users.length,
      campaigns: store.campaigns.length,
      participants: store.campaignParticipants.length,
      forces: store.forces.length,
      forceUnits: store.forceUnits.length,
    });

    console.log("Smoke test completed successfully.");
  } catch (err) {
    console.error("Smoke test failed:", err instanceof Error ? err.message : err);
    process.exitCode = 2;
  }
}

run();
