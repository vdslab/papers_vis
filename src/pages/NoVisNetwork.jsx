import { TabScrollButton } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import NetworkGraph from "../components/NetworkGraph";
import NoVisList from "../novisComponents/NoVisList";
import NodeDetail from "../components/NodeDetail";
import SelectLabel from "../components/SelectLabel";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import SelectPartOrWholeLabel from "../components/SelectPartOrWholeLabel";
import { positions } from "@mui/system";
import SideBar from "../components/SideBar";

const NoVisNetwork = () => {
  const [detail, setDetail] = useState({});
  const [isOpenMenu, setIsOpenMenu] = useState(true);
  const [nodeLabel, setNodeLabel] = useState("title");
  const search = useLocation().search;
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(true);
  const query = new URLSearchParams(search);
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [labelString, setLabelString] = useState("part");
  const [labelPart, setLabelPart] = useState("part");
  const [labelStringNum, setLabelStringNum] = useState(20);

  return (
    <div style={loading ? { margin: "550px auto" } : { display: "flex" }}>
      {/* <SideBar 
            sideBarOpen = {sideBarOpen} setSideBarOpen = {setSideBarOpen} 
            nodeLabel = {nodeLabel}  setNodeLabel = {setNodeLabel}
            labelPart = {labelPart} setLabelPart = {setLabelPart}
            labelStringNum = {labelStringNum} setLabelStringNum = {setLabelStringNum}
            labelString = {labelString} setLabelString = {setLabelString}
            />
            */}

      {/*<div style = {{width:"65%"}}>
                <NetworkGraph 
                detail = {detail} setDetail = {setDetail}
                sideBarOpen = {sideBarOpen} setSideBarOpen = {setSideBarOpen} 
                nodeLabel = {nodeLabel} 
                setLoading = {setLoading} loading = {loading}
                reloading = {reloading}
                isOpenMenu = {isOpenMenu} setIsOpenMenu = {setIsOpenMenu}
                labelPart = {labelPart} setLabelPart = {setLabelPart}
                labelString = {labelString} setLabelString = {setLabelString}
                labelStringNum = {labelStringNum} setLabelStringNum = {setLabelStringNum}
                />
            </div>
        */}
      {loading || (
        <div style={{ width: "60%", margin: "0 10px" }}>
          <NodeDetail
            detail={detail}
            isOpenMenu={isOpenMenu}
            reloading={reloading}
            setReloading={setReloading}
          />
        </div>
      )}

      <NoVisList
        detail={detail}
        setDetail={setDetail}
        sideBarOpen={sideBarOpen}
        setSideBarOpen={setSideBarOpen}
        nodeLabel={nodeLabel}
        setLoading={setLoading}
        loading={loading}
        reloading={reloading}
        isOpenMenu={isOpenMenu}
        setIsOpenMenu={setIsOpenMenu}
        labelPart={labelPart}
        setLabelPart={setLabelPart}
        labelString={labelString}
        setLabelString={setLabelString}
        labelStringNum={labelStringNum}
        setLabelStringNum={setLabelStringNum}
      />

      {/*loading || <button className='button is-white' style={{margin : '0 0 0 5px'}} onClick = { () => setIsOpenMenu(!isOpenMenu)}>
                {
                !isOpenMenu ? 
                <KeyboardArrowDownIcon/> :
                <KeyboardArrowUpIcon />
                }
            </button>
            */}
    </div>
  );
};

export default NoVisNetwork;
