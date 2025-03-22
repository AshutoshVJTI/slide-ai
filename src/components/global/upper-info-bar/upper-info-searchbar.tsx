'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchStore } from "@/store/useSearchStore";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";

const SearchBar = () => {
    const { setSearchQuery } = useSearchStore();
    const [localSearch, setLocalSearch] = useState("");

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocalSearch(value);
    };

    // Debounce search to avoid too many updates
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(localSearch);
        }, 300);

        return () => clearTimeout(timer);
    }, [localSearch, setSearchQuery]);

    return (
        <div className="min-w-[60%] relative flex items-center border rounded-full bg-primary-90">
            <Button
                type="submit"
                size="sm"
                variant="ghost"
                className="absolute left-0 h-full rounded-l-none bg-transparent hover:bg-transparent"
            >
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
            </Button>
            <Input
                type="text"
                placeholder="Search by title"
                className="flex-grow bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 ml-6"
                value={localSearch}
                onChange={handleSearch}
            />
        </div>
    );
};

export default SearchBar;