export const mockWorkflows = [
  {
    id: 1,
    title: 'Workflow 1',
    type: 'step_in_out',
    meta: { operation: 'in', step: '102030' },
    filters: { origins: ['1'], sectors: ['2'] },
    tasks: [
      {
        trigger: 'now',
        type: 'follow_up',
        title: 'Ligar pra pessoa',
        when: { type: 'hours', value: 5 },
      },
      {
        trigger: 'after_previous',
        type: 'follow_up',
        title: 'Ligar pra pessoa de novo',
        when: { type: 'days', value: 5 },
      },
    ],
  },
]
