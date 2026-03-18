import { createUploadthing } from "uploadthing/next";

const f = createUploadthing();

export const uploadRouter = {
  productImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
  }).onUploadComplete(async ({ file }) => {
    return {
      url: file.url,
      fileKey: file.key,
    };
  }),
};
