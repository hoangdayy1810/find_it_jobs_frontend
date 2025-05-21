import React from "react";
import JobResults from "./JobResults";
import TagResults from "./TagResults";
import { ITagBySearch } from "@/stores/tagStore";
import { IJobSearch } from "./Search_Header";

const SearchResults: React.FC<{
  query: string;
  tagResults: ITagBySearch[];
  jobResults: IJobSearch[];
  onTagClick: (tag: ITagBySearch) => void;
  onJobClick: (job: IJobSearch) => void;
}> = ({ query, tagResults, jobResults, onTagClick, onJobClick }) => {
  return (
    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[80vh] overflow-y-auto">
      <div className="p-3 border-b border-gray-200">
        <p className="text-sm text-gray-500">
          Search results for:{" "}
          <span className="font-semibold text-gray-700">{query}</span>
        </p>
      </div>

      {/* Tag Results Section */}
      {tagResults.length > 0 && (
        <div className="p-3 border-b border-gray-200">
          <h3 className="text-xs uppercase font-semibold text-gray-500 mb-2">
            Tags
          </h3>
          <TagResults tags={tagResults} onTagClick={onTagClick} />
        </div>
      )}

      {/* Job Results Section */}
      {jobResults.length > 0 && (
        <div className="p-3">
          <h3 className="text-xs uppercase font-semibold text-gray-500 mb-2">
            Jobs
          </h3>
          <JobResults jobs={jobResults} onJobClick={onJobClick} />
        </div>
      )}

      {tagResults.length === 0 && jobResults.length === 0 && (
        <div className="p-4 text-center text-gray-500">
          No results found for "{query}"
        </div>
      )}

      {/* See all results button */}
      {/* <div className="p-3 border-t border-gray-200 bg-gray-50">
        <button
          onClick={() =>
            (window.location.href = `/jobs?q=${encodeURIComponent(query)}`)
          }
          className="w-full text-center text-blue-600 hover:text-blue-800 font-medium text-sm py-1"
        >
          See all results
        </button>
      </div> */}
    </div>
  );
};

export default SearchResults;
