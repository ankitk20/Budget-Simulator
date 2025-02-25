import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function verifyToken(token: string) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload; // Contains user info if valid
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export async function POST(req: Request) {
  const authHeader = req.headers.get("Authorization");
  
  const token = authHeader?.split(" ")[1];
  const user = await verifyToken(token || "");
  
  if (!user) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const env = process.env.DEPLOYMENT_ENV;
  const prodApiHost = process.env.PROD_API_HOST;
  const devApiHost = process.env.LOCAL_API_HOST;
  const apiBaseUrl =
    env === "production"
      ? prodApiHost
      : devApiHost;

  const api = `${apiBaseUrl}/analyze`;

  try {
    const response = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": authHeader || ""
      },
      body: JSON.stringify(await req.json())
    });

    if (!response.body) {
      return new Response("Error: No response body", { status: 500 });
    }
    const analysisData = await response.json();

    return NextResponse.json(analysisData, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch financial analysis" }, { status: 500 });
  }
} 
  