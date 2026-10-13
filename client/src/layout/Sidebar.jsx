import { NavLink } from 'react-router-dom'
import UserMenu from '@/components/UserMenu'

function Sidebar({ user }) {
  return (
<aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-background md:flex md:flex-col">      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-lg font-semibold">
          Asset Tracker
        </h1>
      </div>

    <nav className="flex-1 space-y-1 p-4">
  <NavLink
    to="/"
    className={({ isActive }) =>
      `block rounded-md px-3 py-2 text-sm font-medium ${
        isActive
          ? 'bg-accent text-accent-foreground'
          : 'hover:bg-accent'
      }`
    }
  >
    Dashboard
  </NavLink>

  <NavLink
    to="/portfolio"
    className={({ isActive }) =>
      `block rounded-md px-3 py-2 text-sm font-medium ${
        isActive
          ? 'bg-accent text-accent-foreground'
          : 'hover:bg-accent'
      }`
    }
  >
    Portfolio
  </NavLink>

  <NavLink
    to="/categories"
    className={({ isActive }) =>
      `block rounded-md px-3 py-2 text-sm font-medium ${
        isActive
          ? 'bg-accent text-accent-foreground'
          : 'hover:bg-accent'
      }`
    }
  >
    Categories
  </NavLink>

  <NavLink
    to="/assets"
    className={({ isActive }) =>
      `block rounded-md px-3 py-2 text-sm font-medium ${
        isActive
          ? 'bg-accent text-accent-foreground'
          : 'hover:bg-accent'
      }`
    }
  >
    Assets
  </NavLink>

  <NavLink
    to="/history"
    className={({ isActive }) =>
      `block rounded-md px-3 py-2 text-sm font-medium ${
        isActive
          ? 'bg-accent text-accent-foreground'
          : 'hover:bg-accent'
      }`
    }
  >
    History
  </NavLink>

  <NavLink
    to="/settings"
    className={({ isActive }) =>
      `block rounded-md px-3 py-2 text-sm font-medium ${
        isActive
          ? 'bg-accent text-accent-foreground'
          : 'hover:bg-accent'
      }`
    }
  >
    Settings
  </NavLink>
</nav>

      <div className="border-t p-4">
        <UserMenu user={user} />
      </div>
    </aside>
  )
}

export default Sidebar