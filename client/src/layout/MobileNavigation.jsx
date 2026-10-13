import { NavLink } from 'react-router-dom'

function MobileNavigation() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-center justify-around border-t bg-background md:hidden">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `text-sm font-medium ${
            isActive ? 'text-primary' : 'text-muted-foreground'
          }`
        }
      >
        Home
      </NavLink>

      <NavLink
        to="/portfolio"
        className={({ isActive }) =>
          `text-sm font-medium ${
            isActive ? 'text-primary' : 'text-muted-foreground'
          }`
        }
      >
        Portfolio
      </NavLink>

      <NavLink
        to="/assets"
        className={({ isActive }) =>
          `text-sm font-medium ${
            isActive ? 'text-primary' : 'text-muted-foreground'
          }`
        }
      >
        Assets
      </NavLink>

      <NavLink
        to="/history"
        className={({ isActive }) =>
          `text-sm font-medium ${
            isActive ? 'text-primary' : 'text-muted-foreground'
          }`
        }
      >
        History
      </NavLink>

      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `text-sm font-medium ${
            isActive ? 'text-primary' : 'text-muted-foreground'
          }`
        }
      >
        More
      </NavLink>
    </nav>
  )
}

export default MobileNavigation