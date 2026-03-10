"use client"

import { UploadButton } from "@uploadthing/react"

export default function ProductImageUpload({ onUpload }) {

  return (
    <UploadButton
      endpoint="productImage"
      onClientUploadComplete={(res) => {
        const urls = res.map(r => r.url)
        onUpload(urls)
      }}
      onUploadError={(error) => {
        alert(`Erro: ${error.message}`)
      }}
    />
  )
}