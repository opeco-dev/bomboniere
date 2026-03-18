"use client";

import { UploadButton } from "@uploadthing/react";

export default function ProductImageUpload({
  endpoint = "productImages",
  value = [],
  onChange,
}) {
  return (
    <div className="flex flex-col gap-3">
      <UploadButton
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          const arquivos = res.map((item) => ({
            url: item.serverData.url,
            fileKey: item.serverData.fileKey,
            name: item.serverData.name,
          }));

          onChange([...(value || []), ...arquivos]);
        }}
        onUploadError={(error) => {
          alert(`Erro no upload: ${error.message}`);
        }}
      />

      {value.length > 0 && (
        <div className="flex gap-2 overflow-x-auto">
          {value.map((img, index) => (
            <div key={img.fileKey || index} className="relative">
              <img
                src={img.url}
                alt={`imagem-${index}`}
                className="w-20 h-20 rounded-lg object-cover border"
              />

              <button
                type="button"
                onClick={() =>
                  onChange(value.filter((_, current) => current !== index))
                }
                className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full text-xs"
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
