import { useEffect, useState } from 'react'
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Package,
} from 'lucide-react'

import {
  getAssets,
  createAsset,
  updateAsset,
  deleteAsset,
} from '../services/assetService'

import { getCategories } from '../services/categoryService'

function Assets() {
  const [assets, setAssets] = useState([])
  const [categories, setCategories] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showForm, setShowForm] = useState(false)
  const [editingAsset, setEditingAsset] = useState(null)

  const [assetName, setAssetName] = useState('')
  const [categoryId, setCategoryId] = useState('')

  const [openMenu, setOpenMenu] = useState(null)
  const [assetToDelete, setAssetToDelete] = useState(null)

  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Load assets and categories
  useEffect(() => {
    let cancelled = false

    const loadData = async () => {
      try {
        const [assetsData, categoriesData] =
          await Promise.all([
            getAssets(),
            getCategories(),
          ])

        if (!cancelled) {
          setAssets(assetsData)
          setCategories(categoriesData)
          setLoading(false)
        }
      } catch (error) {
        console.error('Failed to load assets:', error)

        if (!cancelled) {
          setError(error.message)
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      cancelled = true
    }
  }, [])

  // Open create form
  const openCreateForm = () => {
    setEditingAsset(null)
    setAssetName('')
    setCategoryId('')
    setShowForm(true)
    setError(null)
  }

  // Open edit form
  const openEditForm = (asset) => {
    setEditingAsset(asset)
    setAssetName(asset.name)
    setCategoryId(asset.categoryId)
    setShowForm(true)
    setOpenMenu(null)
    setError(null)
  }

  // Close form
  const closeForm = () => {
    setShowForm(false)
    setEditingAsset(null)
    setAssetName('')
    setCategoryId('')
  }

  // Create or update asset
  const handleSubmit = async (event) => {
    event.preventDefault()

    const trimmedName = assetName.trim()

    if (!trimmedName) {
      setError('Asset name is required')
      return
    }

    if (!categoryId) {
      setError('Category is required')
      return
    }

    try {
      setSaving(true)
      setError(null)

      if (editingAsset) {
      const updatedAsset = await updateAsset(
  editingAsset.id,
  trimmedName,
)
        
        setAssets((currentAssets) =>
          currentAssets.map((asset) =>
            asset.id === updatedAsset.id
              ? updatedAsset
              : asset,
          ),
        )
      } else {
        const newAsset = await createAsset(
          trimmedName,
          categoryId,
        )

        setAssets((currentAssets) => [
          newAsset,
          ...currentAssets,
        ])
      }

      closeForm()
    } catch (error) {
      console.error('Failed to save asset:', error)
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  // Open delete confirmation
  const openDeleteDialog = (asset) => {
    setAssetToDelete(asset)
    setOpenMenu(null)
  }

  // Delete asset
  const handleDeleteAsset = async () => {
    if (!assetToDelete) {
      return
    }

    try {
      setDeleting(true)
      setError(null)

      await deleteAsset(assetToDelete.id)

      setAssets((currentAssets) =>
        currentAssets.filter(
          (asset) => asset.id !== assetToDelete.id,
        ),
      )

      setAssetToDelete(null)
    } catch (error) {
      console.error('Failed to delete asset:', error)
      setError(error.message)
    } finally {
      setDeleting(false)
    }
  }

  // Find category name
  const getCategoryName = (assetCategoryId) => {
    const category = categories.find(
      (category) => category.id === assetCategoryId,
    )

    return category?.name || 'Unknown category'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Assets
          </h1>

          <p className="text-muted-foreground">
            Manage the assets in your portfolio.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Add Asset
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Create / Edit form */}
      {showForm && (
        <section className="rounded-xl border bg-background p-5">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">
              {editingAsset
                ? 'Edit Asset'
                : 'Add Asset'}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {editingAsset
                ? 'Update the asset information.'
                : 'Add an asset to your portfolio.'}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {/* Asset name */}
            <div>
              <label
                htmlFor="asset-name"
                className="mb-2 block text-sm font-medium"
              >
                Asset name
              </label>

              <input
                id="asset-name"
                type="text"
                value={assetName}
                onChange={(event) =>
                  setAssetName(event.target.value)
                }
                placeholder="e.g. MTN Ghana"
                disabled={saving}
                autoFocus
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="asset-category"
                className="mb-2 block text-sm font-medium"
              >
                Category
              </label>

              <select
                id="asset-category"
                value={categoryId}
                onChange={(event) =>
                  setCategoryId(event.target.value)
                }
                disabled={saving}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">
                  Select a category
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Form actions */}
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
                  ? editingAsset
                    ? 'Saving...'
                    : 'Creating...'
                  : editingAsset
                    ? 'Save Changes'
                    : 'Create Asset'}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Assets list */}
      <section className="rounded-xl border bg-background">
        <div className="border-b p-5">
          <h2 className="text-lg font-semibold">
            Your Assets
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            View and manage the assets in your portfolio.
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Loading assets...
          </div>
        ) : assets.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Package className="h-5 w-5 text-muted-foreground" />
            </div>

            <h3 className="mt-4 text-sm font-semibold">
              No assets yet
            </h3>

            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Add your first asset to start tracking your portfolio.
            </p>

            <button
              type="button"
              onClick={openCreateForm}
              className="mt-5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Add Asset
            </button>
          </div>
        ) : (
          /* Asset rows */
          <div className="divide-y">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="flex items-center justify-between gap-4 p-5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Package className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {asset.name}
                    </p>

                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {getCategoryName(asset.categoryId)}
                    </p>
                  </div>
                </div>

                {/* Menu */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenMenu(
                        openMenu === asset.id
                          ? null
                          : asset.id,
                      )
                    }
                    className="rounded-md p-2 hover:bg-accent"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>

                  {openMenu === asset.id && (
                    <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-md border bg-background p-1 shadow-md">
                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(asset)
                        }
                        className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          openDeleteDialog(asset)
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
      {assetToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border bg-background p-6 shadow-lg">
            <h2 className="text-lg font-semibold">
              Delete asset?
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to delete{' '}
              <span className="font-medium text-foreground">
                {assetToDelete.name}
              </span>
              ?
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAssetToDelete(null)}
                disabled={deleting}
                className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteAsset}
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

export default Assets
