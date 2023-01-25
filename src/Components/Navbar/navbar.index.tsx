import React, { useEffect, useRef, useState } from "react";
import "./navbar.index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faDatabase,
  faTableColumns,
  faChevronLeft,
  faSignOut,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import Logo from "../../assets/logo.png";

export default () => {
  const navbar: any = useRef(null);
  const toggler: any = useRef(null);
  const firstList: any = useRef(null);
  const dashboard: any = useRef(null);
  const asset: any = useRef(null);
  const transaction: any = useRef(null);
  const transfer: any = useRef(null);
  const logout: any = useRef(null);

  const [isNavOpen, setIsNavOpen] = useState(true);

  const toggleTab = (element: any) => {
    element.children[1].style.display = isNavOpen ? "none" : "initial";
    element.style.textAlign = isNavOpen ? "center" : "initial";
  };

  const handleToggler = () => {
    toggler.current.children[0].style.transform = isNavOpen
      ? "rotate(180deg)"
      : "unset";
    navbar.current.style.width = isNavOpen ? "80px" : "300px";
    firstList.current.style.gridTemplateColumns = isNavOpen
      ? "unset"
      : "1fr 4fr 1fr";
    firstList.current.style.paddingLeft = isNavOpen ? 0 : "20px";
    firstList.current.children[0].style.padding = isNavOpen ? "20px" : 0;
    firstList.current.children[0].style.width = isNavOpen ? "80px" : "100%";
    firstList.current.children[0].style.justifySelf = isNavOpen
      ? "center"
      : "initial";
    firstList.current.children[1].style.display = isNavOpen
      ? "none"
      : "initial";

    navbar.current.children[0].style.width = isNavOpen ? "80px" : "100%";
    navbar.current.children[1].style.width = isNavOpen ? "80px" : "100%";

    toggleTab(dashboard.current);
    toggleTab(asset.current);
    toggleTab(transfer.current);
    toggleTab(transaction.current);
    toggleTab(logout.current);

    setIsNavOpen(!isNavOpen);
  };

  useEffect(() => {}, [isNavOpen]);

  return (
    <nav className="sidebar-nav" ref={navbar}>
      <ol>
        <li ref={firstList}>
          <img src={Logo} draggable="false" />
          <span>ChainDirect</span>
          <a href="#" ref={toggler} onClick={handleToggler}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </a>
        </li>
        <li>
          <a href="#" ref={dashboard}>
            <FontAwesomeIcon icon={faTableColumns} /> <span>Dashboard</span>
          </a>
        </li>
        <li>
          <a href="#" ref={transfer}>
            <FontAwesomeIcon icon={faArrowRight} /> <span>Transfers</span>
          </a>
        </li>
        <li>
          <a href="#" ref={asset}>
            <FontAwesomeIcon icon={faDatabase} /> <span>Manage Assets</span>
          </a>
        </li>
        <li>
          <a href="#" ref={transaction}>
            <FontAwesomeIcon icon={faChartLine} /> <span>Transactions</span>
          </a>
        </li>
      </ol>
      <ol>
        <li>
          <a href="#" ref={logout}>
            <FontAwesomeIcon icon={faSignOut} />
            <span>Logout</span>
          </a>
        </li>
      </ol>
    </nav>
  );
};
