import React, { useEffect, useState } from "react";
import { useMemo } from "react";
import PropTypes from "prop-types";
import { Card, CardBody, NavItem, NavLink, CardTitle } from "reactstrap";
import classnames from "classnames";
import { map } from "lodash";
import { Link } from "react-router-dom";

import TableContainer from "../../../components/Common/TableContainer";

import { Idno, Pdate, Type, Value, ValueInUsd } from "./CryptoWalCol";

import Spinners from "../../../components/Common/Spinner";
import { createSelector } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { getCryptoProducts as onGetCryptoProducts } from "../../../store/actions";

const WalletActivities = ({ isLoading, setLoading }) => {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("all");

  const selectCryptoState = (state) => state.crypto;
  const CryptoProperties = createSelector(
    selectCryptoState,
    (Crypto) => ({
      products: Crypto.products,
    })
  );

  const {
    products
  } = useSelector(CryptoProperties);

  const [productData, setSetProductData] = useState([products]);

  const toggleTab = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  useEffect(() => {
    dispatch(onGetCryptoProducts());
    if (activeTab !== 'all') {
      var allProduct = products.filter(product =>
        product.type === activeTab
      );
    } else {
      var allProduct = products;
    }
    setSetProductData(allProduct)
  }, [activeTab]);

  const experiences = useMemo(
    () => [
    {
      id: 1,
      iconClass: "bx-server",
      link: "#",
      designation: "2a tentativa para reunião",
      timeDuration: "20 novembro - 10h02",
    },
    {
      id: 2,
      iconClass: "bx-code",
      link: "#",
      designation: "E-mail enviado para o contato principal",
      timeDuration: "20 novembro - 10h02",
    },
    {
      id: 3,
      iconClass: "bx-edit",
      link: "#",
      designation: "Arquivo anexado",
      timeDuration: "20 novembro - 10h02",
    },
  ],
  []
  );

  const columns = useMemo(
    () => [
      {
        Header: "Id No",
        accessor: "idno",
        filterable: true,
        Cell: cellProps => {
          return <Idno {...cellProps} />;
        },
      },
      {
        Header: "Date",
        accessor: "pdate",
        filterable: true,
        Cell: cellProps => {
          return <Pdate {...cellProps} />;
        },
      },
      {
        Header: "Type",
        accessor: "type",
        filterable: true,
        Cell: cellProps => {
          return <Type {...cellProps} />;
        },
      },
      {
        Header: "Currency",
        accessor: "coin",
        filterable: true,
        Cell: cellProps => {
          return <Value {...cellProps} />;
        },
      },
      {
        Header: "Value in USD",
        accessor: "valueInUsd",
        filterable: true,
        Cell: cellProps => {
          return <ValueInUsd {...cellProps} />;
        },
      },
    ],
    []
  );

  return (
    <Card>
      <CardBody>
        {
          isLoading ? <Spinners setLoading={setLoading} />
            :
            <>
              <ul className="nav nav-tabs nav-tabs-custom">
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: activeTab === "all",
                    })}
                    onClick={() => {
                      toggleTab("all");
                    }}
                  >
                    <i className="fas fa-pen-square"></i> Historico
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: activeTab === "Buy",
                    })}
                    onClick={() => {
                      toggleTab("Buy");
                    }}
                  >
                    <i className="fas fa-pen-square"></i> Tarefas
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: activeTab === "Sell",
                    })}
                    onClick={() => {
                      toggleTab("Sell");
                    }}
                  >
                    <i className="fas fa-pen-square"></i> Observações
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: activeTab === "Sell",
                    })}
                    onClick={() => {
                      toggleTab("Sell");
                    }}
                  >
                    <i className="fas fa-pen-square"></i> Reuniões
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: activeTab === "Sell",
                    })}
                    onClick={() => {
                      toggleTab("Sell");
                    }}
                  >
                    <i className="fas fa-pen-square"></i> Arquivos
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: activeTab === "Sell",
                    })}
                    onClick={() => {
                      toggleTab("Sell");
                    }}
                  >
                    <i className="fas fa-pen-square"></i> Ligações
                  </NavLink>
                </NavItem>
              </ul>

              {/* <div className="mt-4">
                <TableContainer
                  tableClass="table-hover dt-responsive nowrap dataTable no-footer dtr-inline"
                  columns={columns}
                  data={activeTab !== 'all' ? productData : products}
                  isGlobalFilter={true}
                  customPageSize={10}
                  isPagination={true}
                  isShowingPageLength={true}
                  iscustomPageSizeOptions={true}
                  paginationDiv="col-sm-12 col-md-7"
                  pagination="pagination justify-content-end pagination-rounded"
                />
              </div> */}
              <div>
              <Card>
                <CardBody>
                  <CardTitle className="mb-3" style={{ fontWeight:'100', fontSize:'13px'}}>Atividades anteriores</CardTitle>
                  <div>
                    <ul className="verti-timeline list-unstyled">
                      {map(experiences, (experience, i) => (
                        <li
                          className={
                            experience.id === 1
                              ? "event-list active"
                              : "event-list"
                          }
                          key={"_exp_" + i}
                        >
                          <div className="event-timeline-dot">
                            <i
                              className={
                                experience.id === 1
                                  ? "bx bx-right-arrow-circle bx-fade-right"
                                  : "bx bx-right-arrow-circle"
                              }
                            />
                          </div>
                          <div className="d-flex">
                            <div className="me-3">
                              <i
                                className={
                                  "bx " +
                                  experience.iconClass +
                                  " h4 text-primary"
                                }
                              />
                            </div>
                            <div className="flex-grow-1">
                              <div>
                                <h5 className="font-size-15">
                                  <Link
                                    to={experience.link}
                                    className="text-dark"
                                  >
                                    {experience.designation}
                                  </Link>
                                </h5>
                                <span className="text-primary">
                                  {experience.timeDuration}
                                </span>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardBody>
              </Card>
              </div>
            </>
        }
      </CardBody>
    </Card>
  );
};

WalletActivities.propTypes = {
  walletHistory: PropTypes.array,
  activeTab: PropTypes.string,
  toggleTab: PropTypes.func,
};

export default WalletActivities;
