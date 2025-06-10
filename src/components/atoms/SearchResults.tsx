import React from "react";
import JobResults from "./JobResults";
import TagResults from "./TagResults";
import { ITagBySearch } from "@/stores/tagStore";
import { IJobSearch } from "./Search_Header";

const SearchResults: React.FC<{
  t: any;
  query: string;
  tagResults: ITagBySearch[];
  jobResults: IJobSearch[];
  onTagClick: (tag: ITagBySearch) => void;
  onJobClick: (job: IJobSearch) => void;
}> = ({ t, query, tagResults, jobResults, onTagClick, onJobClick }) => {
  return (
    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[80vh] overflow-y-auto">
      <div className="p-3 border-b border-gray-200">
        <p className="text-sm text-gray-500">
          {t("search.results-for")}{" "}
          <span className="font-semibold text-gray-700">{query}</span>
        </p>
      </div>

      {/* Tag Results Section */}
      {tagResults.length > 0 && (
        <div className="p-3 border-b border-gray-200">
          <h3 className="text-xs uppercase font-semibold text-gray-500 mb-2">
            {t("search.tags")}
          </h3>
          <TagResults tags={tagResults} onTagClick={onTagClick} />
        </div>
      )}

      {/* Job Results Section */}
      {jobResults.length > 0 && (
        <div className="p-3">
          <h3 className="text-xs uppercase font-semibold text-gray-500 mb-2">
            {t("search.jobs")}
          </h3>
          <JobResults jobs={jobResults} onJobClick={onJobClick} />
        </div>
      )}

      {tagResults.length === 0 && jobResults.length === 0 && (
        <div className="p-4 py-10 text-center text-gray-500">
          {t("search.no-results")} "{query}"
        </div>
      )}
    </div>
  );
};

export default SearchResults;
