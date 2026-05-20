async function req(url: string, opts: any = {}) {
  const res = await globalThis.fetch(url, opts);
  let body: any = null;
  try {
    body = await res.json();
  } catch (e) {}
  return { status: res.status, body };
}

async function run() {
  const base = "http://localhost:3001";
  console.log("Starting HTTP smoke tests against", base);

  const regA = await req(`${base}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "httpA@example.com", password: "password123", displayName: "HTTP A" }),
  });
  console.log("register A ->", regA.status, regA.body?.user?.id ?? regA.body);

  const regB = await req(`${base}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "httpB@example.com", password: "password123", displayName: "HTTP B" }),
  });
  console.log("register B ->", regB.status, regB.body?.user?.id ?? regB.body);

  const loginA = await req(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "httpA@example.com", password: "password123" }),
  });
  const tokenA = loginA.body?.token;
  console.log("login A ->", loginA.status, tokenA ? "token received" : loginA.body);

  const loginB = await req(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "httpB@example.com", password: "password123" }),
  });
  const tokenB = loginB.body?.token;
  console.log("login B ->", loginB.status, tokenB ? "token received" : loginB.body);
  const userAId = loginA.body?.user?.id ?? regA.body?.user?.id;
  const userBId = loginB.body?.user?.id ?? regB.body?.user?.id;

  // Create force as A
  const createForce = await req(`${base}/api/forces`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenA}` },
    body: JSON.stringify({ name: "HTTP Force Alpha", unitIds: [] }),
  });
  console.log("create force ->", createForce.status, createForce.body?.id ?? createForce.body);
  const origForceId = createForce.body?.id;

  // Create campaign as A
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

  const createCampaign = await req(`${base}/api/campaigns`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenA}` },
    body: JSON.stringify({ name: "HTTP Campaign", description: "API test", settings }),
  });
  console.log("create campaign ->", createCampaign.status, createCampaign.body?.id ?? createCampaign.body);
  const campaignId = createCampaign.body?.id;

  // Invite B
  const invite = await req(`${base}/api/campaigns/${campaignId}/invite`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenA}` },
    body: JSON.stringify({ userId: userBId }),
  });
  console.log("invite B ->", invite.status, invite.body?.id ?? invite.body);

  // Try to GET campaign as B (should be 403 because invite pending)
  const getAsB = await req(`${base}/api/campaigns/${campaignId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  console.log("GET campaign as B ->", getAsB.status, getAsB.body ?? "no-body");

  // GET as A should be 200
  const getAsA = await req(`${base}/api/campaigns/${campaignId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  console.log("GET campaign as A ->", getAsA.status, getAsA.body?.id ?? getAsA.body);

  // Now have B accept the invitation
  const respond = await req(`${base}/api/campaigns/${campaignId}/respond`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenB}` },
    body: JSON.stringify({ accept: true }),
  });
  console.log("B respond accept ->", respond.status, respond.body?.status ?? respond.body);

  // GET as B should now be allowed
  const getAsBAfter = await req(`${base}/api/campaigns/${campaignId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  console.log("GET campaign as B after accept ->", getAsBAfter.status, getAsBAfter.body?.id ?? getAsBAfter.body);

  // Have B assign A's force to campaign (copies)
  const assign = await req(`${base}/api/forces/${origForceId}/assign`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${tokenB}` },
    body: JSON.stringify({ campaignId }),
  });
  console.log("assign force by B ->", assign.status, assign.body?.id ?? assign.body);

  // List B's pending invites (should be empty after accept)
  const invites = await req(`${base}/api/users/me/invites`, {
    method: "GET",
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  console.log("B pending invites ->", invites.status, invites.body?.length ?? invites.body);

  // List B's notifications
  const notes = await req(`${base}/api/users/me/notifications`, {
    method: "GET",
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  console.log("B notifications ->", notes.status, (notes.body || []).map((n: any) => ({ id: n.id, type: n.type })));

  console.log("HTTP smoke tests completed.");
}

run().catch((e) => {
  console.error("httpSmoke failed:", e);
  process.exitCode = 2;
});
