'use client'

import { useState } from 'react'
import { debounce } from 'lodash'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Loader2 } from 'lucide-react'
import { Restaurant, PaginationType } from "@/@types"
import { fetchAllRestaurants } from '@/action/restaurant'
import { RestaurantCard } from '@/components/restaurant-card'
import { ErrorState } from '@/components/error-state'
import { Header } from '@/components/header'
import "react-toastify/dist/ReactToastify.css"

interface HomePageProps {
  initialRestaurants: Restaurant[]
  pagination: PaginationType
}

export default function HomePage({
  initialRestaurants,
  pagination: initialPagination
}: HomePageProps) {

  const [restaurants, setRestaurants] = useState<Restaurant[]>(initialRestaurants)
  const [pagination, setPagination] = useState<PaginationType>(initialPagination)
  const [searchTerm, setSearchTerm] = useState('')
  const [buttonLoading, setButtonLoading] = useState({
    search: false,
    pagination: false
  })
  const [error, setError] = useState<Error | null>(null)

  const debouncedSearch = debounce(async (term: string) => {
    try {
      setButtonLoading(prev => ({ ...prev, search: true }))
      setError(null)

      const { restaurants: searchedRestaurants, pagination: searchPagination } = await fetchAllRestaurants({
        search: term,
        page: 1,
        limit: 10
      })

      setRestaurants(searchedRestaurants)
      setPagination(searchPagination)
    } catch (error) {
      console.error("Error searching restaurants:", error)
      setError(error instanceof Error ? error : new Error('An unknown error occurred'))
    } finally {
      setButtonLoading(prev => ({ ...prev, search: false }))
    }
  }, 500)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)

    debouncedSearch(term)
  }

  const handlePageChange = async (page: number) => {
    try {
      setButtonLoading(prev => ({ ...prev, pagination: true }))
      setError(null)

      const { restaurants: pageRestaurants, pagination: pagePagination } = await fetchAllRestaurants({
        search: searchTerm,
        page,
        limit: 10
      })

      setRestaurants(pageRestaurants)
      setPagination(pagePagination)
    } catch (error) {
      console.error("Error changing page:", error)
      setError(error instanceof Error ? error : new Error('An unknown error occurred'))
    } finally {
      setButtonLoading(prev => ({ ...prev, pagination: false }))
    }
  }

  if (error) {
    return <ErrorState />
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        isSearchDisabled={buttonLoading.search}
      />
      <main className="flex-grow container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <RestaurantCard 
              key={restaurant.id} 
              id={restaurant.id} 
              image={restaurant.image} 
              name={restaurant.name} 
              isOpen={restaurant.isOpen}
            />
          ))}
        </div>

        {restaurants.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No restaurants found.
          </div>
        )}

        <div className="mt-8">
          <Pagination>
            <PaginationContent className="flex-wrap justify-center">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (pagination.hasPreviousPage) {
                      handlePageChange(pagination.currentPage - 1)
                    }
                  }}
                  aria-disabled={!pagination.hasPreviousPage || buttonLoading.pagination}
                  className={(!pagination.hasPreviousPage || buttonLoading.pagination) ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {[...Array(pagination.totalPages)].map((_, index) => (
                <PaginationItem key={index} className="hidden sm:inline-block">
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      handlePageChange(index + 1)
                    }}
                    isActive={pagination.currentPage === index + 1}
                    aria-disabled={buttonLoading.pagination}
                    className={buttonLoading.pagination ? "pointer-events-none opacity-50" : ""}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (pagination.hasNextPage) {
                      handlePageChange(pagination.currentPage + 1)
                    }
                  }}
                  aria-disabled={!pagination.hasNextPage || buttonLoading.pagination}
                  className={(!pagination.hasNextPage || buttonLoading.pagination) ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <div className="text-center text-sm text-muted-foreground mt-4">
            {buttonLoading.pagination ? (
              <div className="flex justify-center items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </div>
            ) : (
              <>
                Page {pagination.currentPage} of {pagination.totalPages}
                {pagination.totalItems > 0 && ` (${pagination.totalItems} total restaurants)`}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

