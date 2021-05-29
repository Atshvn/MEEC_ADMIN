import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom';
import { ForgotPass, Login , Page404, Signup, LoginAdmin} from '../Component/System';
import { HomeAdmin, Question, TestManager, WelCome } from '../Component/Admin';
import { CourseManage } from '../Component/Admin/CourseManage';
import ScrollToTop from '../Commom/ScrollToTop';
import { AdminRoute } from './AdminRoute';
export const Routers = () => {
   
    return (
        <BrowserRouter>
        {/* <Route path="/" component={TopMenuClient} /> */}
        <ScrollToTop/>
        <Switch>
            {/* <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login}/>
            <Route exact path="/signup" component={Signup}/>
            <Route exact path="/forgot-password" component={ForgotPass}/>
            <Route exact path="/demo" component={Demo} />
            <PrivateRoute exact path="/main" component={MainUser} />
            <PrivateRoute exact path="/profile" component={Profile} />
            <Route exact path="/mid" component={Mid} />
            <PrivateRoute exact path="/result" component={ResultLearning} />
            <Route exact path="/course" component={Course} />
            <Route exact path="/course1" component={Course1} />
            <Route exact path="/course2" component={Course2} />
            <Route exact path="/course3" component={Course3} />
            <Route exact path="/course4" component={Course4} />
            <Route exact path="/course5" component={Course5} />
            <Route exact path="/course6" component={Course6} />
            <Route exact path="/contact" component={Contact} />
            <Route exact path="/recruit" component={Recruit} />
            <Route exact path="/recruit-detail" component={RecruitDetail} />
            <Route exact path="/for-me" component={ForMe} /> */}

            <Route exact path="/" component={LoginAdmin}/>
            <AdminRoute  path="/main" component={HomeAdmin} />
            <AdminRoute  path="/question" component={Question} />
            <AdminRoute  path="/test" component={TestManager} />
            <AdminRoute  path="/course" component={CourseManage} />
            <AdminRoute  path="/welcome" component={WelCome} />

            <Route  component={Page404}/>
        </Switch>
        {/* <Route path="/" component={Foodter}/> */}
    </BrowserRouter>
    )
}