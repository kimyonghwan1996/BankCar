import React, {useState} from "react";
import {FaRegHeart, FaRegUserCircle, FaHome} from "react-icons/fa";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import { BsFillChatDotsFill } from "react-icons/bs";
import {BottomNavigation, BottomNavigationAction, Paper} from "@mui/material";


const footerMenu = [
    {id: 1, text: "홈", icon: <FaHome size={18}/>, path: "/"},
    {
        id: 2,
        text: "위시리스트",
        icon: <FaRegHeart size={18}/>,
        path: "/wishList",
    },
    {
        id: 3,
        text: "위시리스트",
        icon: <FaRegHeart size={18}/>,
        path: "/mywishList",
    },
    {
        id: 4,
        text: "로그인",
        icon: <FaRegUserCircle size={18}/>,
        path: "/login",
    },
    {
        id: 5,
        text: "1:1채팅",
        icon: <BsFillChatDotsFill  size={18}/>,
        path: "/ChattingList",
    },
    {
        id: 6,
        text: "프로필",
        icon: <FaRegUserCircle size={18}/>,
        path: "/profile",
    },
   

];

const FooterMenu = () => {
    const [selected, setSelected] = useState(1);
    const id = useSelector((state) => state.Login.id);

    const footerMenuFilter = id ?
        footerMenu.filter(item => [1, 3, 5, 6].includes(item.id)) :
        footerMenu.filter(item => [1, 2, 4].includes(item.id));

    return (
        <Paper sx={{position: 'fixed', bottom: 0, left: 0, right: 0}} elevation={3}>
            <BottomNavigation showLabels value={window.location.pathname} >
                {
                    footerMenuFilter.map(item =>
                        <BottomNavigationAction
                            key={item.id}
                            value={item.path}
                            label={item.text}
                            component={Link}
                            to={item.path}
                            onClick={(e) => setSelected(e.target.value)}
                            icon={item.icon}
                            style={{ color: window.location.pathname === item.path ? 'red' : 'inherit' }}
                        />
                    )
                }
            </BottomNavigation>
        </Paper>
    );
};

export default FooterMenu;
