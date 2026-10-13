import { useEffect, useState } from 'react'
import {
  Folder,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react'

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/categoryService'

function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showForm, setShowForm] = useState(false)
  const [categoryName, setCategoryName] = useState('')
  const [editingCategory, setEditingCategory] = useState(null)

  const [openMenu, setOpenMenu] = useState(null)
  const [categoryToDelete, setCategoryToDelete] = useState(null)

  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let cancelled = false

    const loadCategories = async () => {
      try {
        const data = await getCategories()

        if (!cancelled) {
          setCategories(data)
          setLoading(false)
        }
      } catch (error) {
        console.error('Failed to load categories:', error)

        if (!cancelled) {
          setError(error.message)
          setLoading(false)
        }
      }
    }

    loadCategories()

    return () => {
      cancelled = true
    }
  }, [])

  const refreshCategories = async () => {
    try {
      setError(null)

      const data = await getCategories()

      setCategories(data)
    } catch (error) {
      console.error('Failed to load categories:', error)
      setError(error.message)
    }
  }

  const openCreateForm = () => {
    setEditingCategory(null)
    setCategoryName('')
    setShowForm(true)
    setError(null)
  }

  const openEditForm = (category) => {
    setEditingCategory(category)
    setCategoryName(category.name)
    setShowForm(true)
    setOpenMenu(null)
    setError(null)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingCategory(null)
    setCategoryName('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const trimmedName = categoryName.trim()

    if (!trimmedName) {
      setError('Category name is required')
      return
    }

    try {
      setSaving(true)
      setError(null)

      if (editingCategory) {
        const updatedCategory = await updateCategory(
          editingCategory.id,
          trimmedName,
        )

        setCategories((currentCategories) =>
          currentCategories.map((category) =>
            category.id === updatedCategory.id
              ? updatedCategory
              : category,
          ),
        )
      } else {
        const newCategory = await createCategory(trimmedName)

        setCategories((currentCategories) => [
          newCategory,
          ...currentCategories,
        ])
      }

      closeForm()
    } catch (error) {
      console.error('Failed to save category:', error)
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const openDeleteDialog = (category) => {
    setCategoryToDelete(category)
    setOpenMenu(null)
  }

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) {
      return
    }

    try {
      setDeleting(true)
      setError(null)

      await deleteCategory(categoryToDelete.id)

      setCategories((currentCategories) =>
        currentCategories.filter(
          (category) => category.id !== categoryToDelete.id,
        ),
      )

      setCategoryToDelete(null)
    } catch (error) {
      console.error('Failed to delete category:', error)
      setError(error.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Categories
          </h1>

          <p className="text-muted-foreground">
            Organize your assets into categories.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Add Category
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Create / Edit Form */}
      {showForm && (
        <section className="rounded-xl border bg-background p-5">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">
              {editingCategory
                ? 'Edit Category'
                : 'Add Category'}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {editingCategory
                ? 'Update the category name.'
                : 'Create a category to organize your assets.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="category-name"
                className="mb-2 block text-sm font-medium"
              >
                Category name
              </label>

              <input
                id="category-name"
                type="text"
                value={categoryName}
                onChange={(event) =>
                  setCategoryName(event.target.value)
                }
                placeholder="e.g. Ghana Stock Exchange"
                disabled={saving}
                autoFocus
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? editingCategory
                    ? 'Saving...'
                    : 'Creating...'
                  : editingCategory
                    ? 'Save Changes'
                    : 'Create Category'}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Categories */}
      <section className="rounded-xl border bg-background">
        <div className="border-b p-5">
          <h2 className="text-lg font-semibold">
            Your Categories
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage the categories used to organize your assets.
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Folder className="h-5 w-5 text-muted-foreground" />
            </div>

            <h3 className="mt-4 text-sm font-semibold">
              No categories yet
            </h3>

            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Create your first category to start organizing your assets.
            </p>

            <button
              type="button"
              onClick={openCreateForm}
              className="mt-5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Create Category
            </button>
          </div>
        ) : (
          <div className="divide-y">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between gap-4 p-5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Folder className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {category.name}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Category
                    </p>
                  </div>
                </div>

                {/* Menu */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenMenu(
                        openMenu === category.id
                          ? null
                          : category.id,
                      )
                    }
                    className="rounded-md p-2 hover:bg-accent"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>

                  {openMenu === category.id && (
                    <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-md border bg-background p-1 shadow-md">
                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(category)
                        }
                        className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          openDeleteDialog(category)
                        }
                        className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-destructive hover:bg-accent"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Delete confirmation */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border bg-background p-6 shadow-lg">
            <h2 className="text-lg font-semibold">
              Delete category?
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to delete{' '}
              <span className="font-medium text-foreground">
                {categoryToDelete.name}
              </span>
              ?
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() =>
                  setCategoryToDelete(null)
                }
                disabled={deleting}
                className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteCategory}
                disabled={deleting}
                className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Categories
