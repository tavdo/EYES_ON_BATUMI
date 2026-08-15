import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getBlobToken } from "@/lib/blob-env";

export async function POST(request: Request) {
  const token = getBlobToken();
  if (!token) {
    return NextResponse.json({ error: "Blob token არ არის" }, { status: 500 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const json = await handleUpload({
      body,
      request,
      token,
      onBeforeGenerateToken: async (pathname) => {
        if (!(await isAdminAuthenticated())) {
          throw new Error("შესვლა საჭიროა");
        }

        if (!pathname.startsWith("photos/")) {
          throw new Error("არასწორი გზა");
        }

        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
            "image/heic",
            "image/heif",
          ],
          addRandomSuffix: false,
          allowOverwrite: true,
          maximumSizeInBytes: 50 * 1024 * 1024,
        };
      },
    });

    return NextResponse.json(json);
  } catch (error) {
    const message = error instanceof Error ? error.message : "ატვირთვა ვერ მოხერხდა";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
