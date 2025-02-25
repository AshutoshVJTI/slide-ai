"use server"

import { client } from "@/lib/prisma";
import { onAuthenticateUser } from "./user";

export const getAllProjects = async () => {
    try {
        const checkUser = await onAuthenticateUser();
        if (checkUser.status !== 200 || !checkUser.user) {
            return { status: 403, error: 'User not authenticated' };
        }

        const projects = await client.project.findMany({
            where: {
                userId: checkUser.user.id,
                isDeleted: false,
            },
            orderBy: {
                updatedAt: 'desc',
            }
        });
        if (projects.length === 0) {
            return { status: 404, error: 'No projects found' }
        }
        return { status: 200, data: projects };
    } catch (error) {
        console.error("Error fetching projects:", error);
        return { status: 500, error: 'Internal Server Error' };
    }
}

export const getRecentProjects = async () => {
    try {
        const checkUser = await onAuthenticateUser();
        if (checkUser.status !== 200 || !checkUser.user) {
            return { status: 403, error: 'User not authenticated' };
        }

        const projects = await client.project.findMany({
            where: {
                userId: checkUser.user.id,
                isDeleted: false,
            },
            orderBy: {
                updatedAt: 'desc',
            },
            take: 5,
        });
        if (projects.length === 0) {
            return { status: 404, error: 'No projects found' }
        }
        return { status: 200, data: projects };
    } catch (error) {
        console.error("Error fetching projects:", error);
        return { status: 500, error: 'Internal Server Error' };
    }
}

export const recoverProject = async (projectId: string) => {
    try {
        const checkUser = await onAuthenticateUser();
        if (checkUser.status !== 200 || !checkUser.user) {
            return { status: 403, error: 'User not authenticated' };
        }

        const project = await client.project.findFirst({
            where: {
                id: projectId,
                userId: checkUser.user.id,
                isDeleted: true,
            }
        });
        if (!project) {
            return { status: 404, error: 'Project not found' }
        }
        const updatedProject = await client.project.update({
            where: {
                id: projectId,
            },
            data: {
                isDeleted: false,
            }
        });
        return { status: 200, data: updatedProject };
    }
    catch (error) {
        console.error("Error fetching projects:", error);
        return { status: 500, error: 'Internal Server Error' };
    }
}

export const deleteProject = async (projectId: string) => {
    try {
        const checkUser = await onAuthenticateUser();
        if (checkUser.status !== 200 || !checkUser.user) {
            return { status: 403, error: 'User not authenticated' };
        }

        const project = await client.project.findFirst({
            where: {
                id: projectId,
                userId: checkUser.user.id,
                isDeleted: false,
            }
        });
        if (!project) {
            return { status: 404, error: 'Project not found' }
        }
        const updatedProject = await client.project.update({
            where: {
                id: projectId,
            },
            data: {
                isDeleted: true,
            }
        });
        return { status: 200, data: updatedProject };
    }
    catch (error) {
        console.error("Error fetching projects:", error);
        return { status: 500, error: 'Internal Server Error' };
    }
}