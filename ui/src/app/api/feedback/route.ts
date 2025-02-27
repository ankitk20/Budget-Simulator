import { NextResponse } from "next/server";
import { auth, OAuth2Client } from "google-auth-library";

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

  const api = `${process.env.FEEDBACK_GOOGLE_APP_SCRIPT_URL}`;
  try {
    const response = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader || ""
      },
      body: JSON.stringify(await req.json())
    });

    if (response.ok) {
        return NextResponse.json("Feedback submitted successfully", { status: 200 });
    } else {
        return NextResponse.json("Something went wrong", { status: 502 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
  }
} 
  