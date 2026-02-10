import { useAuth } from "../../context/AuthContext"

export default function AdminTopbar() {
  const { user } = useAuth()

  return (
    <header className="h-16 bg-white flex items-center shadow justify-end px-8">
      {/* User */}
      <div className="flex items-center gap-6">
        <div className="flex items-end gap-3 bg-emerald-100 px-4 py-1 rounded-2xl pb-2">
          <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
            {user?.email?.[0]?.toUpperCase()}
          </div>
          <div className="text-sm">
            <p className="font-semibold text-gray-700">
             {user?.role}
            </p>
            <p className="text-gray-400">{user?.email}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
