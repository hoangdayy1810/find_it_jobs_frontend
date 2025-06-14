import { ITagBySearch } from "@/stores/tagStore";
import React from "react";

const TagResults: React.FC<{
  tags: ITagBySearch[];
  onTagClick: (tag: ITagBySearch) => void;
}> = ({ tags, onTagClick }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <button
          key={tag._id}
          onClick={() => onTagClick(tag)}
          className="px-3 py-1 bg-whiite hover:bg-gray-100 text-gray-600 border rounded-full text-sm transition-colors flex items-center"
        >
          <span className="text-gray-600">#</span>
          <span className="ml-1">{tag.name}</span>
        </button>
      ))}
    </div>
  );
};

export default TagResults;
