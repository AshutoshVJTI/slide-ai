"use server";

import { client } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const onAuthenticateUser = async () => {
    try {
        const user = await currentUser();
        if (!user) {
            return { status: 403 };
        }
        const userExist = await client.user.findUnique({
            where: {
                clerkId: user.id,
            },
            include: {
                PurchasedProjects: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        if (userExist) {
            return { status: 200, user: userExist };
        }

        const newUser = await client.user.create({
            data: {
                clerkId: user.id,
                email: user.emailAddresses[0].emailAddress,
                name: user.firstName + " " + user.lastName,
                profileImage: user.imageUrl,
                storeId: "defaultStoreId",
                webhookSecret: "defaultWebhookSecret"
            },
        });

        if (newUser) {
            return { status: 201, user: newUser };
        }
        return { status: 400 };
    } catch (error) {
        console.log("🔴 ERROR", error);
        return { status: 500, error: "Internal Server Error" };
    }
};

export const updateUserProfile = async (
    name: string
) => {
    try {
        const user = await currentUser();
        if (!user) {
            return { status: 403, error: "User not authenticated" };
        }

        const updatedUser = await client.user.update({
            where: {
                clerkId: user.id,
            },
            data: {
                name,
            },
        });

        if (!updatedUser) {
            return { status: 500, error: "Failed to update profile" };
        }

        return { status: 200, user: updatedUser };
    } catch (error) {
        console.log("🔴 ERROR", error);
        return { status: 500, error: "Internal Server Error" };
    }
};

export const updateUserAvatar = async (
    profileImage: string
) => {
    try {
        const user = await currentUser();
        if (!user) {
            return { status: 403, error: "User not authenticated" };
        }

        const updatedUser = await client.user.update({
            where: {
                clerkId: user.id,
            },
            data: {
                profileImage,
            },
        });

        if (!updatedUser) {
            return { status: 500, error: "Failed to update avatar" };
        }

        return { status: 200, user: updatedUser };
    } catch (error) {
        console.log("🔴 ERROR", error);
        return { status: 500, error: "Internal Server Error" };
    }
};

// Store user preferences in localStorage since we can't modify DB schema
export const updateUserPreferences = async (
    theme: string,
    reduceAnimations: boolean,
    fontSize: string
) => {
    try {
        // Since we're in a server action, we'll return the preferences
        // and let the client component store them in localStorage
        const preferences = {
            theme,
            reduceAnimations,
            fontSize
        };
        
        return { 
            status: 200, 
            preferences
        };
    } catch (error) {
        console.log("🔴 ERROR", error);
        return { status: 500, error: "Internal Server Error" };
    }
};

// Store notification preferences in localStorage since we can't modify DB schema
export const updateNotificationPreferences = async (
    emailNotifications: boolean,
    presentationComments: boolean,
    projectUpdates: boolean,
    marketingEmails: boolean
) => {
    try {
        // Since we're in a server action, we'll return the preferences
        // and let the client component store them in localStorage
        const notificationPreferences = {
            emailNotifications,
            presentationComments,
            projectUpdates,
            marketingEmails
        };
        
        return {
            status: 200,
            notificationPreferences
        };
    } catch (error) {
        console.log("🔴 ERROR", error);
        return { status: 500, error: "Internal Server Error" };
    }
};