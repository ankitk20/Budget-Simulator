import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response("Unauthorized", { status: 401 });
  }
  const response = await fetch("http://0.0.0.0:8000/simulate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": authHeader || "", // Pass token to backend API
    },
    body: JSON.stringify(await req.json())
  });

  if (!response.body) {
    return new Response("Error: No response body", { status: 500 });
  }

  const reader = response.body.getReader();
  const stream = new ReadableStream({
    async start(controller) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        controller.enqueue(value);
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/json" },
  });
}
  