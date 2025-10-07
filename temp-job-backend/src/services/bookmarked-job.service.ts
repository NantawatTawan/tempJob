import { SupabaseClient, User } from "@supabase/supabase-js";
import { supabaseServiceClient } from "../configs/db.config";

export class BookmarkedJobService {
  private _BOOKMARKED_JOB_TABLE = "bookmarked_job";

  constructor(private readonly supabaseClient: SupabaseClient) {
    if (!this.supabaseClient) throw new Error("Supabase client is required");
  }

  async getBookmarkedJobsByUserId(userId: User["id"]) {
    if (!userId) throw new Error("User ID is required");

    const { data: bookmarkedJobs, error: bookmarkedJobsError } =
      await this.supabaseClient
        .from(this._BOOKMARKED_JOB_TABLE)
        .select("*")
        .eq("user_id", userId);

    if (bookmarkedJobsError) throw new Error(bookmarkedJobsError.message);

    return bookmarkedJobs;
  }

  async toggleJobBookmark(userId: string, jobId: string) {
    const { data: existingBookmark, error: fetchError } =
      await this.supabaseClient
        .from(this._BOOKMARKED_JOB_TABLE)
        .select("*")
        .eq("user_id", userId)
        .eq("job_id", jobId);

    if (fetchError) throw new Error(fetchError.message);

    if (existingBookmark && existingBookmark.length > 0) {
      await this.supabaseClient
        .from(this._BOOKMARKED_JOB_TABLE)
        .delete()
        .eq("user_id", userId)
        .eq("job_id", jobId);

      return null;
    }

    const { data: newBookmark, error: insertError } = await this.supabaseClient
      .from(this._BOOKMARKED_JOB_TABLE)
      .insert([{ user_id: userId, job_id: jobId }]);

    if (insertError) throw new Error(insertError.message);

    return newBookmark;
  }
}

export const bookmarkedJobService = new BookmarkedJobService(
  supabaseServiceClient
);
