import { useSelector } from 'react-redux'

export const usePeopleSelector = () => {
  const peoples = useSelector(({ Peoples }) => Peoples.peoples ?? [])

  const agenciesByCompany = useSelector(
    ({ Peoples }) => Peoples.agenciesByCompany ?? []
  )
  const personsByCompany = useSelector(
    ({ Peoples }) => Peoples.personsByCompany ?? []
  )
  const personsByAgency = useSelector(
    ({ Peoples }) => Peoples.personsByAgency ?? []
  )
  const usersByTenant = useSelector(
    ({ Peoples }) => Peoples.usersByTenant ?? []
  )
  const loading = useSelector(({ Peoples }) => Peoples.loading ?? false)
  const error = useSelector(({ Peoples }) => Peoples.error ?? {})

  const createdPeople = useSelector(
    ({ Peoples }) => Peoples.createdPeople ?? null
  )

  return {
    createdPeople,
    peoples,
    agenciesByCompany,
    personsByCompany,
    personsByAgency,
    usersByTenant,
    loading,
    error,
  }
}
