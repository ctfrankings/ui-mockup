import { useState, useEffect, useMemo } from 'react'
import DataTable from '../components/DataTable'
import eventsData from '../assets/data/events.json'

const CTFRankings = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadEvents = () => {
      try {
        setLoading(true)
        
        // Filter events from the past year
        const oneYearAgo = new Date()
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
        const oneYearAgoTimestamp = oneYearAgo.getTime() / 1000
        
        const recentEvents = eventsData.filter(event => {
          const eventStart = new Date(event.start).getTime() / 1000
          return eventStart >= oneYearAgoTimestamp
        })
        
        // Sort by weight (importance) and participants
        const sortedEvents = recentEvents.sort((a, b) => {
          if (b.weight !== a.weight) {
            return b.weight - a.weight
          }
          return b.participants - a.participants
        })
        
        setEvents(sortedEvents)
      } catch (err) {
        setError(err.message)
        console.error('Error loading events:', err)
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  const columns = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: 'CTF Name',
        cell: ({ row, getValue }) => (
          <a
            href={row.original.ctftime_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline font-medium"
          >
            {getValue()}
          </a>
        ),
      },
      {
        accessorKey: 'start',
        header: 'Date',
        cell: ({ getValue }) => {
          const date = new Date(getValue())
          return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        },
      },
      {
        accessorKey: 'format',
        header: 'Format',
      },
      {
        accessorKey: 'participants',
        header: 'Participants',
      },
      {
        accessorKey: 'weight',
        header: 'Weight',
        cell: ({ getValue }) => {
          const weight = getValue()
          const bgColor = weight >= 50 
            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
            : weight >= 25 
            ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
          
          return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}>
              {weight.toFixed(2)}
            </span>
          )
        },
      },
      {
        accessorKey: 'duration',
        header: 'Duration',
        cell: ({ getValue }) => {
          const duration = getValue()
          const days = duration.days
          const hours = duration.hours
          
          if (days > 0) {
            return `${days}d ${hours}h`
          }
          return `${hours}h`
        },
      },
      {
        accessorKey: 'location',
        header: 'Location',
        cell: ({ row, getValue }) => {
          const location = getValue()
          const onsite = row.original.onsite
          
          if (onsite && location) {
            return (
              <span className="inline-flex items-center">
                <span className="mr-1">📍</span>
                {location}
              </span>
            )
          }
          return <span className="text-gray-500">Online</span>
        },
      },
      {
        accessorKey: 'organizers',
        header: 'Organizers',
        cell: ({ getValue }) => {
          const organizers = getValue()
          if (!organizers || organizers.length === 0) return 'N/A'
          
          return organizers.map(org => org.name).join(', ')
        },
      },
    ],
    []
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading CTF events...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card p-8 text-center">
        <p className="text-red-500 dark:text-red-400">Error loading events: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary mt-4"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <DataTable
      data={events}
      columns={columns}
      title="CTF Rankings"
      searchPlaceholder="Search CTF events, formats, or organizers..."
    />
  )
}

export default CTFRankings
