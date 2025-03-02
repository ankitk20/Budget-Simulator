import { NextRequest, NextResponse } from "next/server";
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

export async function GET(req: NextRequest) {
  const cookieToken = req.cookies.get("idToken")?.value;
  console.log(cookieToken);
  const authHeader = req.headers.get("Authorization");
  
  // const token = authHeader?.split(" ")[1];
  // const user = await verifyToken(token || "");
  
  // if (!user) {
  //   return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  // }

  const country = req.nextUrl.searchParams.get("country") || "us";
  const env = process.env.DEPLOYMENT_ENV;
  const prodApiHost = process.env.PROD_API_HOST;
  const devApiHost = process.env.LOCAL_API_HOST;
  const apiBaseUrl =
    env === "production"
      ? prodApiHost
      : devApiHost;

  const api = `${apiBaseUrl}/glossary?country=${country}`;
  try {
    const response = await fetch(api, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader || ""
      },
    });

    if (response.ok) {
        return NextResponse.json(await response.json(), { status: 200 });
    } else {
        return NextResponse.json("Something went wrong", { status: 502 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
  }
} 
  