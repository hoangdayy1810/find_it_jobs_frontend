"use client";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";

import { debounce } from "lodash";
import { useJob } from "@/contexts/AppContext";
import { ITagBySearch } from "@/stores/tagStore";
import SearchInput from "./SearchInput";
import SearchResults from "./SearchResults";

export interface IJobSearch {
  _id: string;
  title: string;
  companyName: string;
  logo?: string;
  location: string;
  jobType: string;
}

const Search_Header = () => {
  const t = useTranslations();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const jobStore = useJob();

  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [tagResults, setTagResults] = useState<ITagBySearch[]>([]);
  const [jobResults, setJobResults] = useState<IJobSearch[]>([]);

  // Handle outside click to close the search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Create a debounced search function
  const debouncedSearch = useRef(
    debounce(async (query: string) => {
      if (query.length === 0) {
        setTagResults([]);
        setJobResults([]);
        setShowResults(false);
        return;
      }

      setIsLoading(true);
      try {
        // Call your backend API here
        const response = await jobStore?.getJobsBySearch({ q: query });

        // Update the state with the search results
        setTagResults(response.tagValues || []);
        setJobResults(response.jobs || []);
        setShowResults(true);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 300)
  ).current;

  // Clean up the debounced function on component unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length > 0) {
      router.push(`/jobs/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowResults(false);
    }
  };

  // Navigate to job list with selected tag
  const handleTagClick = (tag: ITagBySearch) => {
    router.push(`/jobs?${tag.keyName}=${tag.name}`);
    setShowResults(false);
  };

  // Navigate to job detail page
  const handleJobClick = (job: IJobSearch) => {
    router.push(`/jobs/${job._id}`);
    setShowResults(false);
  };

  return (
    <div className="relative" ref={searchRef}>
      <SearchInput
        placeholder={t("header.search_placeholder")}
        value={searchQuery}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />

      {showResults && searchQuery.trim().length > 0 && (
        <SearchResults
          query={searchQuery}
          tagResults={tagResults}
          jobResults={jobResults}
          onTagClick={handleTagClick}
          onJobClick={handleJobClick}
        />
      )}
    </div>
  );
};

// Search Input Component

export default Search_Header;
