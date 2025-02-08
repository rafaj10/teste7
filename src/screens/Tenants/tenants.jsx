import React, { useEffect, useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";
import TableContainer from "../../components/Common/TableContainer";
import Spinners from "../../components/Common/Spinner"
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  FormFeedback,
  UncontrolledTooltip,
  Input,
  Form,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";

import { Email, Tags, Projects } from "./contactlistCol";

//Import Breadcrumb
import Breadcrumbs from "/src/components/Common/Breadcrumb";

import {
  getTenants as onGetTenants,
} from "/src/store/tenants/actions";

import { isEmpty } from "lodash";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { ToastContainer } from "react-toastify";

const Tenants = (props) => {
  //meta title
  document.title = "7stratos | Tenants";

  const dispatch = useDispatch();

  const selectTenantsState = (state) => state.Tenants;
  const TenantsProperties = createSelector(
    selectTenantsState,
    (Tenants) => ({
      tenants: Tenants.tenants,
      loading: Tenants.loading
    })
  );

  const {
    tenants, loading
  } = useSelector(TenantsProperties);

  const columns = useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
        filterable: true,
        Cell: cellProps => {
          return (
            <>
              <h5 className="font-size-14 mb-1">
                <Link className="text-dark" to="#">{cellProps.row.original._id}</Link>
              </h5>
              <p className="text-muted mb-0">{cellProps.row.original.designation}</p>
            </>
          )
        },
      },
      {
        Header: "Nome",
        accessor: "name",
        filterable: true,
        Cell: cellProps => {
          return (
            <>
              <h5 className="font-size-14 mb-1">
                <Link className="text-dark" to="#">{cellProps.row.original.name}</Link>
              </h5>
              <p className="text-muted mb-0">{cellProps.row.original.designation}</p>
            </>
          )
        },
      },
    ],
    []
  );

  useEffect(() => {
    dispatch(onGetTenants());
    console.log('LOADING')
  }, []);

  var node = useRef();
  const onPaginationPageChange = (page) => {
    if (
      node &&
      node.current &&
      node.current.props &&
      node.current.props.pagination &&
      node.current.props.pagination.options
    ) {
      node.current.props.pagination.options.onPageChange(page);
    }
  };

  const keyField = "id";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Lista" breadcrumbItem="Tenants" />
          {
            loading ? <Spinners />
              :
              <Row>
                <Col lg="12">
                  <Card>
                    <CardBody>

                      <TableContainer
                        isPagination={true}
                        columns={columns}
                        data={tenants}
                        isGlobalFilter={false}
                        isAddUserList={false}
                        isShowingPageLength={false}
                        iscustomPageSizeOptions={false}
                        handleUserClick={() => {}}
                        customPageSize={8}
                        tableClass="table align-middle table-nowrap table-hover"
                        theadClass="table-light"
                        paginationDiv="col-sm-12 col-md-7"
                        pagination="pagination pagination-rounded justify-content-end mt-4"
                      />
                    </CardBody>
                  </Card>
                </Col>
              </Row>
          }
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  );
};

export default withRouter(Tenants);
