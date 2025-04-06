"use server";

import { lemonSqueezyClient } from "@/lib/axios";

export const buySubscription = async (buyUserId: string) => {
  try {
    // Validate required environment variables
    if (!process.env.LEMON_SQUEEZY_API_KEY) {
      throw new Error("LEMON_SQUEEZY_API_KEY is missing");
    }
    if (!process.env.LEMON_SQUEEZY_STORE_ID) {
      throw new Error("LEMON_SQUEEZY_STORE_ID is missing");
    }
    if (!process.env.LEMON_SQUEEZY_VARIANT_ID) {
      throw new Error("LEMON_SQUEEZY_VARIANT_ID is missing");
    }
    if (!process.env.NEXT_PUBLIC_HOST_URL) {
      throw new Error("NEXT_PUBLIC_HOST_URL is missing");
    }
    
    // Ensure host URL is properly formatted
    let redirectUrl = `${process.env.NEXT_PUBLIC_HOST_URL}/dashboard`;
    // Make sure URL starts with http:// or https://
    if (!redirectUrl.startsWith('http://') && !redirectUrl.startsWith('https://')) {
      redirectUrl = `https://${redirectUrl}`;
    }
    
    // Correct payload structure per LemonSqueezy API
    const payload = {
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            custom: {
              user_id: buyUserId,
            },
          },
          product_options: {
            redirect_url: redirectUrl,
          },
        },
        relationships: {
          store: {
            data: {
              type: "stores",
              id: process.env.LEMON_SQUEEZY_STORE_ID
            }
          },
          variant: {
            data: {
              type: "variants",
              id: process.env.LEMON_SQUEEZY_VARIANT_ID
            }
          }
        }
      }
    };
    
    const res = await lemonSqueezyClient(
      process.env.LEMON_SQUEEZY_API_KEY
    ).post("/checkouts", payload);

    const checkoutUrl = res.data.data.attributes.url;
    return { url: checkoutUrl, status: 200 };
  } catch (error: any) {
    console.log("🔴 ERROR", error);
    // Provide more detailed error information
    const errorMessage = error.response?.data?.errors?.[0]?.detail ||
      (error instanceof Error ? error.message : "Unknown error occurred");
    
    return { 
      status: 500, 
      error: "Internal Server Error", 
      details: errorMessage 
    };
  }
};