import Sidebar from "./Sidebar"
import Header from "./Header"
import MobileNavigation from "./MobileNavigation"

function AppLayout({ children, user }) {
  return (
    <div className="min-h-screen bg-muted/40 ">
      <Sidebar user={user} />

      <div className="md:pl-64">
        <Header />

        <main className="p-4 pb-20 md:p-6 md:pb-6 ">
          {children}
        </main>
      </div>

      <MobileNavigation />
    </div>
  )
}

export default AppLayout