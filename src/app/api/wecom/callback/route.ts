import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Used only for WeCom callback URL verification.
// Keep these in sync with the values entered in the WeCom admin console.
const WECOM_CALLBACK_TOKEN =
  process.env.WECOM_CALLBACK_TOKEN || "pdgogogo20260521wecom";
const WECOM_CALLBACK_AES_KEY =
  process.env.WECOM_CALLBACK_AES_KEY || "h2GcpgPIZjDfm4Zi5tEunRDP4EEKmsdW3Xe9lqzyxuO";

function sha1(parts: string[]): string {
  return crypto.createHash("sha1").update(parts.sort().join(""), "utf8").digest("hex");
}

function pkcs7Unpad(buffer: Buffer): Buffer {
  const pad = buffer[buffer.length - 1];
  if (pad < 1 || pad > 32) return buffer;
  return buffer.subarray(0, buffer.length - pad);
}

function decryptEcho(echostr: string): string {
  const aesKey = Buffer.from(`${WECOM_CALLBACK_AES_KEY}=`, "base64");
  if (aesKey.length !== 32) {
    throw new Error("Invalid WeCom EncodingAESKey length");
  }

  const encrypted = Buffer.from(echostr, "base64");
  const decipher = crypto.createDecipheriv("aes-256-cbc", aesKey, aesKey.subarray(0, 16));
  decipher.setAutoPadding(false);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  const plain = pkcs7Unpad(decrypted);

  // Plaintext = 16 random bytes + 4-byte network-order msg length + msg + corpId
  const msgLen = plain.readUInt32BE(16);
  return plain.subarray(20, 20 + msgLen).toString("utf8");
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const msgSignature = searchParams.get("msg_signature") || "";
  const timestamp = searchParams.get("timestamp") || "";
  const nonce = searchParams.get("nonce") || "";
  const echostr = searchParams.get("echostr") || "";

  if (!msgSignature || !timestamp || !nonce || !echostr) {
    return NextResponse.json({ ok: true, service: "wecom-callback" });
  }

  const expected = sha1([WECOM_CALLBACK_TOKEN, timestamp, nonce, echostr]);
  if (expected !== msgSignature) {
    return new NextResponse("invalid signature", { status: 403 });
  }

  try {
    return new NextResponse(decryptEcho(echostr), {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("WeCom callback verification failed", error);
    return new NextResponse("decrypt failed", { status: 400 });
  }
}

export async function POST() {
  // We do not need to receive messages for the report notification flow.
  return NextResponse.json({ ok: true });
}
