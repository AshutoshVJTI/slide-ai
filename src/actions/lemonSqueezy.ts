"use server";

import { lemonSqueezyClient } from "@/lib/axios";

export const buySubscription = async (buyUserId: string) => {
  // Log environment variables (safely)
  console.log("Environment check:", {
    hostUrl: process.env.NEXT_PUBLIC_HOST_URL,
    storeIdExists: !!process.env.LEMON_SQUEEZY_STORE_ID,
    variantIdExists: !!process.env.LEMON_SQUEEZY_VARIANT_ID,
    apiUrlExists: !!process.env.NEXT_PUBLIC_LEMON_SQUEEZY_API,
    apiKeyExists: !!process.env.LEMON_SQUEEZY_API_KEY,
  });
  
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
    
    const res = await lemonSqueezyClient(
      process.env.LEMON_SQUEEZY_API_KEY
    ).post("/checkouts", {
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            custom: {
              buyerUserId: buyUserId,
            },
          },
          product_options: {
            redirect_url: `${process.env.NEXT_PUBLIC_HOST_URL}/dashboard`,
          },
        },
        relationships: {
          store: {
            data: {
              type: "stores",
              id: process.env.LEMON_SQUEEZY_STORE_ID,
            },
          },
          variant: {
            data: {
              type: "variants",
              id: process.env.LEMON_SQUEEZY_VARIANT_ID,
            },
          },
        },
      },
    });

    const checkoutUrl = res.data.data.attributes.url;
    return { url: checkoutUrl, status: 200 };
  } catch (error) {
    console.log("🔴 ERROR", error);
    // Provide more detailed error information
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Unknown error occurred";
    
    return { 
      status: 500, 
      error: "Internal Server Error", 
      details: errorMessage 
    };
  }
};