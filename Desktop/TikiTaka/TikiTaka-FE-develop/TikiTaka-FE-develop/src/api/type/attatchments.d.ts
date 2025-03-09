declare interface PresignedUrlRequest {
  fileName: string;
  mimeType: string;
  fileSize: number;
}

declare interface PresignedUrlResponse {
  presignedUrl: string;
  expiresIn: number;
}

declare interface AttachmentMetadata {
  fileName: string;
  filePath: string;
  mimeType: string;
  fileSize: number;
}

declare interface AttachmentItem {
  attachmentId: number;
  type: string;
  typeId: number;
  fileName: string;
  fileSize: number;
}
