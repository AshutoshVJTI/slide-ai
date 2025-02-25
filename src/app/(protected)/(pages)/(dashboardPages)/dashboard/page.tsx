import { getAllProjects } from '@/actions/project';
import NotFound from '@/components/global/not-found';
import Projects from '@/components/global/projects';
import React from 'react'

const DashboardPage = async () => {
    const allProjects = await getAllProjects();
    return (
        <div className="w-full flex flex-col gap-6 relative max-md:p-0 p-4">
            <div className='flex flex-col-reverse items-start w-full gap-6 max-sm:flex-row max-sm:items-center max-sm:justify-center'>
                <div className="flex flex-col items-start">
                    <h1 className='text-2xl font-semibold dark:text-primary backdrop-blur-lg'>
                        Projects
                    </h1>
                    <p className="text-base font-normal dark:text-secondary">
                        All of your work in one place
                    </p>
                </div>
            </div>
            {allProjects.data && allProjects.data.length > 0 ? <Projects projects={allProjects.data} /> : <NotFound />}
        </div>
    )
}

export default DashboardPage