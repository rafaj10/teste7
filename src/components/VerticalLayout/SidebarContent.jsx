import PropTypes from 'prop-types'
import React, { useEffect, useRef, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SimpleBar from 'simplebar-react'
import MetisMenu from 'metismenujs'
import { useDispatch } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { useBoardSelector } from '../../store/board/selectors'
import { getBoardListReq } from '../../store/board/actions'
import withRouter from '../Common/withRouter'

const SidebarContent = (props) => {
  const ref = useRef()
  const path = useLocation()
  const dispatch = useDispatch()
  const { boardList } = useBoardSelector()

  const activateParentDropdown = useCallback((item) => {
    item.classList.add('active')
    const parent = item.parentElement
    const parent2El = parent.childNodes[1]
    if (parent2El && parent2El.id !== 'side-menu') {
      parent2El.classList.add('mm-show')
    }

    if (parent) {
      parent.classList.add('mm-active')
      const parent2 = parent.parentElement

      if (parent2) {
        parent2.classList.add('mm-show') // ul tag

        const parent3 = parent2.parentElement // li tag

        if (parent3) {
          parent3.classList.add('mm-active') // li
          parent3.childNodes[0].classList.add('mm-active') //a
          const parent4 = parent3.parentElement // ul
          if (parent4) {
            parent4.classList.add('mm-show') // ul
            const parent5 = parent4.parentElement
            if (parent5) {
              parent5.classList.add('mm-show') // li
              parent5.childNodes[0].classList.add('mm-active') // a tag
            }
          }
        }
      }
      scrollElement(item)
      return false
    }
    scrollElement(item)
    return false
  }, [])

  const removeActivation = (items) => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i]
      const parent = items[i].parentElement

      if (item && item.classList.contains('active')) {
        item.classList.remove('active')
      }
      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.length && parent.childNodes[1]
            ? parent.childNodes[1]
            : null
        if (parent2El && parent2El.id !== 'side-menu') {
          parent2El.classList.remove('mm-show')
        }

        parent.classList.remove('mm-active')
        const parent2 = parent.parentElement

        if (parent2) {
          parent2.classList.remove('mm-show')

          const parent3 = parent2.parentElement
          if (parent3) {
            parent3.classList.remove('mm-active') // li
            parent3.childNodes[0].classList.remove('mm-active')

            const parent4 = parent3.parentElement // ul
            if (parent4) {
              parent4.classList.remove('mm-show') // ul
              const parent5 = parent4.parentElement
              if (parent5) {
                parent5.classList.remove('mm-show') // li
                parent5.childNodes[0].classList.remove('mm-active') // a tag
              }
            }
          }
        }
      }
    }
  }

  const activeMenu = useCallback(() => {
    const pathName = path.pathname
    let matchingMenuItem = null
    const ul = document.getElementById('side-menu')
    const items = ul.getElementsByTagName('a')
    removeActivation(items)

    for (let i = 0; i < items.length; ++i) {
      if (pathName === items[i].pathname) {
        matchingMenuItem = items[i]
        break
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem)
    }
  }, [path.pathname, activateParentDropdown])

  useEffect(() => {
    ref.current.recalculate()
  }, [])

  useEffect(() => {
    new MetisMenu('#side-menu')
    activeMenu()
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    activeMenu()
  }, [activeMenu])

  useEffect(() => {
    dispatch(getBoardListReq())
  }, [dispatch])

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300
      }
    }
  }

  return (
    <React.Fragment>
      <SimpleBar className="h-100" ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">Principal </li>
            <li>
              <Link to="/inicio" className=" ">
                <i className="bx bx-home"></i>
                <span>Inicio</span>
              </Link>
            </li>
            <li>
              <Link to="/dashboards" className=" ">
                <i className="bx bx-bar-chart-alt-2"></i>
                <span>Dashboards</span>
              </Link>
            </li>

            <li>
              <Link to="/agenda" className=" ">
                <i className="bx bx-calendar-event"></i>
                <span>Agenda</span>
              </Link>
            </li>

            <li className="menu-title">Funil(s)</li>

            {/* {boardList.sort((a, b) => {
              if (a.type === 'engagement' && b.type !== 'engagement') {
                return -1;
              }
              if (a.type !== 'engagement' && b.type === 'engagement') {
                return 1;
              }
              return a.type.localeCompare(b.type); // Se ambos são 'ENGAGEMENT' ou nenhum é, compara por CRM
            }).map((board) => (
              <li>
                <Link to={`/funil/${board._id}`} className=" ">
                  {board.type.toLowerCase() === "crm" ? (<i className="bx bx-transfer"></i>) : (<i className="bx bx-magnet"></i>)}
                  <span>{board.name}</span>
                </Link>
              </li>
            ))} */}

            {boardList.filter(b => b.visible).map((board) => (
              <li>
                <Link to={`/funil/${board._id}`} className=" ">
                  {/* {board.type.toLowerCase() === "crm" ? (<i className="bx bx-transfer"></i>) : (<i className="bx bx-magnet"></i>)} */}
                  <i className={`bx ${board.icon ? board.icon : 'bx-transfer'}`}></i>
                  <span>{board.name}</span>
                </Link>
              </li>
            ))}

            <li className="menu-title">CADASTROS</li>

            <li>
              <Link to="/empresas?type=company" className=" ">
                <i className="bx bx-buildings"></i>
                <span>Empresas</span>
              </Link>
            </li>
            <li>
              <Link to="/agencias?type=agency" className=" ">
                <i className="bx bx-store-alt"></i>
                <span>Agencias</span>
              </Link>
            </li>
            <li>
              <Link to="/contatos?type=person" className=" ">
                <i className="bx bx-user-pin"></i>
                <span>Contatos</span>
              </Link>
            </li>
            <li>
              <Link to="/produtos" className=" ">
                <i className="bx bx-money"></i>
                <span>Produtos</span>
              </Link>
            </li>
            <li>
              <Link to="/emailtemplates" className=" ">
                <i className="bx bx-envelope"></i>
                <span>Templates</span>
              </Link>
            </li>
            {/* <li>
              <Link to="/importar-dados" className=" ">
                <i className="bx bx-upload"></i>
                <span>Importar</span>
              </Link>
            </li> */}
            <li>
              <Link to="/workflow" className=" ">
                <i className="bx bx-shape-triangle"></i>
                <span>Workflows</span>
              </Link>
            </li>
            {/* <li>
              <Link to="/ajuda" className=" ">
                <i className="bx bx-help-circle"></i>
                <span>Ajuda</span>
              </Link>
            </li> */}

            {/* <li className="menu-title">Admin </li>

            <li>
              <Link to="/admin" className=" ">
                <i className="bx bx-shape-triangle"></i>
                <span>Admin Tenant</span>
              </Link>
            </li> */}
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  )
}

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
}

export default withRouter(withTranslation()(SidebarContent))
