"use client";

// import { useCategory } from '@/contexts/AppContext';
import { observer } from "mobx-react-lite";
// import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const NavBar_Desktop = observer(() => {
  //   const router = useRouter();
  // const categoryStore = useCategory();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  });

  const [isHovered, setIsHovered] = useState(false);
  // const [activeCategory, setActiveCategory] = useState<string | null>('');

  // handleMouseEnter
  const handleMouseEnter = () => {
    setIsHovered(true);
    // setActiveCategory(categoryStore?.categories?.[0]?._id || '');
  };

  // handleMouseLeave
  const handleMouseLeave = () => {
    setIsHovered(false);
    // setActiveCategory(null);
  };

  // handleCategoryHover
  //   const handleCategoryHover = (categoryId: string) => {
  //     // setActiveCategory(categoryId);
  //   };

  // const handleClickCategory = (id: string) => {
  //     setIsHovered(false);
  //     router.push(`/products?category=${id}`)
  // }

  return (
    <div className="hidden md:block">
      <div
        className="flex justify-center items-center pl-8 py-3"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span className="mr-1">
          <i
            className="fa-solid fa-bars fa-2xl"
            style={{ color: "#7d8082" }}
          ></i>
        </span>
        <span>
          <img src="/images/header/icon_seemore_gray.svg" alt="" />
        </span>

        {/* Danh mục sản phẩm */}
        {isHovered && isClient && (
          <div className="absolute top-16 right-20 z-50 w-5/6 p-4 py-8 bg-white border rounded shadow-lg">
            <div className="flex">
              {/* Danh sách danh mục bên trái */}
              <div className="w-1/4 border-r p-2">
                <h3 className="text-2xl font-bold opacity-60 p-2 pb-4">
                  Danh mục sản phẩm
                </h3>
                <ul>
                  {/* {categoryStore?.categories?.map((category, index) => (
                                        <li
                                            key={index}
                                            className={`p-4 cursor-pointer rounded-lg hover:bg-gray-200 font-bold ${activeCategory === category._id ? 'bg-gray-200' : ''
                                                }`}
                                            onMouseEnter={() => handleCategoryHover(category._id)}
                                            onClick={() => { handleClickCategory(category._id) }}
                                        >
                                            {category.ten}
                                        </li>
                                    ))} */}
                </ul>
              </div>

              {/* Danh sách nhóm sản phẩm bên phải */}
              <div className="w-3/4 pt-4 pl-6 text-black">
                {/* {categoryStore?.categories?.map((category, index) =>
                                    activeCategory === category._id && (
                                        <div key={index}>
                                            <div>
                                                <h3 className="text-2xl font-bold mb-4">{category.ten}</h3>
                                            </div>
                                            <div className="grid grid-cols-4 gap-8 text-sm">
                                                {category.children?.map((category2, index) => index < 8 && (
                                                    <div
                                                        key={index}
                                                        className="cursor-pointer"
                                                    >
                                                        <h3 className="font-semibold mb-2" onClick={() => { handleClickCategory(category2._id) }}>{category2.ten}</h3>
                                                        <ul>
                                                            {category2.children?.map((category3, index) => index < 5 && (
                                                                <li
                                                                    key={index}
                                                                    className="cursor-pointer hover:text-yellow-600 text-gray-500 text-ellipsis overflow-hidden whitespace-nowrap"
                                                                    onClick={() => { handleClickCategory(category3._id) }}
                                                                >
                                                                    {category3.ten}
                                                                </li>
                                                            ))}
                                                            {category2.children && category2.children.length > 5 && (
                                                                <li
                                                                    className='cursor-pointer text-blue-500'
                                                                    onClick={() => { handleClickCategory(category2._id) }}
                                                                >
                                                                    Xem tất cả
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                } */}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default NavBar_Desktop;
