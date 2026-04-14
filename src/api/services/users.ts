import api from "../client";
import type { User, UserSettings, SuccessResponse } from "../types";

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  location?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface UpdateSettingsPayload {
  notifEmail?: boolean;
  notifSms?: boolean;
  notifMessages?: boolean;
  notifPriceAlerts?: boolean;
  notifMarketing?: boolean;
  profileVisible?: boolean;
  shareActivity?: boolean;
  language?: string;
  currency?: string;
  twoFactorEnabled?: boolean;
}

const usersService = {
  async getProfile(): Promise<User> {
    const { data } = await api.get<User>("/users/me");
    return data;
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    const { data } = await api.patch<User>("/users/me", payload);
    return data;
  },

  async getSettings(): Promise<UserSettings> {
    const { data } = await api.get<UserSettings>("/users/me/settings");
    return data;
  },

  async updateSettings(payload: UpdateSettingsPayload): Promise<UserSettings> {
    const { data } = await api.patch<UserSettings>("/users/me/settings", payload);
    return data;
  },

  async deleteAccount(): Promise<SuccessResponse> {
    const { data } = await api.delete<SuccessResponse>("/users/me");
    return data;
  },
};

export default usersService;
