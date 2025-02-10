"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenuButton } from '@/components/ui/sidebar'
import { Project, User } from '@prisma/client'
import React from 'react'
import NavMain from './nav-main'
import { data } from '@/lib/constants'
import RecentOpen from './recent-open'
import NavFooter from './nav-footer'

const AppSidebar = ({ recentProjects, user, ...props }: {
    recentProjects: Project[]
} & { user: User } & React.ComponentProps<typeof Sidebar>) => {
    const defaultImage = 'https://via.placeholder.com/150';

    return (
        <Sidebar collapsible='icon' className='min-w-[212px] bg-background-90 flex flex-col' {...props}>
            <SidebarHeader className='pt-6 px-3 pb-0'>
                <SidebarMenuButton size={'lg'} className='data-[state="open"]:text-sidebar-accent-foreground' >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                        <Avatar className='h-10 w-10 rounded-full'>
                            <AvatarImage src={defaultImage} alt={user?.name || ''} />
                        <AvatarFallback className='rounded-lg'>SAI</AvatarFallback>
                        </Avatar>
                    </div>
                    <span className="truncate text-primary text-3xl font-semibold">Slides AI</span>
                </SidebarMenuButton>
            </SidebarHeader>
            <SidebarContent className='px-3 mt-10 gap-y-6 flex-1'>
                <NavMain items={data.navMain} />
                <RecentOpen recentProjects={recentProjects}/>
            </SidebarContent>
            <SidebarFooter>
                <NavFooter prismaUser={user} />
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSidebar