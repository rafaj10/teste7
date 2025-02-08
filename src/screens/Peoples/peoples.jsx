import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../../components/Common/withRouter';
import TableContainer from '../../components/Common/TableContainer';
import Spinners from '../../components/Common/Spinner';
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  UncontrolledTooltip,
  Input,
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Badge,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
} from 'reactstrap';
import { toast } from 'react-toastify';
import moment from 'moment/moment';
import { FunilFilter } from '../Funil/fragments/FunilFilter';

import ModalCreate from './modalCreate';
import ModalCreateContact from './modalCreateContact';
import ModalConfirmation from './modalConfirmation';

import verificationImg from '../../assets/images/verification-img.png';

// Import Breadcrumb
import Breadcrumbs from '/src/components/Common/Breadcrumb';

import {
  getPeoples as onGetPeoples,
  createPeoples as onCreatePeople,
  updatePeoples as onUpdatePeople,
  deletePeoples as onDeletePeople,
  loadingPeoples as onLoadingPeoples,
  createLeads as onCreateLeads,
} from '/src/store/peoples/actions';
import { useBoardSelector } from '../../store/board/selectors';
import { getBoardListReq } from '../../store/board/actions';

// Redux
import { useDispatch } from 'react-redux';
import { usePeopleSelector } from '../../store/peoples/selectors';
import { ToastContainer } from 'react-toastify';

import { getLoggedInUser } from '../../helpers/backend_helper';

// Import ReactTags
import { WithContext as ReactTags } from 'react-tag-input';
import './../../helpers/ReactTags.css';

// Import Select
import Select from 'react-select';
import { useBoard } from '../../store/board/hooks';

const Peoples = (props) => {
  const dispatch = useDispatch();
  const peopleSelector = usePeopleSelector();
  const { boardList } = useBoardSelector();
  const boardHooks = useBoard();
  const { data: usersByTenant } = boardHooks.getUsersByTenants();

  const searchParams = new URLSearchParams(document.location.search);

  let type = searchParams.get('type');

  document.title = '7stratos | ' + type;

  const findValue = (arr, type) => {
    if (!arr) return '';
    let myValue = '';
    arr.map((item) => {
      if (item.type.toLowerCase() === type) myValue = item.value;
    });
    return myValue;
  };

  const findValueByType = () => {
    if (type === 'person') return 'Contatos';
    if (type === 'company') return 'Empresa';
    if (type === 'agency') return 'Agencia';
  };

  const createPeople = (payload) => {
    toggle();
    dispatch(onLoadingPeoples());
    dispatch(
      onCreatePeople(type, payload, true, null, (success, resp) => {
        if (!success) {
          toast.error(`Atenção, esse registro já existe`);
        }
      })
    );
  };

  const updatePeople = (peopleId, payload, callback) => {
    dispatch(onLoadingPeoples());
    dispatch(onUpdatePeople(peopleId, type, payload, callback));
  };

  const onClickEdit = (userData) => {
    setEditing(userData);
    toggle();
  };

  const onClickDelete = (userData) => {
    setpeopleIdToDelete(userData._id);
    toggleConfirmation();
  };

  const [drp_primary1, setDrp_primary1] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalConfirmation, setModalConfirmation] = useState(false);
  const [editing, setEditing] = useState(null);
  const [peopleIdToDelete, setpeopleIdToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeoples, setSelectedPeoples] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [filterModal, setFilterModal] = useState({ open: false });

  // Estados para a troca de dono em lote
  const [modalChangeOwner, setModalChangeOwner] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [ownerProcessingStatus, setOwnerProcessingStatus] = useState([]);
  const [isOwnerProcessing, setIsOwnerProcessing] = useState(false);

  // Estados existentes
  const [modalBatchDelete, setModalBatchDelete] = useState(false);
  const [deleteProcessingStatus, setDeleteProcessingStatus] = useState([]);
  const [isDeleteProcessing, setIsDeleteProcessing] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  const [modalApplyTags, setModalApplyTags] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagProcessingStatus, setTagProcessingStatus] = useState([]);
  const [isTagProcessing, setIsTagProcessing] = useState(false);

  const [modalPushToFunil, setModalPushToFunil] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [processingStatus, setProcessingStatus] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const toggle = () => (modal ? setModal(false) : setModal(true));
  const toggleConfirmation = (shouldDelete) => {
    if (shouldDelete) {
      if (peopleIdToDelete) {
        dispatch(onLoadingPeoples());
        dispatch(onDeletePeople(peopleIdToDelete, type));
        setpeopleIdToDelete(null);
      }
    }
    modalConfirmation ? setModalConfirmation(false) : setModalConfirmation(true);
  };

  const keyField = 'id';

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedPeoples([]);
    } else {
      const allPeopleIds = peopleSelector.peoples.map((people) => people._id);
      setSelectedPeoples(allPeopleIds);
    }
    setSelectAll(!selectAll);
  };

  const handleSelectPeople = (id) => {
    if (selectedPeoples.includes(id)) {
      setSelectedPeoples(selectedPeoples.filter((peopleId) => peopleId !== id));
    } else {
      setSelectedPeoples([...selectedPeoples, id]);
    }
  };

  const handleOpenFilter = () => {
    setFilterModal({ open: !filterModal.open });
  };

  const handleApplyFilter = (filters) => {
    setFilterModal({ open: false });
    dispatch(onGetPeoples(searchParams.get('type'), filters));
  };

  const getNameById = (id) => {
    const person = peopleSelector.peoples.find((p) => p._id === id);
    return person ? person.name : '';
  };

  const pushToFunil = (type, board) => {
    setSelectedBoard(board);
    setModalPushToFunil(true);
  };

  const simulateProcessing = async () => {
    setIsProcessing(true);

    const userMeId = getLoggedInUser()?._id;

    setProcessingStatus(
      selectedPeoples.map((id) => ({
        id,
        name: getNameById(id),
        status: 'pending',
        error: null,
      }))
    );

    for (let i = 0; i < selectedPeoples.length; i++) {
      const id = selectedPeoples[i];
      const companyId = id;

      const company = peopleSelector.peoples.find((p) => p._id === companyId);

      if (!company) {
        setProcessingStatus((prevStatus) => {
          const newStatus = [...prevStatus];
          newStatus[i] = {
            ...newStatus[i],
            status: 'error',
            error: 'Empresa não encontrada.',
          };
          return newStatus;
        });
        continue;
      }

      const contacts =
        company.relations
          ?.filter((relation) => relation.type === 'person' && relation.people?._id)
          .map((relation) => ({
            person: relation.people._id,
            ref: companyId,
            strategic: false,
          })) || [];

      const steps = selectedBoard.steps;

      const stepStarter = steps.find((e) => e.flags?.starter);
      if (!stepStarter) {
        setProcessingStatus((prevStatus) => {
          const newStatus = [...prevStatus];
          newStatus[i] = {
            ...newStatus[i],
            status: 'error',
            error: 'Step inicial não encontrado no board.',
          };
          return newStatus;
        });
        continue;
      }

      const payload = {
        step: stepStarter._id,
        owner: userMeId,
        origin: 'em lote',
        title: selectedBoard.type === 'crm' ? 'Oportunidade' : '',
        type: selectedBoard.type,
        company: companyId,
        agency: '',
        contacts: contacts,
      };

      await new Promise((resolve) => {
        dispatch(
          onCreateLeads(selectedBoard._id, payload, (status, error) => {
            if (status === 'success') {
              setProcessingStatus((prevStatus) => {
                const newStatus = [...prevStatus];
                newStatus[i] = {
                  ...newStatus[i],
                  status: 'success',
                };
                return newStatus;
              });
            } else {
              setProcessingStatus((prevStatus) => {
                const newStatus = [...prevStatus];
                newStatus[i] = {
                  ...newStatus[i],
                  status: 'error',
                  error: error?.response?.data?.message || 'Erro desconhecido',
                };
                return newStatus;
              });
            }
            resolve();
          })
        );
      });
    }

    setIsProcessing(false);
  };

  const startBatchDeletion = async () => {
    setIsDeleteProcessing(true);

    setDeleteProcessingStatus(
      selectedPeoples.map((id) => ({
        id,
        name: getNameById(id),
        status: 'pending',
        error: null,
      }))
    );

    for (let i = 0; i < selectedPeoples.length; i++) {
      const id = selectedPeoples[i];

      await new Promise((resolve) => {
        dispatch(
          onDeletePeople(id, type, (status, error) => {
            if (status === 'success') {
              setDeleteProcessingStatus((prevStatus) => {
                const newStatus = [...prevStatus];
                newStatus[i] = {
                  ...newStatus[i],
                  status: 'success',
                };
                return newStatus;
              });
            } else {
              setDeleteProcessingStatus((prevStatus) => {
                const newStatus = [...prevStatus];
                newStatus[i] = {
                  ...newStatus[i],
                  status: 'error',
                  error: error?.response?.data?.message || 'Erro desconhecido',
                };
                return newStatus;
              });
            }
            resolve();
          })
        );
      });
    }

    setIsDeleteProcessing(false);

    // Clear selection and update the list
    setSelectedPeoples([]);
    setSelectAll(false);
    dispatch(onGetPeoples(type, null));
  };

  const startBatchTagging = async () => {
    if (tags.length === 0) {
      toast.error('Por favor, adicione ao menos uma tag.');
      return;
    }

    setIsTagProcessing(true);

    setTagProcessingStatus(
      selectedPeoples.map((id) => ({
        id,
        name: getNameById(id),
        status: 'pending',
        error: null,
      }))
    );

    for (let i = 0; i < selectedPeoples.length; i++) {
      const id = selectedPeoples[i];

      // Obter as tags existentes da pessoa
      const person = peopleSelector.peoples.find((p) => p._id === id);
      const existingTags = person?.tags || [];

      // Combinar as tags existentes com as novas, evitando duplicatas
      const combinedTags = Array.from(new Set([...existingTags, ...tags.map((tag) => tag.text)]));

      const payload = {
        tags: combinedTags,
      };

      await new Promise((resolve) => {
        updatePeople(id, payload, (status, error) => {
          if (status === 'success') {
            setTagProcessingStatus((prevStatus) => {
              const newStatus = [...prevStatus];
              newStatus[i] = {
                ...newStatus[i],
                status: 'success',
              };
              return newStatus;
            });
          } else {
            setTagProcessingStatus((prevStatus) => {
              const newStatus = [...prevStatus];
              newStatus[i] = {
                ...newStatus[i],
                status: 'error',
                error: error?.response?.data?.message || 'Erro desconhecido',
              };
              return newStatus;
            });
          }
          resolve();
        });
      });
    }

    setIsTagProcessing(false);

    // Atualizar a lista
    dispatch(onGetPeoples(type, null));
  };

  // Função para iniciar a troca de dono em lote
  const startBatchOwnerChange = async () => {
    if (!selectedOwner) {
      toast.error('Por favor, selecione um novo dono.');
      return;
    }

    setIsOwnerProcessing(true);

    setOwnerProcessingStatus(
      selectedPeoples.map((id) => ({
        id,
        name: getNameById(id),
        status: 'pending',
        error: null,
      }))
    );

    for (let i = 0; i < selectedPeoples.length; i++) {
      const id = selectedPeoples[i];

      const payload = {
        owner: selectedOwner.value,
      };

      await new Promise((resolve) => {
        updatePeople(id, payload, (status, error) => {
          if (status === 'success') {
            setOwnerProcessingStatus((prevStatus) => {
              const newStatus = [...prevStatus];
              newStatus[i] = {
                ...newStatus[i],
                status: 'success',
              };
              return newStatus;
            });
          } else {
            setOwnerProcessingStatus((prevStatus) => {
              const newStatus = [...prevStatus];
              newStatus[i] = {
                ...newStatus[i],
                status: 'error',
                error: error?.response?.data?.message || 'Erro desconhecido',
              };
              return newStatus;
            });
          }
          resolve();
        });
      });
    }

    setIsOwnerProcessing(false);

    // Atualizar a lista
    dispatch(onGetPeoples(type, null));
  };

  const handleDeleteTag = (i) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAdditionTag = (tag) => {
    setTags([...tags, tag]);
  };

  const handleOwnerChange = (selectedOption) => {
    setSelectedOwner(selectedOption);
  };

  useEffect(() => {
    dispatch(onGetPeoples(searchParams.get('type'), null));
    setSelectedPeoples([])
  }, [searchParams.get('type')]);

  useEffect(() => {
    dispatch(getBoardListReq());
  }, [dispatch]);

  let columns = useMemo(() => {
    let cols = [
      {
        Header: (
          <Input
            type="checkbox"
            className="form-check-input"
            id="selectAll"
            checked={selectAll}
            onChange={handleSelectAll}
          />
        ),
        accessor: 'select',
        filterable: false,
        Cell: ({ row }) => (
          <Input
            type="checkbox"
            className="form-check-input"
            id={`select-${row.original._id}`}
            name={`name-${row.original._id}`}
            value={selectedPeoples.includes(row.original._id) ?? false}
            checked={selectedPeoples.includes(row.original._id) ? 'checked' : undefined}
            defaultChecked={selectedPeoples.includes(row.original._id) ?? false}
            onChange={() => handleSelectPeople(row.original._id)}
          />
        ),
      },
      {
        Header: 'Nome',
        accessor: 'name',
        filterable: true,
        Cell: (cellProps) => {
          return (
            <>
              <h5 className="font-size-14 mb-1">
                <Link
                  className="text-dark"
                  to={'?type=' + type}
                  onClick={() => {
                    const userData = cellProps.row.original;
                    onClickEdit(userData);
                  }}
                >
                  {cellProps.row.original.name}{' '}
                  {type === 'person' ? findValue(cellProps.row.original.contacts, 'sobrenome') : ''}
                </Link>
              </h5>
              <p className="text-muted mb-0">{cellProps.row.original.designation}</p>
            </>
          );
        },
      },
      {
        Header: type === 'person' ? 'E-mail' : 'CNPJ',
        accessor: type === 'person' ? 'email' : 'cnpj',
        filterable: true,
        Cell: (cellProps) => {
          return (
            <>
              <h5 className="font-size-14 mb-1">
                <Link
                  className="text-dark"
                  to={'?type=' + type}
                  onClick={() => {
                    const userData = cellProps.row.original;
                    onClickEdit(userData);
                  }}
                >
                  {type === 'person'
                    ? findValue(cellProps.row.original.contacts, 'email')
                    : findValue(cellProps.row.original.documents, 'cnpj')}
                </Link>
              </h5>
              <p className="text-muted mb-0">{cellProps.row.original.designation}</p>
            </>
          );
        },
      },
      {
        Header: 'Tags',
        accessor: 'tags',
        filterable: true,
        Cell: (cellProps) => {
          const tags = cellProps.row.original.tags || [];
          return (
            <>
              {tags.map((tag, index) => (
                <Badge color="primary" className="me-1" key={index}>
                  {tag}
                </Badge>
              ))}
            </>
          );
        },
      },
      {
        Header: 'Data de criação',
        accessor: 'criacao',
        filterable: true,
        Cell: (cellProps) => {
          return (
            <>
              <h5 className="font-size-14 mb-1">
                {moment(cellProps.row.original.createdAt).format('DD/MM/YYYY HH:mm')}
              </h5>
            </>
          );
        },
      },
      {
        Header: 'Ações',
        Cell: (cellProps) => {
          return (
            <div className="d-flex gap-3">
              <i
                className="mdi mdi-pencil font-size-18"
                id="edittooltip"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  const userData = cellProps.row.original;
                  onClickEdit(userData);
                }}
              />
              <UncontrolledTooltip placement="top" target="edittooltip">
                Editar
              </UncontrolledTooltip>
              <i
                className="mdi mdi-delete font-size-18"
                id="deletetooltip"
                style={{ color: 'red', cursor: 'pointer' }}
                onClick={() => {
                  const userData = cellProps.row.original;
                  onClickDelete(userData);
                }}
              />
              <UncontrolledTooltip placement="top" target="deletetooltip">
                Excluir
              </UncontrolledTooltip>
            </div>
          );
        },
      },
    ];

    if (type === 'company') {
      cols.splice(5, 0, {
        Header: 'Status',
        accessor: 'status',
        filterable: true,
        Cell: (cellProps) => {
          const { customer, active } = cellProps.row.original.flags;
          return (
            <>
              {customer && (
                <Badge color="primary" className="me-1">
                  Cliente
                </Badge>
              )}
              {active ? (
                <Badge color="success" className="me-1">
                  Ativo
                </Badge>
              ) : (
                <Badge color="danger" className="me-1">
                  Inativo
                </Badge>
              )}
            </>
          );
        },
      });
    }

    if (type === 'agency') {
      cols.splice(5, 0, {
        Header: 'Tipo',
        accessor: 'tipo_servico',
        filterable: true,
        Cell: (cellProps) => {
          return (
            <>
              <h5 className="font-size-14 mb-1">
                {findValue(cellProps.row.original.contacts, 'tipo_servico') || '--'}
              </h5>
            </>
          );
        },
      });
    }

    if (type === 'person') {
      cols.splice(5, 0, {
        Header: 'Empresa',
        accessor: 'relacao',
        filterable: true,
        Cell: (cellProps) => {
          return (
            <>
              <h5 className="font-size-14 mb-1">
                {cellProps.row.original.relations?.[0]?.people?.name || '--'}
              </h5>
            </>
          );
        },
      });
    }
    return cols;
  }, [type, selectAll, selectedPeoples]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Lista" breadcrumbItem={findValueByType()} />

          <Row>
            <Col lg="12">
              <div className="d-flex align-items-center" style={{ marginBottom: '20px' }}>
                <div className="flex-shrink-0">
                  <Link
                    to={'?type=' + type}
                    onClick={() => {
                      setEditing(null);
                      setModal(true);
                    }}
                    className="btn btn-primary me-1"
                  >
                    <i className="mdi mdi-plus-box"></i> {findValueByType()}
                  </Link>
                </div>
                {type === 'company' && (
                  <div className="flex-shrink-0">
                    <Link to={'/importar-dados'} className="btn btn-secondary me-1">
                      <i className="mdi mdi-file-import-outline"></i> Importar Empresas
                    </Link>
                  </div>
                )}

                <Button onClick={handleOpenFilter}>
                  <i className="mdi mdi-filter"></i> Filtrar
                </Button>

                {selectedPeoples.length > 0 && (
                  <div className="ms-3" style={{ marginLeft: '-30px' }}>
                    <ButtonDropdown
                      style={{ marginLeft: '-10px' }}
                      isOpen={drp_primary1}
                      toggle={() => setDrp_primary1(!drp_primary1)}
                    >
                      <DropdownToggle caret color="light">
                        Ações em lote ({selectedPeoples.length})
                        <i className="mdi mdi-chevron-down" />
                      </DropdownToggle>
                      <DropdownMenu>
                        {type === 'company' && boardList
                          .filter((b) => b.visible)
                          .map((board) => (
                            <DropdownItem
                              key={board._id}
                              onClick={() => pushToFunil(board.type, board)}
                            >
                              <i className={`bx ${board.icon ? board.icon : 'bx-transfer'}`}></i>
                              &nbsp;&nbsp; {board.name}{' '}
                              {board.type === 'crm' ? '(Criar oportunidade)' : '(Criar Lead)'}
                            </DropdownItem>
                          ))}
                        <DropdownItem onClick={() => setModalApplyTags(true)}>
                          <i className={`bx bx-tag`}></i>&nbsp;&nbsp;&nbsp;Aplicar Tag
                        </DropdownItem>
                        {type === 'company' && (
                          <DropdownItem onClick={() => setModalChangeOwner(true)}>
                            <i className={`bx bx-transfer`}></i>&nbsp;&nbsp;&nbsp;Trocar Dono
                          </DropdownItem>
                        )}
                        <DropdownItem onClick={() => setModalBatchDelete(true)}>
                          <i className={`bx bx-trash`}></i>&nbsp;&nbsp;&nbsp;Excluir
                        </DropdownItem>
                      </DropdownMenu>
                    </ButtonDropdown>
                  </div>
                )}
              </div>
            </Col>
          </Row>

          {peopleSelector.loading ? (
            <Spinners />
          ) : peopleSelector.peoples.length > 0 ? (
            <>
              <Row>
                <Col lg="12">
                  <Card>
                    <CardBody>
                      <TableContainer
                        isPagination={true}
                        columns={columns}
                        data={peopleSelector.peoples}
                        isGlobalFilter={false}
                        isAddUserList={false}
                        isShowingPageLength={false}
                        iscustomPageSizeOptions={false}
                        handleUserClick={null}
                        customPageSize={50}
                        tableClass="table align-middle table-nowrap table-hover"
                        theadClass="table-light"
                        paginationDiv="col-sm-12 col-md-12"
                        pagination="pagination pagination-rounded justify-content-end mt-4"
                      />
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </>
          ) : (
            <>
              <Row className="justify-content-center mt-lg-5">
                <Col xl="5" sm="8">
                  <Card>
                    <CardBody>
                      <div className="text-center">
                        <Row className="justify-content-center">
                          <Col lg="10">
                            <h4 className="mt-4 fw-semibold">Opa nada aqui ...</h4>
                            <p className="text-muted mt-3">
                              Ainda não temos nenhum registro de {findValueByType()} por aqui, você pode
                              adicionar clicando no botão de "+" acima.
                            </p>
                          </Col>
                        </Row>

                        <Row className="justify-content-center mt-5 mb-2">
                          <Col sm="6" xs="8">
                            <div>
                              <img src={verificationImg} alt="" className="img-fluid" />
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </Container>
      </div>
      <ToastContainer />
      {type === 'person' ? (
        <ModalCreateContact
          createPeople={createPeople}
          updatePeople={updatePeople}
          modal={modal}
          toggle={toggle}
          typeName={findValueByType()}
          isCreateLoading={peopleSelector.loading}
          editing={editing}
        />
      ) : (
        <ModalCreate
          createPeople={createPeople}
          updatePeople={updatePeople}
          modal={modal}
          toggle={toggle}
          typeName={findValueByType()}
          isCreateLoading={peopleSelector.loading}
          editing={editing}
        />
      )}

      <ModalConfirmation modal={modalConfirmation} toggle={toggleConfirmation} />
      <FunilFilter
        isOpen={filterModal.open}
        toggle={() => setFilterModal({ ...filterModal, open: false })}
        onApplyFilter={handleApplyFilter}
        from={'people'}
      />

      {/* Modal para confirmação do Push To Funil */}
      <Modal
        isOpen={modalPushToFunil}
        toggle={() => {
          if (!isProcessing) {
            setModalPushToFunil(false);
            setProcessingStatus([]);
          }
        }}
        backdrop="static"
      >
        <ModalHeader
          toggle={() => {
            if (!isProcessing) {
              setModalPushToFunil(false);
              setProcessingStatus([]);
            }
          }}
        >
          Confirmação de {selectedBoard?.type === "crm" ? 'nova(s) oportunidade(s)' : 'novos leads'}
        </ModalHeader>
        <ModalBody>
          {processingStatus.length === 0 ? (
            <p>
              Atenção você está prestes a criar {selectedPeoples.length} {selectedBoard?.type === "crm" ? 'nova(s) oportunidade(s)' : 'novo(s) lead(s)'} no Funil{' '}
              {selectedBoard?.name}, você tem certeza que deseja fazer isso?
            </p>
          ) : (
            <>
              {/* Label com o progresso */}
              <p>
                {`Progresso! ${
                  processingStatus.filter((item) => item.status !== 'pending').length
                } itens de ${processingStatus.length} já foram finalizados!`}
              </p>
              {/* Lista de itens processados */}
              <ul>
                {processingStatus.map((item) => (
                  <li key={item.id}>
                    {item.name} -{' '}
                    {item.status === 'success' ? (
                      <i className="mdi mdi-check-circle" style={{ color: 'green' }}></i>
                    ) : item.status === 'error' ? (
                      <>
                        <i className="mdi mdi-close-circle" style={{ color: 'red' }}></i>
                        {/* Exibir mensagem de erro */}
                        {item.error && <span> - {item.error}</span>}
                      </>
                    ) : (
                      <i className="mdi mdi-progress-clock" style={{ color: 'gray' }}></i>
                    )}
                  </li>
                ))}
              </ul>
              {/* Resumo de sucessos e erros */}
              <p>
                {`Sucesso: ${
                  processingStatus.filter((item) => item.status === 'success').length
                } `}
                {`| Erros: ${
                  processingStatus.filter((item) => item.status === 'error').length
                }`}
              </p>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          {processingStatus.length === 0 ? (
            <>
              <Button color="secondary" onClick={() => setModalPushToFunil(false)}>
                Cancelar
              </Button>
              <Button color="primary" onClick={simulateProcessing}>
                Confirmar
              </Button>
            </>
          ) : isProcessing ? (
            // Enquanto está processando, não exibe nenhum botão
            <></>
          ) : (
            <Button
              color="primary"
              onClick={() => {
                setModalPushToFunil(false);
                setProcessingStatus([]);
                setIsProcessing(false);
              }}
            >
              Fechar
            </Button>
          )}
        </ModalFooter>
      </Modal>

      {/* Modal para confirmação do Excluir em Lote */}
      <Modal
        isOpen={modalBatchDelete}
        toggle={() => {
          if (!isDeleteProcessing) {
            setModalBatchDelete(false);
            setDeleteProcessingStatus([]);
            setDeleteConfirmationText('');
          }
        }}
        backdrop="static"
      >
        <ModalHeader
          toggle={() => {
            if (!isDeleteProcessing) {
              setModalBatchDelete(false);
              setDeleteProcessingStatus([]);
              setDeleteConfirmationText('');
            }
          }}
        >
          Confirmação de Exclusão
        </ModalHeader>
        <ModalBody>
          {deleteProcessingStatus.length === 0 ? (
            <>
              <p>
                Atenção, você está prestes a excluir {selectedPeoples.length} registro(s). Esta ação é
                irreversível. Para confirmar, digite <strong>"deletar"</strong> no campo abaixo.
              </p>
              <Input
                type="text"
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                placeholder="Digite 'deletar' para confirmar"
              />
            </>
          ) : (
            <>
              {/* Label com o progresso */}
              <p>
                {`Progresso: ${
                  deleteProcessingStatus.filter((item) => item.status !== 'pending').length
                } itens de ${deleteProcessingStatus.length} já foram processados!`}
              </p>
              {/* Lista de itens processados */}
              <ul>
                {deleteProcessingStatus.map((item) => (
                  <li key={item.id}>
                    {item.name} -{' '}
                    {item.status === 'success' ? (
                      <i className="mdi mdi-check-circle" style={{ color: 'green' }}></i>
                    ) : item.status === 'error' ? (
                      <>
                        <i className="mdi mdi-close-circle" style={{ color: 'red' }}></i>
                        {item.error && <span> - {item.error}</span>}
                      </>
                    ) : (
                      <i className="mdi mdi-progress-clock" style={{ color: 'gray' }}></i>
                    )}
                  </li>
                ))}
              </ul>
              {/* Resumo de sucessos e erros */}
              <p>
                {`Sucesso: ${
                  deleteProcessingStatus.filter((item) => item.status === 'success').length
                } `}
                {`| Erros: ${
                  deleteProcessingStatus.filter((item) => item.status === 'error').length
                }`}
              </p>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          {deleteProcessingStatus.length === 0 ? (
            <>
              <Button
                color="secondary"
                onClick={() => {
                  setModalBatchDelete(false);
                  setDeleteConfirmationText('');
                }}
              >
                Cancelar
              </Button>
              <Button
                color="danger"
                disabled={deleteConfirmationText.toLowerCase() !== 'deletar'}
                onClick={startBatchDeletion}
              >
                Confirmar
              </Button>
            </>
          ) : isDeleteProcessing ? (
            <></>
          ) : (
            <Button
              color="primary"
              onClick={() => {
                setModalBatchDelete(false);
                setDeleteProcessingStatus([]);
                setIsDeleteProcessing(false);
                setDeleteConfirmationText('');
              }}
            >
              Fechar
            </Button>
          )}
        </ModalFooter>
      </Modal>

      {/* Modal para aplicação de Tags em Lote */}
      <Modal
        isOpen={modalApplyTags}
        toggle={() => {
          if (!isTagProcessing) {
            setModalApplyTags(false);
            setTagProcessingStatus([]);
            setTags([]);
          }
        }}
        backdrop="static"
      >
        <ModalHeader
          toggle={() => {
            if (!isTagProcessing) {
              setModalApplyTags(false);
              setTagProcessingStatus([]);
              setTags([]);
            }
          }}
        >
          Aplicar Tag(s)
        </ModalHeader>
        <ModalBody>
          {tagProcessingStatus.length === 0 ? (
            <>
              <p>
                Você está prestes a aplicar a(s) seguinte(s) tag(s) ao(s) {selectedPeoples.length}{' '}
                registro(s) selecionado(s) marcando nova(s) tag(s) abaixo:
              </p>
              <ReactTags
                tags={tags}
                handleDelete={handleDeleteTag}
                handleAddition={handleAdditionTag}
                placeholder="Digite e pressione Enter para adicionar uma nova tag"
                inputFieldPosition="bottom"
                autocomplete
                classNames={{
                  tags: 'd-flex flex-wrap align-items-center',
                  tagInput: 'flex-grow-1',
                  tagInputField: 'form-control border-0',
                  selected: 'd-flex flex-wrap',
                  tag: 'badge bg-primary me-1 mb-1',
                  remove: 'ms-1',
                }}
              />
            </>
          ) : (
            <>
              {/* Label com o progresso */}
              <p>
                {`Progresso: ${
                  tagProcessingStatus.filter((item) => item.status !== 'pending').length
                } itens de ${tagProcessingStatus.length} já foram processados!`}
              </p>
              {/* Lista de itens processados */}
              <ul>
                {tagProcessingStatus.map((item) => (
                  <li key={item.id}>
                    {item.name} -{' '}
                    {item.status === 'success' ? (
                      <i className="mdi mdi-check-circle" style={{ color: 'green' }}></i>
                    ) : item.status === 'error' ? (
                      <>
                        <i className="mdi mdi-close-circle" style={{ color: 'red' }}></i>
                        {item.error && <span> - {item.error}</span>}
                      </>
                    ) : (
                      <i className="mdi mdi-progress-clock" style={{ color: 'gray' }}></i>
                    )}
                  </li>
                ))}
              </ul>
              {/* Resumo de sucessos e erros */}
              <p>
                {`Sucesso: ${
                  tagProcessingStatus.filter((item) => item.status === 'success').length
                } `}
                {`| Erros: ${
                  tagProcessingStatus.filter((item) => item.status === 'error').length
                }`}
              </p>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          {tagProcessingStatus.length === 0 ? (
            <>
              <Button
                color="secondary"
                onClick={() => {
                  setModalApplyTags(false);
                  setTags([]);
                }}
              >
                Cancelar
              </Button>
              <Button color="primary" onClick={startBatchTagging} disabled={tags.length === 0}>
                Confirmar
              </Button>
            </>
          ) : isTagProcessing ? (
            <></>
          ) : (
            <Button
              color="primary"
              onClick={() => {
                setModalApplyTags(false);
                setTagProcessingStatus([]);
                setIsTagProcessing(false);
                setTags([]);
              }}
            >
              Fechar
            </Button>
          )}
        </ModalFooter>
      </Modal>

      {/* Modal para troca de dono em Lote */}
      <Modal
        isOpen={modalChangeOwner}
        toggle={() => {
          if (!isOwnerProcessing) {
            setModalChangeOwner(false);
            setOwnerProcessingStatus([]);
            setSelectedOwner(null);
          }
        }}
        backdrop="static"
      >
        <ModalHeader
          toggle={() => {
            if (!isOwnerProcessing) {
              setModalChangeOwner(false);
              setOwnerProcessingStatus([]);
              setSelectedOwner(null);
            }
          }}
        >
          Trocar Dono
        </ModalHeader>
        <ModalBody>
          {ownerProcessingStatus.length === 0 ? (
            <>
              <p>
                Você está prestes a trocar o dono do(s) {selectedPeoples.length} registro(s)
                selecionado(s). Por favor, selecione o novo dono:
              </p>
              <Select
                classNamePrefix="select2-selection"
                placeholder="Selecione o novo dono..."
                options={usersByTenant?.map((user) => {
                  return {
                    value: user._id,
                    label: user.name,
                  };
                })}
                value={selectedOwner}
                onChange={handleOwnerChange}
              />
            </>
          ) : (
            <>
              {/* Label com o progresso */}
              <p>
                {`Progresso: ${
                  ownerProcessingStatus.filter((item) => item.status !== 'pending').length
                } itens de ${ownerProcessingStatus.length} já foram processados!`}
              </p>
              {/* Lista de itens processados */}
              <ul>
                {ownerProcessingStatus.map((item) => (
                  <li key={item.id}>
                    {item.name} -{' '}
                    {item.status === 'success' ? (
                      <i className="mdi mdi-check-circle" style={{ color: 'green' }}></i>
                    ) : item.status === 'error' ? (
                      <>
                        <i className="mdi mdi-close-circle" style={{ color: 'red' }}></i>
                        {item.error && <span> - {item.error}</span>}
                      </>
                    ) : (
                      <i className="mdi mdi-progress-clock" style={{ color: 'gray' }}></i>
                    )}
                  </li>
                ))}
              </ul>
              {/* Resumo de sucessos e erros */}
              <p>
                {`Sucesso: ${
                  ownerProcessingStatus.filter((item) => item.status === 'success').length
                } `}
                {`| Erros: ${
                  ownerProcessingStatus.filter((item) => item.status === 'error').length
                }`}
              </p>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          {ownerProcessingStatus.length === 0 ? (
            <>
              <Button
                color="secondary"
                onClick={() => {
                  setModalChangeOwner(false);
                  setSelectedOwner(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                color="primary"
                onClick={startBatchOwnerChange}
                disabled={!selectedOwner}
              >
                Confirmar
              </Button>
            </>
          ) : isOwnerProcessing ? (
            <></>
          ) : (
            <Button
              color="primary"
              onClick={() => {
                setModalChangeOwner(false);
                setOwnerProcessingStatus([]);
                setIsOwnerProcessing(false);
                setSelectedOwner(null);
              }}
            >
              Fechar
            </Button>
          )}
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default withRouter(Peoples);
