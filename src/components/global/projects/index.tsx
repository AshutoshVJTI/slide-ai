"use client";

import { containerVariants } from "@/lib/constants";
import { useSearchStore } from "@/store/useSearchStore";
import { Project } from "@prisma/client";
import { motion } from "framer-motion";
import React, { useMemo } from "react";
import ProjectCard from "../project-card";

type Props = {
    projects: Project[];
};

const Projects = ({ projects }: Props) => {
    const { searchQuery } = useSearchStore();

    const filteredProjects = useMemo(() => {
        if (!searchQuery.trim()) return projects;
        
        return projects.filter((project) => 
            project.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [projects, searchQuery]);

    return (
        <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {filteredProjects.length > 0 ? (
                filteredProjects.map((project, id) => (
                    <ProjectCard
                        key={id}
                        projectId={project?.id}
                        title={project?.title}
                        createdAt={project?.createdAt.toString()}
                        isDelete={project?.isDeleted}
                        slideData={project?.slides}
                        themeName={project.themeName}
                    />
                ))
            ) : (
                <div className="col-span-full text-center p-8">
                    <h3 className="text-lg font-medium">No matching projects found</h3>
                    <p className="text-muted-foreground">Try a different search term</p>
                </div>
            )}
        </motion.div>
    );
};

export default Projects;