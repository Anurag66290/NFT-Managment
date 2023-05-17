import crypto from "crypto";

// Encryption function
export const encryptData = (data, encryptionKey) => {
  const iv = crypto.randomBytes(16); // Generate a random IV (Initialization Vector)
  const cipher = crypto.createCipheriv("aes-256-cbc", encryptionKey, iv);
  let encryptedData = cipher.update(data, "utf8", "hex");
  encryptedData += cipher.final("hex");
  return {
    iv: iv.toString("hex"),
    encryptedData,
  };
};

// Decryption function
export const decryptData = (encryptedData, encryptionKey) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    encryptionKey,
    Buffer.from(encryptedData.iv, "hex")
  );
  let decryptedData = decipher.update(encryptedData.encryptedData, "hex", "utf8");
  decryptedData += decipher.final("utf8");
  return decryptedData;
};
