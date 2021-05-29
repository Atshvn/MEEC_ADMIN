import { Link , useHistory} from "react-router-dom"

export const TopMenuAdmin = () => {
    const history = useHistory();
    const AdminInfor = JSON.parse(localStorage.getItem("AdminInfor"));
    const name= AdminInfor.fullName;
    const Logout = () => {
        localStorage.removeItem("AdminInfor");
        history.push("/")
    }
    return (
        <>
            {/* Topbar Start */}
            <div className="navbar-custom">
                <ul className="list-unstyled topnav-menu float-right mb-0">
                    
                   
                    
                    <li className="dropdown notification-list">
                        <a className="nav-link dropdown-toggle nav-user mr-0 waves-effect" data-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
                            <img src="assets\images\avatar.jpg" alt="user-image" className="rounded-circle" />
                            <span className="pro-user-name ml-1">
                                {name}   <i className="mdi mdi-chevron-down" />
                            </span>
                        </a>
                        <div className="dropdown-menu dropdown-menu-right profile-dropdown ">
                            {/* item*/}
                            <div className="dropdown-header noti-title">
                                <h6 className="text-overflow m-0">Welcome !</h6>
                            </div>
                            {/* item*/}
                            
                            
                            {/* item*/}
                            <a href="javascript:void(0);" className="dropdown-item notify-item">
                                <i className="mdi mdi-logout-variant" />
                                <span onClick={Logout}>Đăng xuất</span>
                            </a>
                        </div>
                    </li>
                    <li className="dropdown notification-list">
                        <a href="javascript:void(0);" className="nav-link right-bar-toggle waves-effect">
                            <i className="mdi mdi-settings-outline noti-icon" />
                        </a>
                    </li>
                </ul>
                {/* LOGO */}
                <div className="logo-box">
                    <Link to="/main" className="logo text-center logo-dark">
                        <span className="logo-lg">
                            <img src="assets\images\logo2.png" alt height={60} />
                            {/* <span class="logo-lg-text-dark">Velonic</span> */}
                        </span>
                     
                    </Link>
                    <Link to="/main" className="logo text-center logo-light">
                        <span className="logo-lg">
                            <img src="assets\images\logo2.png" alt height={60} />
                            {/* <span class="logo-lg-text-dark">Velonic</span> */}
                        </span>
                       
                    </Link>
                </div>
                {/* LOGO */}
                
            </div>
            {/* end Topbar */} {/* ========== Left Sidebar Start ========== */}
            <div className="left-side-menu">
                <div className="slimscroll-menu">
                    {/*- Sidemenu */}
                    <div id="sidebar-menu">
                        <ul className="metismenu" id="side-menu">
                            <li className="menu-title">Menu</li>
                            <li>
                                <Link to="/main" className="waves-effect">
                                    <i className="ion-md-speedometer" />
                                    <span>Danh sách học viên</span>
                                    <span className="menu-arrow" />
                                </Link>
                               
                            </li>
                            <li>
                                <Link to='/test' className="waves-effect">
                                    <i className="ion-md-basket" />
                                    <span>Quản lý bài thi </span>
                                    <span className="menu-arrow" />
                                </Link>
                                <Link to="/question" className="waves-effect">
                                    <i className="ion-md-basket" />
                                    <span> Ngân hàng câu hỏi </span>
                                    <span className="menu-arrow" />
                                </Link>
                                <Link to="/course" className="waves-effect">
                                    <i className="ion-md-basket" />
                                    <span> Quản lý khóa học </span>
                                    <span className="menu-arrow" />
                                </Link>
                               
                            </li>
                            
                        </ul>
                    </div>
                    {/* End Sidebar */}
                    <div className="clearfix" />
                </div>
                {/* Sidebar -left */}
            </div>
            {/* Left Sidebar End */}
        </>

    )
}