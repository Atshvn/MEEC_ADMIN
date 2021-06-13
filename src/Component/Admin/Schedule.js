

import { TopMenuAdmin } from "../Template"
import { CourseAPI, QuestionAPI, ScheduleAPI, SystemAPI, TestAPI } from "../../Service";
import { Alertsuccess, Alerterror, Alertwarning, DataTable, ExportExcel, SelectCourse, FormatDateJson, Alertinfo, FormatDate } from "../../Commom";
import React, { useState, useEffect, useRef } from 'react';
import DateTimePicker from 'react-datetime-picker'
import Select from 'react-select';
export const Schedule = () => {


    useEffect(() => {
        MEEC_Hourse_Local();
        MEEC_Day_Local();
    }, []);

    const [ID, setID] = useState(0);

    const [DisableBtn, setDisableBtn] = useState(false)
    const [data, setData] = useState([])

    const [Edit, setEdit] = useState(false)

    const [CourseId, setCourseId] = useState(0)
    const [CourseNew, setCourseNew] = useState(0)

    const [Hours, setHours] = useState([])
    const [Hour, setHour] = useState({ value: 0, label: "Vui lòng chọn" })
    const [Day, setDay] = useState({ value: 0, label: "Vui lòng chọn" })
    const [Days, setDays] = useState([])
    const [IdZoom, setIdZoom] = useState(0)
    const [passZoom, setPassZoom] = useState(0)
    const IdZoomRef = useRef();
    const passZoomRef = useRef();
    const [dataAll, setDataAll] = useState([])
    const [teacherId, setteacherId] = useState({ value: 0, label: "Vui lòng chọn" })
    const [dataTest, setDataTest] = useState([])

    useEffect(() => {
        MEEC_Account_List_ByCourse(CourseNew)
    }, [CourseNew])




    const MEEC_Hourse_Local = () => {
        const list = [
            { value: 0, label: "Vui lòng chọn" },
            { value: 1, label: "8AM - 10AM" },
            { value: 2, label: "10AM - 12AM" },
            { value: 3, label: "2PM - 4PM" },
            { value: 4, label: "4PM - 6PM" },
            { value: 5, label: "6PM - 8PM" },
            { value: 6, label: "8PM - 10PM" }
        ]
        setHours(list)
    }

    const MEEC_Day_Local = () => {
        const list = [
            { value: 0, label: "Vui lòng chọn" },
            { value: 1, label: "Thứ 2" },
            { value: 2, label: "Thứ 3" },
            { value: 3, label: "Thứ 4" },
            { value: 4, label: "Thứ 5" },
            { value: 5, label: "Thứ 6" },
            { value: 6, label: "Thứ 7" },
            { value: 7, label: "Chủ nhật" }
        ]
        setDays(list)
    }

    //#region List
    const MEEC_Schedule_List = async () => {
        if (CourseId === 0) {
            Alertwarning("Hãy chọn khóa học");
            return;
        }
        try {
            //const params = { _page: 1, _limit: 10 };
            const response = await ScheduleAPI.get(CourseId);
            const d = response.map(i => {
                const DateName = Days.find(item => item.value === i.date);
                const TimeName = Hours.find(item => item.value === i.time);
                return { ...i, dateName: DateName.label, timeName: TimeName.label }
            })
            setData(d)
            response.length === 0 && Alertinfo("Không có dữ liệu")
        } catch (error) {
            Alerterror("Đã có lỗi xảy ra, vui lòng thử lại sau")
            console.log('Failed to fetch: ', error);
        }
    }
    //#endregion

  


    //#region List Acc
    const MEEC_Account_List_ByCourse = async (id) => {

        try {
            //const params = { _page: 1, _limit: 10 };
            const response = await SystemAPI.accByCourse(id);
            const t = response.filter(i => i.roleId === 3);
            const first = { value: 0, label: "Vui lòng chọn" }
            const arr = []
            arr.push(first)
            const data = t.map(i => {
                return { value: i.accountId, label: i.fullName }
            })
            setDataAll([...arr, ...data])
        } catch (error) {
            Alerterror("Lỗi")
            console.log('Failed to fetch: ', error);
        }
    }
    //#endregion

    //#region  Save
    const MEEC_Schedule_Save = async () => {
        setEdit(false)
        if (CourseNew === 0) {
            Alertwarning("Hãy chọn khóa học");
            return;
        }
        if (IdZoom === 0) {
            Alertwarning("Nhập ID zoom");
            IdZoomRef.current.focus();
            return;
        }
        if (passZoom === 0) {
            Alertwarning("Nhập pass zoom");
            passZoomRef.current.focus();
            return;
        }
        if (Hour.value === 0) {
            Alertwarning("Hãy chọn giờ học");
            return;
        }
        if (Day?.length === 0 || Day === null) {
            Alertwarning("Hãy chọn ngày học");
            return;
        }
        if (teacherId.value === 0) {
            Alertwarning("Hãy chọn giáo viên đứng lớp");
            return;
        }

        const dataa = [
            {
                courseId: CourseNew,
                idZoom: +IdZoom,
                passZoom: +passZoom,
                date: Day.value,
                time: Hour.value,
                dateStart: FormatDateJson(new Date(), 0),
                accountId: teacherId.value
            }
        ];

        try {
            //const params = { _page: 1, _limit: 10 };
            const res = await ScheduleAPI.getALL();
            const check = res.filter(i => {
                if (i.date === dataa[0].date && i.time === dataa[0].time && i.courseId === dataa[0].courseId) {
                    return i
                }
            });
            if (check.length > 0) {
                Alertwarning("Dữ liệu đã tồn tại")
                return
            }
      
            const response = await ScheduleAPI.post(dataa);
            Alertsuccess("Lưu thành công");

        } catch (error) {
            Alerterror("Đã có lỗi xảy ra, vui lòng thử lại sau")
            console.log('Failed to fetch: ', error);
        }

    }
    //#endregion

    //#region  Delete
    const MEEC_Schedule_Delete = async (Id) => {
        try {
            //const params = { _page: 1, _limit: 10 };
            const response = await ScheduleAPI.delete(Id);
            Alertsuccess("Xóa thành công");
            const newData = data.filter(i => i.id !== Id);
            setData(newData)
        } catch (error) {
            Alerterror("Lỗi")
            console.log('Failed to fetch: ', error);
        }
    }
    //#endregion 

    //#region Edit
    const MEEC_Course_Edit = async () => {
        setEdit(true)
        const obj = {
            courseId: CourseNew,
            idZoom: IdZoom,
            passZoom: passZoom,
            date: Day.value,
            time: Hour.value,
            dateStart: FormatDateJson(new Date(), 0),
            accountId: teacherId.value
        }
        console.log(obj);
        try {
            //const params = { _page: 1, _limit: 10 };
            const response = await ScheduleAPI.put(ID, obj);
            Alertsuccess("Cập nhật thành công");
            setEdit(false)
        } catch (error) {
            setEdit(true)
            Alerterror("Lỗi")
            console.log('Failed to fetch: ', error);
        }
    }
    //#endregion

    const MEEC_Schedule_View = (item) => {
        setEdit(true)
        setID(item.id);
        setteacherId({ value: item.accountId, label: item.fullName })
        setIdZoom(item.idZoom);
        setPassZoom(item.passZoom);
        let d = Days.find(i => i.value === item.date)
        let t = Hours.find(i => i.value === item.time)
        setDay(d)
        setHour(t)
        setCourseNew(item.courseId)

        document.querySelector("#data-add").click();
    }

    const MEEC_Course_Cancer = () => {
        setEdit(false)
        setPassZoom(0)
        setID(0);
        setIdZoom(0)
        setCourseNew(0)
        setDay({ value: 0, label: "Vui lòng chọn" })
        setHour({ value: 0, label: "Vui lòng chọn" })

    }

    const MEEC_Check_SaveEdit = () => {
        Edit ? MEEC_Course_Edit() : MEEC_Schedule_Save()
    }



    //#region Table
    const columns = [
        {
            Header: "Tùy chọn",
            accessor: '[row identifier to be passed to button]',
            fixed: 'left',
            width: 110,
            Cell: ({ row }) => (<span><button
                className="btn btn-sm btn-info" style={{ marginRight: '5px' }} onClick={e => clickEdit({ row })}>Sửa
            </button><button
                className="btn btn-sm btn-danger" onClick={e => clickDelete({ row })}>Xóa
                </button></span>)
        },
        {
            Header: "STT",
            accessor: "content",
            width: 50,
            className: 'text-center',
            Cell: (row) => <span>{row.index + 1}</span>,

        },
        {
            Header: "ID Zoom",
            accessor: "idZoom",
            minWidth: 150,
            className: 'text-center'
        },
        {
            Header: "Pass Zoom",
            accessor: "passZoom",
            minWidth: 150,
            className: 'text-center'
        },
        {
            Header: "Thứ học",
            accessor: "dateName",
            minWidth: 150,
            className: 'text-center'

        },
        {
            Header: "Ca học",
            accessor: "timeName",
            minWidth: 150,
            className: 'text-center'

        },
        {
            Header: "Giảng viên đứng lớp",
            accessor: "fullName",
            minWidth: 200,
            className: 'text-center'

        },
        {
            Header: "Khóa học",
            accessor: "courseName",
            minWidth: 300,
            className: 'text-center'

        },
    ];
    const clickEdit = (item) => {
        MEEC_Schedule_View(item.row._original)
    }
    const clickDelete = (item) => {
        console.log(item.row._original.id);
        MEEC_Schedule_Delete(item.row._original.id);
    }
    const clickexcel = () => {
        ExportExcel(newData, "Danh-sach-lich-hoc");
    }

    const newData = data.map(i => {
        return {
            "Id Zoom": i.name,
            "Thời lượng": i.timeStudy,
            "Mô tả": i.description

        }
    })
    //#endregion

    return (
        <div className="unsticky-layout">
            <TopMenuAdmin />
            <div class="content-page" style={{ marginTop: '0px', padding: '0px' }}>
                <div class="content " style={{ marginTop: '80px' }}>
                    <div class="container-fluid">
                        <div class="row" style={{ height: '100vh' }}>
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
                                                <span class="d-none d-sm-block">Danh sách lịch học</span>
                                            </a>
                                        </li>


                                    </ul>
                                    <div class="tab-content pt-3">
                                        <div class="tab-pane show active" id="home">
                                            <div className="card">
                                                <div className="card-header p-2  bg-i ">
                                                    <div class="d-flex align-items-center pt-1  " >
                                                        <h3 className="color-white card-title font-weight-bold align-middle mb-0">THÊM MỚI LỊCH HỌC CHO KHÓA HỌC</h3>
                                                    </div>
                                                </div>
                                                <div className="card-body">
                                                    <div className="row ">
                                                        <div class="col-sm-12 col-md-4">
                                                            <div class="form-group">
                                                                <label class="label mb-0">Khóa học<sup className="cl-d">(*)</sup></label>
                                                                <div class="input-group" style={{ zIndex: '111' }}>
                                                                    <SelectCourse
                                                                        onSelected={e => {
                                                                            setCourseNew(e.value)
                                                                            setteacherId({ value: 0, label: "Vui lòng chọn" })
                                                                        }}
                                                                        items={CourseNew}
                                                                        font="font-16"
                                                                        title="Vui lòng chọn">
                                                                    </SelectCourse>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-sm-12 col-md-4">
                                                            <div class="form-group">
                                                                <label class="label mb-0">ID Zoom<sup className="cl-d">(*)</sup></label>
                                                                <div class="input-group">
                                                                    <input type="number" class="form-control back-ground" maxLength={9}
                                                                        ref={IdZoomRef} value={IdZoom} onChange={e => setIdZoom(e.target.value)} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-sm-12 col-md-4">
                                                            <div class="form-group">
                                                                <label class="label mb-0">Password Zoom<sup className="cl-d">(*)</sup></label>
                                                                <div class="input-group">
                                                                    <input type="number" class="form-control back-ground"
                                                                        ref={passZoomRef} value={passZoom} onChange={e => setPassZoom(e.target.value)} />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div class="col-sm-12 col-md-4">
                                                            <div class="form-group">
                                                                <label class="label mb-0">Giờ học<sup className="cl-d">(*)</sup></label>
                                                                <div class="input-group">
                                                                    <Select
                                                                        className="SelectMeno font-16"
                                                                        value={Hour}
                                                                        options={Hours}
                                                                        onChange={item => setHour(item)} >
                                                                    </Select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-sm-12 col-md-4">
                                                            <div class="form-group">
                                                                <label class="label mb-0">Ngày học<sup className="cl-d">(*)</sup></label>
                                                                <div class="input-group">
                                                                    <Select
                                                                        className="SelectMeno font-16"
                                                                        value={Day}
                                                                        options={Days}
                                                                        onChange={item => setDay(item)} >
                                                                    </Select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-sm-12 col-md-4">
                                                            <div class="form-group">
                                                                <label class="label mb-0">Giảng viên đứng lớp<sup className="cl-d">(*)</sup></label>
                                                                <div class="input-group">
                                                                    <Select
                                                                        className="SelectMeno font-16"
                                                                        value={teacherId}
                                                                        options={dataAll}
                                                                        onChange={item => setteacherId(item)} >
                                                                    </Select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 d-flex justify-content-center mt-4">
                                                            <button disabled={DisableBtn ? true : false} className="btn bg-c waves-effect width-md waves-light mr-3 "
                                                                onClick={MEEC_Check_SaveEdit}
                                                            >
                                                                Lưu
                                                            </button>
                                                            <button className="btn bg-d waves-effect width-md "
                                                                onClick={MEEC_Course_Cancer}>
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
                                                            <h3 className="color-white card-title font-weight-bold align-middle mb-0"> QUẢN LÝ LỊCH HỌC</h3>
                                                        </div>

                                                        <div class="col-sm-12 col-md-6 margin-top-5s pt-1 pb-1">
                                                            <button type="button" class="btn btn-sm bg-c pull-right margin-left-5 mr-4" onClick={clickexcel}>
                                                                <i class="fa fa-download pr-2"></i>
                                                                Xuất Excel
                                                            </button>
                                                            <button type="button" class="btn btn-sm bg-d pull-right mr-2" onClick={MEEC_Schedule_List} >
                                                                <i class="fa fa-eye pr-2"></i>
                                                                Xem
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card-body">
                                                    <div className="w-50 m-auto" >
                                                        <div class="form-group">
                                                            <label class="label mb-0">Khóa học</label>
                                                            <div class="input-group" style={{ zIndex: '111' }}>
                                                                <SelectCourse
                                                                    onSelected={e => setCourseId(e.value)}
                                                                    items={CourseId}
                                                                    font="font-16"
                                                                    title="Vui lòng chọn">
                                                                </SelectCourse>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className={data.length > 0 ? "table-responsive font-16" : "display-none"} style={{ color: '#555', zIndex: '0' }}>
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
        </div>
    )

}