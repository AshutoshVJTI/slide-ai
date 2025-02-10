"use client"

import { Button } from '@/components/ui/button';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useSlideStore } from '@/store/useSlideStore';
import { Project } from '@prisma/client'
import { JsonValue } from '@prisma/client/runtime/library';
import { useRouter } from 'next/navigation';
import React from 'react'
import { toast } from 'sonner';

type Props = {
    recentProjects: Project[];
}

const RecentOpen = ({ recentProjects }: Props) => {
    const router = useRouter();
    const { setSlides } = useSlideStore();
    const handleClick = (projectId: string, slides: JsonValue) => {
        if (!projectId || !slides) {
            toast.error("Project not found", { description: "Please create a new project" })
            return;
        }
        setSlides(JSON.parse(JSON.stringify(slides)));
        router.push(`/presentation/${projectId}`)
    }
    if (recentProjects.length === 0) return <></>
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Recently Opened</SidebarGroupLabel>
            <SidebarMenu>
                {recentProjects.map((project) => (
                    <SidebarMenuItem key={project.id}>
                        <SidebarMenuButton asChild tooltip={project.title} className='hover:bg-primary-80'>
                            <Button
                                variant="link"
                                className={`text-xs items-center justify-start`}
                                onClick={() => handleClick(project.id, project.slides)}>
                                <span>{project.title}</span>
                            </Button>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))
                }
            </SidebarMenu>
        </SidebarGroup>
    )
}

export default RecentOpen