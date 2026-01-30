declare global {
  interface Window {
    compressImage: (file: File) => Promise<File>
  }
}

export {}