import api from "../client";

export interface AppWaitlistSubscribeResponse {
  success: boolean;
  alreadySubscribed?: boolean;
  entry?: {
    id: string;
    email: string;
    source?: string | null;
    createdAt: string;
  };
}

const appWaitlistService = {
  async subscribe(
    email: string,
    source = "homepage_cta",
  ): Promise<AppWaitlistSubscribeResponse> {
    const { data } = await api.post<AppWaitlistSubscribeResponse>(
      "/app-waitlist",
      { email, source },
    );
    return data;
  },
};

export default appWaitlistService;
