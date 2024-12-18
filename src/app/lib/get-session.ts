"use server";
import { auth } from "@/auth";

export async function getCurrentUser() {
  return await auth();
}
