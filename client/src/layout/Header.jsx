function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <div>
        <h2 className="text-lg font-semibold">
          Asset Performance Tracker
        </h2>
      </div>

      <button className="rounded-md p-2 text-sm hover:bg-accent">
        Notifications
      </button>
    </header>
  )
}

export default Header