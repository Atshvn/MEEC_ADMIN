import { TopMenuAdmin } from "../Template"
import { QuestionAPI, TestAPI, CourseAPI } from "../../Service";
import { Alertsuccess, Alerterror, Alertwarning, DataTable, ExportExcel, SelectCourse, FormatDateJson, FormatDate } from "../../Commom";
import React, { useState, useEffect, useRef } from 'react';
import DateTimePicker from 'react-datetime-picker'
import Select from 'react-select';
export const TestManager = () => {
  

    useEffect(() => {
        MEEC_Course_List();
    }, []);

    const [ID, setID] = useState(0);

    const [TestName, setTestName] = useState("");
    const TestNameRef = useRef();

    const [TestDate, setTestDate] = useState(new Date())

    const [TotalQuestion, setTotalQuestion] = useState(0);
    const TotalQuestionRef = useRef()

    const [TestTime, setTestTime] = useState(0);
    const TestTimeRef = useRef();

    const [CourseID, setCourseID] = useState(0)
    const [disableBtn, setDisableBtn] = useState(false);


    const [data, setData] = useState([])
    const [dataUnfinish, setDataUnfinish] = useState([])
    const [dataFinish, setDataFinish] = useState([])

    const [CourseSearch, setCourseSearch] = useState(0);
    const [DataCourse, setDataCourse] = useState([]);
    const [Edit, setEdit] = useState(false)

    const MEEC_Course_List = async () => {
        try {
            //const params = { _page: 1, _limit: 10 };
            const response = await CourseAPI.getAll();

            setDataCourse(response)
        } catch (error) {
            console.log('Failed to fetch: ', error);
        }
    }

    const filterItem = (item) => {
        return DataCourse.filter(i => i.courseId === item);
    }
    //#region List
    const MEEC_Test_List = async () => {
        try {
            const response = await TestAPI.getAll();
            const newData = response.map(item => {
                const itemNew = filterItem(item.courseId);
                const Status = item.state ? "Chưa thi" : "Đã thi";
                return {
                    ...item,
                    courseName: itemNew[0].name,
                    dateTest: FormatDate(item.dateTest),
                    Status: Status
                }


            })
            setData(newData)
        } catch (error) {
            console.log('Failed to fetch: ', error);
        }
    }
    const MEEC_Test_List_ByCourse = async () => {
        try {
            const response = await TestAPI.getByCourse(CourseSearch);
            const newData = response.map(item => {
                const itemNew = filterItem(item.courseId);
                const Status = item.state ? "Chưa thi" : "Đã thi";
                return {
                    ...item,
                    courseName: itemNew[0].name,
                    dateTest: FormatDate(item.dateTest),
                    Status: Status
                }
            })
            setData(newData)
        } catch (error) {
            console.log('Failed to fetch: ', error);
        }
    }
    const HandleList = () => {
        setData([])
        if (CourseSearch === 0) {
            return MEEC_Test_List();
        }
        else {
            return MEEC_Test_List_ByCourse();
        }
    }
    // const MEEC_TestUnFinish_List = async () => {
    //     try {
    //         //const params = { _page: 1, _limit: 10 };
    //         const response = await TestAPI.getUnfinished();
    //         console.log('Unfinish: ', response);

    //         setDataUnfinish(response)
    //     } catch (error) {
    //         console.log('Failed to fetch: ', error);
    //     }
    // }
    // const MEEC_TestFinish_List = async () => {
    //     try {
    //         //const params = { _page: 1, _limit: 10 };
    //         const response = await TestAPI.getFinish();
    //         console.log('Finish: ', response);

    //         setDataFinish(response)
    //     } catch (error) {
    //         console.log('Failed to fetch: ', error);
    //     }
    // }
    // //#endregion

    const MEEC_Test_Save = async () => {
        if (TestName === "") {
            Alertwarning("Nhập tên bài kiểm tra");
            TestNameRef.current.focus();
            return;
        }
        if (TestTime === 0) {
            Alertwarning("Nhập thời gian thi");
            TestTimeRef.current.focus();
            return;
        }
        if (TotalQuestion === 0) {
            Alertwarning("Nhập số lượng câu hỏi");
            TotalQuestionRef.current.focus();
            return;
        }
        if (TestTime < 0) {
            Alertwarning("Thời gian không hợp lệ");
            TestTimeRef.current.focus();
            return;
        }
        if (TotalQuestion < 0) {
            Alertwarning("Số lượng câu hỏi không hợp lệ");
            TotalQuestionRef.current.focus();
            return;
        }
        if (CourseID === 0) {
            Alertwarning("Hãy chọn khóa học")
            return
        }

        setDisableBtn(true)
        const obj = {
            testName: TestName,
            courseId: CourseID,
            dateTest: FormatDateJson(TestDate, 1),
            time: +TestTime,
            totalQuestion: +TotalQuestion,
            createsby: "TA"

        }
        try {
            //const params = { _page: 1, _limit: 10 };
            const response = await TestAPI.post(obj);
            Alertsuccess("Lưu thành công");
            setDisableBtn(false)
        } catch (error) {
            Alerterror("Lỗi")
            setDisableBtn(false)
            console.log('Failed to fetch: ', error);
        }
    }

    const MEEC_Test_Delete = async (Id) => {
        try {
            //const params = { _page: 1, _limit: 10 };
            const response = await TestAPI.delete(Id);
            Alertsuccess("Xóa thành công");
            const newData = data.filter(i => i.testId !== Id);
            setData(newData)
        } catch (error) {
            Alerterror("Lỗi")
            console.log('Failed to fetch: ', error);
        }
    }

    const MEEC_Test_View = (item) => {
        setEdit(true)
        setID(item.testId)
        setTestName(item.testName)
        setTestTime(item.time);
        setTotalQuestion(item?.totalQuestion);
        setCourseID(item.courseId)

        document.querySelector("#data-add").click();
    }

    const MEEC_Test_Cancer = () => {
        setEdit(false)
        setTestName("")
        setTestTime(0);
        setTotalQuestion(0);
        setCourseID(0)
        setID(0);

    }
    const MEEC_Test_Edit = async () => {
        setEdit(true)
        const obj = {
            testName: TestName,
            time: TestTime,
            totalQuestion: TotalQuestion,
            courseId: CourseID
        }
        try {
            //const params = { _page: 1, _limit: 10 };
            const response = await TestAPI.put(ID, obj);
            Alertsuccess("Cập nhật thành công");
            setEdit(false)
            MEEC_Course_List();
        } catch (error) {
            setEdit(true)
            Alerterror("Lỗi")
            console.log('Failed to fetch: ', error);
        }
    }

    const HandleSave = () => {
        Edit ? MEEC_Test_Edit() : MEEC_Test_Save();
    }


    //#region Table
    const columns = [
        {
            Header: "Tùy chọn",
            accessor: '[row identifier to be passed to button]',
            fixed: 'left',
            minWidth: 110,
            Cell: ({ row }) => (<span><button
                className="btn btn-sm btn-info" style={{ marginRight: '5px' }} onClick={e => clickEdit({ row })}>Sửa
                </button><button
                    className="btn btn-sm btn-danger" onClick={e => clickDelete({ row })}>Xóa
                </button></span>)
        },
        {
            Header: "Tên bài kiểm tra",
            accessor: "testName",
            minWidth: 200
        },
        {
            Header: "Thuộc khóa",
            accessor: "courseName",
            minWidth: 200
        },
        {
            Header: "Thời lượng thi (phút)",
            accessor: "time",
            minWidth: 150
        },
        {
            Header: "Số lượng câu hỏi",
            accessor: "totalQuestion",
            minWidth: 150

        },
        {
            Header: "Ngày thi",
            accessor: "dateTest",
            minWidth: 100

        },
        {
            Header: "Tình trạng",
            accessor: "Status",
            minWidth: 100

        }
    ];
    const clickEdit = (item) => {
        MEEC_Test_View(item.row._original)
    }
    const clickDelete = (item) => {

        MEEC_Test_Delete(item.row._original.testId);
    }
    const clickexcel = () => {
        ExportExcel(newData, "Danh-sach-cau-hoi");
    }

    const newData = data.map(i => {
        return {
            "Câu hỏi": i.content,
            "Đáp án 1": i.answerA,
            "Đáp án 2": i.answerB,
            "Đáp án 3": i.answerC,
            "Đáp án 4": i.answerD,
            "Đáp án đúng": i.corectAns,

        }
    })
    //#endregion

    return (
        <div className="unsticky-layout">
            <TopMenuAdmin />
            <div class="content-page" style={{ marginTop: '0px', padding: '0px' }}>
                <div class="content " style={{ marginTop: '80px' }}>
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-12">
                                <div class="card-box pt-0 bx">
                                    <ul class="nav nav-tabs tabs-bordered font-16" >
                                        <li class="nav-item">
                                            <a href="#home" id="data-add" data-toggle="tab" aria-expanded="false" class="nav-link active" >
                                                <span class="d-block d-sm-none"><i class="mdi mdi-home-variant-outline font-18"></i></span>
                                                <span class="d-none d-sm-block">Thêm mới</span>
                                            </a>
                                        </li>
                                        <li class="nav-item">
                                            <a href="#profile" data-toggle="tab" aria-expanded="true" class="nav-link ">
                                                <span class="d-block d-sm-none"><i class="mdi mdi-account-outline font-18"></i></span>
                                                <span class="d-none d-sm-block">Danh sách bài kiểm tra</span>
                                            </a>
                                        </li>


                                    </ul>
                                    <div class="tab-content pt-3">
                                        <div class="tab-pane show active" id="home">
                                            <div className="card">
                                                <div className="card-header p-2  bg-i ">
                                                    <div class="d-flex align-items-center pt-1  " >
                                                        <h3 className="color-white card-title font-weight-bold align-middle mb-0">THÊM BÀI KIỂM TRA</h3>
                                                    </div>
                                                </div>
                                                <div className="card-body">
                                                    <div className="row ">
                                                        <div class="col-sm-12 col-md-4">
                                                            <div class="form-group">
                                                                <label class="label mb-0">Tên bài kiểm tra</label>
                                                                <div class="input-group">
                                                                    <input type="text" class="form-control back-ground"
                                                                        ref={TestNameRef} value={TestName} onChange={e => setTestName(e.target.value)} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-sm-12 col-md-4">
                                                            <div class="form-group">
                                                                <label class="label mb-0">Thời gian thi (phút)</label>
                                                                <div class="input-group">
                                                                    <input type="number" class="form-control back-ground"
                                                                        ref={TestTimeRef} value={TestTime} onChange={e => setTestTime(e.target.value)} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-sm-12 col-md-4">
                                                            <div class="form-group">
                                                                <label class="label mb-0">Số lượng câu hỏi</label>
                                                                <div class="input-group">
                                                                    <input type="number" class="form-control back-ground"
                                                                        ref={TotalQuestionRef} value={TotalQuestion} onChange={e => setTotalQuestion(e.target.value)} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-sm-12 col-md-6">
                                                            <div class="form-group">
                                                                <label class="label mb-0">Khóa học</label>
                                                                <div class="input-group">
                                                                    <SelectCourse
                                                                        onSelected={e => setCourseID(e.value)}
                                                                        items={CourseID}
                                                                        font="font-16">
                                                                    </SelectCourse>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-sm-12 col-md-6">
                                                            <div class="form-group">
                                                                <label class="label mb-0">Ngày thi</label>
                                                                <div class="input-group SelectDatetime">
                                                                    <DateTimePicker className="form-control"
                                                                        onChange={date => setTestDate(date)}
                                                                        value={TestDate}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 d-flex justify-content-center mt-4">
                                                            <button disabled={disableBtn ? true : false} className="btn bg-c waves-effect width-md waves-light mr-3 "
                                                                onClick={HandleSave}
                                                            >
                                                                Lưu
                                                        </button>
                                                            <button className="btn bg-d waves-effect width-md "
                                                                onClick={MEEC_Test_Cancer}>
                                                                Hủy
                                                        </button>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                        <div class="tab-pane " id="profile">
                                            <div className="card bx">
                                                <div className="card-header p-0 pl-2  bg-i ">
                                                    <div class="row">
                                                        <div class="col-sm-12 col-md-6 d-flex align-items-center" >
                                                            <h3 className="color-white card-title font-weight-bold align-middle mb-0"> QUẢN LÝ BÀI KIỂM TRA</h3>
                                                        </div>

                                                        <div class="col-sm-12 col-md-6 margin-top-5s pt-1 pb-1">
                                                            <button type="button" class="btn btn-sm bg-c pull-right margin-left-5 mr-4" onClick={clickexcel}>
                                                                <i class="fa fa-download pr-2"></i>
                                                        Xuất Excel
                                                    </button>
                                                            <button type="button" class="btn btn-sm btn-danger pull-right mr-2" onClick={HandleList} >
                                                                <i class="fa fa-eye pr-2"></i>
                                                        Xem
                                                    </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card-body w-50 m-auto">
                                                    <div class="form-group">
                                                        <label class="label mb-0">Khóa học</label>
                                                        <div class="input-group">
                                                            <SelectCourse
                                                                onSelected={e => setCourseSearch(e.value)}
                                                                items={CourseSearch}
                                                                font="font-16"
                                                                title="Chọn tất cả">
                                                            </SelectCourse>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="table-responsive font-16" style={{ color: '#555', zIndex: '0' }}>
                                                    <DataTable
                                                        data={data}
                                                        columns={columns}
                                                    />
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}