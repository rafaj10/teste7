const events = [
  {
    id: 1,
    title: "Lembrete de cadencia",
    start: new Date().setDate(new Date().getDate() + 1),
    className: "bg-success text-white",
  },
  {
    id: 2,
    title: "1a tentativa de ligação",
    start: new Date(),
    end: new Date(),
    className: "bg-success text-white",
  },
  {
    id: 3,
    title: "Retornar Ligação",
    start: new Date().setDate(new Date().getDate() + 18),
    className: "bg-dark text-white",
  },
  {
    id: 4,
    title: "Ligação para Coca-Cola",
    start: new Date().setDate(new Date().getDate() - 9),
    className: "bg-primary text-white",
  },
  {
    id: 5,
    title: "Ação de cadencia",
    start: new Date().setDate(new Date().getDate() - 3),
    className: "bg-info text-white",
  },
  {
    id: 6,
    title: "Retorno",
    start: new Date().setDate(new Date().getDate()),
    className: "bg-danger text-white",
  },
  {
    id: 7,
    title: "Proposta Black-Friday",
    start: new Date().setDate(new Date().getDate() + 4),
    className: "bg-primary text-white",
  },
  {
    id: 8,
    title: "Validação semanal",
    start: new Date().setDate(new Date().getDate() - 5),
    end: new Date().setDate(new Date().getDate() - 3),
    className: "bg-warning text-white",
  },
];

const calenderDefaultCategories = [
  {
    id: 1,
    title: "Nova tarefa interna",
    type: "bg-success",
  },
  {
    id: 2,
    title: "Nova reunião",
    type: "bg-info",
  },
  {
    id: 3,
    title: "Lembrete",
    type: "bg-warning",
  },
  {
    id: 4,
    title: "Criar tarefa urgente",
    type: "bg-danger",
  },
]

export { calenderDefaultCategories, events }
