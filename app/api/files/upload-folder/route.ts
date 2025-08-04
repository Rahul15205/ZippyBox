import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import ImageKit from "imagekit";
import { v4 as uuidv4 } from "uuid";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const folderName = formData.get("folderName") as string;
    const formUserId = formData.get("userId") as string;
    const parentId = (formData.get("parentId") as string) || null;
    const filesData = formData.getAll("files") as File[];

    if (formUserId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!folderName || filesData.length === 0) {
      return NextResponse.json(
        { error: "Folder name and files are required" },
        { status: 400 }
      );
    }

    // Create folder
    const folderId = uuidv4();
    const folderPath = parentId
      ? `/zippybox/${userId}/folders/${parentId}/${folderName}`
      : `/zippybox/${userId}/${folderName}`;

    const folderData = {
      id: folderId,
      name: folderName,
      path: folderPath,
      size: 0,
      type: "folder",
      fileUrl: "",
      thumbnailUrl: null,
      userId: userId,
      parentId: parentId,
      isFolder: true,
      isStarred: false,
      isTrash: false,
    };

    const [newFolder] = await db.insert(files).values(folderData).returning();

    // Upload files
    const uploadedFiles = [];
    const maxFileSize = 50 * 1024 * 1024;

    for (const file of filesData) {
      if (file.size > maxFileSize) {
        return NextResponse.json(
          { error: `File ${file.name} exceeds 50MB limit` },
          { status: 400 }
        );
      }

      const buffer = await file.arrayBuffer();
      const fileBuffer = Buffer.from(buffer);
      const originalFilename = file.name;
      const fileExt = originalFilename.split(".").pop() || "";
      const uniqueFilename = `${uuidv4()}.${fileExt}`;

      const uploadResponse = await imagekit.upload({
        file: fileBuffer,
        fileName: uniqueFilename,
        folder: folderPath,
        useUniqueFileName: false,
      });

      const fileData = {
        name: originalFilename,
        path: uploadResponse.filePath,
        size: file.size,
        type: file.type,
        fileUrl: uploadResponse.url,
        thumbnailUrl: uploadResponse.thumbnailUrl || null,
        userId: userId,
        parentId: folderId,
        isFolder: false,
        isStarred: false,
        isTrash: false,
      };

      const [newFile] = await db.insert(files).values(fileData).returning();
      uploadedFiles.push(newFile);
    }

    return NextResponse.json({
      folder: newFolder,
      files: uploadedFiles,
    });
  } catch (error) {
    console.error("Error uploading folder:", error);
    return NextResponse.json(
      { error: "Failed to upload folder" },
      { status: 500 }
    );
  }
} 
 