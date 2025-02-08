import { useSelector } from 'react-redux'

export const useLeadSelector = () => {
  const state = useSelector((state) => state.Leads)
  const lead = useSelector((state) => state.Leads?.data)
  const tasks = useSelector((state) => state.Leads?.tasks)
  const meetings = useSelector((state) => state.Leads?.meetings)

  const strategicContacts = lead?.contacts?.filter(
    (contact) => contact.strategic
  )

  const nonStrategicContacts = lead?.contacts?.filter(
    (contact) => !contact.strategic
  )

  const getCurrentStep = ({ steps }) => {
    return steps.find((step) => step._id === lead?.step?._id)
  }

  const contacts = lead?.contacts ?? []

  const observations = useSelector((state) => state.Leads?.observations)
  const isObservationsEmpty =
    observations?.data?.length === 0 &&
    !observations?.loading &&
    !observations?.error

  return {
    lead,
    tasks: tasks?.data ?? [],
    isTasksLoading: tasks?.loading ?? false,
    meetings,
    contacts,
    strategicContacts,
    nonStrategicContacts,
    currentStep: lead?.step,
    observations,
    isObservationsEmpty,
    state,
    getCurrentStep,
  }
}


