import api from "../client";

const uploadService = {
  async uploadProfilePicture(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await api.post<{ url: string }>(
      "/upload/profile-picture",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return data;
  },

  async uploadJobAttachment(
    file: File,
  ): Promise<{ url: string; mimeType: string }> {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await api.post<{ url: string; mimeType: string }>(
      "/upload/job-attachment",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );

    return data;
  },
};

export default uploadService;
