

// const buildCategoryTree = (categories: ICategory[]): ICategory[] => {
//   const categoryMap: { [key: string]: ICategory } = {};
//   const tree: ICategory[] = [];

//   // Tạo map để truy cập nhanh
//   categories.forEach((category: ICategory) => {
//     categoryMap[category._id] = {
//       ...category,
//       children: [] as ICategory[],
//     };
//   });

//   // Xây dựng cây
//   categories.forEach((category) => {
//     if (category.parentId) {
//       // Nếu có parentId, thêm vào danh sách children của cha
//       categoryMap[category.parentId]?.children?.push(categoryMap[category._id]);
//     } else {
//       // Nếu không có parentId, đây là gốc
//       tree.push(categoryMap[category._id]);
//     }
//   });

//   return tree;
// };

// export default buildCategoryTree;