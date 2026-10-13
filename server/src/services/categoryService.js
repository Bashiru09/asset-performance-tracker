const prisma = require('../lib/prisma')

const createCategory = async (name, userId) => {
  if (!name || name.trim() === '') {
    const error = new Error('Category name is required')
    error.statusCode = 400
    throw error
  }

  const category = await prisma.category.create({
    data: {
      name: name.trim(),
      userId,
    },
  })

  return category
}


const getCategories = async (userId) => {
  const categories = await prisma.category.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return categories
}


const deleteCategory = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id }
  });

  if (!category) {
    throw new Error("Category not found");
  }

  await prisma.category.delete({
    where: { id }
  });

  return {
    message: "Category deleted successfully"
  };
};



const updateCategory = async (id, data) => {
  const category = await prisma.category.findUnique({
    where: {
      id: id,
    },
  })

  if (!category) {
    throw new Error('Category not found')
  }

  const updatedCategory = await prisma.category.update({
    where: {
      id: id,
    },
    data: {
      name: data.name,
    },
  })

  return updatedCategory
}

module.exports = {
  createCategory,
  getCategories,
  deleteCategory,
  updateCategory
}