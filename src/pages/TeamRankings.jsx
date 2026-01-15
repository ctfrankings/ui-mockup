import { useState, useEffect, useMemo } from 'react'
import DataTable from '../components/DataTable'
import academicTeamsData from '../assets/data/AcademicTeams.json'

const TeamRankings = () => {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadTeams = () => {
      try {
        setLoading(true)
        setError(null)
        
        const currentYear = new Date().getFullYear()
        
        // Convert the object to an array and enrich with data
        const enrichedTeams = Object.entries(academicTeamsData).map(([id, team]) => {
          const rating = team.rating?.[currentYear] || team.rating?.[currentYear - 1] || {}
          
          return {
            id: parseInt(id),
            name: team.name || team.primary_alias,
            country: team.country,
            academic: team.academic,
            rating_points: rating.rating_points || 0,
            rating_place: rating.rating_place || null,
            country_place: rating.country_place || null,
            university: team.university || 'N/A',
          }
        })
        
        // Sort by rating points (descending)
        enrichedTeams.sort((a, b) => b.rating_points - a.rating_points)
        
        console.log('Loaded teams:', enrichedTeams.length)
        setTeams(enrichedTeams)
      } catch (err) {
        setError(err.message)
        console.error('Error loading teams:', err)
      } finally {
        setLoading(false)
      }
    }

    loadTeams()
  }, [])

  const columns = useMemo(
    () => [
      {
        accessorKey: 'rating_place',
        header: 'Rank',
        cell: ({ getValue }) => {
          const value = getValue()
          return value || 'N/A'
        },
      },
      {
        accessorKey: 'name',
        header: 'Team Name',
        cell: ({ row, getValue }) => (
          <a
            href={`https://ctftime.org/team/${row.original.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline font-medium"
          >
            {getValue()}
          </a>
        ),
      },
      {
        accessorKey: 'university',
        header: 'University',
      },
      {
        accessorKey: 'country',
        header: 'Country',
        cell: ({ getValue }) => {
          const value = getValue()
          return value ? (
            <span className="inline-flex items-center">
              <span className="mr-2">{value}</span>
              <img
                src={`https://flagcdn.com/16x12/${value.toLowerCase()}.png`}
                alt={value}
                className="inline-block"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </span>
          ) : 'N/A'
        },
      },
      {
        accessorKey: 'rating_points',
        header: 'Rating Points',
        cell: ({ getValue }) => {
          const value = getValue()
          return value ? value.toFixed(2) : '0.00'
        },
      },
      {
        accessorKey: 'country_place',
        header: 'Country Rank',
        cell: ({ getValue }) => {
          const value = getValue()
          return value || 'N/A'
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
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading teams...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card p-8 text-center">
        <p className="text-red-500 dark:text-red-400">Error loading teams: {error}</p>
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
      data={teams}
      columns={columns}
      title="Team Rankings"
      searchPlaceholder="Search teams, universities, or countries..."
    />
  )
}

export default TeamRankings
