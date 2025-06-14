"use client";

// import { useCategory } from '@/contexts/AppContext';
import { observer } from "mobx-react-lite";
// import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from "react";

const NavBar_Mobile = observer(() => {
  // const router = useRouter();
  // const categoryStore = useCategory();

  const [isClient, setIsClient] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  // const [activeCategory, setActiveCategory] = useState<string | null>(categoryStore?.categories?.[0] ? categoryStore?.categories?.[0]._id : null);
  // const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  // const handleClickCategory = (categoryId: string) => {
  //     setActiveCategory(categoryId);
  // };

  // const toggleCategory2 = (category2Id: string) => {
  //     setExpandedCategories((prev) => ({
  //         ...prev,
  //         [category2Id]: !prev[category2Id],
  //     }));
  // };

  // const handleSelectCategory = (id: string) => {
  //     setIsNavOpen(false);
  //     router.push(`/products?category=${id}`)
  // }

  const closeNav = () => {
    setIsNavOpen(false);
  };

  return (
    <div className="ml-1 block md:hidden">
      {/* Icon mở menu */}
      <span>
        <img
          className="w-8 cursor-pointer"
          src="/images/header/ico_menu_white.svg"
          alt="Menu"
          onClick={toggleNav}
        />
      </span>

      {/* Navbar toàn màn hình */}
      {isNavOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="flex items-center py-3 bg-[#C92127] text-white">
            <div className="w-1/12 cursor-pointer" onClick={closeNav}>
              <i className="fa-solid fa-arrow-left fa-lg"></i>
            </div>
            <div className="w-11/12 flex justify-center text-center font-bold">
              <h2 className="text-lg">Danh Mục Sản Phẩm</h2>
            </div>
          </div>

          {/* Nội dung danh mục */}
          {isClient && (
            <div className="flex h-[calc(100%-3rem)] overflow-y-auto">
              {/* Danh sách danh mục bên trái */}
              <div className="w-1/4 bg-gray-100">
                <ul>
                  {/* {categoryStore?.categories?.length ? (
                                        categoryStore.categories.map((category, index) => (
                                            <li
                                                key={index}
                                                className={`p-4 cursor-pointer hover:bg-gray-200 font-bold ${activeCategory === category._id ? 'bg-gray-200' : ''
                                                    }`}
                                                onClick={() => handleClickCategory(category._id)}
                                            >
                                                {category.ten}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="p-4 text-center text-gray-500">Không có dữ liệu</li>
                                    )} */}
                </ul>
              </div>

              {/* Danh sách nhóm sản phẩm bên phải */}
              <div className="w-3/4 py-4 px-2 h-full text-start">
                {/* {categoryStore?.categories?.map(
                                    (category, index) =>
                                        activeCategory === category._id && (
                                            <div key={index}>  */}
                {/* Hàng ngang các category2 */}
                {/* <div className="text-sm">
                                                    {category.children?.map((category2, index) => (
                                                        <div key={index} className="mb-4">
                                                            <div
                                                                className={`cursor-pointer text-ellipsis overflow-hidden whitespace-nowrap px-4 py-2 rounded-md border ${expandedCategories[category2._id]
                                                                    ? 'text-red-700'
                                                                    : 'border-gray-300'
                                                                    }`}
                                                                onClick={() => toggleCategory2(category2._id)}
                                                            >
                                                                <h3 className="font-semibold">{category2.ten}</h3>
                                                            </div> */}

                {/* Danh sách category3 hiển thị bên dưới category2 được chọn */}
                {/* {expandedCategories[category2._id] && (
                                                                <ul key={index} className="mt-2 pl-4 space-y-4">
                                                                    {category2.children?.map((category3, index) => index < 5 && (
                                                                        <li
                                                                            key={index}
                                                                            className="cursor-pointer hover:text-yellow-600 text-gray-500 text-ellipsis overflow-hidden whitespace-nowrap"
                                                                            onClick={() => { handleSelectCategory(category3._id) }}
                                                                        >
                                                                            {category3.ten}
                                                                        </li>
                                                                    ))}
                                                                    {category2.children && category2.children.length > 5 && (
                                                                        <li
                                                                            className='cursor-pointer text-blue-500'
                                                                            onClick={() => { handleSelectCategory(category2._id) }}
                                                                        >
                                                                            Xem tất cả
                                                                        </li>
                                                                    )}
                                                                </ul>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                )} */}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default NavBar_Mobile;
