export const dynamic = "force-dynamic";

import { client } from "@/lib/prisma";
import { NextRequest } from "next/server";
import crypto from "node:crypto";

// Add support for OPTIONS method (CORS preflight)
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Signature',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    console.log("Webhook received method:", req.method);
    console.log("Headers:", Object.fromEntries(req.headers.entries()));
    
    // Check if webhook secret is configured
    if (!process.env.LEMON_SQUEEZY_WEBHOOK_SECRET) {
      console.error("LEMON_SQUEEZY_WEBHOOK_SECRET environment variable is not set");
      throw new Error("Missing webhook secret configuration");
    }
    
    const rawBody = await req.text();
    console.log("Raw body length:", rawBody.length);
    
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (e) {
      console.error("Failed to parse JSON body:", e);
      throw new Error("Invalid JSON payload");
    }

    console.log("Webhook received event:", body.meta?.event_name);
    
    // Check if this is a subscription-related event
    const validEvents = [
      "subscription_created", 
      "subscription_updated", 
      "subscription_cancelled",
      "subscription_resumed",
      "order_created",
      "order_refunded"
    ];
    
    if (!validEvents.includes(body.meta.event_name)) {
      console.log(`Ignoring event: ${body.meta.event_name}`);
      return Response.json({ 
        message: `Ignoring non-subscription event: ${body.meta.event_name}`, 
        status: 200 
      });
    }

    // Extract user_id from custom_data (not buyerUserId)
    const userId = body.meta.custom_data?.user_id;
    if (!userId) {
      console.error("No user_id in custom_data:", body.meta.custom_data);
      throw new Error("Invalid user_id or id does not exist in custom_data");
    }

    const hmac = crypto.createHmac(
      "sha256",
      process.env.LEMON_SQUEEZY_WEBHOOK_SECRET!
    );

    const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
    const signatureHeader = req.headers.get("X-Signature");
    
    if (!signatureHeader) {
      console.error("No X-Signature header found");
      throw new Error("Missing X-Signature header");
    }
    
    const signature = Buffer.from(signatureHeader, "utf8");

    console.log(`Verifying signature for user ${userId}`);
    console.log(`digest: ${digest.toString("hex")}`);
    console.log(`signature: ${signature.toString("utf8")}`);

    // Only try timing safe comparison if buffers are same length
    if (digest.length !== signature.length) {
      console.error(`Signature length mismatch: digest=${digest.length}, signature=${signature.length}`);
      throw new Error("Invalid signature format");
    }

    if (!crypto.timingSafeEqual(digest, signature)) {
      console.error("Invalid signature");
      throw new Error("Invalid signature");
    }

    // For subscription_cancelled, we might want to set subscription to false
    const subscriptionActive = body.meta.event_name !== "subscription_cancelled";

    const buyer = await client.user.update({
      where: {
        id: userId,
      },
      data: { subscription: subscriptionActive },
    });
    
    if (!buyer) {
      console.error(`User not found with id: ${userId}`);
      return Response.json({
        message: `Cannot update the subscription for user with ID ${userId}`,
        status: 404,
      });
    }

    console.log(`Successfully updated subscription for user ${userId} to ${subscriptionActive}`);
    return Response.json({ 
      data: { userId, subscriptionActive }, 
      status: 200 
    });
  } catch (error) {
    console.error("Error in webhook POST handler:", error);
    return Response.json({ message: "Internal Server Error", status: 500 });
  }
}