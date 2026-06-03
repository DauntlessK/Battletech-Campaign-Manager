import "./App.css";
import { useEffect, useState } from "react";
import { X, ChevronRight } from "lucide-react";
import Header from "./components/AppHeader";
import PageTitle from "./components/PageTitle";
import Footer from "./components/Footer";
import planetProjectionImage from "./assets/Planet-Projection.png";
import AccountPage from "./pages/AccountPage";
import CampaignsPage from "./pages/CampaignsPage";
import ForcesPage from "./pages/ForcesPage";
import BattlesPage from "./pages/BattlesPage";
import UnitsPage from "./pages/UnitsPage";
import { navItems, aboutChildren } from "./constants/appOptions";
import { normalizeCatalogUnit } from "./utils/unitNormalization";
import type {
  PageKey,
  UnitType,
  Battle,
  UnitPanelMode,
  SortMode,
  CriticalSlot,
  UnitLocation,
  UnitWeapon,
  Unit,
  User,
  Campaign,
  CampaignSettings,
  Force,
  ForceUnit,
  FriendRequestSummary,
  FriendSummary,
  PendingInvite,
  NotificationItem,
  AuthMode,
} from "./types/app";

export default function App() {
  const [activePage, setActivePage] = useState<PageKey>("landing");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [unitsLoading, setUnitsLoading] = useState(true);
  const [unitsError, setUnitsError] = useState<string | null>(null);
  const [selectedUnitLoading, setSelectedUnitLoading] = useState(false);
  const [selectedUnitError, setSelectedUnitError] = useState<string | null>(
    null,
  );
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authDisplayName, setAuthDisplayName] = useState("");

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(false);
  const [campaignsError, setCampaignsError] = useState<string | null>(null);
  const [campaignFormLoading, setCampaignFormLoading] = useState(false);
  const [campaignFormError, setCampaignFormError] = useState<string | null>(
    null,
  );
  const [campaignUpdateLoading, setCampaignUpdateLoading] = useState(false);
  const [campaignUpdateError, setCampaignUpdateError] = useState<string | null>(
    null,
  );
  const [campaignForceLoading, setCampaignForceLoading] = useState(false);
  const [campaignForceError, setCampaignForceError] = useState<string | null>(
    null,
  );
  const [campaignFocusId, setCampaignFocusId] = useState<string | null>(null);
  const [forces, setForces] = useState<Force[]>([]);
  const [forcesLoading, setForcesLoading] = useState(false);
  const [forcesError, setForcesError] = useState<string | null>(null);
  const [forceName, setForceName] = useState("");
  const [forceAssignmentTarget, setForceAssignmentTarget] =
    useState<Force | null>(null);
  const [forceAssignmentLoading, setForceAssignmentLoading] = useState(false);
  const [forceAssignmentError, setForceAssignmentError] = useState<
    string | null
  >(null);
  const [forceDescription, setForceDescription] = useState("");
  const [forceEra, setForceEra] = useState("Star League");
  const [forceRulesLevel, setForceRulesLevel] = useState("Standard");
  const [forceBVLimit, setForceBVLimit] = useState<number>(15000);
  const [forceFaction, setForceFaction] = useState("Lyran Commonwealth");
  const [forceForConquest, setForceForConquest] = useState(false);
  const [forceCombatTeamCount, setForceCombatTeamCount] = useState<number>(3);
  const [forceCombatTeamBV, setForceCombatTeamBV] = useState<number>(5000);
  const [forceFormLoading, setForceFormLoading] = useState(false);
  const [forceFormError, setForceFormError] = useState<string | null>(null);
  const [invites, setInvites] = useState<PendingInvite[]>([]);
  const [friends, setFriends] = useState<FriendSummary[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequestSummary[]>(
    [],
  );
  const [friendActionError, setFriendActionError] = useState<string | null>(
    null,
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [accountDataLoading, setAccountDataLoading] = useState(false);
  const [battles, setBattles] = useState<Battle[]>([]);
  const [battleCampaignId, setBattleCampaignId] = useState<string>("");
  const [battleFormDate, setBattleFormDate] = useState<string>(
    new Date().toISOString().slice(0, 10),
  );
  const [battleFormLocation, setBattleFormLocation] = useState<string>("");
  const [battleFormSummary, setBattleFormSummary] = useState<string>("");
  const [battleFormLoading, setBattleFormLoading] = useState(false);
  const [battleFormError, setBattleFormError] = useState<string | null>(null);
  const [battleLoading, setBattleLoading] = useState(false);
  const [battleError, setBattleError] = useState<string | null>(null);
  const [scrollToNotificationsSignal, setScrollToNotificationsSignal] =
    useState(0);
  const [campaignInvitePanelSignal, setCampaignInvitePanelSignal] = useState(0);

  const AUTH_TOKEN_KEY = "bcm-auth-token";

  const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY);
  const saveAuthToken = (token: string) =>
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  const clearAuthToken = () => localStorage.removeItem(AUTH_TOKEN_KEY);

  const authHeaders = () => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleAuthSuccess = (
    user: User,
    token: string,
    successMessage: string,
  ) => {
    saveAuthToken(token);
    setAuthUser(user);
    setAuthError(null);
    setAuthSuccess(successMessage);
    setAuthEmail("");
    setAuthPassword("");
    setAuthDisplayName("");
  };

  const fetchCurrentUser = async () => {
    const token = getAuthToken();
    if (!token) {
      return;
    }

    setAuthLoading(true);
    try {
      const response = await fetch("/api/users/me", {
        headers: {
          ...authHeaders(),
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        clearAuthToken();
        setAuthUser(null);
        return;
      }

      const data = (await response.json()) as User;
      setAuthUser(data);
    } catch (error) {
      console.error("Failed to load current user", error);
      clearAuthToken();
      setAuthUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const submitAuthForm = async (mode: AuthMode) => {
    setAuthLoading(true);
    setAuthError(null);
    setAuthSuccess(null);

    const endpoint =
      mode === "register" ? "/api/auth/register" : "/api/auth/login";
    const payload: Record<string, string> = {
      email: authEmail,
      password: authPassword,
    };
    if (mode === "register") {
      payload.displayName = authDisplayName;
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || `Unable to ${mode}.`);
      }

      handleAuthSuccess(
        result.user,
        result.token,
        mode === "register"
          ? "Account created successfully."
          : "Signed in successfully.",
      );
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : "Authentication failed.",
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    setAuthLoading(true);
    const token = getAuthToken();

    try {
      if (token) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      clearAuthToken();
      setAuthUser(null);
      setCampaigns([]);
      setForces([]);
      setInvites([]);
      setFriends([]);
      setFriendRequests([]);
      setNotifications([]);
      setAuthLoading(false);
      setAuthSuccess("You have been signed out.");
    }
  };

  const fetchCampaigns = async () => {
    setCampaignsLoading(true);
    setCampaignsError(null);
    try {
      const response = await fetch("/api/campaigns", {
        headers: {
          ...authHeaders(),
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || "Unable to load campaigns.");
      }
      const data = (await response.json()) as Campaign[];
      setCampaigns(data);
    } catch (error) {
      setCampaignsError(
        error instanceof Error ? error.message : "Unable to load campaigns.",
      );
    } finally {
      setCampaignsLoading(false);
    }
  };

  const createCampaignForUser = async (payload: {
    name: string;
    description?: string;
    settings: CampaignSettings;
  }): Promise<Campaign | null> => {
    setCampaignFormLoading(true);
    setCampaignFormError(null);

    try {
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: {
          ...authHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(result?.error || "Unable to create campaign.");
      }

      const createdCampaign = result as Campaign;
      setCampaigns((current) => [createdCampaign, ...current]);
      return createdCampaign;
    } catch (error) {
      setCampaignFormError(
        error instanceof Error ? error.message : "Unable to create campaign.",
      );
      return null;
    } finally {
      setCampaignFormLoading(false);
    }
  };

  const replaceCampaignInState = (updatedCampaign: Campaign) => {
    setCampaigns((current) =>
      current.map((campaign) =>
        campaign.id === updatedCampaign.id ? updatedCampaign : campaign,
      ),
    );
  };

  const updateCampaignForUser = async (
    campaignId: string,
    payload: {
      name?: string;
      description?: string;
      settings?: Partial<CampaignSettings>;
    },
  ): Promise<Campaign | null> => {
    setCampaignUpdateLoading(true);
    setCampaignUpdateError(null);

    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: "PATCH",
        headers: {
          ...authHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(result?.error || "Unable to update campaign.");
      }

      const updatedCampaign = result as Campaign;
      replaceCampaignInState(updatedCampaign);
      return updatedCampaign;
    } catch (error) {
      setCampaignUpdateError(
        error instanceof Error ? error.message : "Unable to update campaign.",
      );
      return null;
    } finally {
      setCampaignUpdateLoading(false);
    }
  };


  const beginCampaignForUser = async (
    campaignId: string,
  ): Promise<Campaign | null> => {
    setCampaignUpdateLoading(true);
    setCampaignUpdateError(null);

    try {
      const response = await fetch(`/api/campaigns/${campaignId}/begin`, {
        method: "POST",
        headers: {
          ...authHeaders(),
          "Content-Type": "application/json",
        },
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(result?.error || "Unable to begin campaign.");
      }

      const updatedCampaign = result as Campaign;
      replaceCampaignInState(updatedCampaign);
      void fetchForces();
      return updatedCampaign;
    } catch (error) {
      setCampaignUpdateError(
        error instanceof Error ? error.message : "Unable to begin campaign.",
      );
      return null;
    } finally {
      setCampaignUpdateLoading(false);
    }
  };

  const assignForceToCampaignForUser = async (
    campaignId: string,
    forceId: string | null,
  ): Promise<Campaign | null> => {
    setCampaignForceLoading(true);
    setCampaignForceError(null);

    try {
      const response = await fetch(`/api/campaigns/${campaignId}/force`, {
        method: "PATCH",
        headers: {
          ...authHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ forceId }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(result?.error || "Unable to assign force to campaign.");
      }

      const updatedCampaign = result as Campaign;
      replaceCampaignInState(updatedCampaign);
      return updatedCampaign;
    } catch (error) {
      setCampaignForceError(
        error instanceof Error
          ? error.message
          : "Unable to assign force to campaign.",
      );
      return null;
    } finally {
      setCampaignForceLoading(false);
    }
  };

  const fetchForces = async () => {
    setForcesLoading(true);
    setForcesError(null);
    try {
      const response = await fetch("/api/forces", {
        headers: {
          ...authHeaders(),
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || "Unable to load forces.");
      }
      const data = (await response.json()) as Force[];
      setForces(data);
    } catch (error) {
      setForcesError(
        error instanceof Error ? error.message : "Unable to load forces.",
      );
    } finally {
      setForcesLoading(false);
    }
  };

  const replaceForceInState = (updatedForce: Force) => {
    setForces((current) =>
      current.map((force) =>
        force.id === updatedForce.id ? updatedForce : force,
      ),
    );
    setForceAssignmentTarget((current) =>
      current?.id === updatedForce.id ? updatedForce : current,
    );
  };

  const assignUnitToForce = async (
    unitId: string,
    forceId?: string,
    teamNumber?: number,
  ) => {
    const targetForceId = forceId ?? forceAssignmentTarget?.id;
    if (!targetForceId) {
      setForceAssignmentError("Select a force before adding units.");
      return;
    }

    const targetForce =
      forces.find((force) => force.id === targetForceId) ??
      forceAssignmentTarget;
    if (targetForce?.forConquest && !teamNumber) {
      setForceAssignmentError(
        "Choose which team this unit should be added to.",
      );
      return;
    }

    setForceAssignmentLoading(true);
    setForceAssignmentError(null);

    try {
      const response = await fetch(`/api/forces/${targetForceId}/units`, {
        method: "POST",
        headers: {
          ...authHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ baseUnitId: unitId, teamNumber }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || "Unable to add unit to force.");
      }

      replaceForceInState(result as Force);
    } catch (error) {
      setForceAssignmentError(
        error instanceof Error ? error.message : "Unable to add unit to force.",
      );
    } finally {
      setForceAssignmentLoading(false);
    }
  };

  const updateForceDetails = async (
    forceId: string,
    updates: { name?: string; description?: string; forceUnits?: ForceUnit[] },
  ) => {
    const response = await fetch(`/api/forces/${forceId}`, {
      method: "PATCH",
      headers: {
        ...authHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok)
      throw new Error(result?.error || "Unable to update force.");
    replaceForceInState(result as Force);
  };

  const deleteForceById = async (forceId: string) => {
    const response = await fetch(`/api/forces/${forceId}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!response.ok) {
      const result = await response.json().catch(() => null);
      throw new Error(result?.error || "Unable to delete force.");
    }
    setForces((current) => current.filter((force) => force.id !== forceId));
    setForceAssignmentTarget((current) =>
      current?.id === forceId ? null : current,
    );
  };

  const updateForceUnit = async (
    forceId: string,
    forceUnitId: string,
    updates: {
      teamNumber?: number;
      sortOrder?: number;
      pilotName?: string;
      gunnery?: number;
      piloting?: number;
    },
  ) => {
    const response = await fetch(
      `/api/forces/${forceId}/units/${forceUnitId}`,
      {
        method: "PATCH",
        headers: {
          ...authHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      },
    );
    const result = await response.json().catch(() => null);
    if (!response.ok)
      throw new Error(result?.error || "Unable to update force unit.");
    replaceForceInState(result as Force);
  };

  const sendFriendRequest = async (friendCode: string) => {
    setFriendActionError(null);
    const response = await fetch("/api/users/me/friend-requests", {
      method: "POST",
      headers: {
        ...authHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ friendCode }),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok) {
      const message = result?.error || "Unable to send friend request.";
      setFriendActionError(message);
      throw new Error(message);
    }
    await fetchAccountExtras();
  };

  const respondToFriendRequest = async (requestId: string, accept: boolean) => {
    setFriendActionError(null);
    const response = await fetch(
      `/api/users/me/friend-requests/${requestId}/respond`,
      {
        method: "POST",
        headers: {
          ...authHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accept }),
      },
    );
    const result = await response.json().catch(() => null);
    if (!response.ok) {
      const message = result?.error || "Unable to respond to friend request.";
      setFriendActionError(message);
      throw new Error(message);
    }
    await fetchAccountExtras();
  };

  const clearNotifications = async () => {
    try {
      const response = await fetch("/api/users/me/notifications/clear", {
        method: "POST",
        headers: {
          ...authHeaders(),
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || "Unable to clear notifications.");
      }
      setNotifications([]);
    } catch (error) {
      setAuthError(
        error instanceof Error
          ? error.message
          : "Unable to clear notifications.",
      );
    }
  };

  const openCampaignInvitations = () => {
    setActivePage("myCampaigns");
    setCampaignInvitePanelSignal((value) => value + 1);
  };

  const respondToCampaignInvitation = async (
    campaignId: string,
    accept: boolean,
  ): Promise<Campaign | null> => {
    setCampaignUpdateError(null);
    setCampaignUpdateLoading(true);
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/respond`, {
        method: "POST",
        headers: {
          ...authHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accept }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok)
        throw new Error(
          result?.error || "Unable to respond to campaign invitation.",
        );
      const updatedCampaign = result as Campaign;
      if (accept) {
        setCampaigns((current) => {
          const exists = current.some(
            (campaign) => campaign.id === updatedCampaign.id,
          );
          return exists
            ? current.map((campaign) =>
                campaign.id === updatedCampaign.id ? updatedCampaign : campaign,
              )
            : [updatedCampaign, ...current];
        });
      } else {
        setCampaigns((current) =>
          current.filter((campaign) => campaign.id !== campaignId),
        );
      }
      setInvites((current) =>
        current.filter((invite) => invite.campaign.id !== campaignId),
      );
      setNotifications((current) =>
        current.filter(
          (note) =>
            !(
              note.type === "campaign.invite" &&
              note.payload?.campaignId === campaignId
            ),
        ),
      );
      return updatedCampaign;
    } catch (error) {
      setCampaignUpdateError(
        error instanceof Error
          ? error.message
          : "Unable to respond to campaign invitation.",
      );
      return null;
    } finally {
      setCampaignUpdateLoading(false);
    }
  };

  const inviteFriendToCampaign = async (
    campaignId: string,
    friendUserId: string,
  ): Promise<Campaign | null> => {
    setCampaignUpdateError(null);
    setCampaignUpdateLoading(true);
    try {
      const response = await fetch(
        `/api/campaigns/${campaignId}/invite-friend`,
        {
          method: "POST",
          headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ friendUserId }),
        },
      );
      const result = await response.json().catch(() => null);
      if (!response.ok)
        throw new Error(
          result?.error || "Unable to invite friend to campaign.",
        );
      replaceCampaignInState(result as Campaign);
      return result as Campaign;
    } catch (error) {
      setCampaignUpdateError(
        error instanceof Error
          ? error.message
          : "Unable to invite friend to campaign.",
      );
      return null;
    } finally {
      setCampaignUpdateLoading(false);
    }
  };

  const uninviteCampaignPlayer = async (
    campaignId: string,
    participantUserId: string,
  ): Promise<Campaign | null> => {
    setCampaignUpdateError(null);
    setCampaignUpdateLoading(true);
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/uninvite`, {
        method: "POST",
        headers: {
          ...authHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ participantUserId }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok)
        throw new Error(result?.error || "Unable to remove campaign invite.");
      replaceCampaignInState(result as Campaign);
      return result as Campaign;
    } catch (error) {
      setCampaignUpdateError(
        error instanceof Error
          ? error.message
          : "Unable to remove campaign invite.",
      );
      return null;
    } finally {
      setCampaignUpdateLoading(false);
    }
  };

  const fetchBattlesForCampaign = async (campaignId: string) => {
    setBattleLoading(true);
    setBattleError(null);
    try {
      const response = await fetch(
        `/api/battles/campaigns/${campaignId}/battles`,
        {
          headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || "Unable to load battles.");
      }
      const data = (await response.json()) as Battle[];
      setBattles(data);
    } catch (error) {
      setBattleError(
        error instanceof Error ? error.message : "Unable to load battles.",
      );
    } finally {
      setBattleLoading(false);
    }
  };

  const fetchAccountExtras = async () => {
    setAccountDataLoading(true);
    setAuthError(null);
    try {
      const [
        inviteResponse,
        notificationResponse,
        friendsResponse,
        friendRequestsResponse,
      ] = await Promise.all([
        fetch("/api/users/me/invites", {
          headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
          },
        }),
        fetch("/api/users/me/notifications", {
          headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
          },
        }),
        fetch("/api/users/me/friends", {
          headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
          },
        }),
        fetch("/api/users/me/friend-requests", {
          headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
          },
        }),
      ]);

      if (!inviteResponse.ok) {
        const body = await inviteResponse.json().catch(() => null);
        throw new Error(body?.error || "Unable to load invites.");
      }
      if (!notificationResponse.ok) {
        const body = await notificationResponse.json().catch(() => null);
        throw new Error(body?.error || "Unable to load notifications.");
      }
      if (!friendsResponse.ok) {
        const body = await friendsResponse.json().catch(() => null);
        throw new Error(body?.error || "Unable to load friends.");
      }
      if (!friendRequestsResponse.ok) {
        const body = await friendRequestsResponse.json().catch(() => null);
        throw new Error(body?.error || "Unable to load friend requests.");
      }

      const inviteData = (await inviteResponse.json()) as PendingInvite[];
      const notificationData =
        (await notificationResponse.json()) as NotificationItem[];
      const friendsData = (await friendsResponse.json()) as FriendSummary[];
      const friendRequestsData =
        (await friendRequestsResponse.json()) as FriendRequestSummary[];
      setInvites(inviteData);
      setNotifications(notificationData);
      setFriends(friendsData);
      setFriendRequests(friendRequestsData);
    } catch (error) {
      console.error("Failed to load account extras", error);
    } finally {
      setAccountDataLoading(false);
    }
  };

  useEffect(() => {
    if (authUser) {
      fetchCampaigns();
      fetchForces();
      fetchAccountExtras();
    } else {
      setCampaigns([]);
      setForces([]);
      setInvites([]);
      setFriends([]);
      setFriendRequests([]);
      setNotifications([]);
    }
  }, [authUser]);

  useEffect(() => {
    if (campaigns.length > 0 && !battleCampaignId) {
      setBattleCampaignId(campaigns[0].id);
    }
  }, [campaigns, battleCampaignId]);

  useEffect(() => {
    if (activePage === "battles" && battleCampaignId) {
      fetchBattlesForCampaign(battleCampaignId);
    }
  }, [activePage, battleCampaignId]);

  // Poll for notification updates every 10 seconds
  useEffect(() => {
    if (!authUser) return;

    const pollNotifications = async () => {
      try {
        const response = await fetch("/api/users/me/notifications", {
          headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = (await response.json()) as NotificationItem[];
          setNotifications(data);
        }
      } catch (error) {
        console.error("Failed to poll notifications", error);
      }
    };

    const pollInterval = setInterval(pollNotifications, 10000); // Poll every 10 seconds

    return () => clearInterval(pollInterval);
  }, [authUser]);

  useEffect(() => {
    const loadUnits = async () => {
      try {
        setUnitsLoading(true);
        setUnitsError(null);

        const response = await fetch("/api/units");

        if (!response.ok) {
          const errorBody = await response.json().catch(() => null);
          throw new Error(
            errorBody?.message ??
              errorBody?.error ??
              `Failed to load units: ${response.status}`,
          );
        }

        const data = (await response.json()) as Unit[];
        setUnits(data.map(normalizeCatalogUnit));
      } catch (error) {
        setUnitsError(
          error instanceof Error ? error.message : "Failed to load units",
        );
      } finally {
        setUnitsLoading(false);
      }
    };

    loadUnits();
  }, []);

  useEffect(() => {
    if (!selectedUnitId) {
      setSelectedUnit(null);
      setSelectedUnitError(null);
      return;
    }

    const loadSelectedUnit = async () => {
      try {
        setSelectedUnitLoading(true);
        setSelectedUnitError(null);

        const response = await fetch(`/api/units/${selectedUnitId}`);

        if (!response.ok) {
          const errorBody = await response.json().catch(() => null);
          throw new Error(
            errorBody?.message ??
              errorBody?.error ??
              `Failed to load unit: ${response.status}`,
          );
        }

        const data = (await response.json()) as Unit;
        setSelectedUnit(normalizeCatalogUnit(data));
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load selected unit";
        console.error(error);
        setSelectedUnit(null);
        setSelectedUnitError(message);
      } finally {
        setSelectedUnitLoading(false);
      }
    };

    loadSelectedUnit();
  }, [selectedUnitId]);

  const navigate = (page: PageKey) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100">
      <Header
        activePage={activePage}
        onNavigate={navigate}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        authUser={authUser}
        unreadNotifications={notifications.filter((note) => !note.read).length}
        onOpenNotifications={() => {
          navigate("myAccount");
          setScrollToNotificationsSignal((s) => s + 1);
        }}
        onLogout={handleLogout}
      />

      <main className="w-full max-w-none px-3 pb-10 pt-4 sm:px-5 2xl:px-8">
        {activePage === "landing" && <LandingPage onNavigate={navigate} />}
        {activePage === "about" && <AboutPage onNavigate={navigate} />}
        {activePage === "faq" && <FaqPage />}
        {activePage === "campaignTypes" && <CampaignTypesPage />}
        {activePage === "guide" && (
          <PlaceholderPage title="Guide" eyebrow="How to play" />
        )}
        {activePage === "units" && (
          <>
            {unitsLoading && (
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 text-zinc-400">
                Loading units...
              </div>
            )}

            {unitsError && (
              <div className="rounded-3xl border border-red-500/40 bg-red-950/30 p-6 text-red-200">
                {unitsError}
              </div>
            )}

            {!unitsLoading && !unitsError && (
              <>
                {selectedUnitLoading && (
                  <div className="mb-4 rounded-3xl border border-lime-400/20 bg-lime-400/10 p-4 text-sm font-semibold text-lime-200">
                    Loading selected unit...
                  </div>
                )}

                {selectedUnitError && (
                  <div className="mb-4 rounded-3xl border border-red-500/40 bg-red-950/30 p-4 text-sm text-red-200">
                    {selectedUnitError}
                  </div>
                )}

                <UnitsPage
                  units={units}
                  selectedUnit={selectedUnit}
                  forces={forces}
                  selectedForceForUnitAdd={forceAssignmentTarget}
                  onSelectUnit={setSelectedUnitId}
                  onClearSelectedUnit={() => setSelectedUnitId(null)}
                  onSelectForceForUnitAdd={setForceAssignmentTarget}
                  onAddUnitToForce={assignUnitToForce}
                  addUnitLoading={forceAssignmentLoading}
                  addUnitError={forceAssignmentError}
                />
              </>
            )}
          </>
        )}
        {activePage === "myForces" && (
          <ForcesPage
            authUser={authUser}
            forces={forces}
            units={units}
            loading={forcesLoading}
            error={forcesError}
            forceName={forceName}
            forceDescription={forceDescription}
            forceEra={forceEra}
            forceRulesLevel={forceRulesLevel}
            forceBVLimit={forceBVLimit}
            forceFaction={forceFaction}
            forceForConquest={forceForConquest}
            forceCombatTeamCount={forceCombatTeamCount}
            forceCombatTeamBV={forceCombatTeamBV}
            forceFormLoading={forceFormLoading}
            forceFormError={forceFormError}
            onForceNameChange={setForceName}
            onForceDescriptionChange={setForceDescription}
            onForceEraChange={setForceEra}
            onForceRulesLevelChange={setForceRulesLevel}
            onForceBVLimitChange={setForceBVLimit}
            onForceFactionChange={setForceFaction}
            onForceForConquestChange={(isConquest: boolean) => {
              setForceForConquest(isConquest);
              if (isConquest && forceCombatTeamCount === 0) {
                setForceCombatTeamCount(3);
                setForceCombatTeamBV(5000);
              }
            }}
            onForceCombatTeamCountChange={setForceCombatTeamCount}
            onForceCombatTeamBVChange={setForceCombatTeamBV}
            onBeginForceUnitAssignment={(force: Force) => {
              setForceAssignmentTarget(force);
              navigate("units");
            }}
            onUpdateForce={updateForceDetails}
            onDeleteForce={deleteForceById}
            onOpenCampaignForForce={(campaignId: string) => {
              setCampaignFocusId(campaignId);
              navigate("myCampaigns");
            }}
            onCreateForce={async () => {
              if (!forceName.trim()) {
                setForceFormError("Force name is required.");
                return false;
              }

              setForceFormLoading(true);
              setForceFormError(null);

              try {
                const response = await fetch("/api/forces", {
                  method: "POST",
                  headers: {
                    ...authHeaders(),
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    name: forceName,
                    description: forceDescription,
                    era: forceEra,
                    rulesLevel: forceRulesLevel,
                    totalBV: forceBVLimit,
                    faction: forceFaction,
                    forConquest: forceForConquest,
                    combatTeamCount: forceForConquest
                      ? forceCombatTeamCount
                      : undefined,
                    combatTeamBV: forceForConquest
                      ? forceCombatTeamBV
                      : undefined,
                  }),
                });

                const result = await response.json();
                if (!response.ok) {
                  throw new Error(result?.error || "Unable to create force.");
                }

                setForces((current) => [...current, result]);
                setForceName("");
                setForceDescription("");
                setForceEra("Star League");
                setForceRulesLevel("Standard");
                setForceBVLimit(15000);
                setForceFaction("Lyran Commonwealth");
                setForceForConquest(false);
                setForceCombatTeamCount(3);
                setForceCombatTeamBV(5000);
                return true;
              } catch (error) {
                setForceFormError(
                  error instanceof Error
                    ? error.message
                    : "Unable to create force.",
                );
                return false;
              } finally {
                setForceFormLoading(false);
              }
            }}
          />
        )}
        {activePage === "myCampaigns" && (
          <CampaignsPage
            authUser={authUser}
            campaigns={campaigns}
            forces={forces}
            friends={friends}
            loading={campaignsLoading}
            error={campaignsError}
            createLoading={campaignFormLoading}
            createError={campaignFormError}
            updateLoading={campaignUpdateLoading}
            updateError={campaignUpdateError}
            assignForceLoading={campaignForceLoading}
            assignForceError={campaignForceError}
            onCreateCampaign={createCampaignForUser}
            onUpdateCampaign={updateCampaignForUser}
            onAssignForceToCampaign={assignForceToCampaignForUser}
            onBeginCampaign={beginCampaignForUser}
            invites={invites}
            openInvitesSignal={campaignInvitePanelSignal}
            focusCampaignId={campaignFocusId}
            onCampaignFocusConsumed={() => setCampaignFocusId(null)}
            onInviteFriendToCampaign={inviteFriendToCampaign}
            onUninviteCampaignPlayer={uninviteCampaignPlayer}
            onRespondToCampaignInvitation={respondToCampaignInvitation}
          />
        )}
        {activePage === "battles" && (
          <BattlesPage
            authUser={authUser}
            campaigns={campaigns}
            battles={battles}
            loading={battleLoading}
            error={battleError}
            selectedCampaignId={battleCampaignId}
            onSelectCampaign={setBattleCampaignId}
            battleFormDate={battleFormDate}
            onBattleFormDateChange={setBattleFormDate}
            battleFormLocation={battleFormLocation}
            onBattleFormLocationChange={setBattleFormLocation}
            battleFormSummary={battleFormSummary}
            onBattleFormSummaryChange={setBattleFormSummary}
            battleFormLoading={battleFormLoading}
            battleFormError={battleFormError}
            onCreateBattle={async () => {
              if (!battleCampaignId) {
                setBattleFormError(
                  "Select a campaign before creating a battle.",
                );
                return;
              }
              setBattleFormLoading(true);
              setBattleFormError(null);
              try {
                const response = await fetch(
                  `/api/battles/campaigns/${battleCampaignId}/battles`,
                  {
                    method: "POST",
                    headers: {
                      ...authHeaders(),
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      date: battleFormDate,
                      location: battleFormLocation,
                      summary: battleFormSummary,
                    }),
                  },
                );
                const result = await response.json();
                if (!response.ok) {
                  throw new Error(result?.error || "Unable to create battle.");
                }
                setBattles((current) => [...current, result]);
                setBattleFormLocation("");
                setBattleFormSummary("");
              } catch (error) {
                setBattleFormError(
                  error instanceof Error
                    ? error.message
                    : "Unable to create battle.",
                );
              } finally {
                setBattleFormLoading(false);
              }
            }}
            onConfirmBattle={async (battleId) => {
              try {
                const response = await fetch(
                  `/api/battles/${battleId}/confirm`,
                  {
                    method: "POST",
                    headers: {
                      ...authHeaders(),
                      "Content-Type": "application/json",
                    },
                  },
                );
                const result = await response.json();
                if (!response.ok) {
                  throw new Error(result?.error || "Unable to confirm battle.");
                }
                setBattles((current) =>
                  current.map((battle) =>
                    battle.id === battleId ? result : battle,
                  ),
                );
              } catch (error) {
                setBattleError(
                  error instanceof Error
                    ? error.message
                    : "Unable to confirm battle.",
                );
              }
            }}
            onDeleteBattle={async (battleId) => {
              try {
                const response = await fetch(`/api/battles/${battleId}`, {
                  method: "DELETE",
                  headers: {
                    ...authHeaders(),
                    "Content-Type": "application/json",
                  },
                });
                if (!response.ok) {
                  const body = await response.json().catch(() => null);
                  throw new Error(body?.error || "Unable to delete battle.");
                }
                setBattles((current) =>
                  current.filter((battle) => battle.id !== battleId),
                );
              } catch (error) {
                setBattleError(
                  error instanceof Error
                    ? error.message
                    : "Unable to delete battle.",
                );
              }
            }}
          />
        )}
        {activePage === "myAccount" && (
          <AccountPage
            user={authUser}
            mode={authMode}
            onToggleMode={() =>
              setAuthMode(authMode === "login" ? "register" : "login")
            }
            onChangeMode={setAuthMode}
            email={authEmail}
            password={authPassword}
            displayName={authDisplayName}
            loading={authLoading || accountDataLoading}
            error={authError}
            success={authSuccess}
            notifications={notifications}
            friends={friends}
            friendRequests={friendRequests}
            friendsLoading={accountDataLoading}
            friendActionError={friendActionError}
            onSendFriendRequest={sendFriendRequest}
            onRespondToFriendRequest={respondToFriendRequest}
            onClearNotifications={clearNotifications}
            onOpenCampaignInvitations={openCampaignInvitations}
            scrollToNotificationsSignal={scrollToNotificationsSignal}
            onEmailChange={setAuthEmail}
            onPasswordChange={setAuthPassword}
            onDisplayNameChange={setAuthDisplayName}
            onSubmit={() => submitAuthForm(authMode)}
            onLogout={handleLogout}
          />
        )}
      </main>

      {mobileMenuOpen && (
        <MobileMenu
          activePage={activePage}
          authUser={authUser}
          onNavigate={navigate}
          onClose={() => setMobileMenuOpen(false)}
        />
      )}
      <Footer />
    </div>
  );
}

function MobileMenu({
  activePage,
  authUser,
  onNavigate,
  onClose,
}: {
  activePage: PageKey;
  authUser: User | null;
  onNavigate: (page: PageKey) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/70 backdrop-blur-sm xl:hidden">
      <div className="absolute right-3 top-3 w-[min(92vw,360px)] rounded-3xl border border-zinc-800 bg-zinc-950 p-3 shadow-2xl">
        <div className="mb-2 flex items-center justify-between px-2 py-2">
          <div className="font-semibold text-zinc-100">Menu</div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl bg-zinc-900"
          >
            <X size={18} />
          </button>
        </div>
        <div className="space-y-1">
          {navItems
            .filter((item) => item.key !== "myAccount" || authUser)
            .map((item) => (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm transition ${activePage === item.key ? "bg-lime-400 text-zinc-950" : "text-zinc-300 hover:bg-zinc-900"}`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

function LandingPage({ onNavigate }: { onNavigate: (page: PageKey) => void }) {
  return (
    <section className="space-y-5">
      <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-lime-950/40 p-6 shadow-2xl sm:p-10">
        <div className="flex h-full flex-col items-center justify-center text-center">
          <img
            src="src/assets/logo_white.png"
            alt="Logo"
            className="h-60 w-auto"
          />
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
            Run a mercenary unit with deep Battletech Campaign Ops complexity,
            without the need for a GM, Opfor, accountant, or finance degree.
          </p>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
            Build and manage forces, track resources, conduct campaigns for
            days, weeks, or even months as you battle for control of a planet
            against your opponent. No spreadsheets. No overhead. Just the crunch
            you crave.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row justify-center">
            <button
              onClick={() => onNavigate("units")}
              className="rounded-2xl bg-lime-400 px-5 py-3 font-bold text-zinc-950 shadow-lg shadow-lime-950/40 transition hover:bg-lime-300"
            >
              View units
            </button>
            <button
              onClick={() => onNavigate("about")}
              className="rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-3 font-bold text-zinc-100 transition hover:bg-zinc-800"
            >
              Read about the project
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-lime-400/20 bg-zinc-900/70 shadow-2xl">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
          <div className="relative min-h-[18rem] overflow-hidden lg:min-h-[28rem]">
            <img
              src={planetProjectionImage}
              alt="Holographic planet projection over a tactical command console"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-zinc-950/80" />
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-lime-300">Campaign command</div>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-zinc-50 sm:text-3xl">Run the war from orbit.</h2>
            <p className="mt-4 text-sm leading-7 text-zinc-300 sm:text-base">
              Track planetary control, objectives, combat teams, pilot rosters, and campaign status from one tactical command view built for BattleTech-style campaigns.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-zinc-300">
              <span className="rounded-full border border-lime-400/25 bg-lime-400/10 px-3 py-1 text-lime-200">Planet control</span>
              <span className="rounded-full border border-zinc-700 bg-zinc-950/70 px-3 py-1">Force readiness</span>
              <span className="rounded-full border border-zinc-700 bg-zinc-950/70 px-3 py-1">Battle history</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 text-center">
          <div className="text-2xl font-bold text-lime-300 mb-2">⚙️</div>
          <div className="text-lg font-bold text-zinc-50">
            Campaign Logistics
          </div>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Manage resources, finances, and unit logistics with true Battletech
            complexity.
          </p>
        </div>
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 text-center">
          <div className="text-2xl font-bold text-lime-300 mb-2">🤖</div>
          <div className="text-lg font-bold text-zinc-50">Roster Control</div>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Build and maintain your mercenary forces with detailed unit tracking
            and validation.
          </p>
        </div>
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 text-center">
          <div className="text-2xl font-bold text-lime-300 mb-2">⚔️</div>
          <div className="text-lg font-bold text-zinc-50">
            Battle Management
          </div>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Track campaigns and battles as you compete for control with no GM
            needed.
          </p>
        </div>
      </div>
    </section>
  );
}

function AboutPage({ onNavigate }: { onNavigate: (page: PageKey) => void }) {
  return (
    <section className="space-y-5">
      <PageTitle
        eyebrow="Project overview"
        title="About"
        description="A barebones starting point for the concept pitch, creator info, and design goals."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {aboutChildren.map((child) => (
          <button
            key={child.key}
            onClick={() => onNavigate(child.key)}
            className="group rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5 text-center transition hover:border-lime-400/40 hover:bg-zinc-900"
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <div>
                <div className="text-lg font-bold text-zinc-50">
                  {child.label}
                </div>
                <p className="mt-1 text-sm leading-6 text-zinc-400">
                  Placeholder content ready to expand.
                </p>
              </div>
              <ChevronRight className="text-zinc-500 transition group-hover:translate-x-1 group-hover:text-lime-300" />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function FaqPage() {
  return <PlaceholderPage title="FAQ" eyebrow="Common questions" />;
}

function CampaignTypesPage() {
  return (
    <PlaceholderPage title="Campaign Types" eyebrow="Supported play styles" />
  );
}

function PlaceholderPage({
  title,
  eyebrow,
}: {
  title: string;
  eyebrow: string;
}) {
  return (
    <section className="space-y-5">
      <PageTitle
        eyebrow={eyebrow}
        title={title}
        description="This page is intentionally minimal for now while Units becomes the first fully useful testing area."
      />
      <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/40 p-8 text-center text-zinc-400">
        Content coming soon.
      </div>
    </section>
  );
}
