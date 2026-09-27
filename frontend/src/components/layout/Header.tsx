import {
  Bell,
  Search,
} from "lucide-react"

import {
  useEffect,
  useState,
} from "react"

import {
  useNavigate,
} from "react-router-dom"

import {
  getComplaints,
} from "../../services/api"

import type {
  Complaint,
} from "../../types/api"


function Header() {

  const navigate =
    useNavigate()


  const [
    search,
    setSearch,
  ] =
    useState("")


  const [
    results,
    setResults,
  ] =
    useState<Complaint[]>([])


  const [
    focused,
    setFocused,
  ] =
    useState(false)


  const [
    notificationsOpen,
    setNotificationsOpen,
  ] =
    useState(false)


  useEffect(() => {

    const query =
      search.trim()


    if (!query) {

      setResults([])

      return
    }


    const timer =
      window.setTimeout(
        async () => {

          try {

            const response =
              await getComplaints({
                limit: 10,
                offset: 0,
              })


            const q =
              query.toLowerCase()


            setResults(
              response.items
                .filter(
                  (item) =>
                    [
                      item.complaint_id,
                      item.account_id,
                      item.category,
                      item.region,
                    ].some(
                      (value) =>
                        String(value)
                          .toLowerCase()
                          .includes(q),
                    ),
                )
                .slice(0, 5),
            )

          } catch {

            setResults([])

          }

        },
        250,
      )


    return () =>
      window.clearTimeout(
        timer,
      )

  }, [search])


  return (

    <header className="flex h-16 items-center justify-between border-b bg-white px-6">

      <div>

        <p className="text-sm text-slate-500">
          Complaint Operations
        </p>

      </div>


      <div className="flex items-center gap-4">

        <div className="relative hidden md:block">

          <div className="flex items-center gap-2 rounded-lg border bg-slate-50 px-3 py-2">

            <Search className="h-4 w-4 text-slate-400" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              onFocus={() =>
                setFocused(true)
              }
              onBlur={() =>
                window.setTimeout(
                  () =>
                    setFocused(
                      false,
                    ),
                  150,
                )
              }
              placeholder="Search complaints..."
              className="w-56 bg-transparent text-sm outline-none"
            />

          </div>


          {focused &&
            search.trim() && (

              <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-xl border bg-white shadow-xl">

                {results.length ? (

                  <div className="divide-y">

                    {results.map(
                      (item) => (

                        <button
                          key={
                            item.complaint_id
                          }
                          onMouseDown={(
                            event,
                          ) =>
                            event.preventDefault()
                          }
                          onClick={() => {

                            setSearch("")

                            setFocused(
                              false,
                            )

                            navigate(
                              `/complaints/${item.complaint_id}`,
                            )

                          }}
                          className="w-full px-4 py-3 text-left hover:bg-slate-50"
                        >

                          <p className="text-sm font-semibold text-slate-900">
                            {
                              item.complaint_id
                            }
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {
                              item.account_id
                            }
                            {" · "}
                            {
                              item.category
                            }
                          </p>

                        </button>

                      ),
                    )}

                  </div>

                ) : (

                  <div className="p-5 text-center text-sm text-slate-500">
                    No results on the current page.
                  </div>

                )}

              </div>

            )}

        </div>


        <div className="relative">

          <button
            onClick={() =>
              setNotificationsOpen(
                (value) =>
                  !value,
              )
            }
            className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >

            <Bell className="h-5 w-5" />

            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
              !
            </span>

          </button>


          {notificationsOpen && (

            <div className="absolute right-0 top-12 z-50 w-80 rounded-xl border bg-white p-4 shadow-xl">

              <p className="text-sm font-semibold text-slate-900">
                Operational alerts
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Use the Complaints page to review live SLA breaches and open cases.
              </p>

            </div>

          )}

        </div>


        <div className="flex items-center gap-3 border-l pl-4">

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            AG
          </div>

          <div className="hidden sm:block">

            <p className="text-sm font-medium text-slate-900">
              Agent
            </p>

            <p className="text-xs text-slate-500">
              Customer Operations
            </p>

          </div>

        </div>

      </div>

    </header>
  )
}


export default Header