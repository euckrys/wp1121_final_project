"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/shadcn";
import { Search } from 'lucide-react';

type PostsSearchBarProps = {
  isCoach: boolean;
};

export default function PostsSearchBar({ isCoach }: PostsSearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams);

    params.set("search", !e.target.value ? "" : e.target.value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex px-2 py-2 w-full justify-center items-center">
      <Input
        disabled={!isCoach}
        onChange={handleSearch}
        placeholder="搜尋教練"
        className={cn(
          "mr-4 w-full text-xl rounded-xl py-4 placeholder:font-semibold placeholder:text-black",
        )}
        style={{ border: "1px solid gray" }}
      />
      <Search />
    </div>
  );
}
