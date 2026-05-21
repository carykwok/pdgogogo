import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Used only for WeCom callback URL verification.
// The fallback list intentionally accepts common visual-confusion variants
// because WeCom's UI makes uppercase I / lowercase l / digit 1 easy to mistype.
const WECOM_CALLBACK_TOKEN =
  process.env.WECOM_CALLBACK_TOKEN || "pdgogogo20260521wecom";

const PRIMARY_AES_KEY =
  process.env.WECOM_CALLBACK_AES_KEY || "h2GcpgPIZjDfm4Zi5tEunRDP4EEKmsdW3Xe9lqzyxuO";

const AES_KEY_CANDIDATES = Array.from(
  new Set([
    PRIMARY_AES_KEY,
    "h2GcpgPIZjDfm4Zi5tEunRDP4EEKmsdW3Xe9lqzyxuO", // intended: uppercase I
    "h2GcpgPlZjDfm4Zi5tEunRDP4EEKmsdW3Xe9lqzyxuO", // likely screenshot: lowercase l
    "h2GcpgP1ZjDfm4Zi5tEunRDP4EEKmsdW3Xe9lqzyxuO", // common mistake: digit 1
    "h2GcpqPIZjDfm4Zi5tEunRDP4EEKmsdW3Xe9lqzyxuO", // common mistake: q instead of g
  ])
);

function sha1(parts: string[]): string {
  return crypto.createHash("sha1").update(parts.sort().join(""), "utf8").digest("hex");
}

function pkcs7Unpad(buffer: Buffer): Buffer {
  const pad = buffer[buffer.length - 1];
  if (pad < 1 || pad > 32) return buffer;
  return buffer.subarray(0, buffer.length - pad);
}

function decryptEchoWithKey(echostr: string, encodingAesKey: string): string {
  const aesKey = Buffer.from(`${encodingAesKey}=`, "base64");
  if (aesKey.length !== 32) {
    throw new Error(`Invalid WeCom EncodingAESKey length: ${encodingAesKey.length}`);
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

function decryptEcho(echostr: string): string {
  const errors: string[] = [];
  for (const key of AES_KEY_CANDIDATES) {
    try {
      return decryptEchoWithKey(echostr, key);
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }
  }
  throw new Error(`All AES key candidates failed: ${errors.join(" | ")}`);
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
