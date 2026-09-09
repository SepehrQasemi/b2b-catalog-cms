import { beforeEach, describe, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireAdminSession: vi.fn(),
}));

vi.mock("@/lib/auth/session", () => ({
  requireAdminSession: mocks.requireAdminSession,
}));

import { saveCategoryAction } from "@/app/(admin)/admin/(protected)/categories/actions";
import { saveInquiryReviewAction } from "@/app/(admin)/admin/(protected)/inquiries/actions";
import { saveManufacturerAction } from "@/app/(admin)/admin/(protected)/manufacturers/actions";
import { saveMediaAction } from "@/app/(admin)/admin/(protected)/media/actions";
import { savePageAction } from "@/app/(admin)/admin/(protected)/pages/actions";
import { saveProductAction } from "@/app/(admin)/admin/(protected)/products/actions";
import { saveSettingsAction } from "@/app/(admin)/admin/(protected)/settings/actions";

const actions = [
  ["categories", saveCategoryAction],
  ["inquiries", saveInquiryReviewAction],
  ["manufacturers", saveManufacturerAction],
  ["media", saveMediaAction],
  ["pages", savePageAction],
  ["products", saveProductAction],
  ["settings", saveSettingsAction],
] as const;

describe("admin mutation actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.requireAdminSession.mockRejectedValue(new Error("unauthorized"));
  });

  test.each(actions)("%s rejects before processing an unauthenticated mutation", async (_name, action) => {
    await expect(action(new FormData())).rejects.toThrow("unauthorized");
    expect(mocks.requireAdminSession).toHaveBeenCalledOnce();
  });
});