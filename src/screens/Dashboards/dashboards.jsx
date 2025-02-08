import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Row, Col, Card, CardBody, CardTitle, Table } from 'reactstrap'
import Tour from 'reactour'
import Breadcrumbs from '../../components/Common/Breadcrumb'
import SimpleLineChart from '../AllCharts/rechart/SimpleLineChart'
import Apaexlinecolumn from '../AllCharts/apex/apaexlinecolumn'
import OrigemEtapa from '../AllCharts/apex/origemetapa'
import SegmentoEtapa from '../AllCharts/apex/segmentoetapa'
import ProdutoEtapa from '../AllCharts/apex/produtoetapa'
import BarChart from '../AllCharts/apex/barchart'
import FunnelChart from '../AllCharts/apex/FunnelChart'
import Spinners from '../../components/Common/Spinner'
import verificationImg from '../../assets/images/verification-img.png'
import { useBoardSelector } from '../../store/board/selectors'
import { getBoardListReq } from '../../store/board/actions'
import { useDashboard } from '../../store/dashboard/hooks'
import BoardStepSelector from '../../components/Common/BoardStepSelector'

const Dashboards = () => {
  document.title = 'Dashboard | 7Stratos'

  const dispatch = useDispatch()
  const { boardList, isLoading } = useBoardSelector()
  const dashboard = useDashboard()
  const [boardId, setBoardId] = useState('')
  const [stepId, setStepId] = useState('')
  const [steps, setSteps] = useState([])
  const [isTourOpen, setIsTourOpen] = useState(false)

  const tourSteps = [
    {
      selector: '.breadcrumb',
      content: 'Aqui você pode navegar pelo dashboard e acessar diferentes seções.',
    },
    {
      selector: '.board-step-selector',
      content: 'Use este seletor para escolher o quadro e os passos que deseja visualizar.',
    },
    {
      selector: '.leads-steps-periods',
      content: 'Esta tabela mostra as etapas dos leads e os períodos.',
    },
    {
      selector: '.funnel-chart',
      content: 'Este gráfico mostra o funil de conversão dos leads.',
    },
    {
      selector: '.origem-etapa',
      content: 'Aqui você pode ver a conversão por origem e etapa.',
    },
    {
      selector: '.produto-etapa',
      content: 'Aqui você pode ver a conversão por produto e etapa.',
    },
    {
      selector: '.segmento-etapa',
      content: 'Aqui você pode ver a conversão por segmento e etapa.',
    },
  ]

  const { mutateAsync: getBoardList } = dashboard.getBoardList()
  const {
    mutateAsync: getDashboardWithBoardId,
    data: dash,
    isPending,
  } = dashboard.getDashboardInfoWithBoard()

  const init = async () => {
    const boards = await getBoardList()
    if (boards.length > 0) {
      const initialBoardId = boards[0]._id
      setBoardId(initialBoardId)
      await getDashboardWithBoardId(initialBoardId)
    }
  }

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    if (boardId) {
      getDashboardWithBoardId(boardId)
    }
  }, [boardId])

  const formatarTempo = (minutos) => {
    const meses = Math.floor(minutos / 43200)
    minutos %= 43200
    const dias = Math.floor(minutos / 1440)
    minutos %= 1440
    const horas = Math.floor(minutos / 60)
    minutos %= 60

    let resultado = []
    if (meses > 0) resultado.push(`${meses} mes${meses > 1 ? 'es' : ''}`)
    if (dias > 0) resultado.push(`${dias} dia${dias > 1 ? 's' : ''}`)
    if (horas > 0) resultado.push(`${horas} hora${horas > 1 ? 's' : ''}`)
    if (minutos > 0)
      resultado.push(`${minutos} minuto${minutos > 1 ? 's' : ''}`)

    return resultado.join(', ')
  }

  const nothinHere = (title) => (
    <Card>
      <CardBody>
        <CardTitle className="mb-4">{title}</CardTitle>
        <div className="text-center">
          <Row className="justify-content-center">
            <Col lg="10">
              <h4 className="mt-4 fw-semibold">Opa nada aqui ...</h4>
              <p className="text-muted mt-3">
                Ainda não temos dados o suficiente para essa métrica, em breve
                teremos novidades por aqui!
              </p>
            </Col>
          </Row>
          <Row className="justify-content-center mt-5 mb-2">
            <Col sm="6" xs="8">
              <div>
                <img src={verificationImg} className="img-fluid" />
              </div>
            </Col>
          </Row>
        </div>
      </CardBody>
    </Card>
  )

  return (
    <React.Fragment>
      <Tour
        steps={tourSteps}
        isOpen={isTourOpen}
        onRequestClose={() => setIsTourOpen(false)}
        startAt={0}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Meu Dashboard" breadcrumbItem="Conversão Geral" />
          <BoardStepSelector
            className="board-step-selector"
            setBoardId={setBoardId}
            setStepId={setStepId}
            setStepList={setSteps}
          />
          <Row>
            <Col xl={6}>
              {isLoading ? (
                <Spinners setLoading={isLoading} />
              ) : (
                <Card>
                  <CardBody>
                    <CardTitle className="h4 leads-steps-periods">
                      Leads Etapas e Périodos
                    </CardTitle>
                    <div className="table-responsive">
                      <Table className="table mb-0">
                        <thead>
                          <tr>
                            <th>Etapas</th>
                            <th>Entrada</th>
                            <th>SAÍDA</th>
                            <th>TAXA</th>
                            <th>LEAD TIME</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dash &&
                            dash.leadStepsTime &&
                            dash.leadStepsTime.map((i, index) => (
                              <tr key={index}>
                                <th scope="row">{i.step.name}</th>
                                <td>{i.in}</td>
                                <td>{i.out}</td>
                                <td>{Math.floor(i.percentage)}%</td>
                                <td>
                                  {formatarTempo(Math.floor(i.timeAvgMin))}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </Table>
                    </div>
                  </CardBody>
                </Card>
              )}
            </Col>
            <Col xl={6}>
              {isPending ? (
                <Spinners setLoading={isPending} />
              ) : (
                dash && (
                  <Card>
                    <CardBody>
                      <CardTitle className="card-title mb-4 funnel-chart">
                        Funil de conversão
                      </CardTitle>
                      <FunnelChart steps={dash.leadsCountByStep || []} />
                    </CardBody>
                  </Card>
                )
              )}
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              {isPending ? (
                <Spinners setLoading={isPending} />
              ) : dash && dash.leadsWonByOriginAndStep.count > 0 ? (
                <Card>
                  <CardBody>
                    <CardTitle className="mb-4 origem-etapa">
                      Conversão por Origem x Etapa
                    </CardTitle>
                    <OrigemEtapa
                      steps={dash.leadsWonByOriginAndStep || []}
                      dataColors='["--bs-danger","--bs-primary", "--bs-success"]'
                    />
                  </CardBody>
                </Card>
              ) : (
                nothinHere('Conversão por Origem x Etapa')
              )}
            </Col>
            <Col lg={6}>
              {isLoading ? (
                <Spinners setLoading={isLoading} />
              ) : dash && dash.leadsWonByProductAndStep.count > 0 ? (
                <Card>
                  <CardBody>
                    <CardTitle className="mb-4 produto-etapa">
                      Conversão por Produto x Etapa
                    </CardTitle>
                    <ProdutoEtapa
                      steps={dash.leadsWonByProductAndStep || []}
                      dataColors='["--bs-danger","--bs-primary", "--bs-success"]'
                    />
                  </CardBody>
                </Card>
              ) : (
                nothinHere('Conversão por Produto x Etapa')
              )}
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              {isLoading ? (
                <Spinners setLoading={isLoading} />
              ) : dash && dash.leadsWonBySectorAndStep.count > 0 ? (
                <Card>
                  <CardBody>
                    <CardTitle className="mb-4 segmento-etapa">
                      Conversão por Segmento x Etapa
                    </CardTitle>
                    <SegmentoEtapa
                      steps={dash.leadsWonBySectorAndStep || []}
                      dataColors='["--bs-danger","--bs-primary", "--bs-success"]'
                    />
                  </CardBody>
                </Card>
              ) : (
                nothinHere('Conversão por Segmento x Etapa')
              )}
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Dashboards
