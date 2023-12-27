"use client";

// import { useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils/shadcn"

import { Input } from "@/components/ui/input";

type PostsSearchBarProps = {
    isCoach: boolean;
}

export default function PostsSearchBar({
    isCoach
}: PostsSearchBarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleSearch = ( e: React.ChangeEvent<HTMLInputElement> ) => {
        const params = new URLSearchParams(searchParams);

        params.set("search", !e.target.value ? "" : e.target.value);
        router.push(`${pathname}?${params.toString()}`);
    }

    return (
        <div>
            <Input
                disabled={!isCoach}
                onChange={handleSearch}
                placeholder="搜尋教練"
                className={cn("ml-4 rounded-xl p-2 w-full placeholder:text-gray-700 placeholder:font-semibold")}
                style={{ border: "1px solid gray" }}
            />
        </div>
    )
}