import { useState, useEffect, useMemo } from 'react'
import DataTable from '../components/DataTable'
import academicTeamsData from '../assets/data/AcademicTeams.json'

const UniversityRankings = () => {
  const [universities, setUniversities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadUniversityData = () => {
      try {
        setLoading(true)
        
        // Group teams by university
        const universityMap = new Map()
        const currentYear = new Date().getFullYear()
        
        Object.entries(academicTeamsData).forEach(([id, team]) => {
          const university = team.university
          
          if (!university || university === 'Unknown' || university === 'N/A') return
          
          const rating = team.rating?.[currentYear] || team.rating?.[currentYear - 1] || {}
          const ratingPoints = rating.rating_points || 0
          
          if (!universityMap.has(university)) {
            universityMap.set(university, {
              university,
              teams: [],
              totalRating: 0,
              avgRating: 0,
              topRating: 0,
              country: team.country || 'N/A',
            })
          }
          
          const uniData = universityMap.get(university)
          uniData.teams.push({
            id: parseInt(id),
            name: team.name || team.primary_alias,
            rating: ratingPoints,
          })
          uniData.totalRating += ratingPoints
          uniData.topRating = Math.max(uniData.topRating, ratingPoints)
        })
        
        // Calculate averages and sort
        const universityData = Array.from(universityMap.values())
          .map(uni => ({
            ...uni,
            avgRating: uni.teams.length > 0 ? uni.totalRating / uni.teams.length : 0,
            teamCount: uni.teams.length,
          }))
          .sort((a, b) => b.totalRating - a.totalRating)
        
        setUniversities(universityData)
      } catch (err) {
        setError(err.message)
        console.error('Error loading university data:', err)
      } finally {
        setLoading(false)
      }
    }

    loadUniversityData()
  }, [])

  const columns = useMemo(
    () => [
      {
        accessorKey: 'university',
        header: 'University',
        cell: ({ getValue }) => (
          <div className="font-medium">{getValue()}</div>
        ),
      },
      {
        accessorKey: 'country',
        header: 'Country',
        cell: ({ getValue }) => {
          const value = getValue()
          return value && value !== 'N/A' ? (
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
        accessorKey: 'teamCount',
        header: 'Teams',
        cell: ({ getValue }) => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
            {getValue()}
          </span>
        ),
      },
      {
        accessorKey: 'totalRating',
        header: 'Total Rating',
        cell: ({ getValue }) => getValue().toFixed(2),
      },
      {
        accessorKey: 'avgRating',
        header: 'Avg Rating',
        cell: ({ getValue }) => getValue().toFixed(2),
      },
      {
        accessorKey: 'topRating',
        header: 'Top Team Rating',
        cell: ({ getValue }) => getValue().toFixed(2),
      },
      {
        accessorKey: 'teams',
        header: 'Top Teams',
        cell: ({ getValue }) => {
          const teams = getValue()
          const topTeams = teams
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 3)
          
          return (
            <div className="text-sm">
              {topTeams.map((team, idx) => (
                <div key={team.id} className="truncate">
                  <a
                    href={`https://ctftime.org/team/${team.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {team.name}
                  </a>
                  {idx < topTeams.length - 1 && ', '}
                </div>
              ))}
            </div>
          )
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
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading university rankings...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card p-8 text-center">
        <p className="text-red-500 dark:text-red-400">Error loading universities: {error}</p>
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
      data={universities}
      columns={columns}
      title="University Rankings"
      searchPlaceholder="Search universities or countries..."
    />
  )
}

export default UniversityRankings
